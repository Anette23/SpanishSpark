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
    a.download = `spanishspark-backup-${new Date().toISOString().slice(0, 10)}.json`
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
          setImportStatus('✓ Dáta obnovené! Načítavam...')
          setTimeout(() => window.location.reload(), 1200)
        } else {
          setImportStatus('Neplatný záložný súbor.')
          setTimeout(() => setImportStatus(''), 3000)
        }
      } catch {
        setImportStatus('Súbor sa nepodarilo prečítať.')
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
      if (!('Notification' in window)) { setNotifStatus('Notifikácie nie sú v tomto prehliadači podporované.'); return }
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') { setNotifStatus('Prístup zamietnutý. Povoľ notifikácie v nastaveniach prehliadača.'); return }
    }
    const next = { ...notif, enabled: !notif.enabled }
    setNotif(next)
    saveNotifSettings(next)
    setNotifStatus(next.enabled ? 'Pripomienky zapnuté!' : 'Pripomienky vypnuté.')
    setTimeout(() => setNotifStatus(''), 3000)
  }

  function handleNotifHour(e) {
    const next = { ...notif, hour: Number(e.target.value) }
    setNotif(next)
    saveNotifSettings(next)
  }

  return (
    <div className="task-session">
      <button className="btn-back" onClick={onBack}>← Späť</button>
      <div className="task-header accent-purple">
        <span className="task-icon">⚙️</span>
        <div>
          <h2>Nastavenia</h2>
          <p className="task-subtitle">Dáta a konfigurácia</p>
        </div>
      </div>

      <div className="prompt-box">
        <div className="prompt-label">Tvoje dáta</div>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text)', marginBottom: '12px' }}>
          Všetok tvoj pokrok je uložený lokálne v tomto prehliadači. Kedykoľvek si môžeš exportovať zálohu.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={handleExport} style={{ flex: 1 }}>
            {exportDone ? '✓ Stiahnuté!' : '📥 Exportovať dáta (JSON)'}
          </button>
          <button className="btn-secondary" onClick={() => importRef.current?.click()} style={{ flex: 1 }}>
            📤 Importovať zálohu
          </button>
          <input ref={importRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
        </div>
        {importStatus && <p style={{ fontSize: 13, color: 'var(--green)', marginTop: 8, fontWeight: 600 }}>{importStatus}</p>}
      </div>

      <div className="prompt-box">
        <div className="prompt-label">Ako funguje AI spätná väzba</div>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text)' }}>
          AI spätná väzba beží bezpečne na serveri — tvoj API kľúč sa nikdy neukladá v prehliadači.
          Pre aktiváciu pridaj svoj Anthropic API kľúč ako premennú prostredia vo Vercel projekte.
        </p>
      </div>

      <div className="prompt-box">
        <div className="prompt-label">Kroky nastavenia</div>
        <ol className="settings-steps">
          <li>Choď na <strong>vercel.com</strong> → tvoj projekt → <strong>Settings → Environment Variables</strong></li>
          <li>Pridaj premennú: <strong>ANTHROPIC_API_KEY</strong> = tvoj kľúč</li>
          <li>Získaj kľúč na <strong>console.anthropic.com</strong> → API Keys</li>
          <li>Znovu nasaď projekt</li>
        </ol>
      </div>

      <div className="prompt-box">
        <div className="prompt-label">Denná pripomienka</div>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text)', marginBottom: 12 }}>
          Dostávaj každý deň upozornenie v prehliadači, aby si si pripomenula cvičenie.
        </p>
        <div className="notif-row">
          <button
            className={`notif-toggle ${notif.enabled ? 'notif-toggle-on' : ''}`}
            onClick={handleNotifToggle}
          >
            {notif.enabled ? '🔔 Zapnuté' : '🔕 Vypnuté'}
          </button>
          {notif.enabled && (
            <div className="notif-hour-row">
              <label style={{ fontSize: 14, color: 'var(--text)' }}>Pripomenúť o</label>
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
          Poznámka: Notifikácie fungujú len keď je aplikácia otvorená v prehliadači. Pre spoľahlivé pripomienky použi PWA nainštalovanú na domovskej obrazovke.
        </p>
      </div>

      <div className="prompt-box">
        <div className="prompt-label" style={{ color: 'var(--danger, #e53e3e)' }}>Nebezpečná zóna</div>
        {!resetConfirm ? (
          <button className="btn-danger" onClick={() => setResetConfirm(true)}>
            Resetovať všetok pokrok
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ fontSize: '14px', color: 'var(--danger, #e53e3e)', margin: 0 }}>
              Tým sa vymažú všetky tvoje série, XP a história. Toto nie je možné vrátiť späť.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-danger" onClick={handleReset}>Áno, resetovať všetko</button>
              <button className="btn-secondary" onClick={() => setResetConfirm(false)}>Zrušiť</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
