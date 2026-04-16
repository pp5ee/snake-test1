import React from 'react'

/**
 * HUD score display component.
 *
 * @param {{ score: number, status: string }} props
 */
function ScoreBoard({ score, status }) {
  return (
    <div className="scoreboard">
      <div className="scoreboard-row">
        <span className="scoreboard-label">SCORE</span>
        <span className="scoreboard-value">{String(score).padStart(6, '0')}</span>
      </div>
      <div className="scoreboard-row">
        <span className="scoreboard-label">STATUS</span>
        <span className={`scoreboard-status status-${status}`}>{status.toUpperCase()}</span>
      </div>
    </div>
  )
}

export default ScoreBoard
