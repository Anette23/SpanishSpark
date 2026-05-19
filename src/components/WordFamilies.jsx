import { useState, useMemo } from 'react'
import { WORD_FAMILIES_EXERCISES } from '../wordFamiliesExercises'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function normalise(str) {
  return str.trim().toLowerCase()
}

const LEVELS = ['B1', 'B2', 'C1']

export default function WordFamilies({ onBack }) {
  const [level, setLevel] = useState(null)
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const [familyOpen, setFamilyOpen] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [finished, setFinished] = useState(false)

  const exercises = useMemo(() => {
    if (!level) return []
    return shuffle(WORD_FAMILIES_EXERCISES.filter(e => e.level === level))
  }, [level])

  // ── Level picker ──────────────────────────────────────────────────────────────

  if (!level) {
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>

        <div className="task-header accent-green">
          <span className="task-icon">🌿</span>
          <div>
            <h2>Word Families</h2>
            <p className="task-subtitle">Choose the correct word form</p>
          </div>
        </div>

        <div className="prompt-box">
          <p className="prompt-label">Choose your level</p>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
            You will see a sentence with a blank. Type the correct form of the root word shown.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {LEVELS.map(lvl => {
            const count = WORD_FAMILIES_EXERCISES.filter(e => e.level === lvl).length
            return (
              <button
                key={lvl}
                className="level-btn"
                onClick={() => setLevel(lvl)}
                style={{ textAlign: 'left', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span style={{ fontWeight: 700, fontSize: 16 }}>{lvl}</span>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>{count} exercises</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Results screen ────────────────────────────────────────────────────────────

  if (finished) {
    const total = correct + wrong
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>

        <div className="session-complete">
          <div className="complete-icon">🌿</div>
          <h2>Session complete!</h2>

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
            <p style={{ color: 'var(--green)', fontWeight: 600, fontSize: 15 }}>
              Great work! Keep building those word families.
            </p>
          )}
          {pct < 70 && (
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>
              Keep practising — word forms take time to master!
            </p>
          )}

          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button
              className="btn-secondary"
              style={{ flex: 1 }}
              onClick={() => {
                setLevel(null)
                setIdx(0)
                setInput('')
                setChecked(false)
                setFamilyOpen(false)
                setCorrect(0)
                setWrong(0)
                setFinished(false)
              }}
            >
              Change level
            </button>
            <button
              className="btn-primary"
              style={{ flex: 1 }}
              onClick={() => {
                setIdx(0)
                setInput('')
                setChecked(false)
                setFamilyOpen(false)
                setCorrect(0)
                setWrong(0)
                setFinished(false)
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Exercise screen ───────────────────────────────────────────────────────────

  const ex = exercises[idx]

  function handleCheck() {
    if (!input.trim()) return
    setChecked(true)
    if (normalise(input) === normalise(ex.answer)) {
      setCorrect(c => c + 1)
    } else {
      setWrong(w => w + 1)
    }
  }

  function handleNext() {
    if (idx + 1 < exercises.length) {
      setIdx(i => i + 1)
      setInput('')
      setChecked(false)
      setFamilyOpen(false)
    } else {
      setFinished(true)
    }
  }

  const isCorrect = checked && normalise(input) === normalise(ex.answer)

  // Render sentence with blank highlighted
  const [before, after] = ex.sentence.split('___')

  return (
    <div className="task-session">
      <button className="btn-back" onClick={() => setLevel(null)}>← Back</button>

      <div className="task-header accent-green">
        <span className="task-icon">🌿</span>
        <div>
          <h2>Word Families</h2>
          <p className="task-subtitle">{level} · {idx + 1} / {exercises.length}</p>
        </div>
      </div>

      {/* Root word badge */}
      <div className="prompt-box" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="prompt-label">Root word</div>
        <div>
          <span style={{
            background: 'color-mix(in srgb, var(--purple) 12%, transparent)',
            color: 'var(--purple)',
            padding: '4px 12px',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 15,
            display: 'inline-block',
            marginBottom: 8,
          }}>
            {ex.rootWord} ({ex.rootForm})
          </span>
        </div>

        {/* Sentence with blank */}
        <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--text)', margin: 0 }}>
          {before}
          <span style={{
            display: 'inline-block',
            minWidth: 80,
            borderBottom: '2.5px solid var(--purple)',
            margin: '0 4px',
            color: checked ? (isCorrect ? 'var(--green)' : '#ef4444') : 'var(--purple)',
            fontWeight: 700,
          }}>
            {checked ? ex.answer : '_____'}
          </span>
          {after}
        </p>

        <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
          Required form: <strong>{ex.requiredForm}</strong>
        </p>
      </div>

      {/* Collapsible word family reference */}
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        overflow: 'hidden',
      }}>
        <button
          onClick={() => setFamilyOpen(o => !o)}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            color: 'var(--purple)',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          <span>See word family</span>
          <span style={{ fontSize: 18, lineHeight: 1 }}>{familyOpen ? '▲' : '▼'}</span>
        </button>

        {familyOpen && (
          <div style={{ padding: '4px 16px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {ex.family.map((member, i) => (
              <div key={i} style={{ fontSize: 14, color: 'var(--text)', padding: '2px 0' }}>
                {member}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input area */}
      {!checked && (
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="vocab-search"
            type="text"
            placeholder="Type the correct form..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleCheck() }}
            autoFocus
            style={{ flex: 1 }}
          />
          <button
            className="btn-primary"
            onClick={handleCheck}
            disabled={!input.trim()}
            style={{ width: 'auto', padding: '10px 20px', fontSize: 15 }}
          >
            Check
          </button>
        </div>
      )}

      {/* Feedback */}
      {checked && (
        <>
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
              {isCorrect ? '✓ Correct!' : `✗ The answer is: ${ex.answer}`}
            </div>
            {!isCorrect && (
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                You typed: {input}
              </div>
            )}
            <div style={{ fontSize: 14, color: 'var(--text)', marginTop: 4 }}>
              {ex.explanation}
            </div>
          </div>

          {/* Full family tree shown after answering */}
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '12px 16px',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Word family
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {ex.family.map((member, i) => {
                const isAnswer = member.toLowerCase().startsWith(ex.answer.toLowerCase())
                return (
                  <div
                    key={i}
                    style={{
                      fontSize: 14,
                      color: isAnswer ? 'var(--purple)' : 'var(--text)',
                      fontWeight: isAnswer ? 700 : 400,
                      padding: '2px 0',
                    }}
                  >
                    {isAnswer ? '→ ' : ''}{member}
                  </div>
                )
              })}
            </div>
          </div>

          <button className="btn-primary" onClick={handleNext}>
            {idx + 1 < exercises.length ? 'Next word →' : 'See results'}
          </button>
        </>
      )}
    </div>
  )
}
