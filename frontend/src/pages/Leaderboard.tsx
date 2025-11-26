import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { leaderboardApi, LeaderboardEntry } from '@/services/api';
import { Trophy, Medal, Award } from 'lucide-react';
import { GameMode } from '@/lib/gameLogic';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState<GameMode | undefined>(undefined);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await leaderboardApi.getLeaderboard(selectedMode);
        setLeaderboard(data);
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [selectedMode]);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Award className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="w-5 text-center font-bold text-muted-foreground">{index + 1}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-neon bg-clip-text text-transparent">
              LEADERBOARD
            </h1>
            <p className="text-muted-foreground">
              Top players from around the world
            </p>
          </div>

          <Card className="shadow-glow-blue">
            <CardHeader>
              <CardTitle>High Scores</CardTitle>
              <CardDescription>
                Filter by game mode to see who's leading
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full" onValueChange={(value) => {
                setSelectedMode(value === 'all' ? undefined : value as GameMode);
              }}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="all">All Modes</TabsTrigger>
                  <TabsTrigger value="walls">Walls</TabsTrigger>
                  <TabsTrigger value="passthrough">Pass-through</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-2">
                  {loading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading...</div>
                  ) : (
                    leaderboard.map((entry, index) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {getRankIcon(index)}
                          <div>
                            <div className="font-medium">{entry.username}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(entry.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={entry.mode === 'walls' ? 'default' : 'secondary'}>
                            {entry.mode}
                          </Badge>
                          <span className="text-2xl font-bold text-primary">{entry.score}</span>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="walls" className="space-y-2">
                  {loading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading...</div>
                  ) : (
                    leaderboard.map((entry, index) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {getRankIcon(index)}
                          <div>
                            <div className="font-medium">{entry.username}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(entry.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <span className="text-2xl font-bold text-primary">{entry.score}</span>
                      </div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="passthrough" className="space-y-2">
                  {loading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading...</div>
                  ) : (
                    leaderboard.map((entry, index) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {getRankIcon(index)}
                          <div>
                            <div className="font-medium">{entry.username}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(entry.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <span className="text-2xl font-bold text-primary">{entry.score}</span>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
