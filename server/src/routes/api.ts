import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { meetingService } from '../services/meetingService';
import { commitmentService } from '../services/commitmentService';
import { hindsightService } from '../services/hindsightService';
import { briefingService } from '../services/briefingService';
import { chatService } from '../services/chatService';
import { demoService } from '../services/demoService';

const router = Router();

// --- PDF DOWNLOAD ROUTE ---
router.get('/documentation/pdf', (req: Request, res: Response) => {
  const pdfPath = path.resolve(process.cwd(), 'Smart_Meeting_Memory_Agent_Documentation.pdf');
  if (fs.existsSync(pdfPath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Smart_Meeting_Memory_Agent_Documentation.pdf"');
    return res.sendFile(pdfPath);
  }
  
  // Try parent folder if running from dist
  const altPdfPath = path.resolve(process.cwd(), '../Smart_Meeting_Memory_Agent_Documentation.pdf');
  if (fs.existsSync(altPdfPath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Smart_Meeting_Memory_Agent_Documentation.pdf"');
    return res.sendFile(altPdfPath);
  }

  res.status(404).json({ error: 'PDF documentation file not found on server.' });
});

// --- MEETINGS ---
router.post('/meetings', async (req: Request, res: Response) => {
  try {
    const { title, client_name, project_name, date, participants, notes } = req.body;
    if (!title || !client_name || !notes) {
      return res.status(400).json({ error: 'title, client_name, and notes are required fields.' });
    }

    const result = await meetingService.createMeeting({
      title,
      client_name,
      project_name,
      date,
      participants,
      notes
    });

    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create meeting.' });
  }
});

router.get('/meetings', async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const client = req.query.client as string;
    const meetings = await meetingService.getMeetings(search, client);
    res.json(meetings);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch meetings.' });
  }
});

router.get('/meetings/:id', async (req: Request, res: Response) => {
  try {
    const result = await meetingService.getMeetingById(req.params.id);
    if (!result) return res.status(404).json({ error: 'Meeting not found' });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch meeting.' });
  }
});

router.delete('/meetings/:id', async (req: Request, res: Response) => {
  try {
    await meetingService.deleteMeeting(req.params.id);
    res.json({ success: true, message: 'Meeting deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete meeting.' });
  }
});

// --- BRIEFINGS ---
router.post('/briefings/generate', async (req: Request, res: Response) => {
  try {
    const { client_name } = req.body;
    if (!client_name) {
      return res.status(400).json({ error: 'client_name is required' });
    }

    const briefing = await briefingService.generateClientBriefing(client_name);
    res.json(briefing);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate briefing.' });
  }
});

// --- AI CHAT ---
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { query, client_name } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'query is required' });
    }

    const result = await chatService.handleUserQuery(query, client_name);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to process chat query.' });
  }
});

// --- COMMITMENTS ---
router.get('/commitments', async (req: Request, res: Response) => {
  try {
    const client = req.query.client as string;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const items = await commitmentService.getCommitments({ client, status, search });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch commitments.' });
  }
});

router.put('/commitments/:id', async (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const updated = await commitmentService.updateCommitmentStatus(req.params.id, status, notes);
    if (!updated) return res.status(404).json({ error: 'Commitment not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update commitment.' });
  }
});

router.delete('/commitments/:id', async (req: Request, res: Response) => {
  try {
    await commitmentService.deleteCommitment(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete commitment.' });
  }
});

// --- MEMORY EXPLORER (HINDSIGHT) ---
router.get('/memories', async (req: Request, res: Response) => {
  try {
    const client = req.query.client as string;
    const category = req.query.category as string;
    const items = await hindsightService.getAllMemories({ client, category });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch memories.' });
  }
});

router.put('/memories/:id', async (req: Request, res: Response) => {
  try {
    const { content, category, status } = req.body;
    if (!content) return res.status(400).json({ error: 'content is required' });
    const updated = await hindsightService.updateMemory(req.params.id, content, category, status);
    if (!updated) return res.status(404).json({ error: 'Memory not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update memory.' });
  }
});

router.delete('/memories/:id', async (req: Request, res: Response) => {
  try {
    await hindsightService.deleteMemory(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete memory.' });
  }
});

// --- DEMO ROUTE ---
router.post('/demo/seed', async (_req: Request, res: Response) => {
  try {
    const result = await demoService.seedDemoData();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to seed demo data.' });
  }
});

router.post('/demo/followup', async (_req: Request, res: Response) => {
  try {
    const result = await demoService.addFollowupDemoMeeting();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to add follow-up meeting.' });
  }
});

router.post('/demo/reset', async (_req: Request, res: Response) => {
  try {
    const result = await demoService.resetData();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to reset demo data.' });
  }
});

// --- HEALTH CHECK ---
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    hindsight_integration: process.env.HINDSIGHT_API_URL ? 'external' : 'embedded_hindsight_sqlite',
    gemini_ai_configured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

export default router;
