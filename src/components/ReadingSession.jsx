import { useState, useRef, useCallback, useEffect } from 'react'
import { READING_EXERCISES } from '../readingExercises'
import { getLevelStats, sortByPriority, markRead, resetLevel, saveDifficulty } from '../readingStore'
import { addReadingXP } from '../habitStore'
import { getFeedback } from '../api'
import TranslatableText from './TranslatableText'

const LEVELS = ['A1', 'A2']
const DIFFICULTY_OPTIONS = [
  { label: 'Príliš ľahký', value: 'easy', color: 'var(--blue)' },
  { label: 'Akorát',       value: 'ok',   color: 'var(--green)' },
  { label: 'Príliš ťažký', value: 'hard', color: '#ef4444' },
]

// ── Level picker ──────────────────────────────────────────────────────────────

function LevelPicker({ onStart, onBack }) {
  const [selectedLevel, setSelectedLevel] = useState('A1')
  const [stats, setStats] = useState(() => ({
    A1: getLevelStats('A1', READING_EXERCISES),
    A2: getLevelStats('A2', READING_EXERCISES),
  }))

  function refreshStats() {
    setStats({
      A1: getLevelStats('A1', READING_EXERCISES),
      A2: getLevelStats('A2', READING_EXERCISES),
    })
  }

  function handleReset() {
    resetLevel(selectedLevel, READING_EXERCISES)
    refreshStats()
  }

  const { total, unread, review } = stats[selectedLevel]
  const done = total - unread
  const hasNew = unread > 0
  const hasReview = review > 0
  const canStart = hasNew || hasReview

  return (
    <div className="task-session">
      <button className="btn-back" onClick={onBack}>← Späť</button>

      <div className="task-header accent-blue">
        <span className="task-icon">📖</span>
        <div>
          <h2>Čítanie</h2>
          <p className="task-subtitle">Vyber si úroveň</p>
        </div>
      </div>

      <div className="prompt-box" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.5 }}>
          Čítaj krátke španielske texty a odpovedaj na otázky. Klepni na akékoľvek slovo a preložíš ho do slovenčiny.
        </p>

        <div style={{ display: 'flex', gap: 8 }}>
          {LEVELS.map(l => (
            <button
              key={l}
              className={`level-btn ${selectedLevel === l ? 'level-btn-active' : ''}`}
              onClick={() => setSelectedLevel(l)}
              style={{ flex: 1 }}
            >
              {l}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 13, color: 'var(--muted)' }}>
          {selectedLevel === 'A1' && 'Základné témy, jednoduché vety, bežné každodenné slová.'}
          {selectedLevel === 'A2' && 'Jednoduché každodenné situácie, známe témy, priamočiare vety.'}
        </div>

        {/* Progress bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(done / total) * 100}%`,
                background: done === total ? 'var(--green)' : 'var(--purple)',
                borderRadius: 4,
                transition: 'width 0.4s ease',
              }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
              {done}/{total} prečítaných
            </span>
          </div>

          <div style={{ display: 'flex', gap: 12, fontSize: 13 }}>
            {hasNew && (
              <span style={{ color: 'var(--purple)', fontWeight: 600 }}>
                📄 {unread} nových
              </span>
            )}
            {hasReview && (
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>
                🔁 {review} na opakovanie
              </span>
            )}
            {!canStart && (
              <span style={{ color: 'var(--green)', fontWeight: 600 }}>✓ Všetko prečítané!</span>
            )}
            {!canStart && (
              <button
                onClick={handleReset}
                style={{ fontSize: 12, color: 'var(--purple)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', padding: 0, marginLeft: 'auto' }}
              >
                Resetovať a opakovať
              </button>
            )}
          </div>
        </div>
      </div>

      <button
        className="btn-primary"
        onClick={() => onStart(selectedLevel)}
        disabled={!canStart}
        style={{ opacity: canStart ? 1 : 0.45 }}
      >
        {!canStart ? 'Žiadne nové texty — resetuj a opakuj' : 'Začať čítanie →'}
      </button>
    </div>
  )
}

// ── Main session ──────────────────────────────────────────────────────────────

export default function ReadingSession({ onBack }) {
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [exercises, setExercises] = useState([])
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState('read')
  const [answers, setAnswers] = useState([])
  const [scores, setScores] = useState([])
  const [lookedUp, setLookedUp] = useState([])
  const [diffChosen, setDiffChosen] = useState(null)
  const [reaction, setReaction] = useState('')
  const [reactionFeedback, setReactionFeedback] = useState(null)
  const [xpEarned, setXpEarned] = useState(0)
  const [ttsActive, setTtsActive] = useState(false)
  const ttsRef = useRef(null)

  useEffect(() => () => { window.speechSynthesis?.cancel() }, [])

  function handleStart(level) {
    const sorted = sortByPriority(READING_EXERCISES.filter(e => e.level === level))
    setSelectedLevel(level)
    setExercises(sorted)
    setIdx(0)
    setPhase('read')
    setAnswers([])
    setScores([])
    setLookedUp([])
    setDiffChosen(null)
    setReaction('')
    setReactionFeedback(null)
    setXpEarned(0)
  }

  function handleBackToLevelPicker() {
    stopTTS()
    setSelectedLevel(null)
  }

  function stopTTS() {
    window.speechSynthesis?.cancel()
    setTtsActive(false)
  }

  function toggleTTS(text) {
    if (ttsActive) { stopTTS(); return }
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'es-ES'
    utter.rate = 0.9
    const voices = window.speechSynthesis.getVoices()
    const esVoice = voices.find(v => v.lang.startsWith('es') && !v.name.includes('Google')) ||
                    voices.find(v => v.lang.startsWith('es'))
    if (esVoice) utter.voice = esVoice
    utter.onend = () => setTtsActive(false)
    utter.onerror = () => setTtsActive(false)
    ttsRef.current = utter
    window.speechSynthesis.speak(utter)
    setTtsActive(true)
  }

  const handleLookup = useCallback(({ word, translation }) => {
    setLookedUp(prev => {
      if (prev.some(w => w.word === word)) return prev
      return [...prev, { word, translation }]
    })
  }, [])

  function handleStartQuestions() {
    stopTTS()
    setAnswers(Array(ex.questions.length).fill(null))
    setPhase('questions')
  }

  function handleAnswer(qIdx, optIdx) {
    setAnswers(prev => {
      if (prev[qIdx] !== null) return prev
      const next = [...prev]
      next[qIdx] = optIdx
      return next
    })
  }

  function handleSubmitQuestions() {
    const correct = ex.questions.filter((q, i) => answers[i] === q.answer).length
    const total = ex.questions.length
    const isPerfect = correct === total

    const xp = 5 + (isPerfect ? 5 : 0)
    setXpEarned(xp)
    addReadingXP(xp)

    markRead(ex.id, correct, total)
    setScores(prev => [...prev, correct])
    setPhase('done')
  }

  function handleDifficulty(value) {
    setDiffChosen(value)
    saveDifficulty(ex.id, value)
  }

  async function handleGetFeedback() {
    if (!reaction.trim() || reaction.trim().length < 10) return
    setReactionFeedback('loading')
    try {
      const { feedback } = await getFeedback('writing', reaction)
      setReactionFeedback(feedback)
    } catch {
      setReactionFeedback('Spätnú väzbu sa nepodarilo načítať — skontroluj API kľúč v Nastaveniach.')
    }
  }

  function handleNext() {
    stopTTS()
    if (idx + 1 < exercises.length) {
      setIdx(i => i + 1)
      setAnswers([])
      setLookedUp([])
      setDiffChosen(null)
      setReaction('')
      setReactionFeedback(null)
      setXpEarned(0)
      setPhase('read')
    } else {
      setPhase('finished')
    }
  }

  if (!selectedLevel) {
    return <LevelPicker onStart={handleStart} onBack={onBack} />
  }

  const ex = exercises[idx]

  if (phase === 'finished' || !ex) {
    const totalCorrect = scores.reduce((a, b) => a + b, 0)
    const totalQ = exercises.slice(0, scores.length).reduce((a, e) => a + e.questions.length, 0)
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Späť</button>
        <div className="session-complete">
          <div className="complete-icon">📖</div>
          <h2>Session dokončená!</h2>
          <div className="reading-score-card" style={{ width: '100%' }}>
            <div className="reading-score-number">{totalCorrect}/{totalQ}</div>
            <div className="reading-score-label">správnych odpovedí</div>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 14, textAlign: 'center' }}>
            Texty, pri ktorých si skórovala pod 75%, sa vrátia na opakovanie.
          </p>
          <button className="btn-primary" onClick={handleBackToLevelPicker}>
            Vybrať inú úroveň
          </button>
          <button className="btn-secondary" onClick={onBack}>
            Späť na dashboard
          </button>
        </div>
      </div>
    )
  }

  const allAnswered = answers.length > 0 && answers.every(a => a !== null)
  const currentScore = scores[scores.length - 1]
  const isPerfect = currentScore === ex.questions.length

  return (
    <div className="task-session">
      <button className="btn-back" onClick={handleBackToLevelPicker}>← Späť</button>

      <div className="task-header accent-blue">
        <span className="task-icon">📖</span>
        <div>
          <h2>Čítanie · {selectedLevel}</h2>
          <p className="task-subtitle">Text {idx + 1} z {exercises.length}</p>
        </div>
      </div>

      {/* ── Read phase ─────────────────────────────────────────────────────── */}
      {phase === 'read' && (
        <>
          <div className="reading-passage">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 12 }}>
              <div className="reading-passage-title" style={{ marginBottom: 0 }}>{ex.title}</div>
              <button
                className={`reading-tts-btn ${ttsActive ? 'reading-tts-btn-active' : ''}`}
                onClick={() => toggleTTS(ex.passage)}
                title={ttsActive ? 'Zastaviť' : 'Počúvať text'}
              >
                {ttsActive ? '⏹ Zastaviť' : '🔊 Počúvať'}
              </button>
            </div>
            {ex.passage.split('\n\n').map((para, i, arr) => (
              <p key={i} style={{ marginBottom: i < arr.length - 1 ? 14 : 0 }}>
                <TranslatableText text={para} onLookup={handleLookup} />
              </p>
            ))}
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>
            Klepni na akékoľvek slovo pre slovenský preklad
          </p>
          <button className="btn-primary" onClick={handleStartQuestions}>
            Odpovedať na otázky →
          </button>
        </>
      )}

      {/* ── Questions phase ───────────────────────────────────────────────── */}
      {phase === 'questions' && (
        <>
          <div className="reading-q-header">Otázky porozumenia</div>
          {ex.questions.map((q, qi) => (
            <div key={qi} className="reading-question">
              <div className="reading-question-text">{qi + 1}. {q.q}</div>
              <div className="reading-options">
                {q.options.map((opt, oi) => {
                  let cls = 'reading-option'
                  if (answers[qi] !== null) {
                    if (oi === q.answer) cls += ' reading-option-correct'
                    else if (answers[qi] === oi) cls += ' reading-option-wrong'
                  }
                  return (
                    <button
                      key={oi}
                      className={cls}
                      onClick={() => handleAnswer(qi, oi)}
                      disabled={answers[qi] !== null}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
          <button
            className="btn-primary"
            onClick={handleSubmitQuestions}
            disabled={!allAnswered}
            style={{ opacity: allAnswered ? 1 : 0.5 }}
          >
            Zobraziť výsledky
          </button>
        </>
      )}

      {/* ── Done phase ────────────────────────────────────────────────────── */}
      {phase === 'done' && (
        <>
          <div className="reading-score-card">
            <div className="reading-score-number">
              {currentScore}/{ex.questions.length}
            </div>
            <div className="reading-score-label">správne pri „{ex.title}"</div>
            <div className="reading-xp-badge">+{xpEarned} XP {isPerfect ? '⭐ perfektné!' : ''}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ex.questions.map((q, qi) => (
              <div key={qi} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 6 }}>{q.q}</div>
                <div style={{ fontSize: 14, color: answers[qi] === q.answer ? 'var(--green)' : '#ef4444', fontWeight: 600 }}>
                  {answers[qi] === q.answer ? '✓ ' : '✗ '}{q.options[answers[qi]]}
                </div>
                {answers[qi] !== q.answer && (
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                    Správne: {q.options[q.answer]}
                  </div>
                )}
              </div>
            ))}
          </div>

          {lookedUp.length > 0 && (
            <div className="reading-looked-up">
              <div className="reading-looked-up-title">Slová, ktoré si preložila</div>
              <div className="reading-looked-up-chips">
                {lookedUp.map(({ word, translation }) => (
                  <div key={word} className="reading-looked-up-chip">
                    <span className="looked-up-word">{word}</span>
                    <span className="looked-up-sep">→</span>
                    <span className="looked-up-translation">{translation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="reading-difficulty">
            <div className="reading-difficulty-label">Aký bol tento text?</div>
            <div className="reading-difficulty-row">
              {DIFFICULTY_OPTIONS.map(({ label, value, color }) => (
                <button
                  key={value}
                  className={`reading-diff-btn ${diffChosen === value ? 'reading-diff-btn-active' : ''}`}
                  style={diffChosen === value ? { borderColor: color, background: color, color: '#fff' } : {}}
                  onClick={() => handleDifficulty(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button className="btn-primary" onClick={() => setPhase('react')}>
            Napíš reakciu
          </button>
          <button className="btn-secondary" onClick={handleNext}>
            {idx + 1 < exercises.length ? 'Preskočiť → ďalší text' : 'Ukončiť session'}
          </button>
        </>
      )}

      {/* ── React phase ───────────────────────────────────────────────────── */}
      {phase === 'react' && (
        <>
          <div className="prompt-box">
            <div className="prompt-label">Na rade si ty</div>
            <div className="prompt-text" style={{ fontSize: 15 }}>
              ¿Qué piensas sobre "{ex.title}"? Escribe 2–3 oraciones en español.
            </div>
          </div>

          <textarea
            className="text-input"
            rows={4}
            placeholder="Creo que..."
            value={reaction}
            onChange={e => setReaction(e.target.value)}
            disabled={reactionFeedback !== null && reactionFeedback !== 'loading'}
          />

          {reactionFeedback === null && (
            <button
              className="btn-primary"
              onClick={handleGetFeedback}
              disabled={reaction.trim().length < 10}
              style={{ opacity: reaction.trim().length < 10 ? 0.5 : 1 }}
            >
              Získať AI spätnú väzbu
            </button>
          )}

          {reactionFeedback === 'loading' && (
            <p style={{ color: 'var(--muted)', textAlign: 'center' }}>⏳ Získavam spätnú väzbu...</p>
          )}

          {reactionFeedback && reactionFeedback !== 'loading' && (
            <div className="reading-feedback-box">
              <div className="reading-feedback-label">AI spätná väzba</div>
              <p style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{reactionFeedback}</p>
            </div>
          )}

          <button
            className={reactionFeedback && reactionFeedback !== 'loading' ? 'btn-primary btn-done' : 'btn-secondary'}
            onClick={handleNext}
          >
            {idx + 1 < exercises.length ? 'Ďalší text →' : 'Ukončiť session ✓'}
          </button>
        </>
      )}
    </div>
  )
}
