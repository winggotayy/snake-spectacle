// Centralized mock API service for all backend calls

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  mode: 'passthrough' | 'walls';
  timestamp: Date;
}

export interface GameSession {
  id: string;
  username: string;
  score: number;
  isActive: boolean;
}

// Mock data
let mockUser: User | null = null;

const mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', username: 'SnakeMaster', score: 2850, mode: 'walls', timestamp: new Date('2025-11-26T10:30:00') },
  { id: '2', username: 'NeonViper', score: 2640, mode: 'walls', timestamp: new Date('2025-11-26T11:15:00') },
  { id: '3', username: 'ArcadeKing', score: 2420, mode: 'passthrough', timestamp: new Date('2025-11-26T09:45:00') },
  { id: '4', username: 'PixelHunter', score: 2210, mode: 'walls', timestamp: new Date('2025-11-26T12:00:00') },
  { id: '5', username: 'RetroGamer', score: 2050, mode: 'passthrough', timestamp: new Date('2025-11-26T08:20:00') },
  { id: '6', username: 'SpeedDemon', score: 1890, mode: 'walls', timestamp: new Date('2025-11-26T13:30:00') },
  { id: '7', username: 'CyberSnake', score: 1720, mode: 'passthrough', timestamp: new Date('2025-11-26T14:15:00') },
  { id: '8', username: 'NeonNinja', score: 1580, mode: 'walls', timestamp: new Date('2025-11-26T10:00:00') },
];

const mockActiveSessions: GameSession[] = [
  { id: '1', username: 'LivePlayer1', score: 450, isActive: true },
  { id: '2', username: 'ProGamer99', score: 820, isActive: true },
  { id: '3', username: 'SnakeHunter', score: 1120, isActive: true },
];

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!email || !password) {
      throw new Error('Invalid credentials');
    }
    
    const username = email.split('@')[0];
    mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email,
    };
    
    return mockUser;
  },
  
  signup: async (username: string, email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!username || !email || !password) {
      throw new Error('All fields are required');
    }
    
    mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email,
    };
    
    return mockUser;
  },
  
  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockUser = null;
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockUser;
  },
};

// Leaderboard API
export const leaderboardApi = {
  getLeaderboard: async (mode?: 'passthrough' | 'walls'): Promise<LeaderboardEntry[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = [...mockLeaderboard];
    if (mode) {
      filtered = filtered.filter(entry => entry.mode === mode);
    }
    
    return filtered.sort((a, b) => b.score - a.score);
  },
  
  submitScore: async (score: number, mode: 'passthrough' | 'walls'): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (mockUser) {
      mockLeaderboard.push({
        id: Math.random().toString(36).substr(2, 9),
        username: mockUser.username,
        score,
        mode,
        timestamp: new Date(),
      });
    }
  },
};

// Live sessions API
export const sessionApi = {
  getActiveSessions: async (): Promise<GameSession[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockActiveSessions];
  },
  
  getSessionById: async (id: string): Promise<GameSession | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockActiveSessions.find(s => s.id === id) || null;
  },
};
