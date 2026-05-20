import { useState } from 'react'
import { DIALOG_EXERCISES } from '../dialogExercises'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function checkAnswer(input, expected) {
  const norm = input.toLowerCase().replace(/[¿¡.,!?]/g, '').trim()
  return expected.some(e => norm.includes(e.toLowerCase()))
}

export default function DialogExercise({ onBack }) {
  const [dialogId, setDialogId] = useState(null)
  const [turnIdx, setTurnIdx] = useState(0)
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const [hintVisible, setHintVisible] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [history, setHistory] = useState([]) // {role, text, userInput, isCorrect}

  const dialogs = DIALOG_EXERCISES
  const dialog = dialogs.find(d => d.id === dialogId)

  function startDialog(id) {
    setDialogId(id)
    setTurnIdx(0)
    setInput('')
    setChecked(false)
    setHintVisible(false)
    setScore(0)
    setFinished(false)
    setHistory([])
  }

  function handleCheck() {
    if (!input.trim()) return
    const turn = dialog.turns[turnIdx]
    const ok = checkAnswer(input, turn.expected)
    if (ok) setScore(s => s + 1)
    setChecked(true)
    setHistory(h => [...h, { role: 'user', text: input, isCorrect: ok }])
  }

  function handleNext() {
    const turns = dialog.turns
    // Advance past any consecutive AI turns
    let next = turnIdx + 1
    while (next < turns.length && turns[next].role === 'ai') next++
    if (next >= turns.length) {
      setFinished(true)
    } else {
      setTurnIdx(next)
      setInput('')
      setChecked(false)
      setHintVisible(false)
    }
  }

  // Picker
  if (!dialogId) {
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="task-header" style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
          <span className="task-icon">🗣️</span>
          <div>
            <h2>Dialóg</h2>
            <p className="task-subtitle">Scripted conversations</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {dialogs.map(d => (
            <button
              key={d.id}
              onClick={() => startDialog(d.id)}
              style={{
                background: 'var(--card)',
                border: '1.5px solid var(--border)',
                borderRadius: 14,
                padding: '16px 18px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <span style={{ fontSize: 26 }}>🗣️</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{d.title}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{d.level} · {d.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (finished) {
    const userTurns = dialog.turns.filter(t => t.role === 'user').length
    return (
      <div className="task-session">
        <button className="btn-back" onClick={() => setDialogId(null)}>← Back</button>
        <div className="session-complete">
          <div className="complete-icon">🗣️</div>
          <h2>¡Conversación completa!</h2>
          <div className="reading-score-card" style={{ width: '100%' }}>
            <div className="reading-score-number">{score}/{userTurns}</div>
            <div className="reading-score-label">correct responses</div>
          </div>
          {score === userTurns && (
            <p style={{ color: 'var(--green)', fontWeight: 700 }}>⭐ Perfect conversation!</p>
          )}
          <button className="btn-primary" onClick={() => startDialog(dialogId)}>Try again</button>
          <button className="btn-secondary" onClick={() => setDialogId(null)}>Choose another</button>
        </div>
      </div>
    )
  }

  const turns = dialog.turns
  // Collect all turns up to current, including consecutive AI turns before the current user turn
  const visibleTurns = []
  let i = 0
  while (i <= turnIdx) {
    visibleTurns.push(turns[i])
    i++
  }
  // Also show the AI turn right after if we just checked
  if (checked && turnIdx + 1 < turns.length && turns[turnIdx + 1].role === 'ai') {
    visibleTurns.push(turns[turnIdx + 1])
  }

  const currentTurn = turns[turnIdx]
  const isCorrect = checked && checkAnswer(input, currentTurn.expected)

  return (
    <div className="task-session">
      <button className="btn-back" onClick={() => setDialogId(null)}>← Back</button>
      <div className="task-header" style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
        <span className="task-icon">🗣️</span>
        <div>
          <h2>{dialog.title}</h2>
          <p className="task-subtitle">{dialog.level} · {dialog.description}</p>
        </div>
      </div>

      {/* Conversation history */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {visibleTurns.map((turn, idx) => {
          if (turn.role === 'ai') {
            return (
              <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 24, flexShrink: 0 }}>🤖</div>
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '4px 14px 14px 14px', padding: '10px 14px', maxWidth: '85%' }}>
                  <div style={{ fontSize: 15, color: 'var(--text)', fontWeight: 600 }}>{turn.text}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{turn.sk}</div>
                </div>
              </div>
            )
          }
          if (turn === currentTurn && !checked) return null
          // Show past user turn or current checked turn
          const userHistory = history.find((h, hi) => {
            const userTurns = turns.slice(0, idx + 1).filter(t => t.role === 'user')
            return h.role === 'user' && userTurns.length > 0
          })
          const text = turn === currentTurn ? input : (history[history.length - 1]?.text || '')
          const ok = turn === currentTurn ? isCorrect : history.find(h => h.text === text)?.isCorrect
          if (!text) return null
          return (
            <div key={idx} style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'flex-start' }}>
              <div style={{
                background: ok ? 'var(--green-light)' : '#fef2f2',
                border: ok ? '1.5px solid var(--green)' : '1.5px solid #f87171',
                borderRadius: '14px 4px 14px 14px',
                padding: '10px 14px',
                maxWidth: '85%',
              }}>
                <div style={{ fontSize: 15, color: 'var(--text)' }}>{text}</div>
                {!ok && (
                  <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>
                    ✓ {turn.expected[0]}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Input area */}
      {!checked ? (
        <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>
            Your turn: <strong>{currentTurn.prompt}</strong>
          </div>
          {hintVisible ? (
            <p style={{ fontSize: 13, color: '#065f46', background: '#d1fae5', borderRadius: 8, padding: '6px 12px', margin: '0 0 10px' }}>
              💡 {currentTurn.hint}
            </p>
          ) : (
            <button
              onClick={() => setHintVisible(true)}
              style={{ background: 'none', border: '1px dashed var(--muted)', borderRadius: 8, padding: '3px 10px', fontSize: 12, color: 'var(--muted)', cursor: 'pointer', marginBottom: 10 }}
            >
              💡 Show hint
            </button>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="vocab-search"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && input.trim()) handleCheck() }}
              placeholder="Escribe tu respuesta..."
              autoFocus
              style={{ flex: 1 }}
            />
            <button className="btn-primary" onClick={handleCheck} disabled={!input.trim()} style={{ width: 'auto', padding: '10px 18px' }}>
              ➤
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            background: isCorrect ? 'var(--green-light)' : '#fef2f2',
            border: isCorrect ? '1.5px solid var(--green)' : '1.5px solid #f87171',
            borderRadius: 12,
            padding: '12px 14px',
          }}>
            <p style={{ fontWeight: 700, color: isCorrect ? 'var(--green)' : '#dc2626', margin: '0 0 4px' }}>
              {isCorrect ? '✓ ¡Muy bien!' : '✗ Inténtalo así:'}
            </p>
            {!isCorrect && (
              <p style={{ fontSize: 14, color: '#7f1d1d', margin: '0 0 4px' }}>{currentTurn.expected[0]}</p>
            )}
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>💡 {currentTurn.hint}</p>
          </div>
          <button className="btn-primary" onClick={handleNext}>
            {turnIdx + 2 < turns.length ? 'Continuar →' : 'Terminar ✓'}
          </button>
        </div>
      )}
    </div>
  )
}