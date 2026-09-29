"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commitmentService = exports.CommitmentService = void 0;
const database_1 = require("../db/database");
const hindsightService_1 = require("./hindsightService");
class CommitmentService {
    async getCommitments(filter) {
        const db = await (0, database_1.getDb)();
        let sql = `SELECT * FROM commitments WHERE 1=1`;
        const params = [];
        if (filter?.client && filter.client.toLowerCase() !== 'all') {
            sql += ` AND LOWER(client_name) = LOWER(?)`;
            params.push(filter.client.trim());
        }
        if (filter?.status && filter.status !== 'all') {
            sql += ` AND status = ?`;
            params.push(filter.status);
        }
        if (filter?.search) {
            sql += ` AND (LOWER(task_description) LIKE LOWER(?) OR LOWER(assigned_to) LIKE LOWER(?))`;
            const pattern = `%${filter.search.trim()}%`;
            params.push(pattern, pattern);
        }
        sql += ` ORDER BY created_at DESC`;
        return (0, database_1.queryAll)(db, sql, params);
    }
    async updateCommitmentStatus(id, status, notes) {
        const db = await (0, database_1.getDb)();
        const now = new Date().toISOString();
        const existing = (0, database_1.queryOne)(db, `SELECT * FROM commitments WHERE id = ?`, [id]);
        if (!existing)
            return null;
        const newNotes = notes !== undefined ? notes : existing.notes;
        (0, database_1.execute)(db, `UPDATE commitments SET status = ?, notes = ?, updated_at = ? WHERE id = ?`, [status, newNotes, now, id]);
        const updated = (0, database_1.queryOne)(db, `SELECT * FROM commitments WHERE id = ?`, [id]);
        if (updated) {
            // Sync with Hindsight memory: update status or add resolution memory item
            if (status === 'completed') {
                await hindsightService_1.hindsightService.storeMemory({
                    client_name: updated.client_name,
                    project_name: updated.project_name,
                    category: 'commitment',
                    content: `COMPLETED: Commitment "${updated.task_description}" assigned to ${updated.assigned_to} has been marked COMPLETED.`,
                    entity_type: updated.assigned_to,
                    source_meeting_id: updated.meeting_id
                });
            }
        }
        return updated;
    }
    async deleteCommitment(id) {
        const db = await (0, database_1.getDb)();
        (0, database_1.execute)(db, `DELETE FROM commitments WHERE id = ?`, [id]);
        return true;
    }
}
exports.CommitmentService = CommitmentService;
exports.commitmentService = new CommitmentService();
