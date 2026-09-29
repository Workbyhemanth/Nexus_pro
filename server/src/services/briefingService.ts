import { hindsightService } from './hindsightService';
import { commitmentService } from './commitmentService';
import { meetingService } from './meetingService';
import { aiService } from './aiService';
import { BriefingSection } from '../types';

export class BriefingService {
  async generateClientBriefing(clientName: string): Promise<BriefingSection> {
    const trimmedClient = clientName.trim();
    
    // Retrieve memories from Hindsight
    const memories = await hindsightService.retrieveMemories(trimmedClient, { status: 'all' });
    
    // Retrieve commitments
    const commitments = await commitmentService.getCommitments({ client: trimmedClient });

    // Retrieve previous meetings
    const meetings = await meetingService.getMeetings(undefined, trimmedClient);

    // Call AI Service to generate personalized briefing section
    return aiService.generateBriefing(trimmedClient, memories, commitments, meetings);
  }
}

export const briefingService = new BriefingService();
