import { useState, useRef, useEffect } from 'react'
import { ERROR_CORRECTION_EXERCISES } from '../errorCorrectionExercises'

const LEVELS = ['B1', 'B2', 'C1']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function normalize(str) {
  return str.trim().toLowerCase()
}

function wholeWord(text, word) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`\\b${escaped}\\b`, 'i').test(text)
}

function isAnswerCorrect(input, ex) {
  const norm = normalize(input)
  // Accept just the corrected word/phrase
  if (norm === normalize(ex.correction)) return true
  // Accept the full corrected sentence: must contain the fix and not the error word
  return wholeWord(input, ex.correction) && !wholeWord(input, ex.errorWord)
}

function makeCorrectSentence(ex) {
  const escaped = ex.errorWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return ex.sentence.replace(new RegExp(escaped, 'i'), ex.correction)
}

export default function ErrorCorrection({ onBack }) {
  const [level, setLevel] = useState('B1')
  const [started, setStarted] = useState(false)
  const [exercises, setExercises] = useState([])
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (started && !finished && !checked && inputRef.current) {
      inputRef.current.focus()
    }
  }, [started, finished, checked, idx])

  function handleStart() {
    const exs = shuffle(ERROR_CORRECTION_EXERCISES.filter(e => e.level === level))
    setExercises(exs)
    setIdx(0)
    setInput('')
    setChecked(false)
    setCorrect(0)
    setFinished(false)
    setStarted(true)
  }

  function handleCheck() {
    if (!input.trim()) return
    setChecked(true)
    if (isAnswerCorrect(input, exercises[idx])) {
      setCorrect(c => c + 1)
    }
  }

  function handleNext() {
    if (idx + 1 < exercises.length) {
      setIdx(i => i + 1)
      setInput('')
      setChecked(false)
    } else {
      setFinished(true)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      if (!checked) {
        handleCheck()
      } else {
        handleNext()
      }
    }
  }

  // ── Level picker ──────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="task-header" style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}>
          <span className="task-icon">🔧</span>
          <div>
            <h2>Error Correction</h2>
            <p className="task-subtitle">Choose level</p>
          </div>
        </div>

        <div className="prompt-box" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.5 }}>
            Each sentence has one grammar mistake. You can either rewrite the <strong>whole corrected sentence</strong>, or type just the <strong>corrected word</strong> — both work.
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
            {ERROR_CORRECTION_EXERCISES.filter(e => e.level === level).length} sentences
          </div>
        </div>

        <button className="btn-primary" onClick={handleStart}>Start →</button>
      </div>
    )
  }

  // ── Results screen ────────────────────────────────────────────────────────
  if (finished) {
    const total = exercises.length
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="session-complete">
          <div className="complete-icon">🔧</div>
          <h2>All done!</h2>
          <div className="reading-score-card" style={{ width: '100%' }}>
            <div className="reading-score-number">{correct}/{total}</div>
            <div className="reading-score-label">corrections correct</div>
          </div>
          <button className="btn-primary" onClick={() => { setStarted(false); setFinished(false) }}>
            Try again
          </button>
          <button className="btn-secondary" onClick={onBack}>Back</button>
        </div>
      </div>
    )
  }

  // ── Exercise screen ───────────────────────────────────────────────────────
  const ex = exercises[idx]
  const isCorrect = checked && isAnswerCorrect(input, ex)
  const correctSentence = makeCorrectSentence(ex)

  return (
    <div className="task-session">
      <button className="btn-back" onClick={() => setStarted(false)}>← Back</button>

      <div className="task-header" style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}>
        <span className="task-icon">🔧</span>
        <div>
          <h2>Error Correction · {level}</h2>
          <p className="task-subtitle">{idx + 1} / {exercises.length}</p>
        </div>
      </div>

      <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
        {ex.category}
      </div>

      <div className="prompt-box" style={{ textAlign: 'center' }}>
        <p className="prompt-label">Find and correct the error:</p>
        <p style={{ fontSize: 17, color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>
          {ex.sentence}
        </p>
      </div>

      {!checked && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>
            Rewrite the sentence (or just type the corrected word):
          </label>
          <textarea
            ref={inputRef}
            className="text-input"
            rows={3}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleCheck() }
              if (e.key === 'Enter' && checked) handleNext()
            }}
            placeholder={`e.g. "${correctSentence}"`}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button className="btn-primary" onClick={handleCheck} disabled={!input.trim()}>
            Check
          </button>
        </div>
      )}

      {checked && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {isCorrect ? (
            <div style={{
              background: 'var(--green-light)',
              border: '1.5px solid var(--green)',
              borderRadius: 12,
              padding: '14px 16px',
            }}>
              <p style={{ color: 'var(--green)', fontWeight: 700, margin: '0 0 6px' }}>✓ Correct!</p>
              <p style={{ color: '#065f46', fontSize: 14, margin: '0 0 4px' }}>
                ✅ <strong>{correctSentence}</strong>
              </p>
              <p style={{ color: '#065f46', fontSize: 13, margin: 0 }}>{ex.explanation}</p>
            </div>
          ) : (
            <div style={{
              background: '#fef2f2',
              border: '1.5px solid #f87171',
              borderRadius: 12,
              padding: '14px 16px',
            }}>
              <p style={{ color: '#dc2626', fontWeight: 700, margin: '0 0 6px' }}>✗ Not quite.</p>
              <p style={{ color: '#dc2626', fontSize: 14, margin: '0 0 6px' }}>
                Correct: <strong>"{ex.correction}"</strong>
              </p>
              <p style={{ color: '#1e3a5f', fontSize: 14, margin: '0 0 6px' }}>
                ✅ <strong>{correctSentence}</strong>
              </p>
              <p style={{ color: '#7f1d1d', fontSize: 13, margin: 0 }}>{ex.explanation}</p>
            </div>
          )}

          <button className="btn-primary" onClick={handleNext} onKeyDown={handleKeyDown}>
            {idx + 1 < exercises.length ? 'Next →' : 'See results'}
          </button>
        </div>
      )}
    </div>
  )
}
