// SnakeSelector.jsx
// AC-1: Cyberpunk-styled interface with snake type selector
// AC-2: Player can select snake type
// Each card shows a live animated canvas preview of that snake type

import React, { useRef, useEffect } from 'react'
import { SNAKE_TYPES as SNAKE_TYPES_MAP } from '../constants/snakeTypes'

/** Flat array of snake type objects consumed by App.jsx */
export const SNAKE_TYPES = Object.values(SNAKE_TYPES_MAP).map((t) => ({
  id:          t.id,
  name:        t.name,
  color:       t.bodyColor,
  glowColor:   t.shadowColor,
  headColor:   t.headColor,
  description: t.description,
}))

const CELL = 20   // preview cell size

/* ─ Static preview snake (head to tail, moves right) ─────────────────── */
const PREVIEW_SNAKE = [
  { x: 5, y: 1 }, { x: 4, y: 1 }, { x: 3, y: 1 },
  { x: 2, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 1 },
]

/**
 * @param {{ selectedId: string, onSelect: Function }} props
 */
function SnakeSelector({ selectedId, onSelect }) {
  return (
    <aside className="snake-selector">
      <h2 className="selector-title">// SELECT UNIT //</h2>
      <ul className="selector-list">
        {Object.values(SNAKE_TYPES_MAP).map((type) => (
          <SnakeCard
            key={type.id}
            type={type}
            isSelected={selectedId === type.id}
            onSelect={() => onSelect(type.id)}
          />
        ))}
      </ul>
    </aside>
  )
}

export default SnakeSelector

