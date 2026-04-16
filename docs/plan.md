# Snake Battle Royale - Implementation Plan

## Goal Description

Build a cyberpunk-themed Snake Battle Royale game using React (frontend-only). Players control a snake that can eat AI-controlled opponent snakes in a battle royale arena. The game features score persistence via localStorage, snake type selection, pause/start controls, and dynamic visual effects.

## Acceptance Criteria

- AC-1: Game loads and displays cyberpunk-styled interface with snake type selector
  - Positive Tests (expected to PASS):
    - Application renders without errors in modern browsers
    - Snake type selector shows at least 5 distinct snake options
    - Cyberpunk visual theme is applied (neon colors, glow effects, dark background)
  - Negative Tests (expected to FAIL):
    - Application crashes on initial load
    - Snake type selector is missing or has fewer than 5 options
    - Interface appears in default browser styling without cyberpunk theme

- AC-2: Player can select snake type and start game
  - Positive Tests:
    - Clicking a snake type updates the player's snake appearance
    - Start button begins the game with selected snake
    - Snake moves continuously after game starts
  - Negative Tests:
    - Snake type selection has no effect on snake appearance
    - Start button does not initiate game movement

- AC-3: Score system persists across sessions via localStorage
  - Positive Tests:
    - Current score increases when eating smaller snakes
    - Score history displays after reopening the page
    - Previous session scores are visible in history
  - Negative Tests:
    - Score resets to 0 after page refresh
    - Score history section is empty on first visit (expected) but empty after playing (bug)

- AC-4: Battle royale mechanics - eating smaller snakes gains points, larger snakes cause death
  - Positive Tests:
    - Player snake grows when eating a smaller snake
    - Score increases when consuming smaller snakes
    - Player dies when colliding with a larger snake
  - Negative Tests:
    - Eating smaller snakes does not increase score or length
    - Colliding with larger snake allows player to continue (should die)

- AC-5: Game controls (pause/start) function correctly
  - Positive Tests:
    - Pause button stops snake movement
    - Resume button continues from paused position
    - Game state is maintained during pause
  - Negative Tests:
    - Pause does not stop movement
    - Resume does not restore game state correctly

- AC-6: AI opponents exist and behave in the arena
  - Positive Tests:
    - Multiple AI snakes appear in the arena
    - AI snakes move independently
    - AI snakes can be eaten by player
  - Negative Tests:
    - No AI opponents spawn in battle royale mode
    - AI snakes are static and do not move

- AC-7: Dynamic visual effects enhance the game
  - Positive Tests:
    - Snake movement has smooth animation
    - Eating effects include visual feedback (particles, flash)
    - Death effect displays when player loses
  - Negative Tests:
    - Movement appears choppy or laggy
    - No visual feedback on eating snakes

## Path Boundaries

### Upper Bound (Maximum Acceptable Scope)
The implementation includes: React-based single-page application with cyberpunk visual theme, 5+ selectable snake types with unique visual designs, localStorage-based score persistence with history display, battle royale mode with AI-controlled opponent snakes, pause/resume functionality, dynamic visual effects (glow, particles, smooth animations), responsive design for desktop browsers, and comprehensive README documentation.

### Lower Bound (Minimum Acceptable Scope)
The implementation includes: Basic React game with cyberpunk styling, 5 snake types with distinct appearances, functional score tracking saved to localStorage, battle arena with at least 2 AI opponent snakes, working pause/start controls, and essential visual feedback for collisions.

### Allowed Choices
- Can use: React with Vite, CSS animations or Framer Motion for effects, localStorage for persistence, Canvas or DOM-based rendering
- Cannot use: Backend services, WebSocket or real-time multiplayer, external databases

> **Note on Deterministic Designs**: The draft specifies React frontend-only, cyberpunk style, and snake eating mechanics. These constraints are fixed and reflected in the path boundaries.

## Feasibility Hints and Suggestions

> **Note**: This section is for reference and understanding only. These are conceptual suggestions, not prescriptive requirements.

### Conceptual Approach
```
React App Structure:
├── src/
│   ├── components/
│   │   ├── GameArena.jsx     # Main game canvas/board
│   │   ├── Snake.jsx         # Snake rendering component
│   │   ├── SnakeSelector.jsx # Left panel snake type picker
│   │   ├── ScoreBoard.jsx    # Current score display
│   │   ├── ScoreHistory.jsx  # Historical scores list
│   │   └── Controls.jsx      # Start/Pause buttons
│   ├── hooks/
│   │   ├── useGameState.js   # Game state management
│   │   ├── useSnake.js       # Snake movement logic
│   │   └── useStorage.js     # localStorage wrapper
│   ├── utils/
│   │   ├── collision.js      # Collision detection
│   │   └── ai.js             # AI snake behavior
│   ├── styles/
│   │   └── cyberpunk.css     # Theme styling
│   └── App.jsx
```

