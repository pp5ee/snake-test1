import { useState, useCallback } from 'react'
import { loadScores, saveScore as storeScore } from '../utils/storage'

/**
 * Custom hook — localStorage score history management.
 */
export function useStorage() {
  const [scores, setScores] = useState(() => loadScores())

  const saveScore = useCallback((score, snakeType) => {
    storeScore({ score, snakeType })
    setScores(loadScores())
  }, [])

  return { scores, saveScore }
}