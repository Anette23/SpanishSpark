import { useState } from 'react'
import { VOCABULARY_PACKS } from '../vocabularyPacks'
import { saveWord } from '../vocabularyStore'

export default function VocabularyPacks({ onBack }) {
  const [packId, setPackId] = useState(null)
  const [saved, setSaved] = useState({})

  const pack = VOCABULARY_PACKS.find(p => p.id === packId)

  function handleSave(word) {
    saveWord({ word: word.es.split(' / ')[0].replace(/^(el |la |los |las |un |una )/, ''), translation: word.sk, context: word.es, source: 'pack' })
    setSaved(s => ({ ...s, [word.es]: true }))
  }

  if (!packId) {
    return (
      <div className="task-session">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="task-header accent-blue">
          <span className="task-icon">📦</span>
          <div>
            <h2>Vocabulary Packs</h2>
            <p className="task-subtitle">Thematic word lists</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {VOCABULARY_PACKS.map(p => (
            <button
              key={p.id}
              onClick={() => { setPackId(p.id); setSaved({}) }}
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
              <span style={{ fontSize: 28 }}>{p.emoji}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>{p.title}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{p.level} · {p.words.length} words</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="task-session">
      <button className="btn-back" onClick={() => setPackId(null)}>← Back</button>
      <div className="task-header accent-blue">
        <span className="task-icon">{pack.emoji}</span>
        <div>
          <h2>{pack.title}</h2>
          <p className="task-subtitle">{pack.level} · {pack.words.length} words</p>
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', margin: 0 }}>
        Tap + to save a word to your vocabulary for later review.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {pack.words.map((word, i) => (
          <div
            key={i}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{word.es}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{word.sk}</div>
            </div>
            <button
              onClick={() => handleSave(word)}
              disabled={saved[word.es]}
              style={{
                background: saved[word.es] ? 'var(--green-light)' : 'var(--bg)',
                border: saved[word.es] ? '1.5px solid var(--green)' : '1px solid var(--border)',
                borderRadius: 8,
                padding: '5px 10px',
                fontSize: 13,
                color: saved[word.es] ? 'var(--green)' : 'var(--muted)',
                cursor: saved[word.es] ? 'default' : 'pointer',
                flexShrink: 0,
                fontWeight: 600,
              }}
            >
              {saved[word.es] ? '✓' : '+'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}