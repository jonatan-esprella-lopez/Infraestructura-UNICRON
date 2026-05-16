from typing import Annotated, Literal, TypedDict
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, BaseMessage
from langgraph.graph.message import add_messages
import json
from app.config import LEAD_MODEL, DEEPSEEK_API_KEY

SYSTEM_PROMPT = """Sos CasaLens, asistente inmobiliario boliviano. Tu trabajo es entender qué busca esta persona
en 4-6 preguntas naturales, no como formulario. Usá modismos bolivianos suaves cuando encaje.
Datos que necesitas extraer:
- operation_type: "alquiler" | "anticretico" | "venta"
- budget_usd: número aproximado (en alquiler es mensual, en anticretico y venta es total)
- zones: lista de zonas (ej: ["Recoleta", "Cala Cala"])
- rooms: dormitorios deseados
- timing_weeks: cuán urgente es (en semanas)
- extras: pet_friendly, parking, etc.

Estilo: corto, una pregunta a la vez. Si la persona ya dio info, no la vuelvas a pedir.
Cuando tengas los 6 campos completos (operation_type, budget_usd, zones, rooms, timing_weeks y al menos un extra si aplica), decí exactamente:
"Perfecto, ya tengo lo que necesito. Te paso unas propiedades en un momento." y no hagas más preguntas."""

EXTRACT_PROMPT = """De la conversación siguiente, extraé el perfil JSON con exactamente estos campos:
operation_type, budget_usd, zones (lista de strings), rooms (número entero), timing_weeks (número entero), extras (dict).
Si algún campo no fue mencionado todavía, ponelo en null.
Respondé SOLO con JSON válido, sin texto adicional, sin markdown, sin bloques de código.

Conversación:
{conversation}"""


class LeadState(TypedDict):
    # add_messages acumula mensajes entre invocaciones usando el checkpoint
    messages: Annotated[list[BaseMessage], add_messages]
    lead_profile: dict
    complete: bool


llm = ChatOpenAI(
    model=LEAD_MODEL,
    api_key=DEEPSEEK_API_KEY,
    base_url="https://api.deepseek.com",
    temperature=0.3,
)


async def chat_node(state: LeadState) -> dict:
    msgs = [SystemMessage(content=SYSTEM_PROMPT)] + state["messages"]
    response = await llm.ainvoke(msgs)
    return {"messages": [response]}


async def extract_node(state: LeadState) -> dict:
    conversation = "\n".join(
        f"{'Usuario' if isinstance(m, HumanMessage) else 'CasaLens'}: {m.content}"
        for m in state["messages"]
    )
    prompt = EXTRACT_PROMPT.format(conversation=conversation)
    resp = await llm.ainvoke([HumanMessage(content=prompt)])

    try:
        profile = json.loads(resp.content)
    except Exception:
        profile = state.get("lead_profile") or {}

    required = ["operation_type", "budget_usd", "zones", "rooms", "timing_weeks"]
    complete = all(profile.get(k) for k in required)

    # Never mark complete if the agent's last message is still asking a question
    last_reply = state["messages"][-1].content if state["messages"] else ""
    if "?" in last_reply:
        complete = False

    return {"lead_profile": profile, "complete": complete}


# El grafo siempre termina después de un turno — Telegram maneja el siguiente mensaje
_graph = StateGraph(LeadState)
_graph.add_node("chat", chat_node)
_graph.add_node("extract", extract_node)
_graph.set_entry_point("chat")
_graph.add_edge("chat", "extract")
_graph.add_edge("extract", END)

lead_graph = _graph.compile(checkpointer=MemorySaver())