### Relevant References
- React game development patterns
- localStorage API for browser persistence
- Canvas 2D rendering or React state-based rendering
- CSS animations for visual effects

## Dependencies and Sequence

### Milestones
1. **Project Setup**: Initialize React project with Vite, configure build tools
2. **Core Game Engine**: Implement snake movement, grid system, collision detection
3. **UI Components**: Build snake selector, score display, control buttons
4. **Battle Royale Logic**: Add AI opponents, eating mechanics, win/lose conditions
5. **Persistence Layer**: Implement localStorage for score history
6. **Visual Polish**: Add cyberpunk effects, animations, dynamic elements
7. **Documentation**: Write comprehensive README

## Task Breakdown

| Task ID | Description | Target AC | Tag (`coding`/`analyze`) | Depends On |
|---------|-------------|-----------|----------------------------|------------|
| task1 | Initialize React project with Vite and dependencies | AC-1 | coding | - |
| task2 | Create game board/arena component with grid system | AC-1, AC-6 | coding | task1 |
| task3 | Implement snake rendering with 5+ types and cyberpunk theme | AC-1, AC-2 | coding | task2 |
| task4 | Build snake type selector UI in left panel | AC-2 | coding | task3 |
| task5 | Implement basic snake movement controls | AC-2 | coding | task3 |
| task6 | Add AI opponent snakes with basic behavior | AC-6 | coding | task5 |
| task7 | Implement collision detection (eat smaller, die to larger) | AC-4 | coding | task6 |
| task8 | Add score tracking and localStorage persistence | AC-3 | coding | task7 |
| task9 | Implement pause/start controls | AC-5 | coding | task8 |
| task10 | Add dynamic visual effects (glow, particles, animations) | AC-7 | coding | task9 |
| task11 | Create score history display component | AC-3 | coding | task8 |
| task12 | Write comprehensive README documentation | - | coding | task10 |

## Claude-Codex Deliberation

### Agreements
- Both Claude and Codex agree that a frontend-only battle royale Snake game is achievable with React
- localStorage is the appropriate solution for score persistence (no backend)
- AI opponents are the correct approach for battle royale without real multiplayer
- Cyberpunk styling with neon effects is well-suited for this project

### Resolved Disagreements
- **Multiplayer scope**: Codex suggested considering online multiplayer, but the draft explicitly states "只需要前端即可，没有后端" (frontend only, no backend), so single-player with AI opponents is the resolved approach.
- **Movement style**: Codex asked about grid vs smooth movement. The classic Snake game uses grid-based movement, which is simpler and more appropriate for this project.

### Convergence Status
- Final Status: `partially_converged`
- Note: In direct mode, the convergence loop was skipped. Manual review is recommended before implementation.

## Pending User Decisions

- DEC-1: Snake type count
  - Claude Position: Implement exactly 5 snake types as specified in draft
  - Codex Position: Suggested confirming exact number
  - Tradeoff Summary: Draft says "支持5种至少" (at least 5 types). 5 types balances variety with implementation complexity.
  - Decision Status: PENDING - defaults to 5 types

- DEC-2: Movement mechanics
  - Claude Position: Grid-based movement (classic Snake style)
  - Codex Position: Asked for clarification
  - Tradeoff Summary: Grid-based is simpler, matches classic Snake expectations
  - Decision Status: PENDING - defaults to grid-based

- DEC-3: AI opponent count
  - Claude Position: Start with 3-5 AI snakes for battle royale feel
  - Codex Position: Asked for clarification on concurrent players
  - Tradeoff Summary: Need enough opponents for battle royale experience without overwhelming performance
  - Decision Status: PENDING - defaults to 4 AI opponents

## Implementation Notes

### Code Style Requirements
- Implementation code and comments must NOT contain plan-specific terminology such as "AC-", "Milestone", "Step", "Phase", or similar workflow markers
- These terms are for plan documentation only, not for the resulting codebase
- Use descriptive, domain-appropriate naming in code instead

### Translated Language Variant
When `alternative_plan_language` is configured, a translated variant of this plan is generated.

--- Original Design Draft Start ---

# Requirement

现在我想写一个贪吃蛇的游戏，页面要高端一些，不能太简单，支持分数记录（页面本地），下一次打开还能看到自己的分数记录历史记录；需要多一些动态效果，贪吃蛇左侧可以选择蛇的类型；支持暂停，开始，支持吃其他蛇，如果比自己大就死亡，如果比自己小就获得分数；只需要前端即可，没有后端；使用react

大逃杀，支持5种至少，赛博风格

---

## Standard Deliverables (mandatory for every project)

- **README.md** — must be included at the project root with: project title & description, prerequisites, installation steps, usage examples with code snippets, configuration options, and project structure overview.
- **Git commits** — use conventional commit prefix `feat:` for all commits.

--- Original Design Draft End ---