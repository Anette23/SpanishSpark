import { getVocabulary } from '../vocabularyStore'
import { getWeakSpots } from '../weakSpotsStore'

function buildHeatmap(history) {
  const histMap = {}
  history.forEach(e => {
    histMap[e.date] = (e.writingDone ? 1 : 0) + (e.speakingDone ? 1 : 0)
  })
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().slice(0, 10)

  const start = new Date(today)
  start.setDate(today.getDate() - 90)
  const dow = start.getDay()
  start.setDate(start.getDate() - (dow === 0 ? 6 : dow - 1))

  const cells = []
  const d = new Date(start)
  while (d.toISOString().slice(0, 10) <= todayStr) {
    const ds = d.toISOString().slice(0, 10)
    cells.push({ date: ds, level: histMap[ds] ?? 0 })
    d.setDate(d.getDate() + 1)
  }
  while (cells.length % 7 !== 0) {
    d.setDate(d.getDate() + 1)
    cells.push({ date: d.toISOString().slice(0, 10), level: -1 })
  }
  return cells
}

// Returns the Monday of the week containing the given date string 'YYYY-MM-DD'
function getWeekStart(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDay() // 0=Sun, 1=Mon, ...
  const diff = (day === 0 ? -6 : 1 - day)
  d.setDate(d.getDate() + diff)
  return d.toISOString().slice(0, 10)
}

// Format a date string as short label: 'May 5'
function shortDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Build last 8 week buckets (Monday-based), newest last
function buildWeeks() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dayOfWeek = today.getDay()
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const thisMonday = new Date(today)
  thisMonday.setDate(today.getDate() + diff)

  const weeks = []
  for (let i = 7; i >= 0; i--) {
    const start = new Date(thisMonday)
    start.setDate(thisMonday.getDate() - i * 7)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    weeks.push({
      start: start.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10),
      xp: 0,
    })
  }
  return weeks
}

