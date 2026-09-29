"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.briefingService = exports.BriefingService = void 0;
const hindsightService_1 = require("./hindsightService");
const commitmentService_1 = require("./commitmentService");
const meetingService_1 = require("./meetingService");
const aiService_1 = require("./aiService");
class BriefingService {
    async generateClientBriefing(clientName) {
        const trimmedClient = clientName.trim();
        // Retrieve memories from Hindsight
        const memories = await hindsightService_1.hindsightService.retrieveMemories(trimmedClient, { status: 'all' });
        // Retrieve commitments
        const commitments = await commitmentService_1.commitmentService.getCommitments({ client: trimmedClient });
        // Retrieve previous meetings
        const meetings = await meetingService_1.meetingService.getMeetings(undefined, trimmedClient);
        // Call AI Service to generate personalized briefing section
        return aiService_1.aiService.generateBriefing(trimmedClient, memories, commitments, meetings);
    }
}
exports.BriefingService = BriefingService;
exports.briefingService = new BriefingService();
