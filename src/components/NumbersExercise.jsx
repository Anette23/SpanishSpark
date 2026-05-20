import { useState, useRef, useEffect } from 'react'
import { NUMBERS_EXERCISES } from '../numbersExercises'

const LEVELS = ['A1', 'A2']

const CATEGORY_LABELS = {
  números: '🔢 Números',
  horas: '🕐 Horas',
  días: '📅 Días',
  meses: '🗓️ Meses',
  fechas: '📆 Fechas',
  duración: '⏱️ Duración',
  frecuencia: '🔄 Frecuencia',
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function normalise(s) {
  return s.toLowerCase()
    .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
    .replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ü/g, 'u')
    .replace(/ñ/g, 'n').trim()
}

function isCorrect(input, answers) {
  const norm = normalise(input)
  return answers.some(a => normalise(a) === norm)
}

export default function NumbersExercise({ onBack }) {
  const [level, setLevel] = useState('A1')
  const [started, setStarted] = useState(false)
  const [exercises, setExercises] = useState([])
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const [hintVisible, setHintVisible] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (started && !finished && !checked && inputRef.current) {
      inputRef.current.focus()
    }
  }, [started, finished, checked, idx])

  function handleStart() {
    const exs = shuffle(NUMBERS_EXERCISES.filter(e => e.level === level))
    setExercises(exs)
    setIdx(0)
    setInput('')
    setChecked(false)
    setHintVisible(false)
    setCorrect(0)
    setFinished(false)
    setStarted(true)
  }

  function handleCheck() {
    if (!input.trim()) return
    setChecked(true)
    if (isCorrect(input, exercises[idx].answer)) {
      setCorrect(c => c + 1)
    }
  }

  function handleNext() {
    if (idx + 1 < exercises.length) {
      setIdx(i => i + 1)
      setInput('')
      setChecked(false)
      setHintVisible(false)
    } else {
      setFinished(true)
    }
  }

  if (!started) {
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="task-header" style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
          <span className="task-icon">🔢</span>
          <div>
            <h2>Čísla a čas</h2>
            <p className="task-subtitle">Vyber úroveň</p>
          </div>
        </div>

        <div className="prompt-box" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.5 }}>
            Precvič čísla, hodiny, dni, mesiace a dátumy v španielčine.
            Napíš odpoveď v španielčine — diakritika nie je povinná.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            {LEVELS.map(l => (
              <button
                key={l}
                className={`level-btn ${level === l ? 'level-btn-active' : ''}`}
                onClick={() => setLevel(l)}
                style={{ flex: 1 }}
              >
                {l}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            {NUMBERS_EXERCISES.filter(e => e.level === level).length} cvičení
          </div>
        </div>

        <button className="btn-primary" onClick={handleStart}>Začať →</button>
      </div>
    )
  }

  if (finished) {
    const total = exercises.length
    const pct = Math.round(correct / total * 100)
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="session-complete">
          <div className="complete-icon">🔢</div>
          <h2>Hotovo!</h2>
          <div className="reading-score-card" style={{ width: '100%' }}>
            <div className="reading-score-number">{correct}/{total}</div>
            <div className="reading-score-label">správnych odpovedí ({pct}%)</div>
          </div>
          {correct === total && (
            <p style={{ color: 'var(--green)', fontWeight: 700, fontSize: 16 }}>⭐ Perfecto!</p>
          )}
          <button className="btn-primary" onClick={() => { setStarted(false); setFinished(false) }}>
            Skúsiť znovu
          </button>
          <button className="btn-secondary" onClick={onBack}>Späť</button>
        </div>
      </div>
    )
  }

  const ex = exercises[idx]
  const ok = checked && isCorrect(input, ex.answer)

  return (
    <div className="task-session">
      <button className="btn-back" onClick={() => setStarted(false)}>← Back</button>

      <div className="task-header" style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
        <span className="task-icon">🔢</span>
        <div>
          <h2>Čísla a čas · {level}</h2>
          <p className="task-subtitle">{idx + 1} / {exercises.length}</p>
        </div>
      </div>

      <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
        {CATEGORY_LABELS[ex.category] || ex.category}
      </div>

      <div className="prompt-box" style={{ textAlign: 'center' }}>
        <p className="prompt-label">Preložte do španielčiny:</p>
        <p style={{ fontSize: 17, color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>
          {ex.question}
        </p>
      </div>

      {!checked && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {!hintVisible ? (
            <button
              className="btn-hint"
              onClick={() => setHintVisible(true)}
              style={{ alignSelf: 'flex-start', border: '1.5px dashed var(--muted)', background: 'none', color: 'var(--muted)', borderRadius: 8, padding: '4px 12px', fontSize: 13, cursor: 'pointer' }}
            >
              💡 Zobraziť nápovedu
            </button>
          ) : (
            <div style={{ background: 'var(--yellow-light, #fef9c3)', border: '1.5px solid #fbbf24', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#78350f' }}>
              💡 {ex.hint}
            </div>
          )}
          <input
            ref={inputRef}
            className="prep-input"
            type="text"
            placeholder="Tvoja odpoveď po španielsky..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && input.trim()) handleCheck() }}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
          <button className="btn-primary" onClick={handleCheck} disabled={!input.trim()}>
            Skontrolovať
          </button>
        </div>
      )}

      {checked && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ok ? (
            <div style={{ background: 'var(--green-light)', border: '1.5px solid var(--green)', borderRadius: 12, padding: '14px 16px' }}>
              <p style={{ color: 'var(--green)', fontWeight: 700, margin: '0 0 6px' }}>✓ Správne!</p>
              <p style={{ color: '#065f46', fontSize: 14, margin: '0 0 4px' }}>
                ✅ <strong>{ex.answer[0]}</strong>
              </p>
              <p style={{ color: '#065f46', fontSize: 13, margin: 0 }}>💡 {ex.hint}</p>
            </div>
          ) : (
            <div style={{ background: '#fef2f2', border: '1.5px solid #f87171', borderRadius: 12, padding: '14px 16px' }}>
              <p style={{ color: '#dc2626', fontWeight: 700, margin: '0 0 6px' }}>✗ Nie celkom.</p>
              <p style={{ color: '#1e3a5f', fontSize: 14, margin: '0 0 6px' }}>
                Správne: <strong>{ex.answer.join(' / ')}</strong>
              </p>
              <p style={{ color: '#7f1d1d', fontSize: 13, margin: 0 }}>💡 {ex.hint}</p>
            </div>
          )}
          <button className="btn-primary" onClick={handleNext}>
            {idx + 1 < exercises.length ? 'Ďalej →' : 'Zobraziť výsledky'}
          </button>
        </div>
      )}
    </div>
  )
}
