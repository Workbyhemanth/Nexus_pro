import { getDb, execute } from '../db/database';
import { meetingService } from './meetingService';

export class DemoService {
  async seedDemoData(): Promise<any> {
    await this.resetData();

    // Meeting 1: ABC Client Initial Discovery
    const mtg1 = await meetingService.createMeeting({
      title: 'ABC Client - Payment Module Discovery',
      client_name: 'ABC Client',
      project_name: 'FinTech Platform',
      date: '2026-10-01',
      participants: 'Ravi (Lead Dev), Alex (PM), ABC Security Team',
      notes: 'ABC client requested the payment module by October 10. Ravi will send the API documentation. The client raised concerns about security. Dark mode was also requested.'
    });

    // Meeting 2: XYZ Client (For Client Isolation Test)
    const mtg2 = await meetingService.createMeeting({
      title: 'XYZ Enterprise - SDK Architecture Review',
      client_name: 'XYZ Corp',
      project_name: 'Mobile App Suite',
      date: '2026-10-03',
      participants: 'Sarah (iOS Eng), David (Client CTO)',
      notes: 'XYZ client requested mobile SDK integration by November 15. Sarah will deliver the iOS build. The client expressed severe budget concerns and requested a phased rollout.'
    });

    return {
      message: 'Demo dataset successfully seeded with ABC Client and XYZ Corp meetings!',
      abc_meeting: mtg1,
      xyz_meeting: mtg2
    };
  }

  async addFollowupDemoMeeting(): Promise<any> {
    // Follow-up meeting for ABC Client resolving API docs commitment & dark mode
    const mtgFollowup = await meetingService.createMeeting({
      title: 'ABC Client - Technical Review & Follow-up',
      client_name: 'ABC Client',
      project_name: 'FinTech Platform',
      date: '2026-10-05',
      participants: 'Ravi (Lead Dev), Alex (PM), ABC Tech Lead',
      notes: 'Ravi sent the API documentation. The client approved dark mode, but the security concern regarding payment data encryption remains unresolved.'
    });

    return {
      message: 'Follow-up meeting added for ABC Client.',
      meeting: mtgFollowup
    };
  }

  async resetData(): Promise<{ message: string }> {
    const db = await getDb();
    execute(db, `DELETE FROM extracted_data`);
    execute(db, `DELETE FROM commitments`);
    execute(db, `DELETE FROM memories`);
    execute(db, `DELETE FROM meetings`);
    return { message: 'Database reset cleanly.' };
  }
}

export const demoService = new DemoService();
