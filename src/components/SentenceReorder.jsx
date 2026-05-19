import { useState, useMemo } from 'react'
import { REORDER_EXERCISES } from '../sentenceReorderExercises'

const LEVELS = ['A1', 'A2']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function SentenceReorder({ onBack }) {
  const [level, setLevel] = useState('A1')
  const [started, setStarted] = useState(false)
  const [exercises, setExercises] = useState([])
  const [idx, setIdx] = useState(0)
  const [placed, setPlaced] = useState([])    // { token, origIdx }
  const [bank, setBank] = useState([])         // { token, origIdx }
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState(false)

  function handleStart() {
    const exs = shuffle(REORDER_EXERCISES.filter(e => e.level === level))
    setExercises(exs)
    loadExercise(exs, 0)
    setStarted(true)
    setCorrect(0)
    setFinished(false)
  }

  function loadExercise(exs, i) {
    const ex = exs[i]
    const shuffled = shuffle(ex.tokens.map((token, origIdx) => ({ token, origIdx })))
    setPlaced([])
    setBank(shuffled)
    setChecked(false)
    setIdx(i)
  }

  function placeToken(item) {
    setBank(b => b.filter(t => t.origIdx !== item.origIdx))
    setPlaced(p => [...p, item])
  }

  function removeToken(item) {
    setPlaced(p => p.filter(t => t.origIdx !== item.origIdx))
    setBank(b => [...b, item])
  }

  function handleCheck() {
    setChecked(true)
    const answer = placed.map(t => t.token).join(' ')
    const expected = exercises[idx].tokens.join(' ')
    if (answer === expected) setCorrect(c => c + 1)
  }

  function handleNext() {
    if (idx + 1 < exercises.length) {
      loadExercise(exercises, idx + 1)
    } else {
      setFinished(true)
    }
  }

  const isCorrect = checked && placed.map(t => t.token).join(' ') === exercises[idx]?.tokens.join(' ')

  if (!started) {
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="task-header accent-orange">
          <span className="task-icon">🔀</span>
          <div><h2>Sentence Reorder</h2><p className="task-subtitle">Choose level</p></div>
        </div>
        <div className="prompt-box" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.5 }}>
            Arrange the words into a correct Spanish sentence. Tap a word to place it, tap a placed word to move it back.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            {LEVELS.map(l => (
              <button key={l} className={`level-btn ${level === l ? 'level-btn-active' : ''}`} onClick={() => setLevel(l)} style={{ flex: 1 }}>
                {l}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            {REORDER_EXERCISES.filter(e => e.level === level).length} sentences
          </div>
        </div>
        <button className="btn-primary" onClick={handleStart}>Start →</button>
      </div>
    )
  }

  if (finished) {
    const total = exercises.length
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="session-complete">
          <div className="complete-icon">🔀</div>
          <h2>All done!</h2>
          <div className="reading-score-card" style={{ width: '100%' }}>
            <div className="reading-score-number">{correct}/{total}</div>
            <div className="reading-score-label">sentences correct</div>
          </div>
          <button className="btn-primary" onClick={() => { setStarted(false); setFinished(false) }}>
            Try again
          </button>
          <button className="btn-secondary" onClick={onBack}>Back</button>
        </div>
      </div>
    )
  }

  const ex = exercises[idx]

  return (
    <div className="task-session">
      <button className="btn-back" onClick={() => setStarted(false)}>← Back</button>
      <div className="task-header accent-orange">
        <span className="task-icon">🔀</span>
        <div>
          <h2>Sentence Reorder · {level}</h2>
          <p className="task-subtitle">{idx + 1} / {exercises.length}</p>
        </div>
      </div>

      {/* Hint */}
      <div style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>
        💡 {ex.hint}
      </div>

      {/* Answer area */}
      <div className="reorder-answer-area">
        {placed.length === 0 ? (
          <span style={{ color: 'var(--muted)', fontSize: 14 }}>Tap words below to build the sentence...</span>
        ) : (
          placed.map((item, i) => (
            <button
              key={item.origIdx}
              className="reorder-token reorder-token-placed"
              onClick={() => !checked && removeToken(item)}
              disabled={checked}
            >
              {item.token}
            </button>
          ))
        )}
      </div>

      {/* Word bank */}
      <div className="reorder-bank">
        {bank.map(item => (
          <button
            key={item.origIdx}
            className="reorder-token reorder-token-bank"
            onClick={() => !checked && placeToken(item)}
            disabled={checked}
          >
            {item.token}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {checked && (
        <div style={{
          background: isCorrect ? 'var(--green-light)' : '#fee2e2',
          border: `1.5px solid ${isCorrect ? 'var(--green)' : '#ef4444'}`,
          borderRadius: 12,
          padding: '14px 16px',
        }}>
          <div style={{ fontWeight: 700, color: isCorrect ? '#065f46' : '#991b1b', marginBottom: isCorrect ? 0 : 6 }}>
            {isCorrect ? '✓ Correct!' : '✗ Correct order:'}
          </div>
          {!isCorrect && (
            <div style={{ fontSize: 15, color: 'var(--text)', fontWeight: 600 }}>
              {ex.tokens.join(' ')}
            </div>
          )}
        </div>
      )}

      {!checked ? (
        <button
          className="btn-primary"
          onClick={handleCheck}
          disabled={placed.length !== ex.tokens.length}
          style={{ opacity: placed.length === ex.tokens.length ? 1 : 0.5 }}
        >
          Check
        </button>
      ) : (
        <button className={`btn-primary ${isCorrect ? 'btn-done' : ''}`} onClick={handleNext}>
          {idx + 1 < exercises.length ? 'Next sentence →' : 'See results'}
        </button>
      )}
    </div>
  )
}
