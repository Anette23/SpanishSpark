import { useState, useMemo, useEffect } from 'react'
import { SYNONYM_WORDS, PREPOSITION_PHRASES, IDIOM_PHRASES, SHADOWING_SENTENCES, getListForLevel } from '../bonusExercises'
import { GRAMMAR_EXERCISES } from '../grammarExercises'
import { saveFlashcard, incrementDailyProgress, DAILY_GOAL, getDailyProgress } from '../flashcardStore'
import { completeDailyBonusGoal } from '../habitStore'
import FlashcardReview from './FlashcardReview'

// Re-use exercise components from BonusSession by importing them inline here
// (they are not exported, so we duplicate the lightweight ones needed)
import SpeechRecorder from './SpeechRecorder'
import { checkSentence } from '../api'
import { savePracticedSentence } from '../sentenceStore'

// ── UseItPhase (same as BonusSession) ────────────────────────────────────────
function UseItPhase({ targetPhrase, type, onDone }) {
  const [sentence, setSentence]   = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [check, setCheck]         = useState(null)
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    savePracticedSentence({ type, phrase: targetPhrase, sentence: '' })
  }, [])

  async function handleSubmit() {
    setSubmitted(true)
    setLoading(true)
    savePracticedSentence({ type, phrase: targetPhrase, sentence })
    try {
      const result = await checkSentence(targetPhrase, sentence)
      setCheck(result)
    } catch {
      setCheck(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="prompt-box">
        <div className="prompt-label">Now use it in a sentence</div>
        <p className="bonus-word" style={{ fontSize: 17 }}>{targetPhrase}</p>
      </div>
      {!submitted ? (
        <>
          <textarea
            className="text-input"
            rows={3}
            placeholder={`Write a sentence using "${targetPhrase}"...`}
            value={sentence}
            onChange={e => setSentence(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey && sentence.trim().length >= 5) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            autoCapitalize="sentences"
          />
          <div className="syn-recall-btns">
            <button className="btn-hint" type="button" onClick={onDone}>Skip →</button>
            <button className="btn-primary btn-check" onClick={handleSubmit} disabled={sentence.trim().length < 5}>
              Submit
            </button>
          </div>
        </>
      ) : (
        <div className="bonus-result">
          {loading && <p className="syn-checking">⏳ Checking...</p>}
          {!loading && check && (
            <p className={check.ok ? 'result-correct' : 'result-wrong'}>
              {check.ok ? '✅' : '❌'} {check.feedback}
            </p>
          )}
          {!loading && !check && <p className="result-correct">✅ Sentence submitted!</p>}
          {!loading && <button className="btn-primary" onClick={onDone}>Next →</button>}
        </div>
      )}
    </>
  )
}

// ── Exercise cards ────────────────────────────────────────────────────────────
function MixSynCard({ item, onDone }) {
  const [input, setInput]   = useState('')
  const [checked, setChecked] = useState(false)
  const [phase, setPhase]   = useState('recall') // 'recall' | 'useit'
  const userWords  = input.toLowerCase().split(',').map(w => w.trim()).filter(Boolean)
  const gotCorrect = checked ? userWords.filter(w => item.synonyms.includes(w)) : []
  const score = checked ? gotCorrect.length / item.synonyms.length : 0
  const suggested = gotCorrect[0] || item.synonyms[0]

  if (phase === 'useit') {
    return <UseItPhase targetPhrase={suggested} type="synonyms" onDone={() => onDone(score)} />
  }

  return (
    <>
      <div className="prompt-box">
        <div className="prompt-label">Find synonyms for</div>
        <p className="bonus-word">{item.word}</p>
      </div>
      <div>
        <label className="input-label">Your synonyms <span className="optional">— separated by commas</span></label>
        <textarea
          className="text-input" rows={3}
          placeholder="e.g. glad, joyful, pleased..."
          value={input} onChange={e => setInput(e.target.value)}
          disabled={checked} autoCapitalize="none" autoCorrect="off"
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); setChecked(true) } }}
        />
      </div>
      {!checked ? (
        <div className="prep-input-row">
          <button className="btn-primary btn-check" onClick={() => setChecked(true)}>
            {input.trim() ? 'Check →' : 'Show →'}
          </button>
        </div>
      ) : (
        <div className="bonus-result">
          {gotCorrect.length > 0
            ? <p className="result-correct">✅ {gotCorrect.length}/{item.synonyms.length} correct!</p>
            : <p className="result-wrong">❌ No matches — learn these:</p>
          }
          <div className="syn-chips">
            {item.synonyms.map(s => (
              <span key={s} className={`syn-chip ${gotCorrect.includes(s) ? 'syn-chip-got' : 'syn-chip-new'}`}>
                {gotCorrect.includes(s) ? '✓ ' : ''}{s}
              </span>
            ))}
          </div>
          <button className="btn-primary" onClick={() => setPhase('useit')}>Use it in a sentence →</button>
        </div>
      )}
    </>
  )
}

