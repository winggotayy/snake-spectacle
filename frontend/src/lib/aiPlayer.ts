// AI logic for simulated players in watch mode

import { Position, Direction, getNextHeadPosition, checkWallCollision, checkSelfCollision, GameMode, GRID_SIZE } from './gameLogic';

export interface AIGameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  mode: GameMode;
}

// Simple AI that tries to move towards food while avoiding obstacles
export const getAINextMove = (state: AIGameState): Direction => {
  const head = state.snake[0];
  const food = state.food;
  
  // Calculate possible moves
  const moves: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
  const validMoves = moves.filter(move => {
    // Don't reverse direction
    if (isOppositeDirection(move, state.direction)) return false;
    
    const nextPos = getNextHeadPosition(head, move, state.mode);
    
    // Check wall collision in walls mode
    if (state.mode === 'walls' && checkWallCollision(nextPos)) return false;
    
    // Check self collision
    if (checkSelfCollision(nextPos, state.snake.slice(1))) return false;
    
    return true;
  });
  
  if (validMoves.length === 0) {
    return state.direction; // Keep going, game over next frame
  }
  
  // Score each move based on distance to food
  const scoredMoves = validMoves.map(move => {
    const nextPos = getNextHeadPosition(head, move, state.mode);
    const distance = getDistance(nextPos, food, state.mode);
    return { move, distance };
  });
  
  // Choose move that gets closest to food
  scoredMoves.sort((a, b) => a.distance - b.distance);
  
  return scoredMoves[0].move;
};

const isOppositeDirection = (dir1: Direction, dir2: Direction): boolean => {
  return (
    (dir1 === 'UP' && dir2 === 'DOWN') ||
    (dir1 === 'DOWN' && dir2 === 'UP') ||
    (dir1 === 'LEFT' && dir2 === 'RIGHT') ||
    (dir1 === 'RIGHT' && dir2 === 'LEFT')
  );
};

const getDistance = (pos1: Position, pos2: Position, mode: GameMode): number => {
  if (mode === 'passthrough') {
    // Calculate shortest distance considering wrapping
    const dx = Math.min(
      Math.abs(pos1.x - pos2.x),
      GRID_SIZE - Math.abs(pos1.x - pos2.x)
    );
    const dy = Math.min(
      Math.abs(pos1.y - pos2.y),
      GRID_SIZE - Math.abs(pos1.y - pos2.y)
    );
    return dx + dy;
  } else {
    // Manhattan distance for walls mode
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  }
};
