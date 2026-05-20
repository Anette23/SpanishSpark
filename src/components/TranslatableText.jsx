import { useState } from 'react'
import { translateWord } from '../api'
import { saveWord, isWordSaved } from '../vocabularyStore'

export default function TranslatableText({ text, className, onLookup }) {
  const [popup, setPopup] = useState(null) // { word, context, translation, loading, saved }

  function handleWordTap(word, fullText) {
    const clean = word.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ'-]/g, '').toLowerCase()
    if (!clean || clean.length < 2) return
    const alreadySaved = isWordSaved(clean)
    setPopup({ word: clean, context: fullText, translation: null, loading: true, saved: alreadySaved })
    translateWord(clean, fullText)
      .then(({ translation }) => {
        setPopup(p => p?.word === clean ? { ...p, translation, loading: false } : p)
        if (onLookup) onLookup({ word: clean, translation })
      })
      .catch(() => setPopup(p => p?.word === clean ? { ...p, translation: '—', loading: false } : p))
  }

  function handleSave() {
    if (!popup || popup.saved) return
    saveWord({ word: popup.word, translation: popup.translation, context: popup.context, source: 'tap' })
    setPopup(p => ({ ...p, saved: true }))
  }

  // Tokenise: keep words (including Spanish accented chars) and punctuation separate
  const tokens = text.split(/([\wáéíóúüñÁÉÍÓÚÜÑ'-]+)/)

  return (
    <>
      <span className={className}>
        {tokens.map((token, i) => {
          if (/^[\wáéíóúüñÁÉÍÓÚÜÑ'-]+$/.test(token) && token.length >= 2) {
            return (
              <span
                key={i}
                className="translatable-word"
                onClick={() => handleWordTap(token, text)}
              >
                {token}
              </span>
            )
          }
          return token
        })}
      </span>

      {popup && (
        <div className="translate-overlay" onClick={() => setPopup(null)}>
          <div className="translate-sheet" onClick={e => e.stopPropagation()}>
            <div className="translate-sheet-word">{popup.word}</div>
            {popup.loading ? (
              <div className="translate-loading">⏳ Translating...</div>
            ) : (
              <>
                <div className="translate-result">{popup.translation}</div>
                <div className="translate-actions">
                  <button
                    className={`btn-save-word ${popup.saved ? 'btn-save-word-saved' : ''}`}
                    onClick={handleSave}
                    disabled={popup.saved}
                  >
                    {popup.saved ? '✓ Saved' : '📖 Save to vocabulary'}
                  </button>
                  <button className="btn-translate-close" onClick={() => setPopup(null)}>Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
