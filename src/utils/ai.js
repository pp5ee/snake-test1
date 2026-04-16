/**
 * Utility: AI snake movement logic.
 * Each AI snake wanders randomly with occasional direction persistence.
 */

const DIRECTIONS = [
  { x: 1,  y: 0  },
  { x: -1, y: 0  },
  { x: 0,  y: 1  },
  { x: 0,  y: -1 },
]

/**
 * Compute the next direction for an AI snake.
 * Avoids reversing and biases toward the current direction to reduce zig-zagging.
 *
 * @param {{ x: number, y: number }} currentDir Current movement direction
 * @param {Array<{x: number, y: number}>} body Snake body cells
 * @param {{ cols: number, rows: number }} grid Grid dimensions
 * @returns {{ x: number, y: number }} Next direction
 */
export function aiNextDirection(currentDir, body, grid) {
  const head = body[0]

  // Filter out the reverse direction and directions that walk into walls
  const safe = DIRECTIONS.filter((dir) => {
    // No 180-degree reversals
    if (dir.x === -currentDir.x && dir.y === -currentDir.y) return false
    // No out-of-bounds
    const nx = head.x + dir.x
    const ny = head.y + dir.y
    return nx >= 0 && nx < grid.cols && ny >= 0 && ny < grid.rows
  })

  if (safe.length === 0) return currentDir

  // 70% chance to keep current direction if it is still safe
  const keepCurrent = safe.find(
    (d) => d.x === currentDir.x && d.y === currentDir.y,
  )
  if (keepCurrent && Math.random() < 0.7) return keepCurrent

  // Otherwise pick a random safe direction
  return safe[Math.floor(Math.random() * safe.length)]
}
