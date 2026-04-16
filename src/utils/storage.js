/**
 * Utility: localStorage wrapper for score persistence.
 */

const SCORES_KEY = 'snakeBattleRoyale_scores'

/**
 * Load score history from localStorage.
 * @returns {Array<{score: number, snakeType: string, date: string}>}
 */
export function loadScores() {
  try {
    const raw = localStorage.getItem(SCORES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Persist a new score entry to localStorage.
 * @param {{score: number, snakeType: string}} entry
 */
export function saveScore(entry) {
  const history = loadScores()
  history.unshift({ ...entry, date: new Date().toISOString() })
  // Keep only the last 50 scores
  localStorage.setItem(SCORES_KEY, JSON.stringify(history.slice(0, 50)))
}

/**
 * Clear all stored scores.
 */
export function clearScores() {
  localStorage.removeItem(SCORES_KEY)
}
