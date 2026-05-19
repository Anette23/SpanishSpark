import { useState } from 'react'
import SpeechRecorder from './SpeechRecorder'
import FeedbackView from './FeedbackView'
import { getFeedback } from '../api'
import { saveTaskResult, todayStr } from '../habitStore'

const MAX_LENGTH = 3000

export default function WeeklySession({ challenge, onComplete, onBack }) {
  const isSpeaking = challenge.type === 'speaking'

  const [text, setText]                       = useState('')
  const [submitted, setSubmitted]             = useState(false)
  const [feedback, setFeedback]               = useState(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [feedbackError, setFeedbackError]     = useState(null)

  async function handleSubmit() {
    setSubmitted(true)
    onComplete()
    saveTaskResult(todayStr(), challenge.type, { text, feedback: null, prompt: challenge.prompt })

    if (!text.trim()) return

    setFeedbackLoading(true)
    let feedbackResult = null
    try {
      feedbackResult = await getFeedback(challenge.type, text)
      setFeedback(feedbackResult)
    } catch (e) {
      if (e.message === 'NOT_CONFIGURED') {
        setFeedbackError('AI feedback is not set up yet. See ⚙️ Settings.')
      } else if (e.message === 'UNAUTHORIZED') {
        setFeedbackError('Feedback token mismatch. Try redeploying.')
      } else {
        setFeedbackError('Could not load feedback. Try again later.')
      }
    } finally {
      setFeedbackLoading(false)
      if (feedbackResult) saveTaskResult(todayStr(), challenge.type, { text, feedback: feedbackResult, prompt: challenge.prompt })
    }
  }

  if (submitted) {
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="session-complete-inline">
          <div className="complete-icon">🏆</div>
          <h2>Weekly Challenge done!</h2>
          <p className="xp-gain">+50 XP earned</p>
        </div>
        {text.trim()
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

      <div className="task-header weekly-header">
        <span className="task-icon">🏆</span>
        <div>
          <h2>{challenge.title}</h2>
          <p className="task-subtitle">Weekly Challenge — +50 XP</p>
        </div>
      </div>

      <div className="prompt-box">
        <div className="prompt-label">This week's challenge</div>
        <p className="prompt-text">{challenge.prompt}</p>
      </div>

      {isSpeaking ? (
        <>
          <div className="speaking-hint">
            <p>🎤 Di tu respuesta en voz alta en español.</p>
            <p>Use the recorder for transcription, or write your answer below.</p>
          </div>
          <SpeechRecorder onTranscript={t => setText(t)} disabled={false} />
          <div>
            <label className="input-label">
              Your answer <span className="optional">— edit transcript or write manually</span>
            </label>
            <textarea
              className="text-input"
              rows={5}
              placeholder="Transcript appears here, or write it yourself..."
              value={text}
              onChange={e => setText(e.target.value)}
              maxLength={MAX_LENGTH}
            />
            <div className="char-count">{text.length} / {MAX_LENGTH}</div>
          </div>
        </>
      ) : (
        <div>
          <textarea
            className="text-input"
            rows={8}
            placeholder="Start writing here — take your time, this is the weekly challenge!"
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={MAX_LENGTH}
          />
          <div className="char-count">{text.length} / {MAX_LENGTH}</div>
        </div>
      )}

      <button className="btn-primary btn-weekly" onClick={handleSubmit}>
        {text.trim() ? 'Submit & Get Feedback 🏆' : 'Mark as Done 🏆'}
      </button>
    </div>
  )
}
