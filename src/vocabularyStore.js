const KEY = 'vocabulary_notebook'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

function defaultSR() {
  return { interval: 1, ease: 2.5, due: todayStr(), reps: 0 }
}

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

function save(all) {
  try { localStorage.setItem(KEY, JSON.stringify(all.slice(0, 200))) } catch {}
}

export function getVocabulary() {
  // Ensure all words have SR data
  const all = load()
  let dirty = false
  all.forEach(w => { if (!w.sr) { w.sr = defaultSR(); dirty = true } })
  if (dirty) save(all)
  return all
}

export function getDueWords() {
  const today = todayStr()
  return getVocabulary().filter(w => w.sr.due <= today)
}

export function getWordsSortedBySR() {
  const today = todayStr()
  const all = getVocabulary()
  const due = all.filter(w => w.sr.due <= today).sort((a, b) => a.sr.due.localeCompare(b.sr.due))
  const later = all.filter(w => w.sr.due > today)
  return [...due, ...later]
}

export function updateWordSR(word, isCorrect) {
  const all = getVocabulary()
  const w = all.find(e => e.word.toLowerCase() === word.toLowerCase())
  if (!w) return
  if (!w.sr) w.sr = defaultSR()
  if (isCorrect) {
    w.sr.reps += 1
    const newInterval = w.sr.reps === 1 ? 1 : w.sr.reps === 2 ? 3 : Math.round(w.sr.interval * w.sr.ease)
    w.sr.interval = newInterval
    w.sr.due = addDays(todayStr(), newInterval)
  } else {
    w.sr.reps = 0
    w.sr.ease = Math.max(1.3, w.sr.ease - 0.2)
    w.sr.interval = 1
    w.sr.due = addDays(todayStr(), 1)
  }
  save(all)
}

export function saveWord({ word, translation, context, source }) {
  const all = load()
  if (all.some(w => w.word.toLowerCase() === word.toLowerCase())) return // already saved
  all.unshift({
    word: word.toLowerCase(),
    translation,
    context: context || '',
    source: source || '',
    date: new Date().toISOString().slice(0, 10),
    sr: defaultSR(),
  })
  save(all)
}

export function removeWord(word) {
  const all = load().filter(w => w.word.toLowerCase() !== word.toLowerCase())
  try { localStorage.setItem(KEY, JSON.stringify(all)) } catch {}
}

export function isWordSaved(word) {
  return load().some(w => w.word.toLowerCase() === word.toLowerCase())
}
