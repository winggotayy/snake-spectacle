// Core game logic for Snake

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameMode = 'passthrough' | 'walls';

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  score: number;
  gameOver: boolean;
  mode: GameMode;
}

export const GRID_SIZE = 20;
export const CELL_SIZE = 20;
export const INITIAL_SPEED = 150;

export const createInitialState = (mode: GameMode = 'walls'): GameState => {
  const center = Math.floor(GRID_SIZE / 2);
  return {
    snake: [
      { x: center, y: center },
      { x: center - 1, y: center },
      { x: center - 2, y: center },
    ],
    food: generateFood([{ x: center, y: center }]),
    direction: 'RIGHT',
    score: 0,
    gameOver: false,
    mode,
  };
};

export const generateFood = (snake: Position[]): Position => {
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
  
  return food;
};

export const getOppositeDirection = (direction: Direction): Direction => {
  const opposites: Record<Direction, Direction> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT',
  };
  return opposites[direction];
};

export const isValidDirectionChange = (current: Direction, next: Direction): boolean => {
  return getOppositeDirection(current) !== next;
};

export const getNextHeadPosition = (head: Position, direction: Direction, mode: GameMode): Position => {
  let newHead = { ...head };
  
  switch (direction) {
    case 'UP':
      newHead.y -= 1;
      break;
    case 'DOWN':
      newHead.y += 1;
      break;
    case 'LEFT':
      newHead.x -= 1;
      break;
    case 'RIGHT':
      newHead.x += 1;
      break;
  }
  
  // Handle passthrough mode
  if (mode === 'passthrough') {
    if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
    if (newHead.x >= GRID_SIZE) newHead.x = 0;
    if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
    if (newHead.y >= GRID_SIZE) newHead.y = 0;
  }
  
  return newHead;
};

export const checkWallCollision = (position: Position): boolean => {
  return position.x < 0 || position.x >= GRID_SIZE || position.y < 0 || position.y >= GRID_SIZE;
};

export const checkSelfCollision = (head: Position, body: Position[]): boolean => {
  return body.some(segment => segment.x === head.x && segment.y === head.y);
};

export const checkFoodCollision = (head: Position, food: Position): boolean => {
  return head.x === food.x && head.y === food.y;
};

export const updateGameState = (state: GameState, newDirection?: Direction): GameState => {
  if (state.gameOver) return state;
  
  const direction = newDirection && isValidDirectionChange(state.direction, newDirection) 
    ? newDirection 
    : state.direction;
  
  const newHead = getNextHeadPosition(state.snake[0], direction, state.mode);
  
  // Check wall collision in walls mode
  if (state.mode === 'walls' && checkWallCollision(newHead)) {
    return { ...state, gameOver: true };
  }
  
  // Check self collision
  if (checkSelfCollision(newHead, state.snake.slice(1))) {
    return { ...state, gameOver: true };
  }
  
  // Check food collision
  const ateFood = checkFoodCollision(newHead, state.food);
  
  let newSnake = [newHead, ...state.snake];
  if (!ateFood) {
    newSnake = newSnake.slice(0, -1);
  }
  
  const newFood = ateFood ? generateFood(newSnake) : state.food;
  const newScore = ateFood ? state.score + 10 : state.score;
  
  return {
    ...state,
    snake: newSnake,
    food: newFood,
    direction,
    score: newScore,
  };
};

export const getGameSpeed = (score: number): number => {
  const speedIncrease = Math.floor(score / 50) * 10;
  return Math.max(50, INITIAL_SPEED - speedIncrease);
};
