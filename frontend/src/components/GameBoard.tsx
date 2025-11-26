import { useEffect, useRef } from 'react';
import { GameState, GRID_SIZE, CELL_SIZE } from '@/lib/gameLogic';

interface GameBoardProps {
  gameState: GameState;
}

export const GameBoard = ({ gameState }: GameBoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0e14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#1a2332';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw food
    const foodGradient = ctx.createRadialGradient(
      gameState.food.x * CELL_SIZE + CELL_SIZE / 2,
      gameState.food.y * CELL_SIZE + CELL_SIZE / 2,
      0,
      gameState.food.x * CELL_SIZE + CELL_SIZE / 2,
      gameState.food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2
    );
    foodGradient.addColorStop(0, '#3b82f6');
    foodGradient.addColorStop(1, '#1e40af');

    ctx.fillStyle = foodGradient;
    ctx.shadowColor = '#3b82f6';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(
      gameState.food.x * CELL_SIZE + CELL_SIZE / 2,
      gameState.food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake
    gameState.snake.forEach((segment, index) => {
      const isHead = index === 0;
      
      if (isHead) {
        // Snake head with glow
        const headGradient = ctx.createRadialGradient(
          segment.x * CELL_SIZE + CELL_SIZE / 2,
          segment.y * CELL_SIZE + CELL_SIZE / 2,
          0,
          segment.x * CELL_SIZE + CELL_SIZE / 2,
          segment.y * CELL_SIZE + CELL_SIZE / 2,
          CELL_SIZE / 2
        );
        headGradient.addColorStop(0, '#22c55e');
        headGradient.addColorStop(1, '#16a34a');

        ctx.fillStyle = headGradient;
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 20;
      } else {
        // Snake body
        const opacity = 1 - (index / gameState.snake.length) * 0.3;
        ctx.fillStyle = `rgba(34, 197, 94, ${opacity})`;
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 10;
      }

      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
    });

    ctx.shadowBlur = 0;
  }, [gameState]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        className="border-2 border-primary rounded-lg shadow-glow-green"
      />
    </div>
  );
};
