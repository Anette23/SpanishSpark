import { useState } from 'react'
import { saveFlashcard, getDueCards, getFlashcardStats } from '../flashcardStore'

// ── Helpers ──────────────────────────────────────────────────────────────────

function getItemId(type, item) {
  if (type === 'synonyms')   return item.word
  if (type === 'grammar')    return item.id
  if (type === 'shadowing')  return item.sentence
  return item.phrase   // prepositions, idioms
}

function renderPhrase(phrase, answer, checked, isCorrect) {
  if (!checked) {
    const [before, after] = phrase.split('___')
    return (
      <>
        {before}
        <span className="answer-blank">______</span>
        {after}
      </>
    )
  }
  const [before, after] = phrase.split('___')
  return (
    <>
      {before}
      <span className={isCorrect ? 'answer-correct' : 'answer-shown'}>
        {Array.isArray(answer) ? answer.join(' / ') : answer}
      </span>
      {after}
    </>
  )
}

// ── Stats display ─────────────────────────────────────────────────────────────

function StatsRow({ stats }) {
  return (
    <div className="flashcard-stats">
      <div className="fc-stat">
        <div className="fc-stat-num">{stats.total}</div>
        <div className="fc-stat-label">Total</div>
      </div>
      <div className="fc-stat">
        <div className="fc-stat-num">{stats.learned}</div>
        <div className="fc-stat-label">Learned</div>
      </div>
      <div className="fc-stat">
        <div className="fc-stat-num">{stats.due}</div>
        <div className="fc-stat-label">Due</div>
      </div>
    </div>
  )
}

// ── All caught up screen ──────────────────────────────────────────────────────

function AllCaughtUp({ type, items, onClose }) {
  const stats = getFlashcardStats(type, items)
  return (
    <div className="task-session">
      <button className="btn-back" onClick={onClose}>← Back</button>
      <div className="session-complete-inline" style={{ paddingTop: 40 }}>
        <div className="complete-icon">🎉</div>
        <h2>All caught up!</h2>
        <p style={{ color: 'var(--muted)', fontSize: 15, marginTop: 8 }}>
          No cards are due for review right now. Come back later!
        </p>
      </div>
      <StatsRow stats={stats} />
      <button className="btn-primary" onClick={onClose}>
        Close
      </button>
    </div>
  )
}

// ── Synonyms card ─────────────────────────────────────────────────────────────

function SynonymCard({ item, onResult }) {
  const [input, setInput]     = useState('')
  const [checked, setChecked] = useState(false)

  const userWords   = input.toLowerCase().split(',').map(w => w.trim()).filter(Boolean)
  const gotCorrect  = checked ? userWords.filter(w => item.synonyms.includes(w)) : []
  const gotWrong    = checked ? userWords.filter(w => !item.synonyms.includes(w)) : []
  const score       = checked ? gotCorrect.length / item.synonyms.length : null

  function handleCheck() {
    setChecked(true)
  }

  return (
    <>
      <div className="prompt-box">
        <div className="prompt-label">Write synonyms for</div>
        <p className="bonus-word">{item.word}</p>
      </div>

      <div>
        <label className="input-label">
          Your synonyms <span className="optional">— separated by commas</span>
        </label>
        <textarea
          className="text-input"
          rows={3}
          placeholder="e.g. glad, joyful, pleased..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={checked}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey && !checked) {
              e.preventDefault()
              handleCheck()
            }
          }}
          autoCapitalize="none"
          autoCorrect="off"
        />
      </div>

      {!checked ? (
        <div className="prep-input-row">
          <button
            className="btn-primary btn-check"
            onClick={handleCheck}
          >
            {input.trim() ? 'Check →' : 'Show →'}
          </button>
        </div>
      ) : (
        <div className="bonus-result">
          {gotCorrect.length > 0
            ? <p className="result-correct">✅ {gotCorrect.length}/{item.synonyms.length} correct — well done!</p>
            : input.trim()
              ? <p className="result-wrong">❌ No matches — review these:</p>
              : null
          }
          {gotWrong.length > 0 && (
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>
              Not quite: <span className="result-wrong-words">{gotWrong.join(', ')}</span>
            </p>
          )}
          <div>
            <div className="syn-chips-label">All synonyms for <strong>{item.word}</strong>:</div>
            <div className="syn-chips">
              {item.synonyms.map(s => (
                <span
                  key={s}
                  className={`syn-chip ${gotCorrect.includes(s) ? 'syn-chip-got' : 'syn-chip-new'}`}
                >
                  {gotCorrect.includes(s) ? '✓ ' : ''}{s}
                </span>
              ))}
            </div>
          </div>
          {item.example && (
            <div className="syn-example-box">
              <div className="syn-example-label">Example</div>
              <p className="syn-example-text">"{item.example}"</p>
            </div>
          )}
          <button className="btn-primary" onClick={() => onResult(score)}>
            Next →
          </button>
        </div>
      )}
    </>
  )
}

