import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatPage.css';

const API = 'http://localhost:8000';

interface Message {
  id: number;
  text: string;
  from: 'user' | 'agent';
  time: string;
  suggestions?: string[];
  hint?: string;
}

const OP_TO_FILTER: Record<string, string> = {
  alquiler: 'rent',
  anticretico: 'anticretico',
  venta: 'sale',
};

function buildPropertyUrl(profile: Record<string, unknown>): string {
  const params = new URLSearchParams();
  const op = profile.operation_type as string | undefined;
  if (op) params.set('operation', OP_TO_FILTER[op] ?? op);
  if (profile.rooms) params.set('rooms', String(profile.rooms));
  if (profile.budget_usd) params.set('budget', String(profile.budget_usd));
  const zones = profile.zones as string[] | undefined;
  if (zones?.length) params.set('zone', zones[0]);
  return `/propiedades?${params.toString()}`;
}

function sessionId(): string {
  const key = 'casalens_session';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

function now(): string {
  return new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });
}

export function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [completedLeadId, setCompletedLeadId] = useState<string | null>(null);
  const [propertyUrl, setPropertyUrl] = useState('/propiedades');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sid = sessionId();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { id: Date.now(), text, from: 'user', time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const resp = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sid, message: text }),
      });
      const data = await resp.json();

      const agentMsg: Message = {
        id: Date.now() + 1,
        text: data.reply,
        from: 'agent',
        time: now(),
        suggestions: data.suggestions ?? [],
        hint: data.hint ?? null,
      };

      if (data.complete && data.lead_id) {
        const closingMsg: Message = {
          id: Date.now() + 2,
          text: '¡Listo! Ya busqué las propiedades que coinciden con lo que necesitás. Hacé clic en el botón para verlas. 🏠',
          from: 'agent',
          time: now(),
        };
        setMessages((prev) => [...prev, agentMsg, closingMsg]);
        setCompletedLeadId(data.lead_id);
        if (data.lead_profile) setPropertyUrl(buildPropertyUrl(data.lead_profile));
      } else {
        setMessages((prev) => [...prev, agentMsg]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: 'No se pudo conectar con el servidor.', from: 'agent', time: now() },
      ]);
    } finally {
      setLoading(false);
      if (!completedLeadId) inputRef.current?.focus();
    }
  }

  async function handleStart() {
    setStarted(true);
    await sendMessage('Hola');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const lastIdx = messages.length - 1;

  return (
    <div className="wa-shell">
      {/* Header */}
      <div className="wa-header">
        <div className="wa-header__avatar">CL</div>
        <div className="wa-header__info">
          <span className="wa-header__name">CasaLens</span>
          <span className="wa-header__status">{loading ? 'escribiendo...' : 'en línea'}</span>
        </div>
      </div>

      {/* Chat body */}
      <div className="wa-body">
        {!started ? (
          <div className="wa-start">
            <div className="wa-start__bubble">
              <p>👋 Hola, soy <strong>CasaLens</strong>.</p>
              <p>Te ayudo a encontrar tu próxima propiedad en Bolivia.</p>
              <button className="wa-start__btn" onClick={handleStart}>
                Iniciar conversación
              </button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              const isLast = idx === lastIdx;
              const showSuggestions = msg.from === 'agent' && isLast && !loading && (msg.suggestions?.length ?? 0) > 0;
              const showHint = msg.from === 'agent' && isLast && !loading && !!msg.hint && !completedLeadId;
              const hasActions = showSuggestions;

              return (
                <div key={msg.id} className={`wa-msg wa-msg--${msg.from}`}>
                  <div className={`wa-msg__bubble${hasActions ? ' wa-msg__bubble--has-actions' : ''}`}>
                    <span className="wa-msg__text">{msg.text}</span>
                    <span className="wa-msg__meta">
                      {msg.time}
                      {msg.from === 'user' && <span className="wa-msg__check">✓✓</span>}
                    </span>

                    {showSuggestions && (
                      <div className="wa-suggestions">
                        {msg.suggestions!.map((s) => (
                          <button
                            key={s}
                            className="wa-suggestion"
                            onClick={() => {
                              if (s === 'Escribir otra opción') {
                                inputRef.current?.focus();
                              } else {
                                sendMessage(s);
                              }
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {showHint && (
                    <p className="wa-hint">💬 {msg.hint}</p>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="wa-msg wa-msg--agent">
                <div className="wa-msg__bubble wa-msg__bubble--typing">
                  <span className="wa-typing"><span /><span /><span /></span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Botón Ver propiedades — aparece sobre la barra cuando el chat completa */}
      {completedLeadId && (
        <button
          className="wa-match-btn"
          onClick={() => navigate(propertyUrl)}
        >
          Ver propiedades →
        </button>
      )}

      {/* Input bar */}
      {started && !completedLeadId && (
        <div className="wa-input-bar">
          <input
            ref={inputRef}
            className="wa-input"
            type="text"
            placeholder="Escribe un mensaje"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            className="wa-send"
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M1.101 21.757 23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
