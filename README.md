# Snake Battle Royale

A cyberpunk-themed Snake Battle Royale game built with React. Players control a snake in an arena with AI opponents, competing to eat smaller snakes while avoiding larger ones.

## Features

- **5 Snake Types**: Cyber Viper, Phantom, Inferno, Glitch, Void Shade - each with unique neon colors
- **Battle Royale Mode**: Compete against 4 AI-controlled opponent snakes
- **Size-Based Mechanics**: Eat snakes smaller than you to grow and gain points; collide with larger snakes and die
- **Score Persistence**: Your scores are saved to localStorage and displayed in a battle log
- **Cyberpunk Visual Theme**: Neon glow effects, glitch animations, dark background with scanlines
- **Controls**: Arrow keys or WASD for movement, pause/resume functionality

## Prerequisites

- Node.js 18+
- npm 9+

## Installation

```bash
# Install dependencies
npm install
```

## Usage

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## How to Play

1. **Select Your Snake**: Click on a snake type in the left panel to choose your fighter
2. **Start Game**: Click the START button to begin
3. **Move**: Use Arrow keys or WASD to control your snake
4. **Eat Smaller Snakes**: Navigate to eat AI snakes that are smaller than you
5. **Avoid Larger Snakes**: Stay away from snakes that are bigger than you
6. **Grow**: Each snake you eat makes you longer and grants points
7. **High Score**: Your scores are saved automatically to localStorage

## Controls

| Key | Action |
|-----|--------|
| Arrow Up / W | Move Up |
| Arrow Down / S | Move Down |
| Arrow Left / A | Move Left |
| Arrow Right / D | Move Right |

## Project Structure

```
src/
├── components/
│   ├── GameArena.jsx      # Main game canvas
│   ├── SnakeSelector.jsx  # Snake type selection panel
│   ├── Controls.jsx       # Start/Pause/Resume buttons
│   ├── ScoreBoard.jsx     # Current score display
│   └── ScoreHistory.jsx   # Historical scores
├── hooks/
│   ├── useGameState.js    # Game state management
│   ├── useSnake.js        # Snake movement logic
│   └── useStorage.js      # localStorage wrapper
├── utils/
│   ├── ai.js              # AI snake behavior
│   ├── collision.js       # Collision detection
│   └── storage.js         # localStorage helpers
├── styles/
│   └── cyberpunk.css      # Cyberpunk theme styles
└── App.jsx                # Main application
```

## Technology Stack

- React 18
- Vite
- Canvas API for game rendering
- localStorage for score persistence

## License

MIT