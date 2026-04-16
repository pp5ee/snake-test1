/**
 * Utility: Collision detection helpers.
 */

/**
 * Check whether two points on the grid are the same cell.
 * @param {{x: number, y: number}} a
 * @param {{x: number, y: number}} b
 * @returns {boolean}
 */
export function sameCell(a, b) {
  return a.x === b.x && a.y === b.y
}

/**
 * Check if a point collides with any segment in a list of cells.
 * @param {{x: number, y: number}} point
 * @param {Array<{x: number, y: number}>} cells
 * @returns {boolean}
 */
export function collidesWithCells(point, cells) {
  return cells.some((cell) => sameCell(point, cell))
}

/**
 * Check head-to-body collision between two snakes.
 * Returns true when the first snake's head overlaps any body segment of the second snake.
 * @param {Array<{x: number, y: number}>} snake1Body
 * @param {Array<{x: number, y: number}>} snake2Body
 * @returns {boolean}
 */
export function headCollidesWithBody(snake1Body, snake2Body) {
  const head = snake1Body[0]
  return snake2Body.some((segment) => sameCell(head, segment))
}
