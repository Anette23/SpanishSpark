import { useState, useEffect, useRef } from 'react'
import { LISTENING_EXERCISES } from '../listeningExercises'

const LEVELS = ['A1', 'A2']

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

function buildDisplaySentence(sentence, blank) {
  // Replace the blank word with underscores, case-insensitive
  return sentence.replace(new RegExp(`\\b${blank}\\b`, 'i'), '_____')
}

export default function ListeningGaps({ onBack }) {
  const [level, setLevel] = useState('A1')
  const [started, setStarted] = useState(false)
  const [exercises, setExercises] = useState([])
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [finished, setFinished] = useState(false)
  const utterRef = useRef(null)

  useEffect(() => () => { window.speechSynthesis?.cancel() }, [])

  function handleStart() {
    const exs = shuffle(LISTENING_EXERCISES.filter(e => e.level === level))
    setExercises(exs)
    setIdx(0)
    setInput('')
    setChecked(false)
    setCorrect(0)
    setFinished(false)
    setStarted(true)
  }

  function speakSentence(sentence) {
    window.speechSynthesis?.cancel()
    const utter = new SpeechSynthesisUtterance(sentence)
    utter.lang = 'es-ES'
    utter.rate = 0.85
    const voices = window.speechSynthesis?.getVoices() || []
    const voice = voices.find(v => v.lang.startsWith('en') && !v.name.includes('Google')) ||
                  voices.find(v => v.lang.startsWith('en'))
    if (voice) utter.voice = voice
    utter.onend = () => setPlaying(false)
    utter.onerror = () => setPlaying(false)
    utterRef.current = utter
    window.speechSynthesis?.speak(utter)
    setPlaying(true)
  }

  function handleCheck() {
    if (!input.trim()) return
    setChecked(true)
    const ex = exercises[idx]
    const userNorm = normalise(input)
    const isOk = userNorm === normalise(ex.blank) ||
                 ex.alternatives.some(a => userNorm === normalise(a))
    if (isOk) setCorrect(c => c + 1)
  }

  function handleNext() {
    window.speechSynthesis?.cancel()
    setPlaying(false)
    if (idx + 1 < exercises.length) {
      setIdx(i => i + 1)
      setInput('')
      setChecked(false)
    } else {
      setFinished(true)
    }
  }

  if (!started) {
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="task-header accent-teal">
          <span className="task-icon">🎧</span>
          <div><h2>Listening Gaps</h2><p className="task-subtitle">Choose level</p></div>
        </div>
        <div className="prompt-box" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.5 }}>
            Listen to a sentence and type the missing word. Press 🔊 to hear it again as many times as you need.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            {LEVELS.map(l => (
              <button key={l} className={`level-btn ${level === l ? 'level-btn-active' : ''}`} onClick={() => setLevel(l)} style={{ flex: 1 }}>
                {l}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            {LISTENING_EXERCISES.filter(e => e.level === level).length} sentences
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
          <div className="complete-icon">🎧</div>
          <h2>Listening complete!</h2>
          <div className="reading-score-card" style={{ width: '100%' }}>
            <div className="reading-score-number">{correct}/{total}</div>
            <div className="reading-score-label">correct answers</div>
          </div>
          <button className="btn-primary" onClick={() => { setStarted(false); setFinished(false) }}>Try again</button>
          <button className="btn-secondary" onClick={onBack}>Back</button>
        </div>
      </div>
    )
  }

  const ex = exercises[idx]
  const userNorm = normalise(input)
  const isCorrect = checked && (
    userNorm === normalise(ex.blank) ||
    ex.alternatives.some(a => userNorm === normalise(a))
  )
  const displaySentence = buildDisplaySentence(ex.sentence, ex.blank)

  return (
    <div className="task-session">
      <button className="btn-back" onClick={() => { window.speechSynthesis?.cancel(); setStarted(false) }}>← Back</button>
      <div className="task-header accent-teal">
        <span className="task-icon">🎧</span>
        <div>
          <h2>Listening Gaps · {level}</h2>
          <p className="task-subtitle">{idx + 1} / {exercises.length}</p>
        </div>
      </div>

      {/* Listen button */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          className={`listening-play-btn ${playing ? 'listening-play-btn-active' : ''}`}
          onClick={() => playing ? (window.speechSynthesis?.cancel(), setPlaying(false)) : speakSentence(ex.sentence)}
        >
          {playing ? '⏹ Stop' : '🔊 Listen'}
        </button>
      </div>

      {/* Sentence with blank */}
      <div className="reading-passage" style={{ fontSize: 17, lineHeight: 1.7, textAlign: 'center' }}>
        {checked ? ex.sentence : displaySentence}
      </div>

      {/* Input */}
      {!checked && (
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="vocab-search"
            type="text"
            placeholder="Type the missing word..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleCheck() }}
            style={{ flex: 1 }}
            autoFocus
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
        <div style={{
          background: isCorrect ? 'var(--green-light)' : '#fee2e2',
          border: `1.5px solid ${isCorrect ? 'var(--green)' : '#ef4444'}`,
          borderRadius: 12,
          padding: '14px 16px',
        }}>
          <div style={{ fontWeight: 700, color: isCorrect ? '#065f46' : '#991b1b', fontSize: 16 }}>
            {isCorrect ? `✓ Correct! The word was "${ex.blank}"` : `✗ The missing word was: "${ex.blank}"`}
          </div>
          {!isCorrect && (
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>You typed: {input}</div>
          )}
        </div>
      )}

      {checked && (
        <button className={`btn-primary ${isCorrect ? 'btn-done' : ''}`} onClick={handleNext}>
          {idx + 1 < exercises.length ? 'Next sentence →' : 'See results'}
        </button>
      )}
    </div>
  )
}
