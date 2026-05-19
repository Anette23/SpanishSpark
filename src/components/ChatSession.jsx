import { useState, useRef, useEffect, useCallback } from 'react'
import FeedbackView from './FeedbackView'
import { sendChatMessage, getChatFeedback } from '../api'
import { getRecentPhrases } from '../sentenceStore'

function useVoiceInput(onResult) {
  const [isRecording, setIsRecording] = useState(false)
  const [supported, setSupported]     = useState(false)
  const recRef          = useRef(null)
  const onResultRef     = useRef(onResult)
  const finalTextRef    = useRef('')
  const shouldRecordRef = useRef(false)
  useEffect(() => { onResultRef.current = onResult }, [onResult])

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    setSupported(true)
    const rec = new SR()
    rec.continuous     = false  // avoids Chrome Android repeating words across audio chunks
    rec.interimResults = true
    rec.lang = 'es-ES'

    rec.onresult = (e) => {
      let newFinal = '', interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) newFinal += e.results[i][0].transcript + ' '
        else interim = e.results[i][0].transcript
      }
      if (newFinal) finalTextRef.current += newFinal
      onResultRef.current(finalTextRef.current + interim)
    }

    rec.onend = () => {
      if (shouldRecordRef.current) {
        try { rec.start() } catch {}   // restart after each utterance pause
      } else {
        setIsRecording(false)
      }
    }

    rec.onerror = (e) => {
      if (e.error !== 'aborted') {
        shouldRecordRef.current = false
        setIsRecording(false)
      }
    }

    recRef.current = rec
    return () => { shouldRecordRef.current = false; rec.abort() }
  }, [])

  const toggle = useCallback(() => {
    const rec = recRef.current
    if (!rec) return
    if (isRecording) {
      shouldRecordRef.current = false
      rec.stop()
    } else {
      finalTextRef.current    = ''
      shouldRecordRef.current = true
      try { rec.start(); setIsRecording(true) } catch {}
    }
  }, [isRecording])

  return { isRecording, toggle, supported }
}

const STARTERS = [
  "¡Hola! ¿Cómo te llamas y de dónde eres?",
  "¿Qué hiciste el fin de semana pasado?",
  "¿Cuál es tu comida favorita?",
  "¿Qué te gusta hacer en tu tiempo libre?",
  "Cuéntame algo sobre tu familia.",
]

function getStarter() {
  return STARTERS[Math.floor(Math.random() * STARTERS.length)]
}

export default function ChatSession({ onBack }) {
  const practicedPhrases = getRecentPhrases(7)
  const [messages, setMessages]       = useState([
    { role: 'assistant', content: getStarter() },
  ])
  const [input, setInput]             = useState('')
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)
  const [feedback, setFeedback]       = useState(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)
  const { isRecording, toggle: toggleVoice, supported: voiceSupported } = useVoiceInput(t => setInput(t))

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, showFeedback])

  const userMessages = messages.filter(m => m.role === 'user')
  const canGetFeedback = userMessages.length >= 2

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const { reply } = await sendChatMessage(newMessages, practicedPhrases)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      if (e.message === 'NOT_CONFIGURED') {
        setError('AI is not set up yet. See ⚙️ Settings.')
      } else if (e.message === 'UNAUTHORIZED') {
        setError('Token error. Try redeploying the app.')
      } else {
        setError('Could not reach AI. Check your connection.')
      }
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  async function handleFeedback() {
    setShowFeedback(true)
    setFeedbackLoading(true)
    try {
      const result = await getChatFeedback(messages)
      setFeedback(result)
    } catch {
      setFeedback(null)
    } finally {
      setFeedbackLoading(false)
    }
  }

  return (
    <div className="chat-session">
      <div className="chat-topbar">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="chat-title">
          <span>💬</span> Chat en español
        </div>
        {canGetFeedback && !showFeedback && (
          <button className="btn-feedback-chat" onClick={handleFeedback}>
            Get feedback
          </button>
        )}
      </div>

      {practicedPhrases.length > 0 && (
        <div className="chat-phrases-bar">
          <span className="chat-phrases-label">Practicing:</span>
          {practicedPhrases.slice(0, 4).map(p => (
            <span key={p} className="chat-phrase-chip">{p}</span>
          ))}
        </div>
      )}

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
            {m.role === 'assistant' && <div className="bubble-avatar">🤖</div>}
            <div className="bubble-text">{m.content}</div>
          </div>
        ))}

        {loading && (
          <div className="chat-bubble bubble-ai">
            <div className="bubble-avatar">🤖</div>
            <div className="bubble-typing">
              <span /><span /><span />
            </div>
          </div>
        )}

        {error && <p className="chat-error">{error}</p>}

        {showFeedback && (
          <div className="chat-feedback-section">
            <div className="chat-feedback-label">📝 Conversation Feedback</div>
            <FeedbackView feedback={feedback} loading={feedbackLoading} error={null} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {!showFeedback && (
        <div className="chat-input-row">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder={isRecording ? '🎙 Escuchando...' : 'Escribe en español...'}
            value={input}
            rows={2}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            disabled={loading}
            maxLength={500}
          />
          {voiceSupported && (
            <button
              className={`btn-mic ${isRecording ? 'btn-mic-active' : ''}`}
              onClick={toggleVoice}
              disabled={loading}
              type="button"
              title={isRecording ? 'Stop recording' : 'Speak'}
            >
              🎙
            </button>
          )}
          <button
            className="btn-send"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            type="button"
          >
            ➤
          </button>
        </div>
      )}

      {showFeedback && !feedbackLoading && (
        <button className="btn-primary" style={{ margin: '0 16px 24px' }} onClick={onBack}>
          Back to Dashboard
        </button>
      )}

      {!showFeedback && canGetFeedback && (
        <p className="chat-hint">Tip: Send a few more messages, then tap "Get feedback" to see corrections.</p>
      )}
    </div>
  )
}