function MixFillCard({ type, item, onDone }) {
  const [input, setInput]     = useState('')
  const [checked, setChecked] = useState(false)
  const [phase, setPhase]     = useState('blank')
  const isCorrect = checked && item.answer.includes(input.trim().toLowerCase())
  const [before, after] = item.phrase.split('___')
  const targetPhrase = type === 'grammar'
    ? item.answer[0]
    : item.hint ? item.hint.split('=')[0].trim() : item.phrase.replace('___', item.answer[0])
  const score = isCorrect ? 1.0 : 0.0

  if (phase === 'useit') {
    return <UseItPhase targetPhrase={targetPhrase} type={type} onDone={() => onDone(score)} />
  }

  return (
    <>
      {type === 'grammar' && <div className="grammar-category-badge">{item.category}</div>}
      <div className="prompt-box">
        <div className="prompt-label">Fill in the blank</div>
        <p className="prompt-text">
          {checked
            ? <>{before}<span className={isCorrect ? 'answer-correct' : 'answer-shown'}>{item.answer[0]}</span>{after}</>
            : <>{before}<span className="answer-blank">______</span>{after}</>
          }
        </p>
      </div>
      <div className="prep-input-row">
        <input
          className="prep-input" type="text" placeholder="your answer..."
          value={input} onChange={e => setInput(e.target.value)}
          disabled={checked}
          onKeyDown={e => e.key === 'Enter' && input.trim() && setChecked(true)}
          autoCapitalize="none" autoCorrect="off"
        />
        {!checked && (
          <button className="btn-primary btn-check" onClick={() => input.trim() && setChecked(true)} disabled={!input.trim()}>
            Check
          </button>
        )}
      </div>
      {checked && (
        <div className="bonus-result">
          <p className={isCorrect ? 'result-correct' : 'result-wrong'}>
            {isCorrect ? '✅ Correct!' : `❌ Answer: ${item.answer.join(' / ')}`}
          </p>
          {item.hint && type !== 'grammar' && <p className="hint-text">💡 {item.hint}</p>}
          {item.hint && type === 'grammar' && <p className="grammar-hint">💡 {item.hint}</p>}
          {item.explanation && <p className="grammar-explanation">{item.explanation}</p>}
          <button className="btn-primary" onClick={() => setPhase('useit')}>Use it in a sentence →</button>
        </div>
      )}
    </>
  )
}

