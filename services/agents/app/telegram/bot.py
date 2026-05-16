import os
from telegram import Update
from telegram.ext import Application, MessageHandler, CommandHandler, filters, ContextTypes
from langchain_core.messages import HumanMessage
from app.graphs.lead_graph import lead_graph
from app.db.connection import save_lead
from app.config import TELEGRAM_BOT_TOKEN

WEB_BASE_URL = os.getenv("WEB_BASE_URL", "http://localhost:5173")


async def start(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text(
        "¡Hola! Soy CasaLens 🏠 Te ayudo a encontrar tu próxima casa o depa en Bolivia. "
        "Contame, ¿estás buscando alquiler, anticrético o querés comprar?"
    )


async def on_message(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    chat_id = update.effective_chat.id
    text = update.message.text

    config = {"configurable": {"thread_id": str(chat_id)}}
    state = await lead_graph.ainvoke(
        {"messages": [HumanMessage(content=text)]},
        config=config,
    )

    last_msg = state["messages"][-1]
    await update.message.reply_text(last_msg.content)

    if state["complete"]:
        lead_id = await save_lead(chat_id=chat_id, profile=state["lead_profile"])
        await update.message.reply_text(
            f"Mirá tus propiedades acá 👉 {WEB_BASE_URL}/app/matcher?lead={lead_id}"
        )


def main() -> None:
    app = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, on_message))
    print("Bot corriendo... Ctrl+C para detener.")
    app.run_polling()


if __name__ == "__main__":
    main()
