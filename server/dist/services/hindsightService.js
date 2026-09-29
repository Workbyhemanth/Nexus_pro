"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hindsightService = exports.HindsightService = void 0;
const database_1 = require("../db/database");
const crypto_1 = __importDefault(require("crypto"));
class HindsightService {
    apiUrl;
    apiKey;
    constructor() {
        this.apiUrl = process.env.HINDSIGHT_API_URL || null;
        this.apiKey = process.env.HINDSIGHT_API_KEY || null;
    }
    /**
     * Save a fact/memory item into Hindsight system
     */
    async storeMemory(data) {
        const db = await (0, database_1.getDb)();
        const id = `mem_${crypto_1.default.randomUUID()}`;
        const now = new Date().toISOString();
        const memory = {
            id,
            client_name: data.client_name.trim(),
            project_name: data.project_name?.trim() || '',
            category: data.category,
            content: data.content.trim(),
            entity_type: data.entity_type || 'general',
            status: 'active',
            source_meeting_id: data.source_meeting_id || '',
            created_at: now,
            updated_at: now
        };
        // If external Hindsight REST server is configured, send request
        if (this.apiUrl) {
            try {
                const headers = { 'Content-Type': 'application/json' };
                if (this.apiKey)
                    headers['Authorization'] = `Bearer ${this.apiKey}`;
                await fetch(`${this.apiUrl}/memories`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(memory)
                });
            }
            catch (err) {
                console.warn('Hindsight external REST API call failed, saved to local Hindsight store:', err);
            }
        }
        // Always persist to DB
        (0, database_1.execute)(db, `INSERT INTO memories (id, client_name, project_name, category, content, entity_type, status, source_meeting_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            memory.id,
            memory.client_name,
            memory.project_name,
            memory.category,
            memory.content,
            memory.entity_type,
            memory.status,
            memory.source_meeting_id,
            memory.created_at,
            memory.updated_at
        ]);
        return memory;
    }
    /**
     * Retrieve memories for a specific client/project with semantic/category filtering
     */
    async retrieveMemories(clientName, options) {
        const db = await (0, database_1.getDb)();
        let sql = `SELECT * FROM memories WHERE LOWER(client_name) = LOWER(?)`;
        const params = [clientName.trim()];
        if (options?.category) {
            sql += ` AND category = ?`;
            params.push(options.category);
        }
        if (options?.status && options.status !== 'all') {
            sql += ` AND status = ?`;
            params.push(options.status);
        }
        else if (!options?.status) {
            // default active or resolved
            sql += ` AND status IN ('active', 'resolved', 'updated')`;
        }
        if (options?.query) {
            sql += ` AND LOWER(content) LIKE LOWER(?)`;
            params.push(`%${options.query.trim()}%`);
        }
        sql += ` ORDER BY created_at DESC`;
        if (options?.limit) {
            sql += ` LIMIT ?`;
            params.push(options.limit);
        }
        const items = (0, database_1.queryAll)(db, sql, params);
        // If external Hindsight API available, try fetching
        if (this.apiUrl) {
            try {
                const headers = { 'Content-Type': 'application/json' };
                if (this.apiKey)
                    headers['Authorization'] = `Bearer ${this.apiKey}`;
                const res = await fetch(`${this.apiUrl}/memories/search?client=${encodeURIComponent(clientName)}`, {
                    headers
                });
                if (res.ok) {
                    const remoteItems = await res.json();
                    if (Array.isArray(remoteItems) && remoteItems.length > 0) {
                        return remoteItems;
                    }
                }
            }
            catch (e) {
                // Fall back to local items
            }
        }
        return items;
    }
    /**
     * Intelligently update memories based on new meeting notes.
     * e.g., if new meeting notes indicate a concern or task is resolved, update memory status.
     */
    async updateMemoriesFromContext(clientName, newExtractedContent) {
        const activeMemories = await this.retrieveMemories(clientName, { status: 'active' });
        const db = await (0, database_1.getDb)();
        const now = new Date().toISOString();
        for (const mem of activeMemories) {
            // Check if new context resolves an unresolved concern
            if (mem.category === 'unresolved_concern') {
                const lowerMemContent = mem.content.toLowerCase();
                // If decisions or resolutions mention key terms from concern
                const resolvedMatch = (newExtractedContent.decisions || []).concat(newExtractedContent.resolutions || []).some(item => {
                    const lowerItem = item.toLowerCase();
                    return lowerItem.includes('resolved') || lowerItem.includes('addressed') || lowerItem.includes('fixed') || lowerItem.includes('sent') || lowerItem.includes('approved') || lowerItem.includes('done');
                });
                if (resolvedMatch && (newExtractedContent.decisions?.some(d => d.toLowerCase().includes('security') || d.toLowerCase().includes('approved')) ||
                    newExtractedContent.resolutions?.some(r => r.toLowerCase().includes('security')))) {
                    (0, database_1.execute)(db, `UPDATE memories SET status = 'resolved', updated_at = ? WHERE id = ?`, [now, mem.id]);
                }
            }
        }
    }
    /**
     * Delete a memory item by ID
     */
    async deleteMemory(id) {
        const db = await (0, database_1.getDb)();
        (0, database_1.execute)(db, `DELETE FROM memories WHERE id = ?`, [id]);
        return true;
    }
    /**
     * Edit a memory item
     */
    async updateMemory(id, content, category, status) {
        const db = await (0, database_1.getDb)();
        const now = new Date().toISOString();
        const existing = (0, database_1.queryOne)(db, `SELECT * FROM memories WHERE id = ?`, [id]);
        if (!existing)
            return null;
        const newCategory = category || existing.category;
        const newStatus = status || existing.status;
        (0, database_1.execute)(db, `UPDATE memories SET content = ?, category = ?, status = ?, updated_at = ? WHERE id = ?`, [content, newCategory, newStatus, now, id]);
        return (0, database_1.queryOne)(db, `SELECT * FROM memories WHERE id = ?`, [id]);
    }
    /**
     * List all memories grouped or filtered
     */
    async getAllMemories(filter) {
        const db = await (0, database_1.getDb)();
        let sql = `SELECT * FROM memories WHERE 1=1`;
        const params = [];
        if (filter?.client) {
            sql += ` AND LOWER(client_name) LIKE LOWER(?)`;
            params.push(`%${filter.client.trim()}%`);
        }
        if (filter?.category && filter.category !== 'all') {
            sql += ` AND category = ?`;
            params.push(filter.category);
        }
        sql += ` ORDER BY created_at DESC`;
        return (0, database_1.queryAll)(db, sql, params);
    }
}
exports.HindsightService = HindsightService;
exports.hindsightService = new HindsightService();
