import { getDb, queryAll, queryOne, execute } from '../db/database';
import { Meeting, ExtractedData, Commitment } from '../types';
import { aiService } from './aiService';
import { hindsightService } from './hindsightService';
import crypto from 'crypto';

export class MeetingService {
  async createMeeting(data: {
    title: string;
    client_name: string;
    project_name?: string;
    date: string;
    participants?: string;
    notes: string;
  }): Promise<{ meeting: Meeting; extracted: ExtractedData[]; commitments: Commitment[] }> {
    const db = await getDb();
    const meetingId = `mtg_${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    const meeting: Meeting = {
      id: meetingId,
      title: data.title.trim(),
      client_name: data.client_name.trim(),
      project_name: data.project_name?.trim() || '',
      date: data.date || new Date().toISOString().split('T')[0],
      participants: data.participants?.trim() || '',
      notes: data.notes.trim(),
      created_at: now,
      updated_at: now
    };

    // Save meeting to DB
    execute(
      db,
      `INSERT INTO meetings (id, title, client_name, project_name, date, participants, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        meeting.id,
        meeting.title,
        meeting.client_name,
        meeting.project_name,
        meeting.date,
        meeting.participants,
        meeting.notes,
        meeting.created_at,
        meeting.updated_at
      ]
    );

    // Extract structured data using AI
    const extraction = await aiService.extractMeetingDetails(meeting.notes, meeting.title, meeting.client_name);

    const savedExtracted: ExtractedData[] = [];
    const savedCommitments: Commitment[] = [];

    // Process Decisions -> ExtractedData + Hindsight Memory
    for (const dec of extraction.decisions) {
      const extId = `ext_${crypto.randomUUID()}`;
      execute(
        db,
        `INSERT INTO extracted_data (id, meeting_id, type, content, created_at) VALUES (?, ?, ?, ?, ?)`,
        [extId, meeting.id, 'decision', dec.content, now]
      );
      savedExtracted.push({ id: extId, meeting_id: meeting.id, type: 'decision', content: dec.content, created_at: now });
      
      await hindsightService.storeMemory({
        client_name: meeting.client_name,
        project_name: meeting.project_name,
        category: 'decision',
        content: dec.content,
        source_meeting_id: meeting.id
      });
    }

