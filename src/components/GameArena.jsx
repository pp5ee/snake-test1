import React, { useRef, useEffect } from 'react'

/**
 * Main game arena — renders the grid and all snakes on a canvas element.
 *
 * @param {{
 *   grid:       { cols: number, rows: number },
 *   playerBody: Array<{x: number, y: number}>,
 *   playerType: object,
 *   aiSnakes:   Array<{ body: Array<{x:number,y:number}>, color: string, glowColor: string }>,
 * }} props
 */
function GameArena({ grid, playerBody, playerType, aiSnakes }) {
  const canvasRef = useRef(null)
  const CELL = 20 // px per grid cell

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = grid.cols * CELL
    const H = grid.rows * CELL

    canvas.width  = W
    canvas.height = H

    // ── Background ────────────────────────────────────────
    ctx.fillStyle = '#050510'
    ctx.fillRect(0, 0, W, H)

    // Grid lines
    ctx.strokeStyle = 'rgba(0,245,255,0.06)'
    ctx.lineWidth   = 0.5
    for (let x = 0; x <= grid.cols; x++) {
      ctx.beginPath()
      ctx.moveTo(x * CELL, 0)
      ctx.lineTo(x * CELL, H)
      ctx.stroke()
    }
    for (let y = 0; y <= grid.rows; y++) {
      ctx.beginPath()
      ctx.moveTo(0, y * CELL)
      ctx.lineTo(W, y * CELL)
      ctx.stroke()
    }

    // ── Helper: draw one snake ────────────────────────────
    function drawSnake(body, color, glowColor, headColor) {
      if (!body || body.length === 0) return

      ctx.shadowBlur  = 12
      ctx.shadowColor = glowColor

      body.forEach((seg, i) => {
        const alpha = i === 0 ? 1 : Math.max(0.35, 1 - i * 0.02)
        ctx.fillStyle   = i === 0 ? headColor : color
        ctx.globalAlpha = alpha
        ctx.fillRect(
          seg.x * CELL + 1,
          seg.y * CELL + 1,
          CELL - 2,
          CELL - 2,
        )
      })

      ctx.globalAlpha = 1
      ctx.shadowBlur  = 0
    }

    // ── AI Snakes ─────────────────────────────────────────
    ;(aiSnakes || []).forEach(({ body, color, glowColor }) =>
      drawSnake(body, color, glowColor, '#ffffff'),
    )

    // ── Player Snake ──────────────────────────────────────
    if (playerType) {
      drawSnake(playerBody, playerType.color, playerType.glowColor, playerType.headColor)
    }
  }, [grid, playerBody, playerType, aiSnakes])

  return (
    <div className="arena-wrapper">
      <canvas ref={canvasRef} className="arena-canvas" />
    </div>
  )
}

export default GameArena
