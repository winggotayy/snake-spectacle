import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogOut, Trophy, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-neon bg-clip-text text-transparent">
              NEON SNAKE
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              asChild
              className="shadow-glow-green"
            >
              <Link to="/">Play</Link>
            </Button>
            
            <Button
              variant={isActive('/leaderboard') ? 'default' : 'ghost'}
              asChild
            >
              <Link to="/leaderboard" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Leaderboard
              </Link>
            </Button>
            
            <Button
              variant={isActive('/watch') ? 'default' : 'ghost'}
              asChild
            >
              <Link to="/watch" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Watch
              </Link>
            </Button>

            <div className="ml-4 pl-4 border-l border-border flex items-center gap-2">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
                    <User className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">{user.username}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button variant="secondary" asChild className="shadow-glow-blue">
                  <Link to="/auth">Login</Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
