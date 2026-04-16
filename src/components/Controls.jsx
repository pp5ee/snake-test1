import React from 'react'
import { GameStatus } from '../hooks/useGameState'

/**
 * Start / Pause / Resume control buttons.
 *
 * @param {{ status: string, onStart: Function, onPause: Function, onResume: Function }} props
 */
function Controls({ status, onStart, onPause, onResume }) {
  return (
    <div className="controls">
      {status === GameStatus.IDLE || status === GameStatus.DEAD ? (
        <button className="btn-neon success" onClick={onStart}>
          {status === GameStatus.DEAD ? '▶ RETRY' : '▶ START'}
        </button>
      ) : status === GameStatus.RUNNING ? (
        <button className="btn-neon" onClick={onPause}>⏸ PAUSE</button>
      ) : (
        <button className="btn-neon success" onClick={onResume}>▶ RESUME</button>
      )}
    </div>
  )
}

export default Controls
