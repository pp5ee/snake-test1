// GameArena.jsx
// Canvas-based game board for Snake Battle Royale
// 30×20 grid, cyberpunk aesthetic with 5 distinct snake styles

import React, { useRef, useEffect, useCallback } from 'react'
import { SNAKE_TYPES } from '../constants/snakeTypes'

const CELL = 24        // px per grid cell
const BG   = '#050510'

/* ─────────────────────────────────────────────────────────────────────────
   Public component
───────────────────────────────────────────────────────────────────────── */
/**
 * @param {{
 *   grid:       { cols: number, rows: number },
 *   playerBody: Array<{x: number, y: number}>,
 *   playerType: { id, color, glowColor, headColor },
 *   aiSnakes:   Array<{ body, color, glowColor, headColor }>,
 * }} props
 */
function GameArena({ grid, playerBody, playerType, aiSnakes }) {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)

  // Keep latest props accessible inside rAF without re-subscribing
  const propsRef = useRef({ grid, playerBody, playerType, aiSnakes })
  useEffect(() => {
    propsRef.current = { grid, playerBody, playerType, aiSnakes }
  })

  /* ── Draw one frame ───────────────────────────────────────────────── */
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const { grid, playerBody, playerType, aiSnakes } = propsRef.current

    const W = grid.cols * CELL
    const H = grid.rows * CELL

    if (canvas.width !== W || canvas.height !== H) {
      canvas.width  = W
      canvas.height = H
    }

    // Background
    ctx.fillStyle = BG
    ctx.fillRect(0, 0, W, H)

    // Grid
    drawGrid(ctx, grid)

    // AI snakes (drawn first, underneath)
    ;(aiSnakes || []).forEach(({ body, color, glowColor, headColor }) =>
      drawAiSnake(ctx, body, color, glowColor, headColor)
    )

    // Player snake (on top)
    if (playerType && playerBody && playerBody.length) {
      const typeData = SNAKE_TYPES[playerType.id] || null
      drawPlayerSnake(ctx, playerBody, playerType, typeData)
    }
  }, [])

  /* ── Animation loop ───────────────────────────────────────────────── */
  useEffect(() => {
    const loop = () => {
      drawFrame()
      animRef.current = requestAnimationFrame(loop)
    }
    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [drawFrame])

  return (
    <div className="arena-wrapper">
      <canvas ref={canvasRef} className="arena-canvas" />
    </div>
  )
}

export default GameArena

/* ─────────────────────────────────────────────────────────────────────────
   Drawing helpers
───────────────────────────────────────────────────────────────────────── */

function drawGrid(ctx, grid) {
  ctx.strokeStyle = 'rgba(0,245,255,0.05)'
  ctx.lineWidth   = 0.5
  for (let x = 0; x <= grid.cols; x++) {
    ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, grid.rows * CELL); ctx.stroke()
  }
  for (let y = 0; y <= grid.rows; y++) {
    ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(grid.cols * CELL, y * CELL); ctx.stroke()
  }
  // Arena border glow
  ctx.shadowBlur  = 14
  ctx.shadowColor = '#00ff41'
  ctx.strokeStyle = 'rgba(0,255,65,0.5)'
  ctx.lineWidth   = 2
  ctx.strokeRect(1, 1, grid.cols * CELL - 2, grid.rows * CELL - 2)
  ctx.shadowBlur  = 0
  ctx.shadowColor = 'transparent'
}

/* AI snakes use a simple rounded rect style */
function drawAiSnake(ctx, body, color, glowColor, headColor) {
  if (!body || body.length === 0) return
  ctx.shadowBlur  = 10
  ctx.shadowColor = glowColor

  body.forEach((seg, i) => {
    const alpha = Math.max(0.3, 1 - i * 0.025)
    ctx.globalAlpha = alpha
    ctx.fillStyle   = i === 0 ? headColor : color
    roundRect(ctx, seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4, 4)
    ctx.fill()
  })

  ctx.globalAlpha = 1
  ctx.shadowBlur  = 0
  ctx.shadowColor = 'transparent'
}

/* Player snake — dispatches to per-type style renderer */
function drawPlayerSnake(ctx, body, playerType, typeData) {
  if (!typeData) {
    // Fallback: simple glow rect
    drawAiSnake(ctx, body, playerType.color, playerType.glowColor, playerType.headColor)
    return
  }

  body.forEach((cell, idx) => {
    const isHead = idx === 0
    const isTail = idx === body.length - 1
    drawSegment(ctx, cell, isHead, isTail, typeData, idx, body.length)
  })
}

