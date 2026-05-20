// sentenceStore.js — saves sentences written during exercises
// Used to inject practiced phrases into ChatSession

const KEY = 'practiced_sentences'
const MAX = 30

function today() {
  return new Date().toISOString().slice(0, 10)
}

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function savePracticedSentence({ type, phrase, sentence }) {
  const all = load()
  all.unshift({ type, phrase, sentence, date: today() })
  try { localStorage.setItem(KEY, JSON.stringify(all.slice(0, MAX))) } catch {}
}

// Returns unique phrases practiced in the last `days` days, newest first
export function getRecentPhrases(days = 7) {
  const cutoff = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10)
  const seen = new Set()
  return load()
    .filter(s => s.date >= cutoff)
    .map(s => s.phrase)
    .filter(p => { if (seen.has(p)) return false; seen.add(p); return true })
    .slice(0, 10)
}

// ── Daily session context (writing / speaking task) ───────────────────────────

export function saveDailySession({ taskType, prompt, text }) {
  try {
    localStorage.setItem('daily_session_context', JSON.stringify({
      date: today(), taskType, prompt, text: text.slice(0, 800)
    }))
  } catch {}
}

// Returns today's session context, or null if none / from a previous day
export function getTodayContext() {
  try {
    const data = JSON.parse(localStorage.getItem('daily_session_context') || 'null')
    if (!data || data.date !== today()) return null
    return data
  } catch { return null }
}
