"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = getDb;
exports.saveDb = saveDb;
exports.queryAll = queryAll;
exports.queryOne = queryOne;
exports.execute = execute;
const sql_js_1 = __importDefault(require("sql.js"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let db = null;
const dbDir = path_1.default.join(process.cwd(), 'data');
const dbPath = path_1.default.join(dbDir, 'database.sqlite');
async function getDb() {
    if (db)
        return db;
    if (!fs_1.default.existsSync(dbDir)) {
        fs_1.default.mkdirSync(dbDir, { recursive: true });
    }
    const SQL = await (0, sql_js_1.default)();
    if (fs_1.default.existsSync(dbPath)) {
        const filebuffer = fs_1.default.readFileSync(dbPath);
        db = new SQL.Database(filebuffer);
    }
    else {
        db = new SQL.Database();
    }
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON;');
    // Initialize tables
    initSchema(db);
    saveDb();
    return db;
}
function saveDb() {
    if (!db)
        return;
    const data = db.export();
    const buffer = Buffer.from(data);
    fs_1.default.writeFileSync(dbPath, buffer);
}
function initSchema(database) {
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
function queryAll(database, sql, params = []) {
    const stmt = database.prepare(sql);
    if (params.length > 0) {
        stmt.bind(params);
    }
    const results = [];
    while (stmt.step()) {
        results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
}
function queryOne(database, sql, params = []) {
    const results = queryAll(database, sql, params);
    return results.length > 0 ? results[0] : null;
}
function execute(database, sql, params = []) {
    database.run(sql, params);
    saveDb();
}
