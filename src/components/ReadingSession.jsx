import { useState, useRef, useCallback, useEffect } from 'react'
import { READING_EXERCISES } from '../readingExercises'
import { getLevelStats, sortByPriority, markRead, resetLevel, saveDifficulty } from '../readingStore'
import { addReadingXP } from '../habitStore'
import { getFeedback } from '../api'
import TranslatableText from './TranslatableText'

const LEVELS = ['B1', 'B2', 'C1']
const DIFFICULTY_OPTIONS = [
  { label: 'Too easy', value: 'easy', color: 'var(--blue)' },
  { label: 'Just right', value: 'ok', color: 'var(--green)' },
  { label: 'Too hard', value: 'hard', color: '#ef4444' },
]

// ── Level picker ──────────────────────────────────────────────────────────────

function LevelPicker({ onStart, onBack }) {
  const [selectedLevel, setSelectedLevel] = useState('B2')
  const [stats, setStats] = useState(() => ({
    B1: getLevelStats('B1', READING_EXERCISES),
    B2: getLevelStats('B2', READING_EXERCISES),
    C1: getLevelStats('C1', READING_EXERCISES),
  }))

  function refreshStats() {
    setStats({
      B1: getLevelStats('B1', READING_EXERCISES),
      B2: getLevelStats('B2', READING_EXERCISES),
      C1: getLevelStats('C1', READING_EXERCISES),
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
      <button className="btn-back" onClick={onBack}>← Back</button>

      <div className="task-header accent-blue">
        <span className="task-icon">📖</span>
        <div>
          <h2>Reading</h2>
          <p className="task-subtitle">Choose your level</p>
        </div>
      </div>

      <div className="prompt-box" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.5 }}>
          Read short English texts and answer comprehension questions. Tap any word to translate it to Slovak.
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
          {selectedLevel === 'B1' && 'Everyday topics, clear sentences, common vocabulary.'}
          {selectedLevel === 'B2' && 'Complex topics, nuanced arguments, advanced vocabulary.'}
          {selectedLevel === 'C1' && 'Academic and abstract texts, sophisticated vocabulary, subtle reasoning.'}
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
              {done}/{total} read
            </span>
          </div>

          <div style={{ display: 'flex', gap: 12, fontSize: 13 }}>
            {hasNew && (
              <span style={{ color: 'var(--purple)', fontWeight: 600 }}>
                📄 {unread} new
              </span>
            )}
            {hasReview && (
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>
                🔁 {review} to review
              </span>
            )}
            {!canStart && (
              <span style={{ color: 'var(--green)', fontWeight: 600 }}>✓ All read!</span>
            )}
            {!canStart && (
              <button
                onClick={handleReset}
                style={{ fontSize: 12, color: 'var(--purple)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', padding: 0, marginLeft: 'auto' }}
              >
                Reset & repeat
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
        {!canStart ? 'No new texts — reset to repeat' : 'Start reading →'}
      </button>
    </div>
  )
}

// ── Main session ──────────────────────────────────────────────────────────────

export default function ReadingSession({ onBack }) {
  const [selectedLevel, setSelectedLevel] = useState(null) // null = show picker
  const [exercises, setExercises] = useState([])
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState('read') // read | questions | done | react | finished
  const [answers, setAnswers] = useState([])
  const [scores, setScores] = useState([])
  const [lookedUp, setLookedUp] = useState([]) // {word, translation} per current text
  const [diffChosen, setDiffChosen] = useState(null)
  const [reaction, setReaction] = useState('')
  const [reactionFeedback, setReactionFeedback] = useState(null) // null | 'loading' | string
  const [xpEarned, setXpEarned] = useState(0) // XP for current text
  const [ttsActive, setTtsActive] = useState(false)
  const ttsRef = useRef(null)

  // Always cancel TTS when this component unmounts
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

  // ── TTS ────────────────────────────────────────────────────────────────────

  function stopTTS() {
    window.speechSynthesis?.cancel()
    setTtsActive(false)
  }

  function toggleTTS(text) {
    if (ttsActive) { stopTTS(); return }
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'en-GB'
    utter.rate = 0.9
    // Prefer a natural English voice if available
    const voices = window.speechSynthesis.getVoices()
    const enVoice = voices.find(v => v.lang.startsWith('en') && !v.name.includes('Google')) ||
                    voices.find(v => v.lang.startsWith('en'))
    if (enVoice) utter.voice = enVoice
    utter.onend = () => setTtsActive(false)
    utter.onerror = () => setTtsActive(false)
    ttsRef.current = utter
    window.speechSynthesis.speak(utter)
    setTtsActive(true)
  }

  // ── Word lookup tracking ───────────────────────────────────────────────────

  const handleLookup = useCallback(({ word, translation }) => {
    setLookedUp(prev => {
      if (prev.some(w => w.word === word)) return prev
      return [...prev, { word, translation }]
    })
  }, [])

  // ── Questions ──────────────────────────────────────────────────────────────

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

    // XP: +5 per text, +5 bonus for 100%
    const xp = 5 + (isPerfect ? 5 : 0)
    setXpEarned(xp)
    addReadingXP(xp)

    markRead(ex.id, correct, total)
    setScores(prev => [...prev, correct])
    setPhase('done')
  }

  // ── Difficulty ─────────────────────────────────────────────────────────────

  function handleDifficulty(value) {
    setDiffChosen(value)
    saveDifficulty(ex.id, value)
  }

  // ── Reaction / AI feedback ─────────────────────────────────────────────────

  async function handleGetFeedback() {
    if (!reaction.trim() || reaction.trim().length < 10) return
    setReactionFeedback('loading')
    try {
      const { feedback } = await getFeedback('writing', reaction)
      setReactionFeedback(feedback)
    } catch {
      setReactionFeedback('Could not get feedback — check your API key in Settings.')
    }
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

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

  // ── Level picker ───────────────────────────────────────────────────────────

  if (!selectedLevel) {
    return <LevelPicker onStart={handleStart} onBack={onBack} />
  }

  const ex = exercises[idx]

  // ── Finished screen ────────────────────────────────────────────────────────

  if (phase === 'finished' || !ex) {
    const totalCorrect = scores.reduce((a, b) => a + b, 0)
    const totalQ = exercises.slice(0, scores.length).reduce((a, e) => a + e.questions.length, 0)
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="session-complete">
          <div className="complete-icon">📖</div>
          <h2>Session complete!</h2>
          <div className="reading-score-card" style={{ width: '100%' }}>
            <div className="reading-score-number">{totalCorrect}/{totalQ}</div>
            <div className="reading-score-label">questions correct</div>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 14, textAlign: 'center' }}>
            Texts you scored under 75% will come back for review.
          </p>
          <button className="btn-primary" onClick={handleBackToLevelPicker}>
            Choose another level
          </button>
          <button className="btn-secondary" onClick={onBack}>
            Back to dashboard
          </button>
        </div>
      </div>
    )
  }

  const allAnswered = answers.length > 0 && answers.every(a => a !== null)
  const currentScore = scores[scores.length - 1]
  const isPerfect = currentScore === ex.questions.length
  const isReview = exercises.slice(0, idx + 1).some(e => {
    // was this a review (previously read) text?
    const completed = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('reading_progress') || '{}').completed || []
      : []
    return false // simplified — just track via score
  })

  return (
    <div className="task-session">
      <button className="btn-back" onClick={handleBackToLevelPicker}>← Back</button>

      <div className="task-header accent-blue">
        <span className="task-icon">📖</span>
        <div>
          <h2>Reading · {selectedLevel}</h2>
          <p className="task-subtitle">Text {idx + 1} of {exercises.length}</p>
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
                title={ttsActive ? 'Stop' : 'Listen to text'}
              >
                {ttsActive ? '⏹ Stop' : '🔊 Listen'}
              </button>
            </div>
            {ex.passage.split('\n\n').map((para, i, arr) => (
              <p key={i} style={{ marginBottom: i < arr.length - 1 ? 14 : 0 }}>
                <TranslatableText text={para} onLookup={handleLookup} />
              </p>
            ))}
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>
            Tap any word to see its Slovak translation
          </p>
          <button className="btn-primary" onClick={handleStartQuestions}>
            Answer questions →
          </button>
        </>
      )}

      {/* ── Questions phase ───────────────────────────────────────────────── */}
      {phase === 'questions' && (
        <>
          <div className="reading-q-header">Comprehension questions</div>
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
            See results
          </button>
        </>
      )}

      {/* ── Done phase ────────────────────────────────────────────────────── */}
      {phase === 'done' && (
        <>
          {/* Score + XP */}
          <div className="reading-score-card">
            <div className="reading-score-number">
              {currentScore}/{ex.questions.length}
            </div>
            <div className="reading-score-label">correct on "{ex.title}"</div>
            <div className="reading-xp-badge">+{xpEarned} XP {isPerfect ? '⭐ perfect!' : ''}</div>
          </div>

          {/* Answer review */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ex.questions.map((q, qi) => (
              <div key={qi} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 6 }}>{q.q}</div>
                <div style={{ fontSize: 14, color: answers[qi] === q.answer ? 'var(--green)' : '#ef4444', fontWeight: 600 }}>
                  {answers[qi] === q.answer ? '✓ ' : '✗ '}{q.options[answers[qi]]}
                </div>
                {answers[qi] !== q.answer && (
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                    Correct: {q.options[q.answer]}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Words looked up */}
          {lookedUp.length > 0 && (
            <div className="reading-looked-up">
              <div className="reading-looked-up-title">Words you translated</div>
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

          {/* Difficulty feedback */}
          <div className="reading-difficulty">
            <div className="reading-difficulty-label">How was this text?</div>
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
            Write a reaction
          </button>
          <button className="btn-secondary" onClick={handleNext}>
            {idx + 1 < exercises.length ? 'Skip → next text' : 'Finish session'}
          </button>
        </>
      )}

      {/* ── React phase ───────────────────────────────────────────────────── */}
      {phase === 'react' && (
        <>
          <div className="prompt-box">
            <div className="prompt-label">Your turn</div>
            <div className="prompt-text" style={{ fontSize: 15 }}>
              What's your opinion on "{ex.title}"? Write 2–3 sentences in English.
            </div>
          </div>

          <textarea
            className="text-input"
            rows={4}
            placeholder="I think that..."
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
              Get AI feedback
            </button>
          )}

          {reactionFeedback === 'loading' && (
            <p style={{ color: 'var(--muted)', textAlign: 'center' }}>⏳ Getting feedback...</p>
          )}

          {reactionFeedback && reactionFeedback !== 'loading' && (
            <div className="reading-feedback-box">
              <div className="reading-feedback-label">AI Feedback</div>
              <p style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{reactionFeedback}</p>
            </div>
          )}

          <button
            className={reactionFeedback && reactionFeedback !== 'loading' ? 'btn-primary btn-done' : 'btn-secondary'}
            onClick={handleNext}
          >
            {idx + 1 < exercises.length ? 'Next text →' : 'Finish session ✓'}
          </button>
        </>
      )}
    </div>
  )
}
