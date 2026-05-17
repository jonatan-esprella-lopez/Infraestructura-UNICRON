import { useEffect, useRef, useState } from 'react';
import './FinancialAdvisorPage.css';

const API = 'http://localhost:8000';

interface Evaluation {
  verdict: 'apto' | 'condicionado' | 'no_apto';
  score: number;
  max_property_usd?: number;
  strengths?: string[];
  concerns?: string[];
  recommendations?: string[];
  summary?: string;
}

interface Message {
  id: number;
  text: string;
  from: 'user' | 'agent';
  time: string;
  suggestions?: string[];
}

function sessionId(): string {
  const key = 'financial_session';
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

const VERDICT_LABEL: Record<string, string> = {
  apto: '✅ Apto para financiamiento',
  condicionado: '⚠️ Condicionado',
  no_apto: '❌ No apto por ahora',
};

const VERDICT_COLOR: Record<string, string> = {
  apto: '#25D366',
  condicionado: '#f59e0b',
  no_apto: '#ef4444',
};

export function FinancialAdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sid = sessionId();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, evaluation]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { id: Date.now(), text, from: 'user', time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const resp = await fetch(`${API}/financial-chat`, {
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
      };

      if (data.complete && data.evaluation) {
        const closingMsg: Message = {
          id: Date.now() + 2,
          text: '¡Listo! Analizé tu situación financiera. Aquí está tu evaluación 👇',
          from: 'agent',
          time: now(),
        };
        setMessages((prev) => [...prev, agentMsg, closingMsg]);
        setEvaluation(data.evaluation);
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
      if (!evaluation) inputRef.current?.focus();
    }
  }

  async function handleStart() {
    setStarted(true);
    await sendMessage('Hola, quiero saber si puedo comprar una propiedad');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const lastIdx = messages.length - 1;

  return (
    <div className="fa-shell">
      {/* Header */}
      <div className="fa-header">
        <div className="fa-header__avatar">AF</div>
        <div className="fa-header__info">
          <span className="fa-header__name">Asesor Financiero</span>
          <span className="fa-header__status">{loading ? 'analizando...' : 'en línea'}</span>
        </div>
      </div>

      {/* Chat body */}
      <div className="fa-body">
        {!started ? (
          <div className="fa-start">
            <div className="fa-start__bubble">
              <p>💰 Hola, soy tu <strong>Asesor Financiero</strong>.</p>
              <p>Te ayudo a saber si estás en condiciones de comprar, alquilar o tomar un anticrético en Bolivia.</p>
              <button className="fa-start__btn" onClick={handleStart}>
                Analizar mi situación
              </button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              const isLast = idx === lastIdx;
              const showSuggestions = msg.from === 'agent' && isLast && !loading && !evaluation && (msg.suggestions?.length ?? 0) > 0;

              return (
                <div key={msg.id} className={`fa-msg fa-msg--${msg.from}`}>
                  <div className={`fa-msg__bubble${showSuggestions ? ' fa-msg__bubble--has-actions' : ''}`}>
                    <span className="fa-msg__text">{msg.text}</span>
                    <span className="fa-msg__meta">
                      {msg.time}
                      {msg.from === 'user' && <span className="fa-msg__check">✓✓</span>}
                    </span>

                    {showSuggestions && (
                      <div className="fa-suggestions">
                        {msg.suggestions!.map((s) => (
                          <button
                            key={s}
                            className="fa-suggestion"
                            onClick={() => sendMessage(s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="fa-msg fa-msg--agent">
                <div className="fa-msg__bubble fa-msg__bubble--typing">
                  <span className="fa-typing"><span /><span /><span /></span>
                </div>
              </div>
            )}

            {/* Evaluation card */}
            {evaluation && (
              <div className="fa-eval-card">
                <div
                  className="fa-eval-card__verdict"
                  style={{ color: VERDICT_COLOR[evaluation.verdict] }}
                >
                  {VERDICT_LABEL[evaluation.verdict]}
                </div>

                {evaluation.score !== undefined && (
                  <div className="fa-eval-card__score-bar">
                    <div
                      className="fa-eval-card__score-fill"
                      style={{
                        width: `${evaluation.score}%`,
                        background: VERDICT_COLOR[evaluation.verdict],
                      }}
                    />
                    <span className="fa-eval-card__score-label">{evaluation.score}/100</span>
                  </div>
                )}

                {evaluation.summary && (
                  <p className="fa-eval-card__summary">{evaluation.summary}</p>
                )}

                {evaluation.max_property_usd && (
                  <p className="fa-eval-card__max">
                    Propiedad accesible estimada: <strong>${evaluation.max_property_usd.toLocaleString()} USD</strong>
                  </p>
                )}

                {(evaluation.strengths?.length ?? 0) > 0 && (
                  <div className="fa-eval-card__section">
                    <p className="fa-eval-card__section-title">✅ Fortalezas</p>
                    <ul>{evaluation.strengths!.map((s) => <li key={s}>{s}</li>)}</ul>
                  </div>
                )}

                {(evaluation.concerns?.length ?? 0) > 0 && (
                  <div className="fa-eval-card__section">
                    <p className="fa-eval-card__section-title">⚠️ Puntos a mejorar</p>
                    <ul>{evaluation.concerns!.map((c) => <li key={c}>{c}</li>)}</ul>
                  </div>
                )}

                {(evaluation.recommendations?.length ?? 0) > 0 && (
                  <div className="fa-eval-card__section">
                    <p className="fa-eval-card__section-title">💡 Recomendaciones</p>
                    <ul>{evaluation.recommendations!.map((r) => <li key={r}>{r}</li>)}</ul>
                  </div>
                )}
              </div>
            )}

            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input bar */}
      {started && !evaluation && (
        <div className="fa-input-bar">
          <input
            ref={inputRef}
            className="fa-input"
            type="text"
            placeholder="Escribe un mensaje"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            className="fa-send"
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