/* ─ Per-segment renderer (dispatches on style) ─────────────────────── */
function drawSegment(ctx, cell, isHead, isTail, type, idx, total) {
  switch (type.style) {
    case 'classic':  return drawClassic(ctx, cell, isHead, type, idx, total)
    case 'glowing':  return drawGlowing(ctx, cell, isHead, type, idx, total)
    case 'vibrant':  return drawVibrant(ctx, cell, isHead, type, idx, total)
    case 'energy':   return drawEnergy(ctx, cell, isHead, type, idx, total)
    case 'dark':     return drawDark(ctx, cell, isHead, type, idx, total)
    default:         return drawClassic(ctx, cell, isHead, type, idx, total)
  }
}

/* ── Style 1: Neon Green — classic glowing blocks ───────────────────── */
function drawClassic(ctx, cell, isHead, type, idx, total) {
  const { x: px, y: py, w, h, cx, cy } = cellMetrics(cell, 2)
  const ratio = idx / Math.max(total - 1, 1)

  ctx.shadowBlur  = type.glowIntensity
  ctx.shadowColor = type.glowColor
  ctx.fillStyle   = lerpColor(type.bodyColor, type.tailColor, ratio)
  roundRect(ctx, px, py, w, h, isHead ? 6 : 3)
  ctx.fill()

  if (isHead) {
    ctx.shadowBlur  = type.glowIntensity * 1.5
    ctx.shadowColor = type.accentColor
    ctx.fillStyle   = type.accentColor
    roundRect(ctx, px + 4, py + 4, w - 8, h - 8, 3)
    ctx.fill()
    drawEyes(ctx, cell, type.headColor, '#000')
  }

  // Scanline stripe
  ctx.shadowBlur = 0
  ctx.fillStyle  = 'rgba(255,255,255,0.04)'
  ctx.fillRect(px, py, w, 3)
  ctx.shadowColor = 'transparent'
}

/* ── Style 2: Cyber Blue — glowing pills with gleam ────────────────── */
function drawGlowing(ctx, cell, isHead, type, idx, total) {
  const { x: px, y: py, w, h } = cellMetrics(cell, 2)
  const ratio  = idx / Math.max(total - 1, 1)
  const pulse  = 0.5 + 0.5 * Math.sin(Date.now() / 280 + idx * 0.5)

  ctx.shadowBlur  = type.glowIntensity + pulse * 12
  ctx.shadowColor = type.glowColor

  const grad = ctx.createLinearGradient(px, py, px + w, py + h)
  grad.addColorStop(0, type.bodyColor)
  grad.addColorStop(1, type.tailColor)
  ctx.fillStyle = grad
  roundRect(ctx, px, py, w, h, 8)
  ctx.fill()

  // Gleam
  ctx.shadowBlur = 0
  const gleam = ctx.createLinearGradient(px, py, px, py + h * 0.5)
  gleam.addColorStop(0, `rgba(255,255,255,${0.28 - ratio * 0.2})`)
  gleam.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gleam
  roundRect(ctx, px + 1, py + 1, w - 2, (h - 2) / 2, 7)
  ctx.fill()

  if (isHead) {
    ctx.shadowBlur  = 28
    ctx.shadowColor = type.accentColor
    ctx.strokeStyle = type.accentColor
    ctx.lineWidth   = 2
    roundRect(ctx, px, py, w, h, 8)
    ctx.stroke()
    drawEyes(ctx, cell, '#ffffff', '#001133')
  }
  ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'
}

/* ── Style 3: Hot Pink — vibrant diamond shapes ─────────────────────── */
function drawVibrant(ctx, cell, isHead, type, idx, total) {
  const { cx, cy } = cellMetrics(cell, 2)
  const r     = (CELL / 2) - 2
  const ratio = idx / Math.max(total - 1, 1)

  ctx.shadowBlur  = type.glowIntensity
  ctx.shadowColor = type.glowColor

  ctx.beginPath()
  ctx.moveTo(cx, cy - r);  ctx.lineTo(cx + r, cy)
  ctx.lineTo(cx, cy + r);  ctx.lineTo(cx - r, cy)
  ctx.closePath()

  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
  grad.addColorStop(0,   type.accentColor)
  grad.addColorStop(0.6, type.bodyColor)
  grad.addColorStop(1,   type.tailColor)
  ctx.fillStyle = grad
  ctx.fill()

  ctx.shadowBlur  = 5
  ctx.strokeStyle = `rgba(255,150,200,${0.8 - ratio * 0.55})`
  ctx.lineWidth   = 1.5
  ctx.stroke()

  if (isHead) {
    ctx.shadowBlur  = 28
    ctx.shadowColor = type.accentColor
    ctx.fillStyle   = type.accentColor
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.38, 0, Math.PI * 2); ctx.fill()
    drawEyes(ctx, cell, type.headColor, '#1a0010')
  }
  ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'
}

