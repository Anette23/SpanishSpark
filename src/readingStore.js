const KEY = 'reading_progress'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch {}
}

export function getCompletedIds() {
  return load().completed || []
}

export function getScores() {
  return load().scores || {}
}

export function markRead(id, score, total) {
  const data = load()
  const completed = data.completed || []
  const scores = data.scores || {}
  if (!completed.includes(id)) completed.push(id)
  scores[id] = { score, total, date: new Date().toISOString().slice(0, 10) }
  save({ ...data, completed, scores })
}

export function saveDifficulty(id, difficulty) {
  const data = load()
  const difficulties = data.difficulties || {}
  difficulties[id] = difficulty
  save({ ...data, difficulties })
}

export function getDifficulties() {
  return load().difficulties || {}
}

export function isRead(id) {
  return (load().completed || []).includes(id)
}

export function resetLevel(level, allExercises) {
  const data = load()
  const levelIds = allExercises.filter(e => e.level === level).map(e => e.id)
  const completed = (data.completed || []).filter(id => !levelIds.includes(id))
  save({ ...data, completed })
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Returns exercises sorted: unread first, then weak (< 75%), then strong
export function sortByPriority(exercises) {
  const data = load()
  const completed = data.completed || []
  const scores = data.scores || {}

  const unread = exercises.filter(e => !completed.includes(e.id))
  const read = exercises.filter(e => completed.includes(e.id))
  const weak = read.filter(e => {
    const s = scores[e.id]
    return s && s.total > 0 && (s.score / s.total) < 0.75
  })
  const strong = read.filter(e => {
    const s = scores[e.id]
    return !s || s.total === 0 || (s.score / s.total) >= 0.75
  })

  return [...shuffle(unread), ...shuffle(weak), ...shuffle(strong)]
}

export function getLevelStats(level, allExercises) {
  const data = load()
  const completed = data.completed || []
  const scores = data.scores || {}
  const all = allExercises.filter(e => e.level === level)
  const unread = all.filter(e => !completed.includes(e.id))
  const weak = all.filter(e => {
    const s = scores[e.id]
    return completed.includes(e.id) && s && s.total > 0 && (s.score / s.total) < 0.75
  })
  return { total: all.length, unread: unread.length, review: weak.length }
}
