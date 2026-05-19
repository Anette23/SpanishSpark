import { useState, useMemo } from 'react'
import { COLLOCATIONS_EXERCISES } from '../collocationsExercises'

const LEVELS = ['A1', 'A2']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function SentenceWithBlank({ sentence }) {
  const parts = sentence.split('___')
  return (
    <span>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <span style={{ color: 'var(--purple)', fontWeight: 900 }}>_____</span>
          )}
        </span>
      ))}
    </span>
  )
}

function optionStyle(idx, selected, correctIdx, answered) {
  const base = {
    padding: '14px',
    borderRadius: '12px',
    border: '1.5px solid var(--border)',
    background: 'var(--card)',
    color: 'var(--text)',
    fontSize: '16px',
    fontWeight: 700,
    cursor: answered ? 'default' : 'pointer',
    transition: 'all .15s',
    textAlign: 'center',
  }
  if (!answered) return base
  if (idx === correctIdx) {
    return { ...base, background: 'var(--green-light)', borderColor: 'var(--green)', color: '#065f46' }
  }
  if (idx === selected) {
    return { ...base, background: '#fee2e2', borderColor: '#ef4444', color: '#991b1b' }
  }
  return base
}

export default function Collocations({ onBack }) {
  const [level, setLevel] = useState('A1')
  const [started, setStarted] = useState(false)
  const [exercises, setExercises] = useState([])
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)  // index of tapped option
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState(false)

  function handleStart() {
    const exs = shuffle(COLLOCATIONS_EXERCISES.filter(e => e.level === level))
    setExercises(exs)
    setIdx(0)
    setSelected(null)
    setCorrect(0)
    setFinished(false)
    setStarted(true)
  }

  function handleSelect(optIdx) {
    if (selected !== null) return  // already answered
    setSelected(optIdx)
    const ex = exercises[idx]
    if (optIdx === ex.answer) setCorrect(c => c + 1)
  }

  function handleNext() {
    if (idx + 1 < exercises.length) {
      setIdx(i => i + 1)
      setSelected(null)
    } else {
      setFinished(true)
    }
  }

  // ── Level picker ─────────────────────────────────────────────────────────────

  if (!started) {
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="task-header accent-blue">
          <span className="task-icon">🔗</span>
          <div><h2>Collocations</h2><p className="task-subtitle">Choose level</p></div>
        </div>
        <div className="prompt-box" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.5 }}>
            Choose the word that correctly completes each collocation. Tap an option to answer instantly — no separate Check button needed.
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
            {COLLOCATIONS_EXERCISES.filter(e => e.level === level).length} questions
          </div>
        </div>
        <button className="btn-primary" onClick={handleStart}>Start →</button>
      </div>
    )
  }

  // ── Results screen ────────────────────────────────────────────────────────────

  if (finished) {
    const total = exercises.length
    const pct = Math.round((correct / total) * 100)
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="session-complete">
          <div className="complete-icon">🔗</div>
          <h2>Collocations complete!</h2>
          <div className="reading-score-card" style={{ width: '100%' }}>
            <div className="reading-score-number">{correct}/{total}</div>
            <div className="reading-score-label">correct answers</div>
          </div>
          {pct === 100 && (
            <p style={{ color: 'var(--green)', fontWeight: 700, fontSize: 16 }}>
              Perfect score!
            </p>
          )}
          {pct >= 70 && pct < 100 && (
            <p style={{ color: 'var(--purple)', fontWeight: 700, fontSize: 15 }}>
              Great work — keep practising!
            </p>
          )}
          {pct < 70 && (
            <p style={{ color: 'var(--muted)', fontWeight: 600, fontSize: 15 }}>
              Keep going — collocations take time to learn!
            </p>
          )}
          <button className="btn-primary" onClick={() => { setStarted(false); setFinished(false) }}>
            Try again
          </button>
          <button className="btn-secondary" onClick={onBack}>Back</button>
        </div>
      </div>
    )
  }

  // ── Exercise screen ───────────────────────────────────────────────────────────

  const ex = exercises[idx]
  const answered = selected !== null
  const isCorrect = answered && selected === ex.answer

  return (
    <div className="task-session">
      <button className="btn-back" onClick={() => setStarted(false)}>← Back</button>

      <div className="task-header accent-blue">
        <span className="task-icon">🔗</span>
        <div>
          <h2>Collocations · {level}</h2>
          <p className="task-subtitle">{idx + 1} / {exercises.length}</p>
        </div>
      </div>

      {/* Sentence with blank */}
      <div
        className="prompt-box"
        style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.6, textAlign: 'center' }}
      >
        <SentenceWithBlank sentence={ex.sentence} />
      </div>

      {/* 2×2 option grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {ex.options.map((opt, i) => (
          <button
            key={i}
            style={optionStyle(i, selected, ex.answer, answered)}
            onClick={() => handleSelect(i)}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Explanation after answer */}
      {answered && (
        <div style={{
          background: isCorrect ? 'var(--green-light)' : '#fee2e2',
          border: `1.5px solid ${isCorrect ? 'var(--green)' : '#ef4444'}`,
          borderRadius: 12,
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          <div style={{ fontWeight: 700, color: isCorrect ? '#065f46' : '#991b1b', fontSize: 16 }}>
            {isCorrect
              ? `✓ Correct! "${ex.options[ex.answer]}" is right.`
              : `✗ The correct answer is "${ex.options[ex.answer]}".`}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>
            {ex.explanation}
          </div>
        </div>
      )}

      {answered && (
        <button className={`btn-primary ${isCorrect ? 'btn-done' : ''}`} onClick={handleNext}>
          {idx + 1 < exercises.length ? 'Next →' : 'See results'}
        </button>
      )}
    </div>
  )
}
