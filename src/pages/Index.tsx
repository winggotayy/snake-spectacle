import { Header } from '@/components/Header';
import { GameBoard } from '@/components/GameBoard';
import { GameControls } from '@/components/GameControls';
import { useGame } from '@/hooks/useGame';

const Index = () => {
  const {
    gameState,
    isPlaying,
    isPaused,
    startGame,
    pauseGame,
    changeMode,
  } = useGame();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-3 bg-gradient-neon bg-clip-text text-transparent">
              NEON SNAKE
            </h1>
            <p className="text-muted-foreground">
              Classic arcade action with a cyberpunk twist
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr,350px] gap-8 items-start">
            <div className="flex justify-center">
              <GameBoard gameState={gameState} />
            </div>

            <GameControls
              isPlaying={isPlaying}
              isPaused={isPaused}
              gameOver={gameState.gameOver}
              score={gameState.score}
              mode={gameState.mode}
              onStart={startGame}
              onPause={pauseGame}
              onModeChange={changeMode}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
