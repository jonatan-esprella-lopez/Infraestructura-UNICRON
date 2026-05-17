"""
Ingests markdown docs from docs/legalities/knowledge-to-bot/ into the
financial_docs pgvector table. Run from the repo root:

  cd services/agents
  python -m scripts.ingest_docs
"""
import asyncio
import os
import re
import sys
from pathlib import Path

import asyncpg
import voyageai
from pgvector.asyncpg import register_vector

DOCS_DIR = Path(__file__).parent.parent.parent.parent / "docs" / "legalities" / "knowledge-to-bot"
DATABASE_URL = os.environ["DATABASE_URL"]
VOYAGE_API_KEY = os.environ["VOYAGE_API_KEY"]

SKIP_FILES = {"INDEX.md"}


def chunk_markdown(text: str, source: str) -> list[dict]:
    sections = re.split(r"\n(?=## )", text)
    chunks = []
    for section in sections:
        section = section.strip()
        if len(section) < 60:
            continue
        if len(section) <= 900:
            chunks.append({"source": source, "chunk": section})
        else:
            paragraphs = re.split(r"\n{2,}", section)
            current = ""
            for para in paragraphs:
                if len(current) + len(para) > 900 and current:
                    chunks.append({"source": source, "chunk": current.strip()})
                    current = para
                else:
                    current += "\n\n" + para
            if current.strip():
                chunks.append({"source": source, "chunk": current.strip()})
    return chunks


async def main() -> None:
    all_chunks: list[dict] = []
    for md_file in sorted(DOCS_DIR.glob("*.md")):
        if md_file.name in SKIP_FILES:
            continue
        text = md_file.read_text(encoding="utf-8")
        chunks = chunk_markdown(text, md_file.name)
        all_chunks.extend(chunks)
        print(f"  {md_file.name}: {len(chunks)} chunks")

    if not all_chunks:
        print("No chunks found — check DOCS_DIR path.")
        sys.exit(1)

    print(f"\nTotal: {len(all_chunks)} chunks — embedding with Voyage AI...")

    voyage = voyageai.AsyncClient(api_key=VOYAGE_API_KEY)
    texts = [c["chunk"] for c in all_chunks]
    embeddings: list = []

    batch_size = 8
    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        result = await voyage.embed(batch, model="voyage-3-lite", input_type="document")
        embeddings.extend(result.embeddings)
        done = min(i + batch_size, len(texts))
        print(f"  {done}/{len(texts)} embedded")
        if done < len(texts):
            await asyncio.sleep(21)  # 3 RPM limit

    pool = await asyncpg.create_pool(DATABASE_URL, min_size=1, max_size=3, init=register_vector)
    async with pool.acquire() as conn:
        await conn.execute("DELETE FROM financial_docs")
        await conn.executemany(
            "INSERT INTO financial_docs (source, chunk, embedding) VALUES ($1, $2, $3)",
            [(c["source"], c["chunk"], emb) for c, emb in zip(all_chunks, embeddings)],
        )

    print(f"\nOK: Inserted {len(all_chunks)} chunks into financial_docs")
    await pool.close()


if __name__ == "__main__":
    asyncio.run(main())
