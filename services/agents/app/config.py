import os
from dotenv import load_dotenv

load_dotenv()

DEEPSEEK_API_KEY = os.environ["DEEPSEEK_API_KEY"]
VOYAGE_API_KEY = os.environ["VOYAGE_API_KEY"]
TELEGRAM_BOT_TOKEN = os.environ["TELEGRAM_BOT_TOKEN"]
DATABASE_URL = os.environ["DATABASE_URL"]

LEAD_MODEL = os.getenv("LEAD_MODEL", "deepseek-chat")
MATCH_MODEL = os.getenv("MATCH_MODEL", "deepseek-chat")
LEGAL_MODEL = os.getenv("LEGAL_MODEL", "deepseek-reasoner")
