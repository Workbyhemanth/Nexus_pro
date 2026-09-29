import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';

let db: SqlJsDatabase | null = null;
const dbDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDir, 'database.sqlite');

export async function getDb(): Promise<SqlJsDatabase> {
  if (db) return db;

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(dbPath)) {
    const filebuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(filebuffer);
  } else {
    db = new SQL.Database();
  }

  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON;');

  // Initialize tables
  initSchema(db);
  saveDb();

  return db;
}

export function saveDb(): void {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

function initSchema(database: SqlJsDatabase): void {
  database.run(`
    CREATE TABLE IF NOT EXISTS meetings (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      client_name TEXT NOT NULL,
      project_name TEXT DEFAULT '',
      date TEXT NOT NULL,
      participants TEXT DEFAULT '',
      notes TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS extracted_data (
      id TEXT PRIMARY KEY,
      meeting_id TEXT NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      assigned_to TEXT DEFAULT '',
      deadline TEXT DEFAULT '',
      status TEXT DEFAULT 'pending',
      created_at TEXT NOT NULL,
      FOREIGN KEY(meeting_id) REFERENCES meetings(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS commitments (
      id TEXT PRIMARY KEY,
      meeting_id TEXT NOT NULL,
      task_description TEXT NOT NULL,
      client_name TEXT NOT NULL,
      project_name TEXT DEFAULT '',
      assigned_to TEXT DEFAULT '',
      deadline TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(meeting_id) REFERENCES meetings(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS memories (
      id TEXT PRIMARY KEY,
      client_name TEXT NOT NULL,
      project_name TEXT DEFAULT '',
      category TEXT NOT NULL,
      content TEXT NOT NULL,
      entity_type TEXT DEFAULT 'general',
      status TEXT NOT NULL DEFAULT 'active',
      source_meeting_id TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

// Helper functions for query execution with parameterized queries
export function queryAll<T = any>(database: SqlJsDatabase, sql: string, params: any[] = []): T[] {
  const stmt = database.prepare(sql);
  if (params.length > 0) {
    stmt.bind(params);
  }
  const results: T[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as unknown as T);
  }
  stmt.free();
  return results;
}

export function queryOne<T = any>(database: SqlJsDatabase, sql: string, params: any[] = []): T | null {
  const results = queryAll<T>(database, sql, params);
  return results.length > 0 ? results[0] : null;
}

export function execute(database: SqlJsDatabase, sql: string, params: any[] = []): void {
  database.run(sql, params);
  saveDb();
}
