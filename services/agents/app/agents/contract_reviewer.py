import json
import re
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from app.config import DEEPSEEK_API_KEY, LEGAL_MODEL

llm = ChatOpenAI(
    model=LEGAL_MODEL,
    api_key=DEEPSEEK_API_KEY,
    base_url="https://api.deepseek.com",
    temperature=0,
)

SYSTEM_PROMPT = """Sos un revisor legal especializado en contratos inmobiliarios bolivianos.
Analizá el contrato y devolvé un JSON estricto con exactamente estas claves:

{
  "red_flags": [...],
  "yellow_flags": [...],
  "green": [...],
  "missing_required": [...]
}

Cada item tiene: { "clause_id": "C-XX", "text_excerpt": "...", "issue": "...", "recommendation": "..." }

Reglas:
- red_flags: cláusulas ilegales o gravemente abusivas (entrada sin previo aviso, garantías > 1 mes,
  renuncia a derechos básicos, falta de inscripción en Derechos Reales para anticréticos > USD 5000,
  penalizaciones desproporcionadas, restricciones arbitrarias de privacidad).
- yellow_flags: cláusulas cuestionables o ambiguas que conviene renegociar.
- green: 3-5 cláusulas bien redactadas (para mostrar balance).
- missing_required: elementos legalmente obligatorios ausentes (plazo, identificación de partes,
  monto, inscripción en Derechos Reales si aplica).

Sé conservador: si dudás, marcá como yellow no red.
JSON estricto, sin texto adicional, sin markdown."""


def _apply_logic_lens(analysis: dict, text: str, operation_type: str) -> dict:
    """Reglas determinísticas que complementan o corrigen lo que dijo el LLM."""
    text_lower = text.lower()

    # Entrada sin previo aviso
    if re.search(r"ingresar.{0,30}(cuando|sin)\b", text_lower):
        if not any("aviso" in f.get("issue", "").lower() for f in analysis.get("red_flags", [])):
            analysis["red_flags"].append({
                "clause_id": "LL-01",
                "text_excerpt": "cláusula de acceso al inmueble",
                "issue": "Permite ingreso sin previo aviso, violando la privacidad del inquilino.",
                "recommendation": "Exigir aviso con al menos 24-48 horas de anticipación.",
            })

    # Anticrético sin mención de Derechos Reales
    if operation_type == "anticretico" and "derechos reales" not in text_lower:
        if not any("derechos reales" in f.get("issue", "").lower() for f in analysis.get("missing_required", [])):
            analysis["missing_required"].append({
                "clause_id": "LL-02",
                "text_excerpt": "(no encontrado en el contrato)",
                "issue": "Anticrético sin mención de inscripción en Derechos Reales. Obligatorio para montos > USD 5.000 (Art. 1540 CC).",
                "recommendation": "Incluir cláusula de inscripción obligatoria en Derechos Reales antes de la entrega del inmueble.",
            })

    # Penalización > 30% del valor anual
    if re.search(r"penali[sz].{0,60}(\d+)\s*%", text_lower):
        match = re.search(r"penali[sz].{0,60}(\d+)\s*%", text_lower)
        if match and int(match.group(1)) > 30:
            if not any("penali" in f.get("issue", "").lower() for f in analysis.get("red_flags", [])):
                analysis["red_flags"].append({
                    "clause_id": "LL-03",
                    "text_excerpt": match.group(0)[:80],
                    "issue": f"Penalización del {match.group(1)}% es desproporcionada.",
                    "recommendation": "Negociar penalización máxima del 10-15% o equivalente a 1 mes de alquiler.",
                })

    return analysis


async def analyze_contract(text: str, operation_type: str = "alquiler") -> dict:
    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=f"Tipo de contrato: {operation_type}\n\nContrato:\n{text}"),
    ]

    resp = await llm.ainvoke(messages)
    raw = resp.content.strip()

    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    analysis = json.loads(raw)

    # Asegurar que todas las claves existen
    for key in ("red_flags", "yellow_flags", "green", "missing_required"):
        analysis.setdefault(key, [])

    analysis = _apply_logic_lens(analysis, text, operation_type)

    return {
        "operation_type": operation_type,
        "summary": {
            "red_count": len(analysis["red_flags"]),
            "yellow_count": len(analysis["yellow_flags"]),
            "green_count": len(analysis["green"]),
            "missing_count": len(analysis["missing_required"]),
        },
        **analysis,
    }
