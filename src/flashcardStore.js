// flashcardStore.js — spaced repetition storage for all bonus exercise types
// Storage key per type: flashcards_${type}
// Format: { [id]: { score, lastSeen, seenCount } }

function storageKey(type) {
  return `flashcards_${type}`
}

function loadDeck(type) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(type)) || '{}')
  } catch {
    return {}
  }
}

function saveDeck(type, deck) {
  try {
    localStorage.setItem(storageKey(type), JSON.stringify(deck))
  } catch (e) {
    console.error('flashcardStore: failed to save deck', e)
  }
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function daysSince(dateStr) {
  if (!dateStr) return 999
  return Math.round((Date.now() - new Date(dateStr)) / 86400000)
}

// Derive the string id for an item depending on type
function itemId(type, item) {
  if (type === 'synonyms')   return item.word
  if (type === 'grammar')    return item.id
  return item.phrase  // prepositions, idioms
  // shadowing uses item.sentence — handled via caller passing item.sentence as id
}

/**
 * Save or update a flashcard entry with exponential decay scoring.
 * score: 0.0–1.0 (new score for this attempt)
 * Effective score = prev * 0.4 + score * 0.6 (prev defaults to 1.0 for new cards)
 */
export function saveFlashcard(type, id, score) {
  const deck = loadDeck(type)
  const prev = deck[id]?.score ?? 1
  const seenCount = (deck[id]?.seenCount ?? 0) + 1
  deck[id] = {
    score: prev * 0.4 + score * 0.6,
    lastSeen: todayStr(),
    seenCount,
  }
  saveDeck(type, deck)
}

/**
 * Returns true if a card entry is currently due for review.
 * Due when: score < 0.75 AND daysSince >= max(1, floor(score * 7))
 */
function isDue(entry) {
  if (!entry) return false
  if (entry.score >= 0.75) return false
  const interval = Math.max(1, Math.floor(entry.score * 7))
  return daysSince(entry.lastSeen) >= interval
}

/**
 * Get up to `count` items from allItems that are due for review,
 * sorted by score ascending (weakest first).
 * allItems: the full exercise array for this type.
 */
export function getDueCards(type, allItems, count) {
  const deck = loadDeck(type)

  // For shadowing, id is item.sentence; for others use itemId()
  function getId(item) {
    return type === 'shadowing' ? item.sentence : itemId(type, item)
  }

  const due = allItems
    .filter(item => {
      const id = getId(item)
      return isDue(deck[id])
    })
    .map(item => {
      const id = getId(item)
      return { item, score: deck[id].score }
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, count)
    .map(x => x.item)

  return due
}

// ── Daily goal tracking ───────────────────────────────────────────────────────

export const DAILY_GOAL = 5

export function getDailyProgress(type) {
  try {
    const data = JSON.parse(localStorage.getItem(`dailyBonus_${type}`) || '{}')
    if (data.date !== todayStr()) return 0
    return data.count || 0
  } catch { return 0 }
}

export function incrementDailyProgress(type) {
  const current = getDailyProgress(type)
  const next = current + 1
  try {
    localStorage.setItem(`dailyBonus_${type}`, JSON.stringify({ date: todayStr(), count: next }))
  } catch {}
  return next
}

/**
 * Returns stats for the flashcard deck vs the full item list.
 * { total, learned, due }
 */
export function getFlashcardStats(type, allItems) {
  const deck = loadDeck(type)

  function getId(item) {
    return type === 'shadowing' ? item.sentence : itemId(type, item)
  }

  const total = allItems.length
  let learned = 0
  let due = 0

  for (const item of allItems) {
    const id = getId(item)
    const entry = deck[id]
    if (!entry) continue
    if (entry.score >= 0.75) {
      learned++
    } else if (isDue(entry)) {
      due++
    }
  }

  return { total, learned, due }
}
