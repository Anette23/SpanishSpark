import { useState, useRef, useEffect } from 'react'

export default function SpeechRecorder({ onTranscript, disabled }) {
  const [isRecording, setIsRecording]   = useState(false)
  const [transcript, setTranscript]     = useState('')
  const [interimText, setInterimText]   = useState('')
  const [supported, setSupported]       = useState(null) // null = not yet checked
  const [error, setError]               = useState(null)
  const recognitionRef  = useRef(null)
  const finalRef        = useRef('')
  const shouldRecordRef = useRef(false) // tracks intended state to auto-restart

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setSupported(false); return }
    setSupported(true)

    const rec = new SR()
    rec.continuous     = false  // avoids Chrome Android repeating words across audio chunks
    rec.interimResults = true
    rec.lang = 'en-US'

    rec.onresult = (e) => {
      let newFinal = ''
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) newFinal += e.results[i][0].transcript + ' '
        else interim = e.results[i][0].transcript
      }
      if (newFinal) finalRef.current += newFinal
      setTranscript(finalRef.current)
      setInterimText(interim)
      onTranscript(finalRef.current + interim)
    }

    rec.onerror = (e) => {
      if (e.error === 'not-allowed') {
        setError('Microphone blocked. Click the 🔒 icon in your browser address bar → Site settings → Microphone → Allow.')
        shouldRecordRef.current = false
        setIsRecording(false)
      } else if (e.error === 'aborted') {
        // intentional stop, do nothing
      } else {
        // transient error — don't show message, let onend handle restart
      }
    }

    rec.onend = () => {
      setInterimText('')
      if (shouldRecordRef.current) {
        // Chrome stopped due to silence — restart automatically
        try { rec.start() } catch {}
      } else {
        setIsRecording(false)
      }
    }

    recognitionRef.current = rec
    return () => { shouldRecordRef.current = false; rec.abort() }
  }, [])

  // Stop recording automatically when TTS starts playing
  useEffect(() => {
    if (disabled && isRecording) {
      shouldRecordRef.current = false
      try { recognitionRef.current?.stop() } catch {}
    }
  }, [disabled])

  function toggleRecording() {
    const rec = recognitionRef.current
    if (!rec) return
    setError(null)
    if (isRecording) {
      shouldRecordRef.current = false
      rec.stop()
    } else {
      finalRef.current = ''
      setTranscript('')
      setInterimText('')
      onTranscript('')
      try {
        shouldRecordRef.current = true
        rec.start()
        setIsRecording(true)
      } catch {
        shouldRecordRef.current = false
        setError('Could not start recording. Try again.')
      }
    }
  }

  if (supported === false) return null // browser doesn't support — silent fallback to text area

  return (
    <div className="speech-recorder">
      <button
        className={`btn-record ${isRecording ? 'btn-recording' : ''}`}
        onClick={toggleRecording}
        disabled={disabled}
        type="button"
      >
        {isRecording ? '⏹ Stop recording' : '🎙 Record my voice'}
      </button>

      {isRecording && (
        <div className="recording-indicator">
          <span className="rec-dot" /> Listening...
        </div>
      )}

      {error && <p className="rec-error">{error}</p>}

      {(transcript || interimText) && (
        <div className="transcript-box">
          <div className="transcript-label">Live transcript</div>
          <p className="transcript-text">
            {transcript}
            {interimText && <span className="interim">{interimText}</span>}
          </p>
        </div>
      )}
    </div>
  )
}