/* ── Per-snake card with animated canvas preview ─────────────────────── */
function SnakeCard({ type, isSelected, onSelect }) {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)

  useEffect(() => {
    const PW = 6 * CELL
    const PH = 3 * CELL

    const loop = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')

      // Background
      ctx.fillStyle = isSelected ? '#0d0d24' : '#080818'
      ctx.fillRect(0, 0, PW, PH)

      // Subtle dot grid
      ctx.fillStyle = 'rgba(255,255,255,0.04)'
      for (let c = 0; c < 6; c++)
        for (let r = 0; r < 3; r++)
          ctx.fillRect(c * CELL + CELL / 2 - 0.5, r * CELL + CELL / 2 - 0.5, 1, 1)

      // Draw preview snake using per-style renderer
      PREVIEW_SNAKE.forEach((cell, idx) => {
        drawPreviewSegment(ctx, cell, idx === 0, idx === PREVIEW_SNAKE.length - 1, type, idx, PREVIEW_SNAKE.length)
      })

      animRef.current = requestAnimationFrame(loop)
    }
    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [type, isSelected])

  return (
    <li
      className={`selector-item ${isSelected ? 'active' : ''}`}
      style={{ '--snake-color': type.bodyColor, '--snake-glow': type.shadowColor }}
      onClick={onSelect}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Select ${type.name}`}
    >
      {/* Live preview */}
      <canvas
        ref={canvasRef}
        width={6 * CELL}
        height={3 * CELL}
        className="selector-preview-canvas"
      />

      {/* Info */}
      <div className="selector-info">
        <span className="selector-name">{type.name.toUpperCase()}</span>
        <span className="selector-desc">{type.description}</span>
        <div
          className="selector-swatch"
          style={{
            background: `linear-gradient(90deg, ${type.tailColor}, ${type.bodyColor}, ${type.accentColor})`,
          }}
        />
      </div>

      {isSelected && (
        <span className="selector-badge" style={{ color: type.accentColor }}>◆ SELECTED</span>
      )}
    </li>
  )
}

/* ─── Per-style canvas drawing functions (inline, no external deps) ───── */

function drawPreviewSegment(ctx, cell, isHead, isTail, type, idx, total) {
  switch (type.style) {
    case 'classic': return prevClassic(ctx, cell, isHead, type, idx, total)
    case 'glowing': return prevGlowing(ctx, cell, isHead, type, idx, total)
    case 'vibrant': return prevVibrant(ctx, cell, isHead, type, idx, total)
    case 'energy':  return prevEnergy(ctx, cell, isHead, type, idx, total)
    case 'dark':    return prevDark(ctx, cell, isHead, type, idx, total)
    default:        return prevClassic(ctx, cell, isHead, type, idx, total)
  }
}

function prevClassic(ctx, cell, isHead, type, idx, total) {
  const { px, py, w, h } = pm(cell)
  const ratio = idx / Math.max(total - 1, 1)
  ctx.shadowBlur  = type.glowIntensity
  ctx.shadowColor = type.glowColor
  ctx.fillStyle   = lc(type.bodyColor, type.tailColor, ratio)
  rr(ctx, px, py, w, h, isHead ? 5 : 2); ctx.fill()
  if (isHead) {
    ctx.shadowBlur = type.glowIntensity * 1.5; ctx.shadowColor = type.accentColor
    ctx.fillStyle  = type.accentColor
    rr(ctx, px + 3, py + 3, w - 6, h - 6, 2); ctx.fill()
    eyes(ctx, cell, type.headColor, '#000')
  }
  ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'
}

function prevGlowing(ctx, cell, isHead, type, idx, total) {
  const { px, py, w, h } = pm(cell)
  const ratio = idx / Math.max(total - 1, 1)
  const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 280 + idx * 0.5)
  ctx.shadowBlur  = type.glowIntensity + pulse * 10
  ctx.shadowColor = type.glowColor
  const grad = ctx.createLinearGradient(px, py, px + w, py + h)
  grad.addColorStop(0, type.bodyColor); grad.addColorStop(1, type.tailColor)
  ctx.fillStyle = grad; rr(ctx, px, py, w, h, 7); ctx.fill()
  ctx.shadowBlur = 0
  const gleam = ctx.createLinearGradient(px, py, px, py + h * 0.5)
  gleam.addColorStop(0, `rgba(255,255,255,${0.25 - ratio * 0.18})`)
  gleam.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gleam; rr(ctx, px + 1, py + 1, w - 2, (h - 2) / 2, 6); ctx.fill()
  if (isHead) {
    ctx.shadowBlur = 24; ctx.shadowColor = type.accentColor
    ctx.strokeStyle = type.accentColor; ctx.lineWidth = 1.5
    rr(ctx, px, py, w, h, 7); ctx.stroke()
    eyes(ctx, cell, '#fff', '#001133')
  }
  ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'
}

function prevVibrant(ctx, cell, isHead, type, idx, total) {
  const { cx, cy } = pm(cell)
  const r = CELL / 2 - 2; const ratio = idx / Math.max(total - 1, 1)
  ctx.shadowBlur  = type.glowIntensity; ctx.shadowColor = type.glowColor
  ctx.beginPath()
  ctx.moveTo(cx, cy - r); ctx.lineTo(cx + r, cy)
  ctx.lineTo(cx, cy + r); ctx.lineTo(cx - r, cy); ctx.closePath()
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
  grad.addColorStop(0, type.accentColor); grad.addColorStop(0.6, type.bodyColor); grad.addColorStop(1, type.tailColor)
  ctx.fillStyle = grad; ctx.fill()
  ctx.shadowBlur = 4; ctx.strokeStyle = `rgba(255,150,200,${0.8 - ratio * 0.5})`; ctx.lineWidth = 1.2; ctx.stroke()
  if (isHead) {
    ctx.shadowBlur = 24; ctx.shadowColor = type.accentColor; ctx.fillStyle = type.accentColor
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.36, 0, Math.PI * 2); ctx.fill()
    eyes(ctx, cell, type.headColor, '#1a0010')
  }
  ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'
}

function prevEnergy(ctx, cell, isHead, type, idx, total) {
  const { px, py, w, h } = pm(cell)
  const fl = 0.85 + Math.random() * 0.15
  ctx.shadowBlur  = (type.glowIntensity + Math.random() * 8) * fl; ctx.shadowColor = type.glowColor
  const jag = isHead ? 0 : (Math.random() < 0.25 ? 1 : 0)
  ctx.beginPath()
  ctx.moveTo(px + jag, py); ctx.lineTo(px + w - jag, py)
  ctx.lineTo(px + w, py + h); ctx.lineTo(px, py + h); ctx.closePath()
  const grad = ctx.createLinearGradient(px, py, px, py + h)
  grad.addColorStop(0, type.headColor); grad.addColorStop(0.4, type.bodyColor); grad.addColorStop(1, type.tailColor)
  ctx.fillStyle = grad; ctx.fill()
  if (isHead) {
    ctx.shadowBlur = 28; ctx.shadowColor = type.accentColor; ctx.fillStyle = type.accentColor
    rr(ctx, px + 4, py + 4, w - 8, h - 8, 2); ctx.fill()
    eyes(ctx, cell, type.headColor, '#200a00')
  }
  ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'
}

function prevDark(ctx, cell, isHead, type, idx, total) {
  const { cx, cy } = pm(cell)
  const r = CELL / 2 - 2; const ratio = idx / Math.max(total - 1, 1)
  ctx.shadowBlur  = type.glowIntensity; ctx.shadowColor = type.glowColor
  const grad = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r)
  grad.addColorStop(0, type.tailColor); grad.addColorStop(0.6, type.bodyColor); grad.addColorStop(1, type.accentColor)
  ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
  ctx.shadowBlur = 0; ctx.strokeStyle = `rgba(157,0,255,${0.5 - ratio * 0.35})`; ctx.lineWidth = 1
  ctx.beginPath(); ctx.arc(cx, cy, r + 1, 0, Math.PI * 2); ctx.stroke()
  if (isHead) {
    ctx.shadowBlur = 22; ctx.shadowColor = type.accentColor; ctx.strokeStyle = type.accentColor; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke()
    eyes(ctx, cell, type.accentColor, '#0d0020')
  }
  ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'
}

/* ─── Tiny shared helpers ────────────────────────────────────────────── */
function pm(cell) {
  const pad = 1
  return {
    px: cell.x * CELL + pad, py: cell.y * CELL + pad,
    w:  CELL - pad * 2,       h:  CELL - pad * 2,
    cx: cell.x * CELL + CELL / 2,
    cy: cell.y * CELL + CELL / 2,
  }
}
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath()
}
function eyes(ctx, cell, iris, pupil) {
  const er = CELL * 0.1
  const ey = cell.y * CELL + CELL * 0.35
  ctx.shadowBlur = 0
  for (const ex of [cell.x * CELL + CELL * 0.3, cell.x * CELL + CELL * 0.7]) {
    ctx.fillStyle = iris;  ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = pupil; ctx.beginPath(); ctx.arc(ex + 0.8, ey + 0.8, er * 0.5, 0, Math.PI * 2); ctx.fill()
  }
}
function lc(hexA, hexB, t) {
  const a = hr(hexA), b = hr(hexB)
  return `rgb(${~~(a.r+(b.r-a.r)*t)},${~~(a.g+(b.g-a.g)*t)},${~~(a.b+(b.b-a.b)*t)})`
}
function hr(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return m ? { r: parseInt(m[1],16), g: parseInt(m[2],16), b: parseInt(m[3],16) } : { r:0,g:200,b:0 }
}