// ── Fill-in-the-blank card (prepositions, idioms, grammar) ────────────────────

function FillBlankCard({ type, item, onResult }) {
  const [input, setInput]     = useState('')
  const [checked, setChecked] = useState(false)

  const userAnswer = input.trim().toLowerCase()
  const isCorrect  = checked && item.answer.includes(userAnswer)
  const score      = checked ? (isCorrect ? 1.0 : 0.0) : null

  function handleCheck() {
    if (input.trim()) setChecked(true)
  }

  return (
    <>
      {type === 'grammar' && item.category && (
        <div className="grammar-category-badge">{item.category}</div>
      )}
      <div className="prompt-box">
        <div className="prompt-label">Fill in the blank</div>
        <p className="prompt-text">
          {renderPhrase(item.phrase, item.answer, checked, isCorrect)}
        </p>
      </div>

      <div className="prep-input-row">
        <input
          className="prep-input"
          type="text"
          placeholder="your answer..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={checked}
          onKeyDown={e => e.key === 'Enter' && handleCheck()}
          autoCapitalize="none"
          autoCorrect="off"
        />
        {!checked && (
          <button
            className="btn-primary btn-check"
            onClick={handleCheck}
            disabled={!input.trim()}
          >
            Check
          </button>
        )}
      </div>

      {checked && (
        <div className="bonus-result">
          <p className={isCorrect ? 'result-correct' : 'result-wrong'}>
            {isCorrect
              ? '✅ Correct!'
              : `❌ Answer: ${item.answer.join(' / ')}`}
          </p>
          {type === 'grammar' && item.hint && (
            <p className="grammar-hint">💡 {item.hint}</p>
          )}
          {type === 'grammar' && item.explanation && (
            <p className="grammar-explanation">{item.explanation}</p>
          )}
          {(type === 'prepositions' || type === 'idioms') && item.hint && (
            <p className="hint-text">💡 {item.hint}</p>
          )}
          <button className="btn-primary" onClick={() => onResult(score)}>
            Next →
          </button>
        </div>
      )}
    </>
  )
}

// ── Shadowing card ────────────────────────────────────────────────────────────

function ShadowingCard({ item, onResult }) {
  const [done, setDone]         = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  function listen() {
    if (!supported) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(item.sentence)
    utt.lang = 'en-US'
    utt.rate = 0.85
    utt.onstart = () => setIsSpeaking(true)
    utt.onend   = () => setIsSpeaking(false)
    utt.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utt)
  }

  return (
    <>
      <div className="prompt-box">
        <div className="prompt-label">Listen and repeat out loud</div>
        <p className="prompt-text">"{item.sentence}"</p>
      </div>

      <button
        className={`btn-listen ${isSpeaking ? 'btn-listening' : ''}`}
        onClick={listen}
        disabled={isSpeaking || !supported}
        type="button"
      >
        {isSpeaking ? '🔊 Playing...' : '🔊 Listen'}
      </button>

      {!supported && (
        <p className="rec-error">Text-to-speech is not supported in this browser.</p>
      )}

      {!done ? (
        <button
          className="btn-primary btn-done"
          style={{ marginTop: 8 }}
          onClick={() => setDone(true)}
        >
          I said it ✓
        </button>
      ) : (
        <div className="bonus-result">
          <p className="result-correct">✅ Great practice! Keep it up.</p>
          <button className="btn-primary" onClick={() => onResult(0.9)}>
            Next →
          </button>
        </div>
      )}
    </>
  )
}

