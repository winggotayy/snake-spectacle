import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { GameMode } from '@/lib/gameLogic';
import { Badge } from '@/components/ui/badge';

interface GameControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
  score: number;
  mode: GameMode;
  onStart: () => void;
  onPause: () => void;
  onModeChange: (mode: GameMode) => void;
}

export const GameControls = ({
  isPlaying,
  isPaused,
  gameOver,
  score,
  mode,
  onStart,
  onPause,
  onModeChange,
}: GameControlsProps) => {
  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-6 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm font-medium">SCORE</span>
          <span className="text-3xl font-bold text-primary shadow-glow-green">{score}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-muted-foreground text-sm font-medium">MODE</div>
        <div className="flex gap-2">
          <Button
            variant={mode === 'walls' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => onModeChange('walls')}
            disabled={isPlaying}
          >
            Walls
          </Button>
          <Button
            variant={mode === 'passthrough' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => onModeChange('passthrough')}
            disabled={isPlaying}
          >
            Pass-through
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {mode === 'walls' 
            ? 'Hit the walls and you lose!' 
            : 'Pass through walls to the other side'}
        </p>
      </div>

      <div className="space-y-3">
        {!isPlaying || gameOver ? (
          <Button 
            className="w-full shadow-glow-green" 
            size="lg" 
            onClick={onStart}
          >
            <Play className="mr-2 h-4 w-4" />
            {gameOver ? 'Play Again' : 'Start Game'}
          </Button>
        ) : (
          <Button 
            className="w-full" 
            size="lg" 
            onClick={onPause}
            variant="secondary"
          >
            {isPaused ? (
              <>
                <Play className="mr-2 h-4 w-4" />
                Resume
              </>
            ) : (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            )}
          </Button>
        )}
        
        {gameOver && (
          <div className="text-center">
            <Badge variant="destructive" className="text-lg py-2 px-4">
              Game Over!
            </Badge>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-border space-y-2">
        <div className="text-xs text-muted-foreground font-medium">CONTROLS</div>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>Arrow Keys or WASD to move</div>
          <div>Space to pause</div>
        </div>
      </div>
    </div>
  );
};