export default function StatsView({ state, onBack }) {
  const { streak, longestStreak, history = [] } = state || {}

  // --- Compute summary stats ---
  const totalSessions = history.filter(d => d.writingDone || d.speakingDone).length
  const writingSessions = history.filter(d => d.writingDone).length
  const speakingSessions = history.filter(d => d.speakingDone).length
  const totalDays = history.length || 1 // avoid divide-by-zero

  // --- XP chart ---
  const weeks = buildWeeks()
  history.forEach(entry => {
    const ws = getWeekStart(entry.date)
    const bucket = weeks.find(w => w.start === ws)
    if (bucket) bucket.xp += (entry.xpEarned || 0)
  })
  const maxXp = Math.max(...weeks.map(w => w.xp), 1)

  // --- Vocabulary ---
  const vocab = getVocabulary()
  const vocabCount = vocab.length

  // --- Weak spots ---
  const weakSpots = getWeakSpots().slice(0, 3)

  // --- Reading progress ---
  let readingCount = 0
  try {
    const rp = JSON.parse(localStorage.getItem('reading_progress') || '{}')
    readingCount = (rp.completed || []).length
  } catch {}

  // --- Styles ---
  const sectionStyle = {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '16px 18px',
    marginBottom: 16,
    boxShadow: 'var(--shadow)',
  }

  const labelStyle = {
    fontSize: 12,
    color: 'var(--muted)',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  }

  const bigNumStyle = {
    fontSize: 28,
    fontWeight: 700,
    color: 'var(--text)',
    lineHeight: 1.1,
  }

  const sectionTitleStyle = {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: 12,
  }

  const progressTrackStyle = {
    background: 'var(--border)',
    borderRadius: 6,
    height: 8,
    flex: 1,
    overflow: 'hidden',
  }

  return (
    <div className="task-session">
      <button className="btn-back" onClick={onBack}>← Back</button>

      <div className="task-header accent-purple" style={{ marginBottom: 20 }}>
        <span>📊</span>
        <span>Your Stats</span>
      </div>

      {/* Top summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Sessions', value: totalSessions },
          { label: 'Streak', value: `${streak ?? 0}🔥` },
          { label: 'Best streak', value: longestStreak ?? 0 },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '12px 10px',
              textAlign: 'center',
              boxShadow: 'var(--shadow)',
            }}
          >
            <div style={labelStyle}>{label}</div>
            <div style={bigNumStyle}>{value}</div>
          </div>
        ))}
      </div>

      {/* XP over time — weekly bar chart */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>XP over time</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
          {weeks.map((w, i) => {
            const barH = w.xp > 0 ? Math.max(4, Math.round((w.xp / maxXp) * 72)) : 4
            const isEmpty = w.xp === 0
            return (
              <div
                key={w.start}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
              >
                <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1 }}>
                  {isEmpty ? '' : w.xp}
                </div>
                <div
                  style={{
                    width: '100%',
                    height: barH,
                    background: isEmpty ? 'var(--border)' : 'var(--purple)',
                    borderRadius: 4,
                    transition: 'height 0.3s',
                    opacity: isEmpty ? 0.4 : 1,
                  }}
                />
                <div style={{ fontSize: 9, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.2 }}>
                  {i === 7 ? 'Now' : shortDate(w.start)}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Activity heatmap */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Activity — last 3 months</div>
        {(() => {
          const cells = buildHeatmap(history)
          const weeks = []
          for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
          return (
            <>
              <div style={{ display: 'flex', gap: 3, overflowX: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginRight: 2, paddingTop: 1 }}>
                  {['M','T','W','T','F','S','S'].map((d, i) => (
                    <div key={i} style={{ height: 13, fontSize: 8, color: 'var(--muted)', lineHeight: '13px' }}>{i % 2 === 0 ? d : ''}</div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {weeks.map((week, wi) => (
                    <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {week.map((cell, di) => (
                        <div
                          key={di}
                          title={cell.level >= 0 ? cell.date + (cell.level > 0 ? ` (${cell.level} task${cell.level > 1 ? 's' : ''})` : '') : ''}
                          style={{
                            width: 13, height: 13,
                            borderRadius: 2,
                            flexShrink: 0,
                            background: cell.level < 0
                              ? 'transparent'
                              : cell.level === 0
                              ? 'var(--border)'
                              : cell.level === 1
                              ? '#86efac'
                              : '#22c55e',
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>Less</span>
                {[0, 1, 2].map(l => (
                  <div key={l} style={{ width: 11, height: 11, borderRadius: 2, background: l === 0 ? 'var(--border)' : l === 1 ? '#86efac' : '#22c55e' }} />
                ))}
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>More</span>
              </div>
            </>
          )
        })()}
      </div>

      {/* Practice breakdown */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Practice breakdown</div>
        {[
          { label: 'Writing sessions', count: writingSessions, color: 'var(--green)' },
          { label: 'Speaking sessions', count: speakingSessions, color: '#3b82f6' },
        ].map(({ label, count, color }) => (
          <div key={label} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 14, color: 'var(--text)' }}>{label}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{count}</span>
            </div>
            <div style={progressTrackStyle}>
              <div
                style={{
                  width: `${Math.min(100, (count / totalDays) * 100)}%`,
                  height: '100%',
                  background: color,
                  borderRadius: 6,
                  minWidth: count > 0 ? 8 : 0,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Vocabulary saved */}
      <div style={{ ...sectionStyle, display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 28 }}>📝</span>
        <div>
          <div style={labelStyle}>Vocabulary saved</div>
          <div style={bigNumStyle}>{vocabCount} <span style={{ fontSize: 16, fontWeight: 400 }}>words</span></div>
        </div>
      </div>

      {/* Top weak spots */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Top weak spots</div>
        {weakSpots.length === 0 ? (
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>No data yet</div>
        ) : (
          weakSpots.map(({ category, count }, i) => (
            <div
              key={category}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: i < weakSpots.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: 'var(--purple)',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 14, color: 'var(--text)' }}>{category}</span>
              </div>
              <span style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--purple)',
                background: 'color-mix(in srgb, var(--purple) 12%, transparent)',
                padding: '2px 8px',
                borderRadius: 10,
              }}>
                {count}x
              </span>
            </div>
          ))
        )}
      </div>

      {/* Reading completed */}
      <div style={{ ...sectionStyle, display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 28 }}>📖</span>
        <div>
          <div style={labelStyle}>Reading completed</div>
          <div style={bigNumStyle}>{readingCount} <span style={{ fontSize: 16, fontWeight: 400 }}>articles</span></div>
        </div>
      </div>
    </div>
  )
}
