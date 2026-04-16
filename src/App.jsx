import React, { useState, useEffect, useCallback, useRef } from 'react'
import GameArena from './components/GameArena'
import SnakeSelector, { SNAKE_TYPES } from './components/SnakeSelector'
import Controls from './components/Controls'
import ScoreBoard from './components/ScoreBoard'
import ScoreHistory from './components/ScoreHistory'
import { useGameState, GameStatus } from './hooks/useGameState'
import { useSnake } from './hooks/useSnake'
import { useStorage } from './hooks/useStorage'
import { aiNextDirection } from './utils/ai'
import { headCollidesWithBody } from './utils/collision'

const GRID = { cols: 30, rows: 20 }
const TICK_MS = 120
const AI_COUNT = 4

function App() {
  // Game state
  const game = useGameState()
  const { status, score, snakeType } = game

  // Snake type selected
  const [selectedTypeId, setSelectedTypeId] = useState('cyber')
  const selectedType = SNAKE_TYPES.find((t) => t.id === selectedTypeId) || SNAKE_TYPES[0]

  // Player snake
  const [playerBody, setPlayerBody] = useState([])
  const [playerDirection, setPlayerDirection] = useState({ x: 1, y: 0 })

  // AI snakes
  const [aiSnakes, setAiSnakes] = useState([])

  // Storage
  const { scores, saveScore } = useStorage()

  // Refs for game loop
  const runningRef = useRef(false)
  const playerDirRef = useRef({ x: 1, y: 0 })
  const nextPlayerDirRef = useRef({ x: 1, y: 0 })
  const aiDirectionsRef = useRef([])

  // Update ref when status changes
  useEffect(() => {
    runningRef.current = status === GameStatus.RUNNING
  }, [status])

  // Initialize game
  const initGame = useCallback(() => {
    // Player starts in center, moving right
    const center = { x: Math.floor(GRID.cols / 2), y: Math.floor(GRID.rows / 2) }
    setPlayerBody([
      center,
      { x: center.x - 1, y: center.y },
      { x: center.x - 2, y: center.y },
    ])
    playerDirRef.current = { x: 1, y: 0 }
    nextPlayerDirRef.current = { x: 1, y: 0 }
    setPlayerDirection({ x: 1, y: 0 })

    // Spawn AI snakes at random positions
    const newAiSnakes = []
    const usedPositions = new Set()
    const getRandomPos = () => {
      let pos
      do {
        pos = {
          x: Math.floor(Math.random() * GRID.cols),
          y: Math.floor(Math.random() * GRID.rows),
        }
      } while (
        usedPositions.has(`${pos.x},${pos.y}`) ||
        (Math.abs(pos.x - center.x) < 5 && Math.abs(pos.y - center.y) < 5)
      )
      usedPositions.add(`${pos.x},${pos.y}`)
      return pos
    }

    const aiColors = [
      { color: '#ff003c', glowColor: 'rgba(255,0,60,0.7)', headColor: '#ffaaaa' },
      { color: '#f5ff00', glowColor: 'rgba(245,255,0,0.7)', headColor: '#ffffaa' },
      { color: '#00ff41', glowColor: 'rgba(0,255,65,0.7)', headColor: '#aaffcc' },
      { color: '#9b00ff', glowColor: 'rgba(155,0,255,0.7)', headColor: '#cc88ff' },
    ]

    for (let i = 0; i < AI_COUNT; i++) {
      const startPos = getRandomPos()
      const dir = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
      ][Math.floor(Math.random() * 4)]

      newAiSnakes.push({
        body: [startPos, { x: startPos.x - dir.x, y: startPos.y - dir.y }],
        ...aiColors[i],
      })
      aiDirectionsRef.current[i] = dir
    }
    setAiSnakes(newAiSnakes)
  }, [])

  // Handle start
  const handleStart = useCallback(() => {
    initGame()
    game.start()
  }, [initGame, game])

  // Handle death
  const handleDie = useCallback(() => {
    game.die()
    if (score > 0) {
      saveScore(score, selectedTypeId)
    }
  }, [game, score, selectedTypeId, saveScore])

  // Keyboard input
  useEffect(() => {
    const MAP = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 },
      s: { x: 0, y: 1 },
      a: { x: -1, y: 0 },
      d: { x: 1, y: 0 },
    }

    const onKey = (e) => {
      const dir = MAP[e.key]
      if (!dir) return
      // Prevent 180-degree reversal
      if (dir.x === -playerDirRef.current.x && dir.y === -playerDirRef.current.y) return
      nextPlayerDirRef.current = dir
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Main game loop
  useEffect(() => {
    if (status !== GameStatus.RUNNING) return

    const tick = setInterval(() => {
      // Update player direction
      playerDirRef.current = nextPlayerDirRef.current
      setPlayerDirection(playerDirRef.current)

      setPlayerBody((prevPlayer) => {
        if (!prevPlayer || prevPlayer.length === 0) return prevPlayer

        const newHead = {
          x: prevPlayer[0].x + playerDirRef.current.x,
          y: prevPlayer[0].y + playerDirRef.current.y,
        }

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID.cols ||
          newHead.y < 0 ||
          newHead.y >= GRID.rows
        ) {
          handleDie()
          return prevPlayer
        }

        // Self collision
        if (prevPlayer.slice(0, -1).some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
          handleDie()
          return prevPlayer
        }

        let newPlayerBody = [newHead, ...prevPlayer.slice(0, -1)]

        setAiSnakes((prevAi) => {
          const newAi = prevAi.map((ai, idx) => {
            // AI movement
            const currentDir = aiDirectionsRef.current[idx] || { x: 1, y: 0 }
            const newDir = aiNextDirection(currentDir, ai.body, GRID)
            aiDirectionsRef.current[idx] = newDir

            const aiHead = {
              x: ai.body[0].x + newDir.x,
              y: ai.body[0].y + newDir.y,
            }

            // Check if AI hits wall, reverse
            if (
              aiHead.x < 0 ||
              aiHead.x >= GRID.cols ||
              aiHead.y < 0 ||
              aiHead.y >= GRID.rows
            ) {
              // Try a different direction
              const altDir = { x: -newDir.x, y: -newDir.y }
              if (
                ai.body[0].x + altDir.x >= 0 &&
                ai.body[0].x + altDir.x < GRID.cols &&
                ai.body[0].y + altDir.y >= 0 &&
                ai.body[0].y + altDir.y < GRID.rows
              ) {
                aiDirectionsRef.current[idx] = altDir
                return {
                  ...ai,
                  body: [
                    { x: ai.body[0].x + altDir.x, y: ai.body[0].y + altDir.y },
                    ...ai.body.slice(0, -1),
                  ],
                }
              }
              return ai
            }

            return {
              ...ai,
              body: [aiHead, ...ai.body.slice(0, -1)],
            }
          })

          // Check collisions between player and AI
          let playerAte = false
          let playerDied = false
          const updatedAi = []

          for (const ai of newAi) {
            const playerLength = newPlayerBody.length
            const aiLength = ai.body.length

            // Player eats AI (player is longer)
            if (playerLength > aiLength && headCollidesWithBody(newPlayerBody, ai.body)) {
              playerAte = true
              // Grow player (add extra segment)
              newPlayerBody = [newPlayerBody[0], ...newPlayerBody]
              game.addScore(aiLength * 10)
              // Respawn AI
              const newPos = {
                x: Math.floor(Math.random() * GRID.cols),
                y: Math.floor(Math.random() * GRID.rows),
              }
              updatedAi.push({
                body: [newPos, { x: newPos.x - 1, y: newPos.y }],
                color: ai.color,
                glowColor: ai.glowColor,
                headColor: ai.headColor,
              })
              aiDirectionsRef.current[newAi.indexOf(ai)] = { x: 1, y: 0 }
            }
            // AI eats player (AI is longer or equal)
            else if (aiLength >= playerLength && headCollidesWithBody(ai.body, newPlayerBody)) {
              playerDied = true
              updatedAi.push(ai)
            }
            // Both collide at same time - player dies
            else if (headCollidesWithBody(newPlayerBody, ai.body) && playerLength <= aiLength) {
              playerDied = true
              updatedAi.push(ai)
            } else {
              updatedAi.push(ai)
            }
          }

          if (playerDied) {
            handleDie()
          }

          return playerAte ? newAi : updatedAi
        })

        return newPlayerBody
      })
    }, TICK_MS)

    return () => clearInterval(tick)
  }, [status, game, handleDie])

  // Initial setup
  useEffect(() => {
    initGame()
  }, [initGame])

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title glitch" data-text="SNAKE BATTLE ROYALE">
          SNAKE BATTLE ROYALE
        </h1>
        <p className="app-subtitle">CYBERPUNK ARENA</p>
      </header>

      <main className="app-main">
        <SnakeSelector selectedId={selectedTypeId} onSelect={setSelectedTypeId} />

        <div className="game-arena-container">
          <div className="game-canvas-wrapper">
            <GameArena
              grid={GRID}
              playerBody={playerBody}
              playerType={selectedType}
              aiSnakes={aiSnakes}
            />

            {status === GameStatus.IDLE && (
              <div className="start-overlay">
                <p className="start-text">
                  Select your snake type and press START
                </p>
              </div>
            )}

            {status === GameStatus.PAUSED && (
              <div className="pause-overlay">
                <span className="pause-text">// PAUSED //</span>
              </div>
            )}

            {status === GameStatus.DEAD && (
              <div className="game-over-overlay">
                <span className="game-over-title">GAME OVER</span>
                <p className="final-score">
                  Final Score: <span>{score}</span>
                </p>
                <button className="btn-neon success" onClick={handleStart}>
                  ▶ RETRY
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="score-panel">
          <ScoreBoard score={score} status={status} />
          <Controls
            status={status}
            onStart={handleStart}
            onPause={game.pause}
            onResume={game.resume}
          />
          <div className="instructions">
            <p>Controls:</p>
            <p><kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd> or <kbd>WASD</kbd></p>
          </div>
          <ScoreHistory scores={scores} />
        </div>
      </main>
    </div>
  )
}

export default App