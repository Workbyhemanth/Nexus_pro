"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = exports.ChatService = void 0;
const hindsightService_1 = require("./hindsightService");
const commitmentService_1 = require("./commitmentService");
const meetingService_1 = require("./meetingService");
const aiService_1 = require("./aiService");
class ChatService {
    async handleUserQuery(query, clientName) {
        let memories = [];
        if (clientName && clientName !== 'all') {
            memories = await hindsightService_1.hindsightService.retrieveMemories(clientName, { status: 'all' });
        }
        else {
            memories = await hindsightService_1.hindsightService.getAllMemories();
        }
        const commitments = await commitmentService_1.commitmentService.getCommitments(clientName ? { client: clientName } : undefined);
        const meetings = await meetingService_1.meetingService.getMeetings(undefined, clientName);
        const answer = await aiService_1.aiService.answerChatQuestion(query, memories, commitments, meetings);
        return { answer, memories };
    }
}
exports.ChatService = ChatService;
exports.chatService = new ChatService();
