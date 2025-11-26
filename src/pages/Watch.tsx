import { useEffect, useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { sessionApi, GameSession } from '@/services/api';
import { GameBoard } from '@/components/GameBoard';
import { GameState, createInitialState, updateGameState, GRID_SIZE } from '@/lib/gameLogic';
import { getAINextMove } from '@/lib/aiPlayer';
import { Eye } from 'lucide-react';

const Watch = () => {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<GameSession | null>(null);
  const [gameState, setGameState] = useState<GameState>(createInitialState('walls'));
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await sessionApi.getActiveSessions();
        setSessions(data);
        if (data.length > 0 && !selectedSession) {
          setSelectedSession(data[0]);
        }
      } catch (error) {
        console.error('Failed to load sessions:', error);
      }
    };

    loadSessions();
    const interval = setInterval(loadSessions, 5000);
    return () => clearInterval(interval);
  }, [selectedSession]);

  useEffect(() => {
    if (!selectedSession) return;

    // Initialize game state for AI player
    const initialState = createInitialState('walls');
    setGameState(initialState);

    // AI game loop
    gameLoopRef.current = setInterval(() => {
      setGameState((prevState) => {
        if (prevState.gameOver) {
          // Restart AI game
          return createInitialState('walls');
        }

        const aiDirection = getAINextMove({
          snake: prevState.snake,
          food: prevState.food,
          direction: prevState.direction,
          mode: prevState.mode,
        });

        return updateGameState(prevState, aiDirection);
      });
    }, 150);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [selectedSession]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-neon bg-clip-text text-transparent">
              WATCH LIVE
            </h1>
            <p className="text-muted-foreground">
              See other players in action
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr,300px] gap-8">
            <div>
              <Card className="shadow-glow-blue">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    {selectedSession ? `Watching ${selectedSession.username}` : 'Select a player'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  {selectedSession ? (
                    <GameBoard gameState={gameState} />
                  ) : (
                    <div className="text-center py-16 text-muted-foreground">
                      No active games to watch
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedSession && (
                <div className="mt-4 flex justify-center">
                  <Badge variant="secondary" className="text-lg py-2 px-4">
                    Score: {gameState.score}
                  </Badge>
                </div>
              )}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Live Players</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sessions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No active sessions
                    </div>
                  ) : (
                    sessions.map((session) => (
                      <button
                        key={session.id}
                        onClick={() => setSelectedSession(session)}
                        className={`w-full p-4 rounded-lg border transition-all text-left ${
                          selectedSession?.id === session.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-muted/50 hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{session.username}</div>
                            <div className="text-sm text-muted-foreground">
                              Currently playing
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="default">Live</Badge>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Watch;
