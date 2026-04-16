import React from 'react'

/**
 * Score history table populated from localStorage.
 *
 * @param {{ scores: Array<{score:number, snakeType:string, date:string}> }} props
 */
function ScoreHistory({ scores }) {
  if (!scores || scores.length === 0) {
    return (
      <div className="score-history empty">
        <p className="history-empty">// NO RECORDS FOUND</p>
      </div>
    )
  }

  return (
    <div className="score-history">
      <h3 className="history-title">BATTLE LOG</h3>
      <ul className="history-list">
        {scores.map((entry, i) => (
          <li key={i} className="history-entry">
            <span className="history-rank">#{String(i + 1).padStart(2, '0')}</span>
            <span className="history-score">{String(entry.score).padStart(6, '0')}</span>
            <span className="history-type">{entry.snakeType?.toUpperCase()}</span>
            <span className="history-date">
              {new Date(entry.date).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ScoreHistory
