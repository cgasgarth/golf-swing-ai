import { Database } from 'bun:sqlite';

let db = new Database('golf_swing.sqlite');

const initDb = (database: Database) => {
  db = database;
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
      original_filename TEXT,
      mime_type TEXT,
      file_size INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  try {
    db.run('ALTER TABLE swings ADD COLUMN original_filename TEXT');
  } catch {}
  try {
    db.run('ALTER TABLE swings ADD COLUMN mime_type TEXT');
  } catch {}
  try {
    db.run('ALTER TABLE swings ADD COLUMN file_size INTEGER');
  } catch {}
  try {
    db.run('ALTER TABLE swing_analyses ADD COLUMN boundaries_json TEXT');
  } catch {}

    db.run(`
      CREATE TABLE IF NOT EXISTS swing_analyses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        swing_id INTEGER NOT NULL,
        phase_tags TEXT,
        boundaries_json TEXT,
        metrics_json TEXT,
        tips_json TEXT,
        drills_json TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(swing_id) REFERENCES swings(id) ON DELETE CASCADE
      )
    `);

};

initDb(db);

export const resetDb = (path: string = ':memory:') => {
  const newDb = new Database(path);
  initDb(newDb);
  return newDb;
};

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
  original_filename?: string | null;
  mime_type?: string | null;
  file_size?: number | null;
  created_at: string;
}

export const swingService = {
  uploadSwing: (userId: number, videoUrl: string, metadata?: { filename?: string; mimeType?: string; size?: number }) => {
    const { filename = null, mimeType = null, size = null } = metadata || {};
    const result = db.run(
      'INSERT INTO swings (user_id, video_url, original_filename, mime_type, file_size) VALUES (?, ?, ?, ?, ?)',
      [userId, videoUrl, filename, mimeType, size]
    );
    return { success: true, swingId: result.lastInsertRowid, userId };
  },
  getUserSwings: (userId: number): Swing[] => {
    return db.query('SELECT * FROM swings WHERE user_id = ?').all(userId) as Swing[];
  }
};

interface SwingAnalysis {
  id: number;
  swing_id: number;
  phase_tags: string | null;
  metrics_json: string | null;
  tips_json: string | null;
  drills_json: string | null;
  created_at: string;
}

export const analysisService = {
  saveAnalysis: (swingId: number, analysis: { phaseTags: string; boundaries?: any; metrics: any; tips: any; drills: any }) => {
    db.run(
      'INSERT INTO swing_analyses (swing_id, phase_tags, boundaries_json, metrics_json, tips_json, drills_json) VALUES (?, ?, ?, ?, ?, ?)',
      [
        swingId,
        analysis.phaseTags,
        JSON.stringify(analysis.boundaries ?? []),
        JSON.stringify(analysis.metrics),
        JSON.stringify(analysis.tips),
        JSON.stringify(analysis.drills),
      ]
    );
    return { success: true };
  },
  getAnalysisForSwing: (swingId: number): any | null => {
    const result = db.query('SELECT * FROM swing_analyses WHERE swing_id = ?').get(swingId) as any | null;
    if (!result) return null;
    return {
      ...result,
      metrics: JSON.parse(result.metrics_json || '[]'),
      boundaries: JSON.parse(result.boundaries_json || '[]'),
      tips: JSON.parse(result.tips_json || '[]'),
      drills: JSON.parse(result.drills_json || '[]'),
    };
  },
  getAnalysisForUser: (userId: number) => {
    return db.query(`
      SELECT sa.* FROM swing_analyses sa 
      JOIN swings s ON sa.swing_id = s.id 
      WHERE s.user_id = ?
    `).all(userId) as SwingAnalysis[];
  }
};
