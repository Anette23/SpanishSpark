import { useState, useRef } from 'react'
import { loadState } from '../habitStore'

function loadNotifSettings() {
  try { return JSON.parse(localStorage.getItem('notif_settings') || '{"enabled":false,"hour":9}') } catch { return { enabled: false, hour: 9 } }
}
function saveNotifSettings(s) { localStorage.setItem('notif_settings', JSON.stringify(s)) }

export default function Settings({ onBack }) {
  const [exportDone, setExportDone] = useState(false)
  const [importStatus, setImportStatus] = useState('')
  const [resetConfirm, setResetConfirm] = useState(false)
  const [notif, setNotif] = useState(loadNotifSettings)
  const [notifStatus, setNotifStatus] = useState('')
  const importRef = useRef(null)

  function handleExport() {
    const state = loadState()
    const synPerf = (() => { try { return JSON.parse(localStorage.getItem('syn_perf') || '{}') } catch { return {} } })()
    const data = { exportedAt: new Date().toISOString(), state, synPerf }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `englishspark-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setExportDone(true)
    setTimeout(() => setExportDone(false), 3000)
  }

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (data.state) {
          localStorage.setItem('english_habit_v1', JSON.stringify(data.state))
          if (data.synPerf) localStorage.setItem('syn_perf', JSON.stringify(data.synPerf))
          setImportStatus('✓ Data restored! Reloading...')
          setTimeout(() => window.location.reload(), 1200)
        } else {
          setImportStatus('Invalid backup file.')
          setTimeout(() => setImportStatus(''), 3000)
        }
      } catch {
        setImportStatus('Could not read file.')
        setTimeout(() => setImportStatus(''), 3000)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleReset() {
    localStorage.removeItem('english_habit_v1')
    localStorage.removeItem('syn_perf')
    window.location.reload()
  }

  async function handleNotifToggle() {
    if (!notif.enabled) {
      if (!('Notification' in window)) { setNotifStatus('Notifications not supported in this browser.'); return }
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') { setNotifStatus('Permission denied. Allow notifications in browser settings.'); return }
    }
    const next = { ...notif, enabled: !notif.enabled }
    setNotif(next)
    saveNotifSettings(next)
    setNotifStatus(next.enabled ? 'Reminders enabled!' : 'Reminders disabled.')
    setTimeout(() => setNotifStatus(''), 3000)
  }

  function handleNotifHour(e) {
    const next = { ...notif, hour: Number(e.target.value) }
    setNotif(next)
    saveNotifSettings(next)
  }

  return (
    <div className="task-session">
      <button className="btn-back" onClick={onBack}>← Back</button>
      <div className="task-header accent-purple">
        <span className="task-icon">⚙️</span>
        <div>
          <h2>Settings</h2>
          <p className="task-subtitle">Data & configuration</p>
        </div>
      </div>

      <div className="prompt-box">
        <div className="prompt-label">Your data</div>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text)', marginBottom: '12px' }}>
          All your progress is stored locally in this browser. Export a backup at any time.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={handleExport} style={{ flex: 1 }}>
            {exportDone ? '✓ Downloaded!' : '📥 Export data (JSON)'}
          </button>
          <button className="btn-secondary" onClick={() => importRef.current?.click()} style={{ flex: 1 }}>
            📤 Import backup
          </button>
          <input ref={importRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
        </div>
        {importStatus && <p style={{ fontSize: 13, color: 'var(--green)', marginTop: 8, fontWeight: 600 }}>{importStatus}</p>}
      </div>

      <div className="prompt-box">
        <div className="prompt-label">How AI feedback works</div>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text)' }}>
          AI feedback runs securely on the server — your API key is never stored in the browser.
          To enable it, add your Anthropic API key as an environment variable in your Vercel project.
        </p>
      </div>

      <div className="prompt-box">
        <div className="prompt-label">Setup steps</div>
        <ol className="settings-steps">
          <li>Go to <strong>vercel.com</strong> → your project → <strong>Settings → Environment Variables</strong></li>
          <li>Add variable: <strong>ANTHROPIC_API_KEY</strong> = your key</li>
          <li>Get a key at <strong>console.anthropic.com</strong> → API Keys</li>
          <li>Redeploy the project</li>
        </ol>
      </div>

      <div className="prompt-box">
        <div className="prompt-label">Daily reminder</div>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text)', marginBottom: 12 }}>
          Get a browser notification each day to remind you to practice.
        </p>
        <div className="notif-row">
          <button
            className={`notif-toggle ${notif.enabled ? 'notif-toggle-on' : ''}`}
            onClick={handleNotifToggle}
          >
            {notif.enabled ? '🔔 Enabled' : '🔕 Disabled'}
          </button>
          {notif.enabled && (
            <div className="notif-hour-row">
              <label style={{ fontSize: 14, color: 'var(--text)' }}>Remind me at</label>
              <select
                className="notif-hour-select"
                value={notif.hour}
                onChange={handleNotifHour}
              >
                {Array.from({ length: 24 }, (_, h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        {notifStatus && <p style={{ fontSize: 13, color: 'var(--green)', marginTop: 8, fontWeight: 600 }}>{notifStatus}</p>}
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
          Note: Notifications only work when the app is open in the browser. For reliable reminders, use the PWA installed on your home screen.
        </p>
      </div>

      <div className="prompt-box">
        <div className="prompt-label" style={{ color: 'var(--danger, #e53e3e)' }}>Danger zone</div>
        {!resetConfirm ? (
          <button className="btn-danger" onClick={() => setResetConfirm(true)}>
            Reset all progress
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ fontSize: '14px', color: 'var(--danger, #e53e3e)', margin: 0 }}>
              This will delete all your streaks, XP, and history. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-danger" onClick={handleReset}>Yes, reset everything</button>
              <button className="btn-secondary" onClick={() => setResetConfirm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
