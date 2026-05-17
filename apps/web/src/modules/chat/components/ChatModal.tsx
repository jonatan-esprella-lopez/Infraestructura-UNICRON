import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatModal.css';

const API = 'http://localhost:8000';

export type ChatOperationType = 'alquiler' | 'anticretico' | 'compra';

interface ChatModalProps {
  operation: ChatOperationType;
  onClose: () => void;
}

interface Message {
  id: number;
  text: string;
  from: 'user' | 'agent';
  time: string;
  suggestions?: string[];
  hint?: string;
}

const OP_FIRST_MESSAGE: Record<ChatOperationType, string> = {
  alquiler: 'Hola, quiero alquilar una propiedad',
  anticretico: 'Hola, quiero un anticrético',
  compra: 'Hola, quiero comprar una propiedad',
};

const OP_LABEL: Record<ChatOperationType, string> = {
  alquiler: 'Alquiler',
  anticretico: 'Anticrético',
  compra: 'Compra',
};

function now(): string {
  return new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });
}

const OP_TO_FILTER: Record<string, string> = {
  alquiler: 'rent',
  anticretico: 'anticretico',
  venta: 'sale',
  compra: 'sale',
};

function buildPropertyUrl(profile: Record<string, unknown>): string {
  const params = new URLSearchParams();

  const op = profile.operation_type as string | undefined;
  if (op) params.set('operation', OP_TO_FILTER[op] ?? op);

  if (profile.city) params.set('city', String(profile.city));

  // Price range ±20% so the agent shows approximate matches, not just exact budget
  if (profile.budget_usd) {
    const budget = Number(profile.budget_usd);
    params.set('minPrice', String(Math.round(budget * 0.8)));
    params.set('maxPrice', String(Math.round(budget * 1.2)));
  }

  // Bedroom range ±1 (min 1) so nearby options are included
  if (profile.rooms) {
    const rooms = Number(profile.rooms);
    params.set('minBedrooms', String(Math.max(1, rooms - 1)));
    params.set('maxBedrooms', String(rooms + 1));
  }

  // Pets: strict — only add if the user explicitly has a pet
  const extras = profile.extras as Record<string, unknown> | null | undefined;
  if (extras?.pet_friendly) params.set('petsAllowed', 'true');

  return `/propiedades?${params.toString()}`;
}

export function ChatModal({ operation, onClose }: ChatModalProps) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [completedLeadId, setCompletedLeadId] = useState<string | null>(null);
  const [propertyUrl, setPropertyUrl] = useState('/propiedades');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // unique session per modal open — starts fresh each time
  const sid = useRef(`modal-${operation}-${crypto.randomUUID()}`).current;
  // Guard against React StrictMode double-invoke
  const initialSent = useRef(false);

  useEffect(() => {
    if (initialSent.current) return;
    initialSent.current = true;
    sendMessage(OP_FIRST_MESSAGE[operation]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const lastIdx = messages.length - 1;

  return (
    <div className="cm-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cm-modal">
        {/* Header */}
        <div className="cm-header">
          <div className="cm-header__avatar">CL</div>
          <div className="cm-header__info">
            <span className="cm-header__name">CasaLens · {OP_LABEL[operation]}</span>
            <span className="cm-header__status">{loading ? 'escribiendo...' : 'en línea'}</span>
          </div>
          <button className="cm-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {/* Body */}
        <div className="cm-body">
          {messages.map((msg, idx) => {
            const isLast = idx === lastIdx;
            const showSuggestions = msg.from === 'agent' && isLast && !loading && !completedLeadId && (msg.suggestions?.length ?? 0) > 0;
            const showHint = msg.from === 'agent' && isLast && !loading && !!msg.hint && !completedLeadId;

            return (
              <div key={msg.id} className={`cm-msg cm-msg--${msg.from}`}>
                <div className={`cm-msg__bubble${showSuggestions ? ' cm-msg__bubble--has-actions' : ''}`}>
                  <span className="cm-msg__text">{msg.text}</span>
                  <span className="cm-msg__meta">
                    {msg.time}
                    {msg.from === 'user' && <span className="cm-msg__check">✓✓</span>}
                  </span>

                  {showSuggestions && (
                    <div className="cm-suggestions">
                      {msg.suggestions!.map((s) => (
                        <button
                          key={s}
                          className="cm-suggestion"
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

                {showHint && <p className="cm-hint">💬 {msg.hint}</p>}
              </div>
            );
          })}

          {loading && (
            <div className="cm-msg cm-msg--agent">
              <div className="cm-msg__bubble cm-msg__bubble--typing">
                <span className="cm-typing"><span /><span /><span /></span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Ver propiedades button */}
        {completedLeadId && (
          <button
            className="cm-match-btn"
            onClick={() => { onClose(); navigate(propertyUrl); }}
          >
            Ver propiedades →
          </button>
        )}

        {/* Input bar */}
        {!completedLeadId && (
          <div className="cm-input-bar">
            <input
              ref={inputRef}
              className="cm-input"
              type="text"
              placeholder="Escribe un mensaje"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="cm-send"
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
            >
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path fill="currentColor" d="M1.101 21.757 23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
