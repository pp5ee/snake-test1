import { useReducer, useCallback } from 'react'

/**
 * Enum-like game status constants.
 */
export const GameStatus = {
  IDLE:    'idle',
  RUNNING: 'running',
  PAUSED:  'paused',
  DEAD:    'dead',
}

const initialState = {
  status:    GameStatus.IDLE,
  score:     0,
  snakeType: 'cyber',
}

function reducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...state, status: GameStatus.RUNNING, score: 0 }
    case 'PAUSE':
      return state.status === GameStatus.RUNNING
        ? { ...state, status: GameStatus.PAUSED }
        : state
    case 'RESUME':
      return state.status === GameStatus.PAUSED
        ? { ...state, status: GameStatus.RUNNING }
        : state
    case 'DIE':
      return { ...state, status: GameStatus.DEAD }
    case 'ADD_SCORE':
      return { ...state, score: state.score + (action.payload ?? 0) }
    case 'SET_SNAKE_TYPE':
      return { ...state, snakeType: action.payload }
    default:
      return state
  }
}

/**
 * Custom hook — top-level game state machine.
 */
export function useGameState() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const start      = useCallback(() => dispatch({ type: 'START' }),                          [])
  const pause      = useCallback(() => dispatch({ type: 'PAUSE' }),                          [])
  const resume     = useCallback(() => dispatch({ type: 'RESUME' }),                         [])
  const die        = useCallback(() => dispatch({ type: 'DIE' }),                            [])
  const addScore   = useCallback((pts) => dispatch({ type: 'ADD_SCORE', payload: pts }),     [])
  const setType    = useCallback((type) => dispatch({ type: 'SET_SNAKE_TYPE', payload: type }), [])

  return { ...state, start, pause, resume, die, addScore, setType }
}
