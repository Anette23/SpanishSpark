import { useState, useEffect, useRef } from 'react'
import { formatDuration } from '../habitStore'

export default function Timer({ duration, onComplete, taskType }) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            setDone(true)
            onComplete()
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  const progress = ((duration - timeLeft) / duration) * 100
  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const color = taskType === 'writing' ? '#6366f1' : '#10b981'
  const bgColor = taskType === 'writing' ? '#e0e7ff' : '#d1fae5'

  return (
    <div className="timer-container">
      <div className="timer-ring-wrap">
        <svg width="128" height="128" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r="54" fill="none" stroke={bgColor} strokeWidth="10" />
          <circle
            cx="64" cy="64" r="54"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 64 64)"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="timer-text">
          {done ? <span className="timer-done">✓</span> : formatDuration(timeLeft)}
        </div>
      </div>

      {!done && (
        <button
          className={`btn-start ${running ? 'btn-pause' : ''}`}
          onClick={() => setRunning(r => !r)}
        >
          {running ? '⏸ Pause' : timeLeft === duration ? '▶ Start' : '▶ Resume'}
        </button>
      )}
      {done && <p className="timer-complete-msg">Time's up! Great job! 🎉</p>}
    </div>
  )
}