// ── Main FlashcardReview component ────────────────────────────────────────────

const TYPE_CONFIG = {
  synonyms:     { title: 'Synonyms Review',     icon: '🔤', accent: 'accent-blue'   },
  prepositions: { title: 'Prepositions Review', icon: '📝', accent: 'accent-orange' },
  idioms:       { title: 'Idioms Review',       icon: '💬', accent: 'accent-purple' },
  grammar:      { title: 'Grammar Review',      icon: '📚', accent: 'accent-green'  },
  shadowing:    { title: 'Shadowing Review',    icon: '🎧', accent: 'accent-teal'   },
}

const BATCH_SIZE = 10

export default function FlashcardReview({ type, items, onClose }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.synonyms

  // Compute due cards once on mount; cardKey forces a fresh render per card
  const [dueCards]      = useState(() => getDueCards(type, items, BATCH_SIZE))
  const [cardIndex, setCardIndex] = useState(0)
  const [cardKey, setCardKey]     = useState(0)
  const [sessionDone, setSessionDone] = useState(false)

  // If nothing due, show all-caught-up immediately
  if (dueCards.length === 0) {
    return <AllCaughtUp type={type} items={items} onClose={onClose} />
  }

  const stats = getFlashcardStats(type, items)

  function handleResult(score) {
    const item = dueCards[cardIndex]
    const id   = getItemId(type, item)
    saveFlashcard(type, id, score)

    const next = cardIndex + 1
    if (next >= dueCards.length) {
      setSessionDone(true)
    } else {
      setCardIndex(next)
      setCardKey(k => k + 1)
    }
  }

  // Session complete
  if (sessionDone) {
    const finalStats = getFlashcardStats(type, items)
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onClose}>← Back</button>
        <div className="session-complete-inline" style={{ paddingTop: 40 }}>
          <div className="complete-icon">🎉</div>
          <h2>Session done!</h2>
          <p style={{ color: 'var(--green)', fontSize: 16, fontWeight: 700, marginTop: 8 }}>
            You reviewed {dueCards.length} card{dueCards.length !== 1 ? 's' : ''}.
          </p>
        </div>
        <StatsRow stats={finalStats} />
        <button className="btn-primary" onClick={onClose}>
          Done
        </button>
      </div>
    )
  }

  const currentCard = dueCards[cardIndex]
  const progress    = `${cardIndex + 1} / ${dueCards.length}`

  return (
    <div className="task-session">
      <button className="btn-back" onClick={onClose}>← Back</button>

      <div className={`task-header ${config.accent}`}>
        <span className="task-icon">{config.icon}</span>
        <div>
          <h2>{config.title}</h2>
          <p className="task-subtitle">Card {progress}</p>
        </div>
      </div>

      <StatsRow stats={stats} />

      <div key={cardKey}>
        {type === 'synonyms' && (
          <SynonymCard item={currentCard} onResult={handleResult} />
        )}
        {(type === 'prepositions' || type === 'idioms' || type === 'grammar') && (
          <FillBlankCard type={type} item={currentCard} onResult={handleResult} />
        )}
        {type === 'shadowing' && (
          <ShadowingCard item={currentCard} onResult={handleResult} />
        )}
      </div>
    </div>
  )
}
