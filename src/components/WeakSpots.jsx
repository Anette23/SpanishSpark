import { useState } from 'react'
import { getWeakSpots, clearWeakSpots } from '../weakSpotsStore'

const CATEGORY_COLORS = {
  'Articles':       '#3b82f6',
  'Tenses':         '#8b5cf6',
  'Prepositions':   '#f97316',
  'Word order':     '#14b8a6',
  'Vocabulary':     '#10b981',
  'Conditionals':   '#6366f1',
  'Passive voice':  '#ec4899',
  'Modal verbs':    '#f59e0b',
  'Reported speech':'#64748b',
  'Spelling':       '#ef4444',
}

export default function WeakSpots({ onBack }) {
  const [spots, setSpots] = useState(() => getWeakSpots())
  const [confirmClear, setConfirmClear] = useState(false)

  const max = spots.length > 0 ? spots[0].count : 1

  function handleClear() {
    clearWeakSpots()
    setSpots([])
    setConfirmClear(false)
  }

  return (
    <div className="task-session">
      <button className="btn-back" onClick={onBack}>← Back</button>
      <div className="task-header accent-purple">
        <span className="task-icon">📊</span>
        <div>
          <h2>Weak Spots</h2>
          <p className="task-subtitle">Based on your AI feedback history</p>
        </div>
      </div>

      {spots.length === 0 ? (
        <div className="prompt-box" style={{ textAlign: 'center', color: 'var(--muted)' }}>
          <p style={{ fontSize: 22, marginBottom: 8 }}>🎉</p>
          <p style={{ fontWeight: 700 }}>No data yet</p>
          <p style={{ fontSize: 13, marginTop: 6 }}>
            Complete writing or speaking exercises and get AI feedback — your common error patterns will appear here automatically.
          </p>
        </div>
      ) : (
        <>
          <div className="prompt-box" style={{ padding: '10px 16px' }}>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>
              These categories appeared most often in your AI feedback. Focus on them to improve fastest.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {spots.map(({ category, count }) => {
              const color = CATEGORY_COLORS[category] || 'var(--purple)'
              const pct = Math.round((count / max) * 100)
              return (
                <div key={category} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px', boxShadow: 'var(--shadow)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, color: 'var(--text)' }}>{category}</span>
                    <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>
                      {count} {count === 1 ? 'time' : 'times'}
                    </span>
                  </div>
                  <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ marginTop: 8 }}>
            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
              >
                Clear history
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>Are you sure?</span>
                <button className="btn-danger" style={{ fontSize: 13, padding: '6px 14px' }} onClick={handleClear}>Yes, clear</button>
                <button className="btn-secondary" style={{ fontSize: 13, padding: '6px 14px' }} onClick={() => setConfirmClear(false)}>Cancel</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