/* ── Style 4: Electric Orange — jagged energy segments ──────────────── */
function drawEnergy(ctx, cell, isHead, type, idx, total) {
  const { x: px, y: py, w, h } = cellMetrics(cell, 2)

  const flicker = 0.82 + Math.random() * 0.18
  ctx.shadowBlur  = (type.glowIntensity + Math.random() * 10) * flicker
  ctx.shadowColor = type.glowColor

  const jag = isHead ? 0 : (Math.random() < 0.28 ? 1 : 0)
  ctx.beginPath()
  ctx.moveTo(px + jag, py);         ctx.lineTo(px + w - jag, py)
  ctx.lineTo(px + w,   py + h);     ctx.lineTo(px, py + h)
  ctx.closePath()

  const grad = ctx.createLinearGradient(px, py, px, py + h)
  grad.addColorStop(0,   type.headColor)
  grad.addColorStop(0.4, type.bodyColor)
  grad.addColorStop(1,   type.tailColor)
  ctx.fillStyle = grad
  ctx.fill()

  // Random arc spark
  if (Math.random() < 0.12) {
    ctx.shadowBlur  = 8
    ctx.shadowColor = type.accentColor
    ctx.strokeStyle = type.accentColor
    ctx.lineWidth   = 1
    ctx.beginPath()
    ctx.moveTo(px + Math.random() * w, py)
    ctx.lineTo(px + Math.random() * w, py + h)
    ctx.stroke()
  }

  if (isHead) {
    ctx.shadowBlur = 32
    ctx.shadowColor = type.accentColor
    ctx.fillStyle   = type.accentColor
    roundRect(ctx, px + 5, py + 5, w - 10, h - 10, 2)
    ctx.fill()
    drawEyes(ctx, cell, type.headColor, '#200a00')
  }
  ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'
}

/* ── Style 5: Void Purple — dark absorbing orbs ─────────────────────── */
function drawDark(ctx, cell, isHead, type, idx, total) {
  const { cx, cy } = cellMetrics(cell, 2)
  const r     = (CELL / 2) - 2
  const ratio = idx / Math.max(total - 1, 1)

  ctx.shadowBlur  = type.glowIntensity
  ctx.shadowColor = type.glowColor

  const grad = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r)
  grad.addColorStop(0,   type.tailColor)
  grad.addColorStop(0.6, type.bodyColor)
  grad.addColorStop(1,   type.accentColor)
  ctx.fillStyle = grad
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()

  ctx.shadowBlur  = 0
  ctx.strokeStyle = `rgba(157,0,255,${0.5 - ratio * 0.35})`
  ctx.lineWidth   = 1
  ctx.beginPath(); ctx.arc(cx, cy, r + 1, 0, Math.PI * 2); ctx.stroke()

  if (isHead) {
    ctx.shadowBlur  = 24
    ctx.shadowColor = type.accentColor
    ctx.strokeStyle = type.accentColor
    ctx.lineWidth   = 2
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke()
    drawEyes(ctx, cell, type.accentColor, '#0d0020')
  }
  ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'
}

/* ─── Shared utilities ───────────────────────────────────────────────── */

function cellMetrics(cell, pad) {
  const px = cell.x * CELL + pad
  const py = cell.y * CELL + pad
  const w  = CELL - pad * 2
  const h  = CELL - pad * 2
  return { x: px, y: py, w, h, cx: cell.x * CELL + CELL / 2, cy: cell.y * CELL + CELL / 2 }
}

function drawEyes(ctx, cell, irisColor, pupilColor) {
  const eyeR = CELL * 0.1
  const lx = cell.x * CELL + CELL * 0.3
  const rx = cell.x * CELL + CELL * 0.7
  const ey = cell.y * CELL + CELL * 0.35
  ctx.shadowBlur = 0
  for (const ex of [lx, rx]) {
    ctx.fillStyle = irisColor
    ctx.beginPath(); ctx.arc(ex, ey, eyeR, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = pupilColor
    ctx.beginPath(); ctx.arc(ex + 1, ey + 1, eyeR * 0.5, 0, Math.PI * 2); ctx.fill()
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y,     x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h,     x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y,         x + r, y)
  ctx.closePath()
}

function lerpColor(hexA, hexB, t) {
  const a = hexToRgb(hexA), b = hexToRgb(hexB)
  const r = Math.round(a.r + (b.r - a.r) * t)
  const g = Math.round(a.g + (b.g - a.g) * t)
  const bl = Math.round(a.b + (b.b - a.b) * t)
  return `rgb(${r},${g},${bl})`
}

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r: 0, g: 200, b: 0 }
}
