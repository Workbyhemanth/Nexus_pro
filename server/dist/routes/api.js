"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const meetingService_1 = require("../services/meetingService");
const commitmentService_1 = require("../services/commitmentService");
const hindsightService_1 = require("../services/hindsightService");
const briefingService_1 = require("../services/briefingService");
const chatService_1 = require("../services/chatService");
const demoService_1 = require("../services/demoService");
const router = (0, express_1.Router)();
// --- PDF DOWNLOAD ROUTE ---
router.get('/documentation/pdf', (req, res) => {
    const pdfPath = path_1.default.resolve(process.cwd(), 'Smart_Meeting_Memory_Agent_Documentation.pdf');
    if (fs_1.default.existsSync(pdfPath)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="Smart_Meeting_Memory_Agent_Documentation.pdf"');
        return res.sendFile(pdfPath);
    }
    // Try parent folder if running from dist
    const altPdfPath = path_1.default.resolve(process.cwd(), '../Smart_Meeting_Memory_Agent_Documentation.pdf');
    if (fs_1.default.existsSync(altPdfPath)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="Smart_Meeting_Memory_Agent_Documentation.pdf"');
        return res.sendFile(altPdfPath);
    }
    res.status(404).json({ error: 'PDF documentation file not found on server.' });
});
// --- MEETINGS ---
router.post('/meetings', async (req, res) => {
    try {
        const { title, client_name, project_name, date, participants, notes } = req.body;
        if (!title || !client_name || !notes) {
            return res.status(400).json({ error: 'title, client_name, and notes are required fields.' });
        }
        const result = await meetingService_1.meetingService.createMeeting({
            title,
            client_name,
            project_name,
            date,
            participants,
            notes
        });
        res.status(201).json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to create meeting.' });
    }
});
router.get('/meetings', async (req, res) => {
    try {
        const search = req.query.search;
        const client = req.query.client;
        const meetings = await meetingService_1.meetingService.getMeetings(search, client);
        res.json(meetings);
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to fetch meetings.' });
    }
});
router.get('/meetings/:id', async (req, res) => {
    try {
        const result = await meetingService_1.meetingService.getMeetingById(req.params.id);
        if (!result)
            return res.status(404).json({ error: 'Meeting not found' });
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to fetch meeting.' });
    }
});
router.delete('/meetings/:id', async (req, res) => {
    try {
        await meetingService_1.meetingService.deleteMeeting(req.params.id);
        res.json({ success: true, message: 'Meeting deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to delete meeting.' });
    }
});
// --- BRIEFINGS ---
router.post('/briefings/generate', async (req, res) => {
    try {
        const { client_name } = req.body;
        if (!client_name) {
            return res.status(400).json({ error: 'client_name is required' });
        }
        const briefing = await briefingService_1.briefingService.generateClientBriefing(client_name);
        res.json(briefing);
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to generate briefing.' });
    }
});
// --- AI CHAT ---
router.post('/chat', async (req, res) => {
    try {
        const { query, client_name } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'query is required' });
        }
        const result = await chatService_1.chatService.handleUserQuery(query, client_name);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to process chat query.' });
    }
});
// --- COMMITMENTS ---
router.get('/commitments', async (req, res) => {
    try {
        const client = req.query.client;
        const status = req.query.status;
        const search = req.query.search;
        const items = await commitmentService_1.commitmentService.getCommitments({ client, status, search });
        res.json(items);
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to fetch commitments.' });
    }
});
router.put('/commitments/:id', async (req, res) => {
    try {
        const { status, notes } = req.body;
        if (!status) {
            return res.status(400).json({ error: 'status is required' });
        }
        const updated = await commitmentService_1.commitmentService.updateCommitmentStatus(req.params.id, status, notes);
        if (!updated)
            return res.status(404).json({ error: 'Commitment not found' });
        res.json(updated);
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to update commitment.' });
    }
});
router.delete('/commitments/:id', async (req, res) => {
    try {
        await commitmentService_1.commitmentService.deleteCommitment(req.params.id);
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to delete commitment.' });
    }
});
// --- MEMORY EXPLORER (HINDSIGHT) ---
router.get('/memories', async (req, res) => {
    try {
        const client = req.query.client;
        const category = req.query.category;
        const items = await hindsightService_1.hindsightService.getAllMemories({ client, category });
        res.json(items);
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to fetch memories.' });
    }
});
router.put('/memories/:id', async (req, res) => {
    try {
        const { content, category, status } = req.body;
        if (!content)
            return res.status(400).json({ error: 'content is required' });
        const updated = await hindsightService_1.hindsightService.updateMemory(req.params.id, content, category, status);
        if (!updated)
            return res.status(404).json({ error: 'Memory not found' });
        res.json(updated);
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to update memory.' });
    }
});
router.delete('/memories/:id', async (req, res) => {
    try {
        await hindsightService_1.hindsightService.deleteMemory(req.params.id);
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to delete memory.' });
    }
});
// --- DEMO ROUTE ---
router.post('/demo/seed', async (_req, res) => {
    try {
        const result = await demoService_1.demoService.seedDemoData();
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to seed demo data.' });
    }
});
router.post('/demo/followup', async (_req, res) => {
    try {
        const result = await demoService_1.demoService.addFollowupDemoMeeting();
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to add follow-up meeting.' });
    }
});
router.post('/demo/reset', async (_req, res) => {
    try {
        const result = await demoService_1.demoService.resetData();
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Failed to reset demo data.' });
    }
});
// --- HEALTH CHECK ---
router.get('/health', (_req, res) => {
    res.json({
        status: 'healthy',
        hindsight_integration: process.env.HINDSIGHT_API_URL ? 'external' : 'embedded_hindsight_sqlite',
        gemini_ai_configured: !!process.env.GEMINI_API_KEY,
        timestamp: new Date().toISOString()
    });
});
exports.default = router;
