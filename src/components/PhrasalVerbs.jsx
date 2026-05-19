import { useState } from 'react'
import { PHRASAL_VERBS_EXERCISES } from '../phrasalVerbsExercises'

const LEVELS = ['A1', 'A2']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Split sentence into [before-blank, after-blank] for styled rendering
function parseSentence(sentence) {
  const idx = sentence.indexOf('___')
  if (idx === -1) return [sentence, '']
  return [sentence.slice(0, idx), sentence.slice(idx + 3)]
}

export default function PhrasalVerbs({ onBack }) {
  const [level, setLevel]     = useState('A1')
  const [started, setStarted] = useState(false)
  const [exercises, setExercises] = useState([])
  const [idx, setIdx]         = useState(0)
  const [selected, setSelected] = useState(null)   // index into options array, or null
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState(false)

  function handleStart(chosenLevel) {
    const exs = shuffle(PHRASAL_VERBS_EXERCISES.filter(e => e.level === chosenLevel))
    setExercises(exs)
    setIdx(0)
    setSelected(null)
    setCorrect(0)
    setFinished(false)
    setStarted(true)
  }

  function handleSelect(optionIndex) {
    if (selected !== null) return   // already answered
    setSelected(optionIndex)
    if (optionIndex === exercises[idx].answer) {
      setCorrect(c => c + 1)
    }
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
        <div className="task-header accent-teal">
          <span className="task-icon">💫</span>
          <div>
            <h2>Phrasal Verbs</h2>
            <p className="task-subtitle">Choose level</p>
          </div>
        </div>
        <div className="prompt-box" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.5 }}>
            Complete the sentence with the correct particle. Tap an option to answer instantly — no confirm button needed.
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
            {PHRASAL_VERBS_EXERCISES.filter(e => e.level === level).length} exercises
          </div>
        </div>
        <button className="btn-primary" onClick={() => handleStart(level)}>Start →</button>
      </div>
    )
  }

  // ── Results screen ───────────────────────────────────────────────────────────
  if (finished) {
    const total = exercises.length
    const pct   = Math.round(correct / total * 100)
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="session-complete">
          <div className="complete-icon">💫</div>
          <h2>Phrasal Verbs complete!</h2>
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
            <p style={{ color: 'var(--teal)', fontWeight: 600, fontSize: 15 }}>
              Well done — keep it up!
            </p>
          )}
          {pct < 70 && (
            <p style={{ color: 'var(--muted)', fontSize: 15 }}>
              Keep practising — you will get there!
            </p>
          )}
          <button className="btn-primary" onClick={() => handleStart(level)}>Try again</button>
          <button className="btn-secondary" onClick={() => setStarted(false)}>Change level</button>
        </div>
      </div>
    )
  }

  // ── Exercise screen ──────────────────────────────────────────────────────────
  const ex = exercises[idx]
  const answered    = selected !== null
  const isCorrect   = answered && selected === ex.answer
  const [before, after] = parseSentence(ex.sentence)

  return (
    <div className="task-session">
      <button className="btn-back" onClick={() => setStarted(false)}>← Back</button>

      <div className="task-header accent-teal">
        <span className="task-icon">💫</span>
        <div>
          <h2>Phrasal Verbs · {level}</h2>
          <p className="task-subtitle">{idx + 1} / {exercises.length}</p>
        </div>
      </div>

      {/* Sentence with highlighted blank */}
      <div className="prompt-box" style={{ fontSize: 18, lineHeight: 1.7, textAlign: 'center' }}>
        {before}
        <span style={{
          color: 'var(--purple)',
          fontWeight: 800,
          borderBottom: '2px solid var(--purple)',
          padding: '0 4px',
        }}>_____</span>
        {after}
      </div>

      {/* 2×2 option grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {ex.options.map((opt, i) => {
          const isThisCorrect = i === ex.answer
          let bg     = 'var(--card)'
          let border = '1.5px solid var(--border)'
          let color  = 'var(--text)'

          if (answered) {
            if (i === selected && isThisCorrect) {
              bg     = 'var(--green-light)'
              border = '1.5px solid var(--green)'
              color  = '#065f46'
            } else if (i === selected && !isThisCorrect) {
              bg     = '#fee2e2'
              border = '1.5px solid #ef4444'
              color  = '#991b1b'
            } else if (isThisCorrect) {
              bg     = 'var(--green-light)'
              border = '1.5px solid var(--green)'
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              style={{
                padding: '14px',
                borderRadius: '12px',
                border,
                background: bg,
                color,
                fontSize: '18px',
                fontWeight: 800,
                cursor: answered ? 'default' : 'pointer',
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {/* Meaning card — shown after answering */}
      {answered && (
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          <div style={{ fontSize: 15 }}>
            {isCorrect
              ? <span style={{ color: 'var(--green)', fontWeight: 700 }}>✓ Correct!</span>
              : <span style={{ color: '#ef4444', fontWeight: 700 }}>✗ The answer is: <strong>{ex.options[ex.answer]}</strong></span>
            }
          </div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>
            {ex.phrasalVerb}
          </div>
          <div style={{ color: 'var(--text)', fontSize: 14 }}>
            {ex.meaning}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 13, fontStyle: 'italic' }}>
            "{ex.example}"
          </div>
        </div>
      )}

      {answered && (
        <button className="btn-primary" onClick={handleNext}>
          {idx + 1 < exercises.length ? 'Next →' : 'See results'}
        </button>
      )}
    </div>
  )
}
