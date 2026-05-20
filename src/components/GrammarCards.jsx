import { useState } from 'react'
import { GRAMMAR_CARDS } from '../grammarCards'

const LEVELS = ['A1', 'A2']

export default function GrammarCards({ onBack }) {
  const [level, setLevel] = useState('A1')
  const [idx, setIdx] = useState(0)
  const [expanded, setExpanded] = useState(false)

  const cards = GRAMMAR_CARDS.filter(c => c.level === level)
  const card = cards[idx]

  function handleLevel(l) {
    setLevel(l)
    setIdx(0)
    setExpanded(false)
  }

  function handleNext() {
    setIdx(i => (i + 1) % cards.length)
    setExpanded(false)
  }

  function handlePrev() {
    setIdx(i => (i - 1 + cards.length) % cards.length)
    setExpanded(false)
  }

  return (
    <div className="task-session">
      <button className="btn-back" onClick={onBack}>← Späť</button>

      <div className="task-header accent-green">
        <span className="task-icon">📋</span>
        <div>
          <h2>Gramatické karty</h2>
          <p className="task-subtitle">Kľúčové pravidlá — klepni pre rozbalenie</p>
        </div>
      </div>

      <div className="level-toggle">
        {LEVELS.map(l => (
          <button
            key={l}
            className={`level-btn ${level === l ? 'level-btn-active' : ''}`}
            onClick={() => handleLevel(l)}
          >
            {l}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)', justifyContent: 'center' }}>
        {idx + 1} / {cards.length} — {card.category}
      </div>

      {/* Card */}
      <div
        style={{
          background: 'var(--card)',
          border: '1.5px solid var(--border)',
          borderRadius: 16,
          padding: '20px 20px 16px',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(e => !e)}
      >
        <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--text)', marginBottom: 12 }}>
          {card.title}
        </div>

        {/* Rule box */}
        <div style={{ background: 'var(--bg)', borderRadius: 10, padding: '12px 14px', marginBottom: 12 }}>
          {card.rule.split('\n').map((line, i) => (
            <p key={i} style={{ margin: i === 0 ? 0 : '4px 0 0', fontSize: 14, color: 'var(--text)', fontFamily: 'monospace', lineHeight: 1.5 }}>
              {line}
            </p>
          ))}
        </div>

        {/* Examples */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(expanded ? card.examples : card.examples.slice(0, 2)).map((ex, i) => (
            <div key={i} style={{ borderLeft: '3px solid var(--green)', paddingLeft: 10 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{ex.es}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{ex.sk}
                {ex.note && <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--purple)', fontStyle: 'italic' }}>— {ex.note}</span>}
              </div>
            </div>
          ))}
          {!expanded && card.examples.length > 2 && (
            <p style={{ fontSize: 13, color: 'var(--purple)', margin: 0, cursor: 'pointer' }}>
              + {card.examples.length - 2} ďalšie príklady — klepni pre rozbalenie
            </p>
          )}
        </div>

        {/* Tip */}
        {expanded && card.tip && (
          <div style={{ marginTop: 14, background: '#fef3c7', borderRadius: 10, padding: '10px 14px' }}>
            <span style={{ fontSize: 13, color: '#92400e', fontWeight: 600 }}>⭐ Tip: </span>
            <span style={{ fontSize: 13, color: '#78350f' }}>{card.tip}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn-secondary" onClick={handlePrev} style={{ flex: 1 }}>
          ← Predch.
        </button>
        <button className="btn-primary" onClick={handleNext} style={{ flex: 1 }}>
          Ďalej →
        </button>
      </div>

      {/* Overview list */}
      <div style={{ marginTop: 4 }}>
        <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, marginBottom: 8 }}>Všetky karty {level}:</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {cards.map((c, i) => (
            <button
              key={c.id}
              onClick={() => { setIdx(i); setExpanded(false) }}
              style={{
                background: i === idx ? 'var(--green-light)' : 'var(--card)',
                border: i === idx ? '1.5px solid var(--green)' : '1px solid var(--border)',
                borderRadius: 10,
                padding: '8px 14px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: 13,
                color: 'var(--text)',
                fontWeight: i === idx ? 700 : 400,
              }}
            >
              {i + 1}. {c.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}