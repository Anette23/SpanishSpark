import { useState } from 'react'

export default function HistoryView({ state, onBack }) {
  const sorted = [...state.history].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="task-session">
      <button className="btn-back" onClick={onBack}>← Back</button>

      <div className="task-header accent-purple">
        <span className="task-icon">📚</span>
        <div>
          <h2>History</h2>
          <p className="task-subtitle">{state.totalDays} days completed</p>
        </div>
      </div>

      <StreakCalendar history={state.history} />

      {sorted.length === 0 && (
        <div className="prompt-box" style={{ textAlign: 'center', color: 'var(--muted)' }}>
          No sessions yet — complete your first one today!
        </div>
      )}

      <div className="history-list">
        {sorted.map(entry => (
          <HistoryEntry key={entry.date} entry={entry} />
        ))}
      </div>
    </div>
  )
}

function StreakCalendar({ history }) {
  const days = 30
  const cells = []
  const historyMap = {}
  history.forEach(e => { historyMap[e.date] = e })

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const entry = historyMap[key]
    const both  = entry?.writingDone && entry?.speakingDone
    const one   = entry?.writingDone || entry?.speakingDone
    const bonus  = !one && (entry?.bonusDone?.length > 0)
    const frozen = !one && !bonus && entry?.frozen
    cells.push({ key, both, one, bonus, frozen, day: d.getDate() })
  }

  return (
    <div className="calendar-section">
      <div className="calendar-label">Last 30 days</div>
      <div className="calendar-grid">
        {cells.map(c => (
          <div
            key={c.key}
            className={`cal-cell ${c.both ? 'cal-full' : c.one ? 'cal-half' : c.bonus ? 'cal-bonus' : c.frozen ? 'cal-frozen' : 'cal-empty'}`}
            title={c.key}
          >
            {c.day}
          </div>
        ))}
      </div>
      <div className="calendar-legend">
        <span className="cal-full cal-legend-dot" /> Both done
        <span className="cal-half cal-legend-dot" style={{marginLeft:12}} /> One done
        <span className="cal-bonus cal-legend-dot" style={{marginLeft:12}} /> Bonus only
        <span className="cal-frozen cal-legend-dot" style={{marginLeft:12}} /> Frozen
        <span className="cal-empty cal-legend-dot" style={{marginLeft:12}} /> Missed
      </div>
    </div>
  )
}

const BONUS_ICONS = { synonyms: '🔤', prepositions: '📝', idioms: '💬', shadowing: '🎧' }

function HistoryEntry({ entry }) {
  const [open, setOpen] = useState(false)
  const hasDetails = entry.writingText || entry.speakingText
  const bonusDone  = entry.bonusDone || []

  return (
    <div className="history-entry">
      <button className="history-entry-header" onClick={() => hasDetails && setOpen(o => !o)}>
        <div className="history-date">{formatDate(entry.date)}</div>
        <div className="history-badges">
          <span className={`history-badge ${entry.writingDone  ? 'badge-purple' : 'badge-empty'}`}>✍️</span>
          <span className={`history-badge ${entry.speakingDone ? 'badge-green'  : 'badge-empty'}`}>🎤</span>
          {bonusDone.map(type => (
            <span key={type} className="history-badge badge-teal" title={type}>
              {BONUS_ICONS[type] || '⭐'}
            </span>
          ))}
        </div>
        <div className="history-xp">+{entry.xpEarned ?? 0} XP</div>
        {hasDetails && <span className="history-toggle">{open ? '▲' : '▼'}</span>}
      </button>

      {open && hasDetails && (
        <div className="history-details">
          {entry.writingText && (
            <SessionDetail
              icon="✍️"
              label="Writing"
              prompt={entry.writingPrompt}
              text={entry.writingText}
              feedback={entry.writingFeedback}
              color="purple"
            />
          )}
          {entry.speakingText && (
            <SessionDetail
              icon="🎤"
              label="Speaking"
              prompt={entry.speakingPrompt}
              text={entry.speakingText}
              feedback={entry.speakingFeedback}
              color="green"
            />
          )}
        </div>
      )}
    </div>
  )
}

function SessionDetail({ icon, label, prompt, text, feedback, color }) {
  return (
    <div className={`history-session history-session-${color}`}>
      <div className="history-session-label">{icon} {label}</div>
      {prompt && <div className="history-session-prompt">"{prompt}"</div>}
      <p className="history-session-text">{text}</p>
      {feedback && <FeedbackMini feedback={feedback} />}
    </div>
  )
}

function FeedbackMini({ feedback }) {
  return (
    <div className="feedback-mini">
      {feedback.corrections?.length > 0 && (
        <div className="mini-row">
          <span className="mini-label corrections">✏️ Corrections:</span>
          <span>{feedback.corrections.join(' • ')}</span>
        </div>
      )}
      {feedback.suggestions?.length > 0 && (
        <div className="mini-row">
          <span className="mini-label suggestions">💡 Suggestions:</span>
          <span>{feedback.suggestions.join(' • ')}</span>
        </div>
      )}
      {feedback.praise && (
        <div className="mini-praise">⭐ {feedback.praise}</div>
      )}
    </div>
  )
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })
}