    // Process Commitments -> ExtractedData + Commitment Table + Hindsight Memory
    for (const comm of extraction.commitments) {
      const extId = `ext_${crypto.randomUUID()}`;
      const commId = `comm_${crypto.randomUUID()}`;

      execute(
        db,
        `INSERT INTO extracted_data (id, meeting_id, type, content, assigned_to, deadline, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [extId, meeting.id, 'commitment', comm.content, comm.assigned_to || '', comm.deadline || '', now]
      );
      savedExtracted.push({ id: extId, meeting_id: meeting.id, type: 'commitment', content: comm.content, assigned_to: comm.assigned_to, deadline: comm.deadline, created_at: now });

      execute(
        db,
        `INSERT INTO commitments (id, meeting_id, task_description, client_name, project_name, assigned_to, deadline, status, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', '', ?, ?)`,
        [
          commId,
          meeting.id,
          comm.content,
          meeting.client_name,
          meeting.project_name || '',
          comm.assigned_to || 'Unassigned',
          comm.deadline || 'TBD',
          now,
          now
        ]
      );
      savedCommitments.push({
        id: commId,
        meeting_id: meeting.id,
        task_description: comm.content,
        client_name: meeting.client_name,
        project_name: meeting.project_name,
        assigned_to: comm.assigned_to || 'Unassigned',
        deadline: comm.deadline || 'TBD',
        status: 'pending',
        notes: '',
        created_at: now,
        updated_at: now
      });

      await hindsightService.storeMemory({
        client_name: meeting.client_name,
        project_name: meeting.project_name,
        category: 'commitment',
        content: `${comm.assigned_to || 'Team'} committed to: "${comm.content}" (Deadline: ${comm.deadline || 'TBD'})`,
        entity_type: comm.assigned_to || 'person',
        source_meeting_id: meeting.id
      });
    }

    // Process Action Items
    for (const act of extraction.action_items) {
      const extId = `ext_${crypto.randomUUID()}`;
      execute(
        db,
        `INSERT INTO extracted_data (id, meeting_id, type, content, assigned_to, deadline, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [extId, meeting.id, 'action_item', act.content, act.assigned_to || '', act.deadline || '', now]
      );
      savedExtracted.push({ id: extId, meeting_id: meeting.id, type: 'action_item', content: act.content, assigned_to: act.assigned_to, deadline: act.deadline, created_at: now });

      await hindsightService.storeMemory({
        client_name: meeting.client_name,
        project_name: meeting.project_name,
        category: 'action_item',
        content: act.content,
        source_meeting_id: meeting.id
      });
    }

    // Process Unresolved Concerns
    for (const con of extraction.unresolved_concerns) {
      const extId = `ext_${crypto.randomUUID()}`;
      execute(
        db,
        `INSERT INTO extracted_data (id, meeting_id, type, content, created_at) VALUES (?, ?, ?, ?, ?)`,
        [extId, meeting.id, 'unresolved_concern', con.content, now]
      );
      savedExtracted.push({ id: extId, meeting_id: meeting.id, type: 'unresolved_concern', content: con.content, created_at: now });

      await hindsightService.storeMemory({
        client_name: meeting.client_name,
        project_name: meeting.project_name,
        category: 'unresolved_concern',
        content: con.content,
        source_meeting_id: meeting.id
      });
    }

    // Process Client Preferences
    for (const pref of extraction.client_preferences) {
      const extId = `ext_${crypto.randomUUID()}`;
      execute(
        db,
        `INSERT INTO extracted_data (id, meeting_id, type, content, created_at) VALUES (?, ?, ?, ?, ?)`,
        [extId, meeting.id, 'preference', pref.content, now]
      );
      savedExtracted.push({ id: extId, meeting_id: meeting.id, type: 'preference', content: pref.content, created_at: now });

      await hindsightService.storeMemory({
        client_name: meeting.client_name,
        project_name: meeting.project_name,
        category: 'preference',
        content: pref.content,
        source_meeting_id: meeting.id
      });
    }

    // Process Follow Ups
    for (const fol of extraction.follow_ups) {
      const extId = `ext_${crypto.randomUUID()}`;
      execute(
        db,
        `INSERT INTO extracted_data (id, meeting_id, type, content, created_at) VALUES (?, ?, ?, ?, ?)`,
        [extId, meeting.id, 'follow_up', fol.content, now]
      );
      savedExtracted.push({ id: extId, meeting_id: meeting.id, type: 'follow_up', content: fol.content, created_at: now });
    }

    // Update existing memories based on new meeting context
    await hindsightService.updateMemoriesFromContext(meeting.client_name, {
      decisions: extraction.decisions.map(d => d.content),
      resolutions: extraction.follow_ups.map(f => f.content)
    });

    return { meeting, extracted: savedExtracted, commitments: savedCommitments };
  }

  async getMeetings(search?: string, clientName?: string): Promise<Meeting[]> {
    const db = await getDb();
    let sql = `SELECT * FROM meetings WHERE 1=1`;
    const params: any[] = [];

    if (clientName && clientName.toLowerCase() !== 'all') {
      sql += ` AND LOWER(client_name) = LOWER(?)`;
      params.push(clientName.trim());
    }

    if (search) {
      sql += ` AND (LOWER(title) LIKE LOWER(?) OR LOWER(notes) LIKE LOWER(?) OR LOWER(client_name) LIKE LOWER(?))`;
      const pattern = `%${search.trim()}%`;
      params.push(pattern, pattern, pattern);
    }

    sql += ` ORDER BY date DESC, created_at DESC`;
    return queryAll<Meeting>(db, sql, params);
  }

  async getMeetingById(id: string): Promise<{ meeting: Meeting; extracted: ExtractedData[]; commitments: Commitment[] } | null> {
    const db = await getDb();
    const meeting = queryOne<Meeting>(db, `SELECT * FROM meetings WHERE id = ?`, [id]);
    if (!meeting) return null;

    const extracted = queryAll<ExtractedData>(db, `SELECT * FROM extracted_data WHERE meeting_id = ?`, [id]);
    const commitments = queryAll<Commitment>(db, `SELECT * FROM commitments WHERE meeting_id = ?`, [id]);

    return { meeting, extracted, commitments };
  }

  async deleteMeeting(id: string): Promise<boolean> {
    const db = await getDb();
    execute(db, `DELETE FROM meetings WHERE id = ?`, [id]);
    return true;
  }
}

export const meetingService = new MeetingService();
