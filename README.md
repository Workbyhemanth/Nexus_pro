# Smart Meeting Memory Agent 🧠⚡

An AI-powered assistant that remembers previous meetings, tracks commitments, identifies unresolved concerns, preserves long-term context using **Hindsight**, and prepares users for upcoming meetings with personalized executive briefings.

![Smart Meeting Memory Agent](https://img.shields.gradient.is/badge/Smart_Meeting-Memory_Agent-indigo)

---

## 🌟 Key Features

1. **Meeting Memory Capture & AI Extraction**
   - Record meeting notes, transcripts, title, client/team name, date, and participants.
   - Automatically extracts decisions, promises/commitments, action items, assigned persons, deadlines, unresolved concerns, client preferences, and follow-up items.

2. **Persistent Long-Term AI Memory via Hindsight**
   - Integrates **Hindsight** memory architecture as the primary long-term memory engine.
   - Stores facts associated with specific clients/projects.
   - Preserves historical context while updating memory states when new information arrives (e.g. tracking when a task is completed or concern resolved).
   - Strict **Client Isolation**: prevents cross-contamination between different client memory banks.

3. **"Prepare Me for My Next Meeting" Executive Briefings**
   - Generates structured briefings containing:
     - **Previous Meeting Summary & Confirmed Decisions**
     - **Previous Commitments** (Task, Assigned Person, Deadline, Status)
     - **Unresolved Concerns & Pending Issues**
     - **Suggested Questions** for the upcoming meeting
     - **Important Reminders** (Client preferences, promises, deadlines)
     - **Personalized Memory Synthesis** beginning with *"Here's what I remember about [Client]..."*

4. **Commitment & Task Tracking**
   - Real-time commitment dashboard.
   - Update statuses (`Pending`, `In Progress`, `Completed`, `Overdue`).
   - Updating status automatically syncs back into Hindsight memory!

5. **AI Assistant Conversational Chat Interface**
   - Natural language Q&A interface asking about previous meetings, client promises, or open concerns.
   - Answers strictly using retrieved memory facts without fabricating nonexistent information.

6. **Memory Explorer**
   - Visual inspection interface categorizing memories into *Client Preferences*, *Decisions*, *Commitments*, *Action Items*, *Unresolved Concerns*, and *Historical Context*.
   - Allows inline editing and deletion of memory items, directly influencing future AI briefings and chat answers.

7. **Interactive Hackathon Demo Environment**
   - Includes a top-level 8-step evaluation banner allowing judges and reviewers to execute the complete test sequence with 1-click execution.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, Lucide React icons.
- **Backend**: Node.js, Express.js, TypeScript.
- **Database**: SQLite (managed via `sql.js` WebAssembly with automatic atomic disk persistence to `data/database.sqlite`).
- **Memory Engine**: **Hindsight Memory System** (Supports both external Hindsight REST API endpoints and embedded Hindsight SQLite engine).
- **AI Model**: Google Gemini API (`gemini-2.5-flash` via `@google/generative-ai` with intelligent rule-based heuristic fallback).

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Setup

1. **Install All Dependencies & Build Project**
   ```bash
   npm run setup
   ```

2. **Configure Environment Variables (Optional)**
   Copy `.env.example` in `server/`:
   ```bash
   cp server/.env.example server/.env
   ```
   *If `GEMINI_API_KEY` or `HINDSIGHT_API_URL` is omitted, the application seamlessly runs using its built-in Hindsight engine and intelligent heuristic parser.*

3. **Start the Production Application**
   ```bash
   npm start
   ```
   Open your browser to: **`http://localhost:5000`**

4. **Run Development Mode (Concurrent Server & Client)**
   ```bash
   # Terminal 1: Server
   npm run dev:server

   # Terminal 2: Client
   npm run dev:client
   ```
   Client dev server runs on `http://localhost:3000` with automatic API proxying to port `5000`.

---

## 🧪 8-Step Hackathon Demonstration Sequence

The application includes an interactive Demo Banner at the top of the UI:

1. **Step 1: Seed ABC Client Discovery Meeting**  
   Preloads Meeting #1 for ABC Client (*Payment module by Oct 10, Ravi API docs commitment, security concern, dark mode preference*).
2. **Step 2 & 3: View Extracted Memories & Commitments**  
   Inspect the Memory Explorer tab to see facts categorized under Preferences, Commitments, and Concerns.
3. **Step 4 & 5: Prepare Me for Next ABC Meeting**  
   Click "Prepare Me" for ABC Client to view the AI briefing recalling dark mode preference, Ravi's commitment, and security concern.
4. **Step 6: Add Follow-up Meeting for ABC Client**  
   Submit follow-up meeting notes where Ravi sends API docs and dark mode is approved.
5. **Step 7: Re-generate Briefing with Updated Context**  
   Verify that dark mode and API docs update to completed status while the security concern remains preserved in context.
6. **Step 8: Client Isolation Test (XYZ Corp)**  
   Generate a briefing for XYZ Corp to verify zero memory cross-leakage from ABC Client.

---

## 📡 API Endpoints

- `POST /api/meetings` - Record meeting & process AI extraction.
- `GET /api/meetings` - List meetings with search & client filters.
- `GET /api/meetings/:id` - Fetch meeting details & extracted items.
- `DELETE /api/meetings/:id` - Delete meeting.
- `POST /api/briefings/generate` - Generate "Prepare Me" client briefing.
- `POST /api/chat` - AI Chat assistant query using retrieved memory.
- `GET /api/commitments` - List commitments (filter by client/status).
- `PUT /api/commitments/:id` - Update commitment status & sync Hindsight.
- `GET /api/memories` - Inspect all Hindsight memories.
- `PUT /api/memories/:id` - Edit memory item.
- `DELETE /api/memories/:id` - Delete memory item.
- `POST /api/demo/seed` - Preload demo dataset.
- `POST /api/demo/reset` - Reset database.
- `GET /api/health` - Backend and Hindsight health check.

---

## 🔒 License & Credits

Built for the Microsoft Hackathon. Powered by Google Gemini and Hindsight Memory architecture.
