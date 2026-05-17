from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph.message import add_messages
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, BaseMessage
import json

from app.config import LEAD_MODEL, DEEPSEEK_API_KEY
from app.agents.financial_rag import retrieve_context

SYSTEM_PROMPT = """Sos un asesor financiero inmobiliario boliviano, amable y claro.
Tu objetivo es evaluar si el usuario puede comprar, alquilar o tomar un anticrético en Bolivia.

Datos que necesitás recopilar (uno por uno, en conversación natural):
- income_type: "dependiente" (trabaja en relación de dependencia) o "independiente"
- monthly_income_usd: ingreso neto mensual en dólares
- monthly_expenses_usd: gastos fijos mensuales (alquiler, servicios, educación)
- monthly_debt_usd: cuotas mensuales de deudas activas (préstamos, tarjetas)
- savings_usd: ahorros disponibles para anticipo o anticrético
- dependents: número de personas a cargo (opcional)
- has_credit_issues: si tiene algún problema crediticio en Infocenter (opcional)

Reglas de estilo:
- Una pregunta a la vez, lenguaje simple y boliviano
- Si el usuario no entiende un concepto (Infocenter, folio real, crédito hipotecario, etc.), explicalo brevemente antes de continuar
- Si el usuario no sabe un dato exacto, aceptá una estimación aproximada
- Nunca seas intimidante con los números — muchos no conocen su situación financiera con precisión

Cuando tengas income_type, monthly_income_usd, monthly_expenses_usd, monthly_debt_usd y savings_usd completos,
decí exactamente: "Perfecto, ya tengo todo lo que necesito para analizar tu situación financiera."
y no hagas más preguntas."""

EXTRACT_PROMPT = """De la conversación siguiente, extraé el perfil financiero JSON con exactamente estos campos:
income_type ("dependiente" | "independiente" | null),
monthly_income_usd (número | null),
monthly_expenses_usd (número | null),
monthly_debt_usd (número | null),
savings_usd (número | null),
dependents (número | null),
has_credit_issues (true | false | null).

Si un campo no fue mencionado, ponelo en null.
Respondé SOLO con JSON válido, sin texto adicional.

Conversación:
{conversation}"""

EVALUATE_PROMPT = """Sos un asesor financiero inmobiliario en Bolivia. Analizá este perfil y devolvé un JSON con la evaluación.

Criterios ASFI Bolivia:
- Cuota máxima crédito = 35% del ingreso mensual neto
- Anticipo mínimo para compra = 20% del valor del inmueble (10% vivienda social < $40.000)
- Para anticrético: necesita el monto total en ahorros
- Ingreso disponible = monthly_income - monthly_expenses - monthly_debt

Perfil del usuario:
{profile}

Devolvé SOLO este JSON (sin texto extra):
{{
  "verdict": "apto" | "condicionado" | "no_apto",
  "score": número entre 0 y 100,
  "max_loan_usd": número estimado de préstamo posible,
  "max_property_usd": número estimado de propiedad accesible (loan + 20% anticipo),
  "strengths": ["fortaleza 1", "fortaleza 2"],
  "concerns": ["preocupación 1"],
  "recommendations": ["recomendación concreta 1", "recomendación concreta 2"],
  "summary": "2-3 oraciones explicando la situación al usuario en lenguaje simple"
}}"""


class FinancialState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    financial_profile: dict
    evaluation: dict
    complete: bool


llm = ChatOpenAI(
    model=LEAD_MODEL,
    api_key=DEEPSEEK_API_KEY,
    base_url="https://api.deepseek.com",
    temperature=0.3,
)

llm_precise = ChatOpenAI(
    model=LEAD_MODEL,
    api_key=DEEPSEEK_API_KEY,
    base_url="https://api.deepseek.com",
    temperature=0,
)


async def chat_node(state: FinancialState) -> dict:
    last_human = next(
        (m.content for m in reversed(state["messages"]) if isinstance(m, HumanMessage)),
        "",
    )

    context = ""
    if last_human and ("?" in last_human or any(
        w in last_human.lower()
        for w in ["qué es", "que es", "cómo", "como", "infocenter", "crédito", "credito",
                  "anticretico", "anticrético", "folio", "derechos reales", "banco", "tasa"]
    )):
        context = await retrieve_context(last_human)

    system_content = SYSTEM_PROMPT
    if context:
        system_content += f"\n\nContexto de referencia (usalo si es relevante para responder):\n{context}"

    msgs = [SystemMessage(content=system_content)] + state["messages"]
    response = await llm.ainvoke(msgs)
    return {"messages": [response]}


async def extract_node(state: FinancialState) -> dict:
    conversation = "\n".join(
        f"{'Usuario' if isinstance(m, HumanMessage) else 'Asesor'}: {m.content}"
        for m in state["messages"]
    )
    resp = await llm_precise.ainvoke(
        [HumanMessage(content=EXTRACT_PROMPT.format(conversation=conversation))]
    )
    try:
        profile = json.loads(resp.content)
    except Exception:
        profile = state.get("financial_profile") or {}

    required = ["income_type", "monthly_income_usd", "monthly_expenses_usd",
                "monthly_debt_usd", "savings_usd"]
    complete = all(profile.get(k) is not None for k in required)

    last_reply = state["messages"][-1].content if state["messages"] else ""
    if "?" in last_reply:
        complete = False

    return {"financial_profile": profile, "complete": complete}


async def evaluate_node(state: FinancialState) -> dict:
    profile = state.get("financial_profile") or {}
    resp = await llm_precise.ainvoke(
        [HumanMessage(content=EVALUATE_PROMPT.format(profile=json.dumps(profile, ensure_ascii=False)))]
    )
    try:
        evaluation = json.loads(resp.content)
    except Exception:
        evaluation = {"verdict": "condicionado", "summary": "No se pudo calcular la evaluación."}

    return {"evaluation": evaluation}


def route_after_extract(state: FinancialState) -> str:
    return "evaluate" if state.get("complete") else END


_graph = StateGraph(FinancialState)
_graph.add_node("chat", chat_node)
_graph.add_node("extract", extract_node)
_graph.add_node("evaluate", evaluate_node)
_graph.set_entry_point("chat")
_graph.add_edge("chat", "extract")
_graph.add_conditional_edges("extract", route_after_extract, {"evaluate": "evaluate", END: END})
_graph.add_edge("evaluate", END)

financial_graph = _graph.compile(checkpointer=MemorySaver())
