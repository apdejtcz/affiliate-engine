import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DATABASE_URL || path.join(__dirname, 'app.sqlite');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function query<T = any>(sql: string, params?: any[]): T[] {
  const stmt = getDb().prepare(sql);
  return stmt.all(...(params || [])) as T[];
}

export function get<T = any>(sql: string, params?: any[]): T | undefined {
  const stmt = getDb().prepare(sql);
  return stmt.get(...(params || [])) as T | undefined;
}

export function run(sql: string, params?: any[]): Database.RunResult {
  const stmt = getDb().prepare(sql);
  return stmt.run(...(params || []));
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
