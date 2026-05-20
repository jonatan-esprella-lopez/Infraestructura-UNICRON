import os
from pathlib import Path

from dotenv import load_dotenv


ENV_FILE = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(ENV_FILE)


def _looks_like_placeholder(name: str, value: str) -> bool:
    normalized = value.strip().lower()
    placeholder_markers = ("...", "<", ">", "your_", "changeme", "todo", "xxx", "example")
    if any(marker in normalized for marker in placeholder_markers):
        return True
    if name.endswith("API_KEY") and len(value.strip()) < 20:
        return True
    if name == "TELEGRAM_BOT_TOKEN" and len(value.strip()) < 30:
        return True
    return False


def _required_env(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    if _looks_like_placeholder(name, value):
        raise RuntimeError(f"{name} looks like a placeholder. Set a real value in {ENV_FILE}.")
    return value


def _truthy_env(name: str) -> bool:
    return os.getenv(name, "").strip().lower() in {"1", "true", "yes", "on"}


_langsmith_tracing_enabled = _truthy_env("LANGSMITH_TRACING") or _truthy_env("LANGCHAIN_TRACING_V2")

if _langsmith_tracing_enabled and _looks_like_placeholder(
    "LANGSMITH_API_KEY",
    os.getenv("LANGSMITH_API_KEY", ""),
):
    os.environ["LANGSMITH_TRACING"] = "false"
    os.environ["LANGCHAIN_TRACING_V2"] = "false"


DEEPSEEK_API_KEY = _required_env("DEEPSEEK_API_KEY")
VOYAGE_API_KEY = _required_env("VOYAGE_API_KEY")
TELEGRAM_BOT_TOKEN = _required_env("TELEGRAM_BOT_TOKEN")
DATABASE_URL = _required_env("DATABASE_URL")

SERVICE_PUBLIC_URL = os.getenv("SERVICE_PUBLIC_URL", "")
BACKEND_API_URL = os.getenv("BACKEND_API_URL", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "")
WEB_BASE_URL = os.getenv("WEB_BASE_URL", FRONTEND_URL or "https://wasi.pages.dev")


def _csv_env(name: str) -> list[str]:
    return [item.strip() for item in os.getenv(name, "").split(",") if item.strip()]


_default_cors_origins = [
    "https://wasi.pages.dev",
    "https://infraestructura-unicron-api.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CORS_ORIGINS = list(
    dict.fromkeys(
        [
            *_default_cors_origins,
            *[origin for origin in (FRONTEND_URL, WEB_BASE_URL) if origin],
            *_csv_env("CORS_ORIGINS"),
        ]
    )
)

LEAD_MODEL = os.getenv("LEAD_MODEL", "deepseek-chat")
MATCH_MODEL = os.getenv("MATCH_MODEL", "deepseek-chat")
LEGAL_MODEL = os.getenv("LEGAL_MODEL", "deepseek-reasoner")
