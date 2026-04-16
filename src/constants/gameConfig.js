// Game constants for Snake Battle Royale

export const GRID_COLS = 30;
export const GRID_ROWS = 20;
export const CELL_SIZE = 24; // px per cell

export const CANVAS_WIDTH = GRID_COLS * CELL_SIZE;
export const CANVAS_HEIGHT = GRID_ROWS * CELL_SIZE;

export const DIRECTIONS = {
  UP:    { x: 0,  y: -1 },
  DOWN:  { x: 0,  y:  1 },
  LEFT:  { x: -1, y:  0 },
  RIGHT: { x: 1,  y:  0 },
};

export const GAME_STATES = {
  IDLE:     'IDLE',
  PLAYING:  'PLAYING',
  PAUSED:   'PAUSED',
  GAME_OVER: 'GAME_OVER',
};

export const TICK_RATE_MS = 120; // milliseconds per game tick

export const FOOD_COLOR = '#ffff00';
export const FOOD_GLOW  = 'rgba(255, 255, 0, 0.8)';

export const GRID_LINE_COLOR   = 'rgba(0, 255, 65, 0.06)';
export const BG_COLOR          = '#050510';
export const ARENA_BORDER_COLOR = '#00ff41';
