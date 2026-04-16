import { useState, useEffect, useCallback, useRef } from 'react'

const TICK_MS = 120

/**
 * Custom hook — player snake movement with keyboard input.
 *
 * @param {boolean} running  Whether the game loop is active
 * @param {{ cols: number, rows: number }} grid
 * @param {Function} onDie   Called when the player hits a wall or itself
 * @returns {{ body, direction }}
 */
export function useSnake(running, grid, onDie) {
  const center = {
    x: Math.floor(grid.cols / 2),
    y: Math.floor(grid.rows / 2),
  }

  const [body, setBody] = useState([
    center,
    { x: center.x - 1, y: center.y },
    { x: center.x - 2, y: center.y },
  ])

  const dirRef  = useRef({ x: 1, y: 0 })
  const nextDir = useRef({ x: 1, y: 0 })

  // Keyboard input
  useEffect(() => {
    const MAP = {
      ArrowUp:    { x: 0,  y: -1 },
      ArrowDown:  { x: 0,  y:  1 },
      ArrowLeft:  { x: -1, y:  0 },
      ArrowRight: { x: 1,  y:  0 },
      w: { x: 0,  y: -1 },
      s: { x: 0,  y:  1 },
      a: { x: -1, y:  0 },
      d: { x: 1,  y:  0 },
    }

    function onKey(e) {
      const dir = MAP[e.key]
      if (!dir) return
      // Prevent 180-degree reversal
      if (dir.x === -dirRef.current.x && dir.y === -dirRef.current.y) return
      nextDir.current = dir
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Game tick
  useEffect(() => {
    if (!running) return

    const id = setInterval(() => {
      dirRef.current = nextDir.current

      setBody((prev) => {
        const head = {
          x: prev[0].x + dirRef.current.x,
          y: prev[0].y + dirRef.current.y,
        }

        // Wall collision
        if (head.x < 0 || head.x >= grid.cols || head.y < 0 || head.y >= grid.rows) {
          onDie()
          return prev
        }

        // Self collision (skip tail which will move away)
        if (prev.slice(0, -1).some((seg) => seg.x === head.x && seg.y === head.y)) {
          onDie()
          return prev
        }

        return [head, ...prev.slice(0, -1)]
      })
    }, TICK_MS)

    return () => clearInterval(id)
  }, [running, grid, onDie])

  /** Grow the snake by appending the tail segment */
  const grow = useCallback(() => {
    setBody((prev) => [...prev, prev[prev.length - 1]])
  }, [])

  /** Reset snake to initial position */
  const reset = useCallback(() => {
    dirRef.current  = { x: 1, y: 0 }
    nextDir.current = { x: 1, y: 0 }
    setBody([
      center,
      { x: center.x - 1, y: center.y },
      { x: center.x - 2, y: center.y },
    ])
  }, [center.x, center.y])

  return { body, direction: dirRef.current, grow, reset }
}
