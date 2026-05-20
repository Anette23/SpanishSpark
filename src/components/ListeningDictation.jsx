import { useState } from 'react'
import { SHADOWING_SENTENCES } from '../bonusExercises'
import { completeDailyBonusGoal } from '../habitStore'
import { getDailyProgress, incrementDailyProgress, DAILY_GOAL } from '../flashcardStore'

function normalise(s) {
  return s.toLowerCase().replace(/[^a-záéíóúüñ\s']/g, '').trim()
}

const SESSION_LENGTH = 10

export default function ListeningDictation({ onBack }) {
  const [sentences] = useState(() => {
    const all = SHADOWING_SENTENCES.filter(s => s.level === 'A1' || s.level === 'A2')
    const arr = [...all]
    const seed = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''))
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (seed * (i + 1)) % (i + 1)
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr.slice(0, SESSION_LENGTH)
  })
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [playCount, setPlayCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const [dailyCount, setDailyCount] = useState(() => getDailyProgress('dictation'))

  const sentence = sentences[idx]?.sentence ?? ''
  const expectedWords = normalise(sentence).split(/\s+/).filter(Boolean)

  function speak(rate) {
    if (isSpeaking || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(sentence)
    utt.lang = 'es-ES'
    utt.rate = rate
    utt.onstart = () => setIsSpeaking(true)
    utt.onend = () => setIsSpeaking(false)
    utt.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utt)
    setPlayCount(p => p + 1)
  }

  function handleCheck() {
    if (!input.trim()) return
    setChecked(true)
    const typedWords = normalise(input).split(/\s+/).filter(Boolean)
    const matched = expectedWords.filter(w => typedWords.includes(w)).length
    const pct = expectedWords.length > 0 ? matched / expectedWords.length : 0
    if (pct >= 0.8) setCorrect(c => c + 1)
    const newCount = incrementDailyProgress('dictation')
    setDailyCount(newCount)
    if (newCount === DAILY_GOAL) completeDailyBonusGoal('dictation')
  }

  function handleNext() {
    if (idx + 1 >= sentences.length) {
      setFinished(true)
    } else {
      setIdx(i => i + 1)
      setInput('')
      setChecked(false)
      setPlayCount(0)
    }
  }

  const typedWords = normalise(input).split(/\s+/).filter(Boolean)
  const clampedCount = Math.min(dailyCount, DAILY_GOAL)

  if (finished) {
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="session-complete">
          <div className="complete-icon">🎙️</div>
          <h2>Dictation done!</h2>
          <div className="reading-score-card" style={{ width: '100%' }}>
            <div className="reading-score-number">{correct}/{sentences.length}</div>
            <div className="reading-score-label">sentences correct (≥80% words)</div>
          </div>
          {correct === sentences.length && (
            <p style={{ color: 'var(--green)', fontWeight: 700, fontSize: 16 }}>⭐ Perfect!</p>
          )}
          <button className="btn-primary" onClick={onBack}>Back to dashboard</button>
        </div>
      </div>
    )
  }

  return (
    <div className="task-session">
      <button className="btn-back" onClick={onBack}>← Back</button>

      <div className="task-header accent-teal">
        <span className="task-icon">🎙️</span>
        <div>
          <h2>Listening Dictation</h2>
          <p className="task-subtitle">{idx + 1} / {sentences.length} · Type what you hear</p>
        </div>
      </div>

      <div className="daily-progress-row">
        <div className="daily-progress-bar-wrap">
          <div className="daily-progress-bar-fill" style={{ width: `${clampedCount / DAILY_GOAL * 100}%` }} />
        </div>
        <span className="daily-progress-label">
          {dailyCount >= DAILY_GOAL ? `✓ ${DAILY_GOAL}/${DAILY_GOAL} done!` : `${dailyCount} / ${DAILY_GOAL} today`}
        </span>
      </div>

      {!checked ? (
        <div className="prompt-box" style={{ textAlign: 'center' }}>
          <div className="prompt-label">Listen carefully and type what you hear</div>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 8 }}>
            {playCount === 0
              ? 'Press play to hear the sentence — the text is hidden until you check.'
              : `Played ${playCount} time${playCount !== 1 ? 's' : ''}. Play again if needed.`}
          </p>
        </div>
      ) : (
        <div className="prompt-box">
          <div className="prompt-label">The sentence was:</div>
          <p className="prompt-text">"{sentence}"</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className={`btn-listen ${isSpeaking ? 'btn-listening' : ''}`}
          onClick={() => speak(0.85)}
          disabled={isSpeaking || !('speechSynthesis' in window) || checked}
          style={{ flex: 1 }}
        >
          {isSpeaking ? '🔊 Playing...' : '🔊 Play'}
        </button>
        <button
          className="btn-listen"
          onClick={() => speak(0.65)}
          disabled={isSpeaking || !('speechSynthesis' in window) || checked}
          style={{ flex: 1 }}
        >
          🐢 Slower
        </button>
        <button
          className="btn-listen"
          onClick={() => speak(0.5)}
          disabled={isSpeaking || !('speechSynthesis' in window) || checked}
          style={{ flex: 1 }}
        >
          🐌 Very slow
        </button>
      </div>

      {!checked && (
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="vocab-search"
            type="text"
            placeholder="Type what you heard..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && input.trim()) handleCheck() }}
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

      {checked && (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {expectedWords.map((word, i) => {
              const ok = typedWords.includes(word)
              return (
                <span
                  key={i}
                  className={ok ? 'shadow-word-ok' : 'shadow-word-miss'}
                  style={{ padding: '3px 8px', borderRadius: 6 }}
                >
                  {word}
                </span>
              )
            })}
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            You typed: <em>"{input}"</em>
          </p>
          <button className="btn-primary" onClick={handleNext}>
            {idx + 1 < sentences.length ? 'Next →' : 'See results'}
          </button>
        </>
      )}
    </div>
  )
}
