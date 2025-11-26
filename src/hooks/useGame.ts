import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Direction, createInitialState, updateGameState, getGameSpeed, GameMode } from '@/lib/gameLogic';
import { leaderboardApi } from '@/services/api';

export const useGame = (initialMode: GameMode = 'walls') => {
  const [gameState, setGameState] = useState<GameState>(() => createInitialState(initialMode));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const nextDirectionRef = useRef<Direction>(gameState.direction);

  const startGame = useCallback(() => {
    setGameState(createInitialState(gameState.mode));
    setIsPlaying(true);
    setIsPaused(false);
    nextDirectionRef.current = 'RIGHT';
  }, [gameState.mode]);

  const pauseGame = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const changeDirection = useCallback((direction: Direction) => {
    nextDirectionRef.current = direction;
  }, []);

  const changeMode = useCallback((mode: GameMode) => {
    setGameState(createInitialState(mode));
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const submitScore = useCallback(async () => {
    if (gameState.score > 0) {
      try {
        await leaderboardApi.submitScore(gameState.score, gameState.mode);
      } catch (error) {
        console.error('Failed to submit score:', error);
      }
    }
  }, [gameState.score, gameState.mode]);

  useEffect(() => {
    if (!isPlaying || isPaused || gameState.gameOver) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      
      if (gameState.gameOver && isPlaying) {
        submitScore();
      }
      
      return;
    }

    const speed = getGameSpeed(gameState.score);
    
    gameLoopRef.current = setInterval(() => {
      setGameState(prevState => updateGameState(prevState, nextDirectionRef.current));
    }, speed);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, isPaused, gameState.gameOver, gameState.score, isPlaying, submitScore]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying || isPaused) return;

      const directionMap: Record<string, Direction> = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
        w: 'UP',
        s: 'DOWN',
        a: 'LEFT',
        d: 'RIGHT',
      };

      const direction = directionMap[e.key];
      if (direction) {
        e.preventDefault();
        changeDirection(direction);
      }

      if (e.key === ' ') {
        e.preventDefault();
        pauseGame();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, isPaused, changeDirection, pauseGame]);

  return {
    gameState,
    isPlaying,
    isPaused,
    startGame,
    pauseGame,
    changeDirection,
    changeMode,
  };
};
