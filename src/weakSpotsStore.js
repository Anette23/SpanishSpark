const KEY = 'weak_spots'

const CATEGORIES = [
  { key: 'Articles',       keywords: ['article', '"the"', '"a "', '"an "', 'definite', 'indefinite'] },
  { key: 'Tenses',         keywords: ['tense', 'past simple', 'present perfect', 'past continuous', 'future', 'past perfect', 'present simple'] },
  { key: 'Prepositions',   keywords: ['preposition', '"in"', '"on"', '"at"', '"by"', '"for"', '"to"', '"of"', 'after', 'before'] },
  { key: 'Word order',     keywords: ['word order', 'order of words', 'inversion', 'position'] },
  { key: 'Vocabulary',     keywords: ['vocabulary', 'word choice', 'collocation', 'expression', 'phrase', 'idiom'] },
  { key: 'Conditionals',   keywords: ['conditional', 'if clause', 'would have', 'third conditional', 'second conditional'] },
  { key: 'Passive voice',  keywords: ['passive', 'past participle'] },
  { key: 'Modal verbs',    keywords: ['modal', 'should have', 'could have', 'might have', 'must have'] },
  { key: 'Reported speech',keywords: ['reported', 'indirect speech', 'backshift', 'said that', 'told'] },
  { key: 'Spelling',       keywords: ['spelling', 'typo', 'written as', 'misspell'] },
]

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}

export function extractAndStore(feedbackText) {
  if (!feedbackText || feedbackText.length < 10) return
  const lower = feedbackText.toLowerCase()
  const counts = load()

  CATEGORIES.forEach(({ key, keywords }) => {
    if (keywords.some(kw => lower.includes(kw.toLowerCase()))) {
      counts[key] = (counts[key] || 0) + 1
    }
  })

  try { localStorage.setItem(KEY, JSON.stringify(counts)) } catch {}
}

export function getWeakSpots() {
  const counts = load()
  return Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
}

export function clearWeakSpots() {
  try { localStorage.removeItem(KEY) } catch {}
}
