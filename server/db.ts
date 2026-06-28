import { Database } from 'bun:sqlite';

const db = new Database('golf_swing.sqlite');

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS swings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    video_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )
`);

interface User {
  id: number;
  username: string;
  password_hash: string;
}

interface AuthResult {
  success: boolean;
  user?: { id: number; username: string };
  error?: string;
}

export const authService = {
  register: async (username: string, password: string): Promise<AuthResult> => {
    try {
      const hash = await Bun.password.hash(password);
      db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash]);
      return { success: true };
    } catch {
      return { success: false, error: 'User exists' };
    }
  },
  login: async (username: string, password: string): Promise<AuthResult> => {
    const user = db.query('SELECT * FROM users WHERE username = ?').get(username) as User | null;
    if (user && await Bun.password.verify(password, user.password_hash)) {
      return { success: true, user: { id: user.id, username: user.username } };
    }
    return { success: false, error: 'Invalid credentials' };
  }
};

interface Swing {
  id: number;
  user_id: number;
  video_url: string;
  created_at: string;
}

export const swingService = {
  uploadSwing: (userId: number, videoUrl: string) => {
    db.run('INSERT INTO swings (user_id, video_url) VALUES (?, ?)', [userId, videoUrl]);
    return { success: true };
  },
  getUserSwings: (userId: number): Swing[] => {
    return db.query('SELECT * FROM swings WHERE user_id = ?').all(userId) as Swing[];
  }
};
