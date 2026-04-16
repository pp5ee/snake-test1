import React from 'react'
import { SNAKE_TYPES as SNAKE_TYPES_MAP } from '../constants/snakeTypes'

/** Flat array of snake type objects for iteration in UI */
export const SNAKE_TYPES = Object.values(SNAKE_TYPES_MAP).map((t) => ({
  id:          t.id,
  name:        t.name,
  color:       t.bodyColor,
  glowColor:   t.shadowColor,
  headColor:   t.headColor,
  description: t.description,
}))

/**
 * Left-panel snake type selector component.
 *
 * @param {{ selectedId: string, onSelect: Function }} props
 */
function SnakeSelector({ selectedId, onSelect }) {
  return (
    <aside className="snake-selector">
      <h2 className="selector-title">SELECT UNIT</h2>
      <ul className="selector-list">
        {SNAKE_TYPES.map((type) => (
          <li
            key={type.id}
            className={`selector-item ${selectedId === type.id ? 'active' : ''}`}
            style={{ '--snake-color': type.color, '--snake-glow': type.glowColor }}
            onClick={() => onSelect(type.id)}
          >
            <span className="selector-swatch" />
            <div className="selector-info">
              <span className="selector-name">{type.name}</span>
              <span className="selector-desc">{type.description}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default SnakeSelector
