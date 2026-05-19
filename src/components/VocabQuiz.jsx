import { useState } from 'react'
import { getWordsSortedBySR, getDueWords, updateWordSR } from '../vocabularyStore'

function normalise(str) {
  return str.trim().toLowerCase().replace(/[^a-z'-]/g, '')
}

export default function VocabQuiz({ onBack }) {
  const [words] = useState(() => getWordsSortedBySR())
  const [dueCount] = useState(() => getDueWords().length)
  const [mode, setMode] = useState('sk-en')
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [finished, setFinished] = useState(false)

  if (words.length === 0) {
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="task-header accent-blue">
          <span className="task-icon">🃏</span>
          <div><h2>Vocabulary Quiz</h2><p className="task-subtitle">No words saved yet</p></div>
        </div>
        <div className="prompt-box" style={{ textAlign: 'center', color: 'var(--muted)' }}>
          <p>Save words from exercises, chat, or reading first.</p>
          <p style={{ fontSize: 13, marginTop: 8 }}>Tap any word → translate → Save to vocabulary.</p>
        </div>
        <button className="btn-primary" onClick={onBack}>Go back</button>
      </div>
    )
  }

  const skToEn = mode === 'sk-en'

  if (finished) {
    const total = correct + wrong
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="session-complete">
          <div className="complete-icon">🃏</div>
          <h2>Quiz complete!</h2>
          <div className="reading-score-card" style={{ width: '100%' }}>
            <div className="reading-score-number">{correct}/{total}</div>
            <div className="reading-score-label">correct answers</div>
          </div>
          {correct === total && (
            <p style={{ color: 'var(--green)', fontWeight: 700, fontSize: 16 }}>⭐ Perfect score!</p>
          )}
          <button className="btn-primary" onClick={onBack}>Back to vocabulary</button>
        </div>
      </div>
    )
  }

  const word = words[idx]
  const isDue = word.sr?.due <= new Date().toISOString().slice(0, 10)

  function handleCheck() {
    if (!input.trim()) return
    setChecked(true)
    const correctAnswer = skToEn ? word.word : word.translation
    const isOk = normalise(input) === normalise(correctAnswer)
    if (isOk) setCorrect(c => c + 1)
    else setWrong(w => w + 1)
    updateWordSR(word.word, isOk)
  }

  function handleNext() {
    if (idx + 1 < words.length) {
      setIdx(i => i + 1)
      setInput('')
      setChecked(false)
    } else {
      setFinished(true)
    }
  }

  const correctAnswer = skToEn ? word.word : word.translation
  const isCorrect = checked && normalise(input) === normalise(correctAnswer)

  return (
    <div className="task-session">
      <button className="btn-back" onClick={onBack}>← Back</button>

      <div className="task-header accent-blue">
        <span className="task-icon">🃏</span>
        <div>
          <h2>Vocabulary Quiz</h2>
          <p className="task-subtitle">{idx + 1} / {words.length}{dueCount > 0 ? ` · 📅 ${dueCount} due` : ''}</p>
        </div>
      </div>

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className={`level-btn ${skToEn ? 'level-btn-active' : ''}`}
          onClick={() => { setMode('sk-en'); setIdx(0); setInput(''); setChecked(false); setCorrect(0); setWrong(0) }}
          style={{ flex: 1 }}
        >
          Slovak → English
        </button>
        <button
          className={`level-btn ${!skToEn ? 'level-btn-active' : ''}`}
          onClick={() => { setMode('en-sk'); setIdx(0); setInput(''); setChecked(false); setCorrect(0); setWrong(0) }}
          style={{ flex: 1 }}
        >
          English → Slovak
        </button>
      </div>

      <div className="prompt-box" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {isDue && (
          <div style={{ fontSize: 12, color: '#92400e', background: '#fef3c7', borderRadius: 6, padding: '3px 8px', width: 'fit-content' }}>
            📅 Due for review
          </div>
        )}
        <div className="prompt-label">{skToEn ? 'What is the English word for?' : 'What is the Slovak translation of?'}</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--purple)', textAlign: 'center', padding: '8px 0' }}>
          {skToEn ? word.translation : word.word}
        </div>
        {word.context && (
          <p style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', textAlign: 'center' }}>
            "{word.context}"
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="vocab-search"
          type="text"
          placeholder={skToEn ? 'Type the English word...' : 'Type the Slovak translation...'}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !checked) handleCheck() }}
          disabled={checked}
          autoFocus
          style={{ flex: 1 }}
        />
        {!checked && (
          <button
            className="btn-primary"
            onClick={handleCheck}
            disabled={!input.trim()}
            style={{ width: 'auto', padding: '10px 20px', fontSize: 15 }}
          >
            Check
          </button>
        )}
      </div>

      {checked && (
        <div style={{
          background: isCorrect ? 'var(--green-light)' : '#fee2e2',
          border: `1.5px solid ${isCorrect ? 'var(--green)' : '#ef4444'}`,
          borderRadius: 12,
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          <div style={{ fontWeight: 700, color: isCorrect ? '#065f46' : '#991b1b', fontSize: 16 }}>
            {isCorrect ? '✓ Correct!' : `✗ The answer is: ${correctAnswer}`}
          </div>
          {!isCorrect && (
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>You typed: {input}</div>
          )}
          {word.sr && (
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
              Next review: {isCorrect
                ? `in ${word.sr.interval} day${word.sr.interval !== 1 ? 's' : ''}`
                : 'tomorrow'}
            </div>
          )}
        </div>
      )}

      {checked && (
        <button className={`btn-primary ${isCorrect ? 'btn-done' : ''}`} onClick={handleNext}>
          {idx + 1 < words.length ? 'Next word →' : 'See results'}
        </button>
      )}
    </div>
  )
}
