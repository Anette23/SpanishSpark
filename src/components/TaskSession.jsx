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
    // Save text immediately so data isn't lost if the browser closes before feedback arrives
    saveTaskResult(date, taskType, { text: feedbackText, feedback: null, prompt })
    // Save context so ChatSession can follow up on today's topic
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
        setFeedbackError('AI feedback is not set up yet. See ⚙️ Settings for instructions.')
      } else if (e.message === 'UNAUTHORIZED') {
        setFeedbackError('Feedback token mismatch. Try redeploying the app.')
      } else {
        setFeedbackError('Could not load feedback. Try again later.')
      }
    } finally {
      setFeedbackLoading(false)
      if (feedbackResult) saveTaskResult(date, taskType, { text: feedbackText, feedback: feedbackResult, prompt })
    }
  }

  if (submitted) {
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="session-complete-inline">
          <div className="complete-icon">⭐</div>
          <h2>Amazing work!</h2>
          <p className="xp-gain">+25 XP earned</p>
        </div>

        {feedbackText.trim()
          ? <FeedbackView feedback={feedback} loading={feedbackLoading} error={feedbackError} />
          : <div className="feedback-box feedback-hint">💡 Next time write or record something to get AI feedback.</div>
        }

        {!feedbackLoading && (
          <button className="btn-primary" onClick={onBack}>Back to Dashboard</button>
        )}
      </div>
    )
  }

  return (
    <div className="task-session">
      <button className="btn-back" onClick={onBack}>← Back</button>

      <div className={`task-header ${accentColor}`}>
        <span className="task-icon">{isWriting ? '✍️' : '🎤'}</span>
        <div>
          <h2>{isWriting ? 'Writing' : 'Speaking'} Session</h2>
          <p className="task-subtitle">{formatDuration(duration)} challenge</p>
        </div>
      </div>

      <div className="prompt-box">
        <div className="prompt-label">Today's prompt</div>
        <p className="prompt-text">"{prompt}"</p>
        {adaptiveResult.targetedAt && (
          <div style={{ fontSize: 12, color: '#065f46', background: '#d1fae5', borderRadius: 6, padding: '3px 10px', width: 'fit-content', marginTop: 6 }}>
            🎯 Chosen to practise {adaptiveResult.targetedAt}
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
            placeholder="Start writing here... don't worry about mistakes, just write!"
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
            <p>Use the recorder below for automatic transcription, or write your answer manually.</p>
          </div>

          <SpeechRecorder
            onTranscript={t => setSpeakingNotes(t)}
            disabled={false}
          />

          <div className="writing-area">
            <label className="input-label">
              Your answer <span className="optional">— edit transcript or write manually</span>
            </label>
            <textarea
              placeholder="Transcript appears here automatically, or write it yourself..."
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
          title={isWriting && text.trim().length < 10 ? 'Write at least a few words first' : ''}
        >
          {feedbackText.trim() ? 'Submit & Get Feedback ✓' : 'Mark as Done ✓'}
        </button>
      )}
      {timerDone && isWriting && text.trim().length < 10 && (
        <p className="submit-hint">✏️ Write at least a few words to submit.</p>
      )}
    </div>
  )
}
