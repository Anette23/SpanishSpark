import { useState } from 'react'
import { TRANSLATION_EXERCISES } from '../translationExercises'

const LEVELS = ['A1', 'A2']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function normalise(s) {
  return s.toLowerCase().replace(/[¿¡.,!?]/g, '').replace(/\s+/g, ' ').trim()
}

export default function TranslationExercise({ onBack }) {
  const [level, setLevel] = useState('A1')
  const [started, setStarted] = useState(false)
  const [exercises, setExercises] = useState([])
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState(false)
  const [tipVisible, setTipVisible] = useState(false)

  function handleStart(l) {
    const exs = shuffle(TRANSLATION_EXERCISES.filter(e => e.level === l))
    setExercises(exs)
    setIdx(0)
    setInput('')
    setChecked(false)
    setCorrect(0)
    setFinished(false)
    setStarted(true)
    setTipVisible(false)
  }

  function handleCheck() {
    if (!input.trim()) return
    setChecked(true)
    const norm = normalise(input)
    const expected = normalise(exercises[idx].es)
    // Accept if 80% of words match (allows minor typos/missing accents)
    const inputWords = norm.split(' ')
    const expectedWords = expected.split(' ')
    const matched = expectedWords.filter(w => inputWords.some(iw => iw === w || iw === w.replace(/[áéíóúü]/g, c => ({á:'a',é:'e',í:'i',ó:'o',ú:'u',ü:'u'}[c])))).length
    const pct = matched / expectedWords.length
    if (pct >= 0.75) setCorrect(c => c + 1)
  }

  function handleNext() {
    if (idx + 1 >= exercises.length) {
      setFinished(true)
    } else {
      setIdx(i => i + 1)
      setInput('')
      setChecked(false)
      setTipVisible(false)
    }
  }

  if (!started) {
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="task-header" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
          <span className="task-icon">🔁</span>
          <div>
            <h2>Prelož vetu</h2>
            <p className="task-subtitle">Slovak → Spanish</p>
          </div>
        </div>
        <div className="prompt-box">
          <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>
            Read the Slovak sentence and type the Spanish translation. Minor accent mistakes are OK — focus on the structure.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            {LEVELS.map(l => (
              <button key={l} className={`level-btn ${level === l ? 'level-btn-active' : ''}`} onClick={() => setLevel(l)} style={{ flex: 1 }}>
                {l}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 8 }}>
            {TRANSLATION_EXERCISES.filter(e => e.level === level).length} sentences
          </div>
        </div>
        <button className="btn-primary" onClick={() => handleStart(level)}>Start →</button>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="session-complete">
          <div className="complete-icon">🔁</div>
          <h2>Done!</h2>
          <div className="reading-score-card" style={{ width: '100%' }}>
            <div className="reading-score-number">{correct}/{exercises.length}</div>
            <div className="reading-score-label">translations correct (≥75% words)</div>
          </div>
          {correct === exercises.length && (
            <p style={{ color: 'var(--green)', fontWeight: 700, fontSize: 16 }}>⭐ Perfect!</p>
          )}
          <button className="btn-primary" onClick={() => handleStart(level)}>Try again</button>
          <button className="btn-secondary" onClick={onBack}>Back</button>
        </div>
      </div>
    )
  }

  const ex = exercises[idx]
  const norm = normalise(input)
  const expected = normalise(ex.es)
  const inputWords = norm.split(' ')
  const expectedWords = expected.split(' ')
  const matched = checked ? expectedWords.filter(w => inputWords.some(iw => iw === w || iw === w.replace(/[áéíóúü]/g, c => ({á:'a',é:'e',í:'i',ó:'o',ú:'u',ü:'u'}[c])))).length : 0
  const pct = checked && expectedWords.length > 0 ? matched / expectedWords.length : 0
  const isCorrect = pct >= 0.75

  return (
    <div className="task-session">
      <button className="btn-back" onClick={() => setStarted(false)}>← Back</button>
      <div className="task-header" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
        <span className="task-icon">🔁</span>
        <div>
          <h2>Prelož vetu · {level}</h2>
          <p className="task-subtitle">{idx + 1} / {exercises.length} · {ex.category}</p>
        </div>
      </div>

      <div className="prompt-box" style={{ textAlign: 'center' }}>
        <div className="prompt-label">Translate to Spanish:</div>
        <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: '10px 0 0', lineHeight: 1.5 }}>
          {ex.sk}
        </p>
        {!checked && (
          <div style={{ marginTop: 12 }}>
            {tipVisible ? (
              <p style={{ fontSize: 13, color: '#065f46', background: '#d1fae5', borderRadius: 8, padding: '6px 12px', margin: 0 }}>
                💡 {ex.tip}
              </p>
            ) : (
              <button
                onClick={() => setTipVisible(true)}
                style={{ background: 'none', border: '1px dashed var(--muted)', borderRadius: 8, padding: '4px 12px', fontSize: 13, color: 'var(--muted)', cursor: 'pointer' }}
              >
                💡 Show tip
              </button>
            )}
          </div>
        )}
      </div>

      {!checked ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <textarea
            className="text-input"
            rows={3}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && input.trim()) { e.preventDefault(); handleCheck() } }}
            placeholder="Escribe la traducción en español..."
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            autoFocus
          />
          <button className="btn-primary" onClick={handleCheck} disabled={!input.trim()}>
            Check
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            background: isCorrect ? 'var(--green-light)' : '#fef2f2',
            border: isCorrect ? '1.5px solid var(--green)' : '1.5px solid #f87171',
            borderRadius: 12,
            padding: '14px 16px',
          }}>
            <p style={{ fontWeight: 700, color: isCorrect ? 'var(--green)' : '#dc2626', margin: '0 0 8px' }}>
              {isCorrect ? '✓ ¡Muy bien!' : '✗ Not quite.'}
            </p>
            <p style={{ fontSize: 14, color: 'var(--text)', margin: '0 0 6px' }}>
              <strong>Correct:</strong> {ex.es}
            </p>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 6px', fontStyle: 'italic' }}>
              You wrote: {input}
            </p>
            <p style={{ fontSize: 13, color: isCorrect ? '#065f46' : '#7f1d1d', margin: 0 }}>
              💡 {ex.tip}
            </p>
          </div>
          <button className="btn-primary" onClick={handleNext}>
            {idx + 1 < exercises.length ? 'Next →' : 'See results'}
          </button>
        </div>
      )}
    </div>
  )
}