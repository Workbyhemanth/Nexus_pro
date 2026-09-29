import { getDb, queryAll, queryOne, execute } from '../db/database';
import { Commitment, TaskStatus } from '../types';
import { hindsightService } from './hindsightService';

export class CommitmentService {
  async getCommitments(filter?: { client?: string; status?: string; search?: string }): Promise<Commitment[]> {
    const db = await getDb();
    let sql = `SELECT * FROM commitments WHERE 1=1`;
    const params: any[] = [];

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
    return queryAll<Commitment>(db, sql, params);
  }

  async updateCommitmentStatus(id: string, status: TaskStatus, notes?: string): Promise<Commitment | null> {
    const db = await getDb();
    const now = new Date().toISOString();

    const existing = queryOne<Commitment>(db, `SELECT * FROM commitments WHERE id = ?`, [id]);
    if (!existing) return null;

    const newNotes = notes !== undefined ? notes : existing.notes;

    execute(
      db,
      `UPDATE commitments SET status = ?, notes = ?, updated_at = ? WHERE id = ?`,
      [status, newNotes, now, id]
    );

    const updated = queryOne<Commitment>(db, `SELECT * FROM commitments WHERE id = ?`, [id]);

    if (updated) {
      // Sync with Hindsight memory: update status or add resolution memory item
      if (status === 'completed') {
        await hindsightService.storeMemory({
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

  async deleteCommitment(id: string): Promise<boolean> {
    const db = await getDb();
    execute(db, `DELETE FROM commitments WHERE id = ?`, [id]);
    return true;
  }
}

export const commitmentService = new CommitmentService();
