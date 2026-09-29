import { hindsightService } from './hindsightService';
import { commitmentService } from './commitmentService';
import { meetingService } from './meetingService';
import { aiService } from './aiService';

export class ChatService {
  async handleUserQuery(query: string, clientName?: string): Promise<{ answer: string; memories: any[] }> {
    let memories: any[] = [];
    
    if (clientName && clientName !== 'all') {
      memories = await hindsightService.retrieveMemories(clientName, { status: 'all' });
    } else {
      memories = await hindsightService.getAllMemories();
    }

    const commitments = await commitmentService.getCommitments(clientName ? { client: clientName } : undefined);
    const meetings = await meetingService.getMeetings(undefined, clientName);

    const answer = await aiService.answerChatQuestion(query, memories, commitments, meetings);

    return { answer, memories };
  }
}

export const chatService = new ChatService();