function MixShadowCard({ item, onDone }) {
  const [transcript, setTranscript] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [retryKey, setRetryKey]     = useState(0)
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  function listen() {
    if (!supported) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(item.sentence)
    utt.lang = 'en-US'; utt.rate = 0.85
    utt.onstart = () => setIsSpeaking(true)
    utt.onend   = () => setIsSpeaking(false)
    utt.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utt)
  }

  const words    = item.sentence.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/)
  const said     = transcript.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean)
  const matchPct = said.length > 0
    ? Math.round(said.filter(w => words.includes(w)).length / words.length * 100) : 0
  const missedWords = words.filter(w => !said.includes(w))

  return (
    <>
      <div className="prompt-box">
        <div className="prompt-label">Listen, then repeat out loud</div>
        <p className="prompt-text">"{item.sentence}"</p>
      </div>
      <button className={`btn-listen ${isSpeaking ? 'btn-listening' : ''}`} onClick={listen} disabled={isSpeaking || !supported} type="button">
        {isSpeaking ? '🔊 Playing...' : '🔊 Listen'}
      </button>
      <SpeechRecorder key={retryKey} onTranscript={setTranscript} disabled={isSpeaking} />
      {transcript && (
        <div className="bonus-result">
          <p>Match: <span className="match-pct">{matchPct}%</span>
            {matchPct >= 80 ? ' — Great!' : matchPct >= 50 ? ' — Getting there!' : ' — Keep going!'}
          </p>
          <div className="shadow-sentence-feedback">
            {words.map((word, i) => {
              const ok = said.includes(word)
              return (
                <span key={i} className={ok ? 'shadow-word-ok' : 'shadow-word-miss shadow-word-tap'}
                  onClick={ok ? undefined : () => {
                    window.speechSynthesis.cancel()
                    const u = new SpeechSynthesisUtterance(word)
                    u.lang = 'en-US'; u.rate = 0.8
                    window.speechSynthesis.speak(u)
                  }}
                >{word}{' '}</span>
              )
            })}
          </div>
          {missedWords.length > 0 && <p className="shadow-tap-hint">👆 Tap a red word to hear it</p>}
          <p className="shadow-transcript">You said: <em>"{transcript}"</em></p>
          <div className="shadow-action-btns">
            <button className="btn-secondary" style={{ width: '100%', padding: 12, fontSize: 15 }}
              onClick={() => { setTranscript(''); setRetryKey(k => k + 1) }}>
              🔄 Try again
            </button>
            <button className="btn-primary" onClick={() => onDone(matchPct >= 50 ? 0.9 : 0.4)}>
              Next →
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// ── Type config ───────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  synonyms:     { title: 'Synonyms',     icon: '🔤', accent: 'accent-blue'   },
  prepositions: { title: 'Prepositions', icon: '📝', accent: 'accent-orange' },
  idioms:       { title: 'Idioms',       icon: '💬', accent: 'accent-purple' },
  grammar:      { title: 'Grammar',      icon: '📚', accent: 'accent-green'  },
  shadowing:    { title: 'Shadowing',    icon: '🎧', accent: 'accent-teal'   },
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ── Main MixedSession ─────────────────────────────────────────────────────────
export default function MixedSession({ onBack }) {
  const level = localStorage.getItem('exerciseLevel') || 'B1'

  const exercises = useMemo(() => {
    const synList  = getListForLevel(SYNONYM_WORDS, level)
    const prepList = getListForLevel(PREPOSITION_PHRASES, level)
    const idiomList = getListForLevel(IDIOM_PHRASES, level)
    const gramList = GRAMMAR_EXERCISES.filter(e => e.level === level)
    const shadList = getListForLevel(SHADOWING_SENTENCES, level)

    return [
      { type: 'synonyms',     item: pickRandom(synList)   },
      { type: 'prepositions', item: pickRandom(prepList)  },
      { type: 'idioms',       item: pickRandom(idiomList) },
      { type: 'grammar',      item: pickRandom(gramList)  },
      { type: 'shadowing',    item: pickRandom(shadList)  },
    ].sort(() => Math.random() - 0.5)
  }, [])

  const [step, setStep]         = useState(0)
  const [cardKey, setCardKey]   = useState(0)
  const [sessionDone, setSessionDone] = useState(false)

  function handleDone(score) {
    const { type, item } = exercises[step]
    const id = type === 'synonyms' ? item.word
             : type === 'grammar'  ? item.id
             : type === 'shadowing'? item.sentence
             : item.phrase
    saveFlashcard(type, id, score)

    const next = step + 1
    if (next >= exercises.length) {
      setSessionDone(true)
    } else {
      setStep(next)
      setCardKey(k => k + 1)
    }
  }

  if (sessionDone) {
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="session-complete-inline" style={{ paddingTop: 40 }}>
          <div className="complete-icon">🎯</div>
          <h2>Mixed session done!</h2>
          <p style={{ color: 'var(--green)', fontWeight: 700, fontSize: 16, marginTop: 8 }}>
            You practiced 5 different skills in one session!
          </p>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>
            The phrases you used are saved — your next chat will know what you've been practicing.
          </p>
        </div>
        <button className="btn-primary" onClick={onBack}>Done ✓</button>
      </div>
    )
  }

  const { type, item } = exercises[step]
  const config = TYPE_CONFIG[type]

  return (
    <div className="task-session">
      <button className="btn-back" onClick={onBack}>← Back</button>

      <div className={`task-header ${config.accent}`}>
        <span className="task-icon">{config.icon}</span>
        <div>
          <h2>Mixed Practice</h2>
          <p className="task-subtitle">{config.title} — {step + 1} of {exercises.length}</p>
        </div>
      </div>

      <div className="daily-progress-row">
        <div className="daily-progress-bar-wrap">
          <div className="daily-progress-bar-fill" style={{ width: `${step / exercises.length * 100}%` }} />
        </div>
        <span className="daily-progress-label">{step} / {exercises.length}</span>
      </div>

      <div key={cardKey}>
        {type === 'synonyms' && <MixSynCard item={item} onDone={handleDone} />}
        {(type === 'prepositions' || type === 'idioms' || type === 'grammar') && (
          <MixFillCard type={type} item={item} onDone={handleDone} />
        )}
        {type === 'shadowing' && <MixShadowCard item={item} onDone={handleDone} />}
      </div>
    </div>
  )
}
