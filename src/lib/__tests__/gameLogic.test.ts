import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  generateFood,
  getOppositeDirection,
  isValidDirectionChange,
  getNextHeadPosition,
  checkWallCollision,
  checkSelfCollision,
  checkFoodCollision,
  updateGameState,
  GRID_SIZE,
} from '../gameLogic';

describe('gameLogic', () => {
  describe('createInitialState', () => {
    it('should create initial state with walls mode', () => {
      const state = createInitialState('walls');
      expect(state.mode).toBe('walls');
      expect(state.snake.length).toBe(3);
      expect(state.score).toBe(0);
      expect(state.gameOver).toBe(false);
      expect(state.direction).toBe('RIGHT');
    });

    it('should create initial state with passthrough mode', () => {
      const state = createInitialState('passthrough');
      expect(state.mode).toBe('passthrough');
    });
  });

  describe('generateFood', () => {
    it('should generate food not on snake', () => {
      const snake = [{ x: 0, y: 0 }];
      const food = generateFood(snake);
      expect(food.x).toBeGreaterThanOrEqual(0);
      expect(food.x).toBeLessThan(GRID_SIZE);
      expect(food.y).toBeGreaterThanOrEqual(0);
      expect(food.y).toBeLessThan(GRID_SIZE);
      expect(food).not.toEqual(snake[0]);
    });
  });

  describe('direction helpers', () => {
    it('should get opposite directions correctly', () => {
      expect(getOppositeDirection('UP')).toBe('DOWN');
      expect(getOppositeDirection('DOWN')).toBe('UP');
      expect(getOppositeDirection('LEFT')).toBe('RIGHT');
      expect(getOppositeDirection('RIGHT')).toBe('LEFT');
    });

    it('should validate direction changes', () => {
      expect(isValidDirectionChange('UP', 'DOWN')).toBe(false);
      expect(isValidDirectionChange('UP', 'LEFT')).toBe(true);
      expect(isValidDirectionChange('LEFT', 'RIGHT')).toBe(false);
    });
  });

  describe('getNextHeadPosition', () => {
    it('should move head in correct direction', () => {
      const head = { x: 5, y: 5 };
      expect(getNextHeadPosition(head, 'UP', 'walls')).toEqual({ x: 5, y: 4 });
      expect(getNextHeadPosition(head, 'DOWN', 'walls')).toEqual({ x: 5, y: 6 });
      expect(getNextHeadPosition(head, 'LEFT', 'walls')).toEqual({ x: 4, y: 5 });
      expect(getNextHeadPosition(head, 'RIGHT', 'walls')).toEqual({ x: 6, y: 5 });
    });

    it('should wrap around in passthrough mode', () => {
      const head = { x: 0, y: 0 };
      expect(getNextHeadPosition(head, 'LEFT', 'passthrough')).toEqual({ 
        x: GRID_SIZE - 1, 
        y: 0 
      });
      expect(getNextHeadPosition(head, 'UP', 'passthrough')).toEqual({ 
        x: 0, 
        y: GRID_SIZE - 1 
      });
    });
  });

  describe('collision detection', () => {
    it('should detect wall collision', () => {
      expect(checkWallCollision({ x: -1, y: 5 })).toBe(true);
      expect(checkWallCollision({ x: GRID_SIZE, y: 5 })).toBe(true);
      expect(checkWallCollision({ x: 5, y: -1 })).toBe(true);
      expect(checkWallCollision({ x: 5, y: GRID_SIZE })).toBe(true);
      expect(checkWallCollision({ x: 5, y: 5 })).toBe(false);
    });

    it('should detect self collision', () => {
      const body = [{ x: 1, y: 1 }, { x: 2, y: 1 }];
      expect(checkSelfCollision({ x: 1, y: 1 }, body)).toBe(true);
      expect(checkSelfCollision({ x: 3, y: 1 }, body)).toBe(false);
    });

    it('should detect food collision', () => {
      const food = { x: 5, y: 5 };
      expect(checkFoodCollision({ x: 5, y: 5 }, food)).toBe(true);
      expect(checkFoodCollision({ x: 4, y: 5 }, food)).toBe(false);
    });
  });

  describe('updateGameState', () => {
    it('should move snake forward', () => {
      const state = createInitialState('walls');
      const newState = updateGameState(state);
      expect(newState.snake[0].x).toBe(state.snake[0].x + 1);
    });

    it('should grow snake when eating food', () => {
      const state = createInitialState('walls');
      // Position food right in front of snake
      const foodState = {
        ...state,
        food: { x: state.snake[0].x + 1, y: state.snake[0].y },
      };
      const newState = updateGameState(foodState);
      expect(newState.snake.length).toBe(state.snake.length + 1);
      expect(newState.score).toBe(10);
    });

    it('should end game on wall collision in walls mode', () => {
      const state = createInitialState('walls');
      const edgeState = {
        ...state,
        snake: [{ x: GRID_SIZE - 1, y: 10 }],
        direction: 'RIGHT' as const,
      };
      const newState = updateGameState(edgeState);
      expect(newState.gameOver).toBe(true);
    });

    it('should wrap around in passthrough mode', () => {
      const state = createInitialState('passthrough');
      const edgeState = {
        ...state,
        snake: [{ x: GRID_SIZE - 1, y: 10 }],
        direction: 'RIGHT' as const,
      };
      const newState = updateGameState(edgeState);
      expect(newState.gameOver).toBe(false);
      expect(newState.snake[0].x).toBe(0);
    });

    it('should end game on self collision', () => {
      const state = createInitialState('walls');
      const collisionState = {
        ...state,
        snake: [
          { x: 5, y: 5 },
          { x: 4, y: 5 },
          { x: 4, y: 6 },
          { x: 5, y: 6 },
        ],
        direction: 'DOWN' as const,
      };
      const newState = updateGameState(collisionState, 'RIGHT');
      const finalState = updateGameState(newState, 'UP');
      expect(finalState.gameOver).toBe(true);
    });
  });
});
