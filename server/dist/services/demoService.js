"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoService = exports.DemoService = void 0;
const database_1 = require("../db/database");
const meetingService_1 = require("./meetingService");
class DemoService {
    async seedDemoData() {
        await this.resetData();
        // Meeting 1: ABC Client Initial Discovery
        const mtg1 = await meetingService_1.meetingService.createMeeting({
            title: 'ABC Client - Payment Module Discovery',
            client_name: 'ABC Client',
            project_name: 'FinTech Platform',
            date: '2026-10-01',
            participants: 'Ravi (Lead Dev), Alex (PM), ABC Security Team',
            notes: 'ABC client requested the payment module by October 10. Ravi will send the API documentation. The client raised concerns about security. Dark mode was also requested.'
        });
        // Meeting 2: XYZ Client (For Client Isolation Test)
        const mtg2 = await meetingService_1.meetingService.createMeeting({
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
    async addFollowupDemoMeeting() {
        // Follow-up meeting for ABC Client resolving API docs commitment & dark mode
        const mtgFollowup = await meetingService_1.meetingService.createMeeting({
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
    async resetData() {
        const db = await (0, database_1.getDb)();
        (0, database_1.execute)(db, `DELETE FROM extracted_data`);
        (0, database_1.execute)(db, `DELETE FROM commitments`);
        (0, database_1.execute)(db, `DELETE FROM memories`);
        (0, database_1.execute)(db, `DELETE FROM meetings`);
        return { message: 'Database reset cleanly.' };
    }
}
exports.DemoService = DemoService;
exports.demoService = new DemoService();
