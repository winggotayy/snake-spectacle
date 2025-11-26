import { describe, it, expect } from 'vitest';
import { getAINextMove } from '../aiPlayer';
import { Direction } from '../gameLogic';

describe('aiPlayer', () => {
  describe('getAINextMove', () => {
    it('should move towards food', () => {
      const state = {
        snake: [{ x: 5, y: 5 }],
        food: { x: 5, y: 3 },
        direction: 'UP' as Direction,
        mode: 'walls' as const,
      };
      
      const move = getAINextMove(state);
      expect(move).toBe('UP'); // Food is above
    });

    it('should avoid walls in walls mode', () => {
      const state = {
        snake: [{ x: 0, y: 5 }],
        food: { x: 10, y: 5 },
        direction: 'RIGHT' as Direction,
        mode: 'walls' as const,
      };
      
      const move = getAINextMove(state);
      expect(move).not.toBe('LEFT'); // Would hit wall
    });

    it('should avoid self collision', () => {
      const state = {
        snake: [
          { x: 5, y: 5 },
          { x: 4, y: 5 },
          { x: 4, y: 6 },
        ],
        food: { x: 10, y: 10 },
        direction: 'RIGHT' as Direction,
        mode: 'walls' as const,
      };
      
      const move = getAINextMove(state);
      expect(move).not.toBe('DOWN'); // Would collide with body
    });

    it('should not reverse direction', () => {
      const state = {
        snake: [
          { x: 5, y: 5 },
          { x: 4, y: 5 },
        ],
        food: { x: 3, y: 5 },
        direction: 'RIGHT' as Direction,
        mode: 'walls' as const,
      };
      
      const move = getAINextMove(state);
      expect(move).not.toBe('LEFT'); // Can't reverse
    });

    it('should work in passthrough mode', () => {
      const state = {
        snake: [{ x: 0, y: 5 }],
        food: { x: 19, y: 5 },
        direction: 'LEFT' as Direction,
        mode: 'passthrough' as const,
      };
      
      const move = getAINextMove(state);
      // In passthrough mode, going left would wrap around and be closer
      expect(['LEFT', 'UP', 'DOWN']).toContain(move);
    });
  });
});
