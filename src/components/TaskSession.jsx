import { useState } from 'react'
import Timer from './Timer'
import FeedbackView from './FeedbackView'
import SpeechRecorder from './SpeechRecorder'
import { getAdaptivePrompt } from '../prompts'
import { formatDuration, todayStr, saveTaskResult } from '../habitStore'
import { getFeedback } from '../api'
import { extractAndStore } from '../weakSpotsStore'
import { getWeakSpots } from '../weakSpotsStore'
import { saveDailySession } from '../sentenceStore'

const MAX_LENGTH = 2000

export default function TaskSession({ taskType, duration, onComplete, onBack }) {
  const [text, setText]                   = useState('')
  const [speakingNotes, setSpeakingNotes] = useState('')
  const [timerDone, setTimerDone]         = useState(false)
  const [submitted, setSubmitted]         = useState(false)
  const [feedback, setFeedback]           = useState(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [feedbackError, setFeedbackError] = useState(null)

  const isWriting    = taskType === 'writing'
  const topWeakSpot  = getWeakSpots()[0]?.category ?? null
  const adaptiveResult = getAdaptivePrompt(isWriting ? 'writing' : 'speaking', topWeakSpot)
  const prompt       = adaptiveResult.text
  const accentColor  = isWriting ? 'accent-purple' : 'accent-green'
  const feedbackText = isWriting ? text : speakingNotes

  async function handleSubmit() {
    const date = todayStr()
    setSubmitted(true)
    onComplete()
    saveTaskResult(date, taskType, { text: feedbackText, feedback: null, prompt })
    if (feedbackText.trim()) saveDailySession({ taskType, prompt, text: feedbackText })

    if (!feedbackText.trim()) return

    setFeedbackLoading(true)
    setFeedbackError(null)
    let feedbackResult = null
    try {
      feedbackResult = await getFeedback(taskType, feedbackText)
      setFeedback(feedbackResult)
      if (feedbackResult) {
        const feedbackStr = [
          ...(feedbackResult.corrections || []),
          ...(feedbackResult.suggestions || []),
          feedbackResult.praise || '',
        ].join(' ')
        extractAndStore(feedbackStr)
      }
    } catch (e) {
      if (e.message === 'NOT_CONFIGURED') {
        setFeedbackError('AI spätná väzba ešte nie je nastavená. Pozri ⚙️ Nastavenia.')
      } else if (e.message === 'UNAUTHORIZED') {
        setFeedbackError('Chyba tokenu. Skús znovu nasadiť aplikáciu.')
      } else {
        setFeedbackError('Spätnú väzbu sa nepodarilo načítať. Skúste to neskôr.')
      }
    } finally {
      setFeedbackLoading(false)
      if (feedbackResult) saveTaskResult(date, taskType, { text: feedbackText, feedback: feedbackResult, prompt })
    }
  }

  if (submitted) {
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Späť</button>
        <div className="session-complete-inline">
          <div className="complete-icon">⭐</div>
          <h2>Skvelá práca!</h2>
          <p className="xp-gain">+25 XP získaných</p>
        </div>

        {feedbackText.trim()
          ? <FeedbackView feedback={feedback} loading={feedbackLoading} error={feedbackError} />
          : <div className="feedback-box feedback-hint">💡 Nabudúce napíš alebo nahraj niečo, aby si dostala AI spätnú väzbu.</div>
        }

        {!feedbackLoading && (
          <button className="btn-primary" onClick={onBack}>Späť na dashboard</button>
        )}
      </div>
    )
  }

  return (
    <div className="task-session">
      <button className="btn-back" onClick={onBack}>← Späť</button>

      <div className={`task-header ${accentColor}`}>
        <span className="task-icon">{isWriting ? '✍️' : '🎤'}</span>
        <div>
          <h2>{isWriting ? 'Písanie' : 'Rozprávanie'}</h2>
          <p className="task-subtitle">{formatDuration(duration)} výzva</p>
        </div>
      </div>

      <div className="prompt-box">
        <div className="prompt-label">Dnešná téma</div>
        <p className="prompt-text">"{prompt}"</p>
        {adaptiveResult.targetedAt && (
          <div style={{ fontSize: 12, color: '#065f46', background: '#d1fae5', borderRadius: 6, padding: '3px 10px', width: 'fit-content', marginTop: 6 }}>
            🎯 Zvolené na precvičenie {adaptiveResult.targetedAt}
          </div>
        )}
      </div>

      <Timer
        duration={duration}
        taskType={taskType}
        onComplete={() => setTimerDone(true)}
      />

      {isWriting && (
        <div className="writing-area">
          <textarea
            placeholder="Začni písať... nerob si starosti s chybami, len píš!"
            value={text}
            onChange={e => setText(e.target.value)}
            className="text-input"
            rows={6}
            maxLength={MAX_LENGTH}
          />
          <div className="char-count">{text.length} / {MAX_LENGTH}</div>
        </div>
      )}

      {!isWriting && (
        <>
          <div className="speaking-hint">
            <p>🎤 Habla en español sobre el tema de arriba.</p>
            <p>Použi rekordér nižšie na automatický prepis alebo napíš svoju odpoveď ručne.</p>
          </div>

          <SpeechRecorder
            onTranscript={t => setSpeakingNotes(t)}
            disabled={false}
          />

          <div className="writing-area">
            <label className="input-label">
              Tvoja odpoveď <span className="optional">— uprav prepis alebo napíš ručne</span>
            </label>
            <textarea
              placeholder="Prepis sa zobrazí tu automaticky, alebo ho napíš sama..."
              value={speakingNotes}
              onChange={e => setSpeakingNotes(e.target.value)}
              className="text-input"
              rows={4}
              maxLength={MAX_LENGTH}
            />
            <div className="char-count">{speakingNotes.length} / {MAX_LENGTH}</div>
          </div>
        </>
      )}

      {timerDone && (
        <button
          className="btn-primary btn-done"
          onClick={handleSubmit}
          disabled={isWriting && text.trim().length < 10}
          title={isWriting && text.trim().length < 10 ? 'Najprv napíš aspoň pár slov' : ''}
        >
          {feedbackText.trim() ? 'Odoslať a dostať spätnú väzbu ✓' : 'Označiť ako hotové ✓'}
        </button>
      )}
      {timerDone && isWriting && text.trim().length < 10 && (
        <p className="submit-hint">✏️ Napíš aspoň pár slov pre odoslanie.</p>
      )}
    </div>
  )
}
