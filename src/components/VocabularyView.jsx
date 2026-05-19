import { useState } from 'react'
import { getVocabulary, removeWord } from '../vocabularyStore'

export default function VocabularyView({ onBack, onStartQuiz }) {
  const [words, setWords] = useState(() => getVocabulary())
  const [search, setSearch] = useState('')
  const [exportDone, setExportDone] = useState(false)

  function handleRemove(word) {
    removeWord(word)
    setWords(getVocabulary())
  }

  function handleExportCSV() {
    const header = 'Word,Translation,Context,Date'
    const rows = words.map(w =>
      [w.word, w.translation, w.context || '', w.date].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vocabulary-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setExportDone(true)
    setTimeout(() => setExportDone(false), 3000)
  }

  const filtered = words.filter(w =>
    w.word.toLowerCase().includes(search.toLowerCase()) ||
    w.translation.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="task-session">
      <button className="btn-back" onClick={onBack}>← Back</button>

      <div className="task-header accent-blue">
        <span className="task-icon">📖</span>
        <div>
          <h2>My Vocabulary</h2>
          <p className="task-subtitle">{words.length} saved word{words.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {words.length === 0 ? (
        <div className="prompt-box" style={{ textAlign: 'center', color: 'var(--muted)' }}>
          <p>No words saved yet.</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>
            Tap any word in exercises or chat to translate it, then save it here.
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-primary" onClick={onStartQuiz} style={{ flex: 1, fontSize: 15 }}>
              🃏 Quiz mode
            </button>
            <button className="btn-secondary" onClick={handleExportCSV} style={{ flex: 1, fontSize: 15 }}>
              {exportDone ? '✓ Downloaded!' : '📤 Export CSV'}
            </button>
          </div>

          <input
            className="vocab-search"
            type="text"
            placeholder="Search words..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className="vocab-list">
            {filtered.map(w => (
              <div key={w.word} className="vocab-item">
                <div className="vocab-item-main">
                  <span className="vocab-word">{w.word}</span>
                  <span className="vocab-translation">🇸🇰 {w.translation}</span>
                </div>
                {w.context && (
                  <p className="vocab-context">"{w.context}"</p>
                )}
                <div className="vocab-meta">
                  <span className="vocab-date">{w.date}</span>
                  <button className="vocab-remove" onClick={() => handleRemove(w.word)}>✕ Remove</button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '20px 0' }}>No matches.</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
