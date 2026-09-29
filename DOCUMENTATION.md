# Smart Meeting Memory Agent — Complete Documentation & User Guide 🧠⚡

Welcome to the official documentation for **Smart Meeting Memory Agent**, an AI-powered assistant designed to solve the problem of forgotten meeting context, unfulfilled commitments, and scattered meeting notes across interactions.

---

## 📋 Table of Contents

1. [Project Overview & Purpose](#1-project-overview--purpose)
2. [System Architecture & Technology Stack](#2-system-architecture--technology-stack)
3. [Hindsight Memory Architecture](#3-hindsight-memory-architecture)
4. [Exhaustive Feature Guide & Step-by-Step Task Walkthroughs](#4-exhaustive-feature-guide--step-by-step-task-walkthroughs)
   - [Feature 1: Dashboard Overview](#feature-1-dashboard-overview)
   - [Feature 2: Meeting Capture & AI Information Extraction](#feature-2-meeting-capture--ai-information-extraction)
   - [Feature 3: Searchable Meeting History](#feature-3-searchable-meeting-history)
   - [Feature 4: Prepare Me for My Next Meeting (Briefings)](#feature-4-prepare-me-for-my-next-meeting-briefings)
   - [Feature 5: Commitment & Task Tracking](#feature-5-commitment--task-tracking)
   - [Feature 6: AI Assistant Conversational Chat](#feature-6-ai-assistant-conversational-chat)
   - [Feature 7: Hindsight Memory Explorer](#feature-7-hindsight-memory-explorer)
   - [Feature 8: Hackathon 8-Step Interactive Demo Walkthrough](#feature-8-hackathon-8-step-interactive-demo-walkthrough)
   - [Feature 9: System Settings & Health Monitor](#feature-9-system-settings--health-monitor)
5. [Installation & Local Execution Guide](#5-installation--local-execution-guide)
6. [API Endpoint Reference](#6-api-endpoint-reference)
7. [Troubleshooting & FAQs](#7-troubleshooting--faqs)

---

## 1. Project Overview & Purpose

### The Problem
Professionals attend multiple meetings daily with different clients, managers, and internal teams. Important decisions, deadlines, promises, and unresolved concerns often get lost or scattered in unorganized notes. Traditional AI chatbots operate on single sessions and **do not retain context across interactions**, forcing users to repeat background information before every meeting.

### The Solution
Smart Meeting Memory Agent bridges this gap by acting as a persistent AI memory layer.
- **Memory Retention**: Automatically remembers important facts from every meeting.
- **Context Preservation**: Updates memories when new notes arrive (e.g. tracking when a task is completed or a concern resolved) without erasing historical background.
- **Client Isolation**: Strictly isolates memories between different clients or projects to avoid context mixing.
- **Proactive Meeting Preparation**: Before a meeting, it synthesizes all stored memories into a personalized, structured executive briefing.

---

## 2. System Architecture & Technology Stack

```
[ Frontend: React 18 + TS + Tailwind ] 
              │
              ▼ HTTP Proxy (/api)
[ Backend: Node.js + Express + TS (Port 5050) ]
       │                      │
       ▼                      ▼
[ Gemini 2.5 Flash API ]   [ Hindsight Memory Engine ]
(Structured Extraction)    (SQLite + Entity Associator)
```

| Layer | Technology Used | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS v4, Lucide React Icons | Responsive SaaS UI dashboard, interactive demo controls, modals, and real-time feeds. |
| **Backend** | Node.js, Express.js, TypeScript | REST API routing, extraction pipeline, briefing synthesis engine, database controllers. |
| **Database** | SQLite via `sql.js` (WebAssembly with atomic disk persistence) | Zero-config relational database storing meetings, extracted items, commitments, memories, and settings. |
| **Memory System** | **Hindsight Memory System** (`hindsightService.ts`) | Long-term semantic fact retention, temporal status updates, and client memory isolation. |
| **AI Integration** | Google Gemini API (`gemini-2.5-flash`) + Heuristic Parser | Extracted structured details from raw meeting notes, generated briefings, and powered Q&A chat. |

---

## 3. Hindsight Memory Architecture

Hindsight serves as the core long-term memory engine. Unlike standard chatbots that append messages into a temporary window, Hindsight structures memories into key categories:

1. **Client Preferences**: Technical requirements, preferred modes, delivery styles (e.g. *"Client requested Dark Mode"*).
2. **Decisions**: Formal agreements reached during meetings (e.g. *"Approved architecture approach B"*).
3. **Commitments**: Tasks promised by team members or clients with assigned owners and deadlines.
4. **Action Items**: Operational follow-ups.
5. **Unresolved Concerns**: Open issues, security risks, or pending questions raised by the client.
6. **Historical Context**: Preserved records of past discussions.

### Dynamic Memory Lifecycles
When a new meeting is recorded:
1. Hindsight inspects existing active memories for the client.
2. If new notes indicate that a previously unresolved concern or task has been addressed, Hindsight updates the status of the older memory item to `resolved` or `completed` while preserving the historical record.
3. If new context arrives for a separate client, Hindsight stores it under that client's isolated partition.

---

## 4. Exhaustive Feature Guide & Step-by-Step Task Walkthroughs

---

### Feature 1: Dashboard Overview

#### What It Does
The Dashboard provides an executive command center displaying top KPI metrics, recent meeting cards, active commitments with upcoming deadlines, and a live feed of memories recorded in Hindsight.

#### Key UI Elements:
- **KPI Cards**:
  - *Total Meetings*: Count of all recorded meetings.
  - *Active Commitments*: Tasks currently pending or in progress.
  - *Completed Tasks*: Tasks successfully delivered.
  - *Overdue Tasks*: Tasks past deadline.
  - *Open Concerns*: Unresolved security/technical concerns tracked in Hindsight.
- **Top Callout Banner**: One-click shortcuts to launch **"Prepare Me Now"** or **"Record New Meeting"**.
- **Recent Meetings Grid**: Shows recent meetings with quick client tags and notes previews.
- **Upcoming Commitments & Hindsight Memory Feed**: Real-time right sidebar listing active tasks and recent facts stored in memory.

#### 📝 Step-by-Step Guide: How to Use the Dashboard
1. Click **Dashboard** in the sidebar navigation.
2. Click any KPI card (e.g. *Active Commitments*) to jump directly to that filtered view.
3. Click **"Prepare Me Now"** on the top purple banner to immediately generate a briefing for your primary client.

---

### Feature 2: Meeting Capture & AI Information Extraction

#### What It Does
Allows users to input meeting notes or transcripts. When submitted, the backend AI model automatically parses the text and extracts:
- Confirmed Decisions
- Commitments (Task description, assigned owner, deadline)
- Action Items
- Unresolved Concerns
- Client Preferences
- Follow-up Requirements

The extracted data is stored in the application database and automatically ingested into Hindsight long-term memory.

#### 📝 Step-by-Step Guide: How to Record a Meeting
1. Click **"+ Add Meeting"** in the top navigation bar or **"Record New Meeting"** on the Meetings view.
2. In the modal:
   - Enter **Meeting Title** (e.g. *"ABC Client Payment & Security Sync"*).
   - Enter **Client / Team Name** (e.g. *"ABC Client"*).
   - (Optional) Enter **Project Name**, **Date**, and **Participants**.
   - Paste the raw meeting text into the **Meeting Notes / Transcript** box.
   - *Tip*: You can click **"Load Sample Meeting Notes"** at the top right of the modal to auto-populate sample notes!
3. Click **"Process & Save Meeting"**.
4. The AI agent processes the notes, saves the meeting, extracts commitments into the task dashboard, and populates Hindsight memory.
5. Click **"View Details & Extraction"** on the saved meeting card to inspect the AI extraction breakdown.

---

### Feature 3: Searchable Meeting History

#### What It Does
Provides a centralized repository of all historical meetings. Allows searching through notes text and filtering by client.

#### 📝 Step-by-Step Guide: How to Search and Manage Meetings
1. Click **Meetings** in the sidebar.
2. **Filter by Client**: Click any client pill (e.g. *"ABC Client"*) at the top right to show meetings for that client.
3. **Search Notes**: Type key terms (e.g. *"security"*, *"dark mode"*, *"Ravi"*) into the search box.
4. **Inspect Details**: Click **"View Details & Extraction"** to open a modal displaying the full notes alongside extracted decisions and commitments.
5. **Delete Meeting**: Click the trash icon on a meeting card to remove it.

---

### Feature 4: Prepare Me for My Next Meeting (Briefings)

#### What It Does
This is the flagship AI feature. Select a client or project, and the AI agent queries Hindsight to construct a structured briefing containing:
1. **Previous Meeting Summary & Confirmed Decisions**
2. **Tracked Commitments & Statuses** (Pending, Completed, Overdue)
3. **Unresolved Concerns & Pending Issues**
4. **Suggested Questions** to ask during the upcoming meeting
5. **Important Reminders** (Client preferences, promises made, upcoming deadlines)
6. **Personalized Memory Synthesis** starting with *"Here's what I remember about [Client]..."*

#### 📝 Step-by-Step Guide: How to Generate a Meeting Briefing
1. Click **Prepare for Meeting** in the sidebar.
2. Select the target client from the dropdown menu (e.g. *"ABC Client"*).
3. Click **"Generate Briefing"**.
4. Review the generated sections:
   - Read the top purple **Hindsight Synthesis Card** for a natural-language summary.
   - Check **Tracked Commitments** to verify who owes what.
   - Read **Suggested Questions** to prepare your discussion agenda.
   - Review **Unresolved Concerns** to ensure open issues are addressed.

---

### Feature 5: Commitment & Task Tracking

#### What It Does
Provides a dedicated task dashboard to track all commitments extracted from meetings or added manually.
Each commitment tracks:
- Task Description
- Client / Project
- Assigned Person
- Deadline
- Status (`Pending`, `In Progress`, `Completed`, `Overdue`)

Updating a task status (e.g., marking it **Completed**) automatically updates Hindsight long-term memory so future meeting preparations reflect the updated delivery state.

#### 📝 Step-by-Step Guide: How to Track and Update Commitments
1. Click **Commitments** in the sidebar.
2. **Filter by Status**: Click tabs (*All*, *Pending*, *In Progress*, *Completed*, *Overdue*).
3. **Update Status**: Click the status dropdown badge on any task card and change it (e.g. change `Pending` to `Completed ✓`).
4. Notice that marking a task completed updates its status in Hindsight memory for future briefings.

---

### Feature 6: AI Assistant Conversational Chat

#### What It Does
An interactive AI chatbot where users can ask questions about previous meetings, client requests, promises, or deadlines.
- Uses retrieved Hindsight memory context to answer accurately.
- Clearly states when information is unavailable without fabricating false details.

#### 📝 Step-by-Step Guide: How to Chat with the AI Memory Assistant
1. Click **AI Assistant** in the sidebar.
2. (Optional) Filter the chat context by selecting a specific client from the top right dropdown.
3. Click any **Sample Question** button (e.g. *"What did Ravi promise?"* or *"Has the security issue been resolved?"*) OR type a custom question in the input bar.
4. Press **Send**.
5. The assistant returns a factual answer along with citations of the retrieved memories used.

---

### Feature 7: Hindsight Memory Explorer

#### What It Does
Visual inspection interface allowing users to view, edit, or delete items stored in Hindsight memory.
Categorizes memories into:
- Client Preferences
- Decisions
- Commitments
- Action Items
- Unresolved Concerns
- Historical Context

Edits or deletions made in the Memory Explorer directly shape subsequent AI briefings and chat answers.

#### 📝 Step-by-Step Guide: How to Inspect and Edit Memories
1. Click **Memory Explorer** in the sidebar.
2. Click category pills (*Client Preferences*, *Unresolved Concerns*, etc.) to filter memories.
3. **Edit a Memory**:
   - Click the pencil icon on any memory card.
   - Edit the content text or change its category/status.
   - Click the checkmark button to save.
4. **Delete a Memory**:
   - Click the trash icon on a memory card to remove incorrect or outdated facts.

---

### Feature 8: Hackathon 8-Step Interactive Demo Walkthrough

#### What It Does
A top-level banner at the top of the app designed for judges and evaluators to test all core capabilities in an automated 8-step sequence.

#### 📝 Step-by-Step Demo Execution Guide:
1. Click **"Step 1: Seed ABC Client Discovery Meeting"** on the top banner. This creates Meeting #1 for ABC Client (*Payment module by Oct 10, Ravi API docs, security concern, dark mode*).
2. Click **"Step 2 & 3"** to navigate to Memory Explorer and verify categorized facts.
3. Click **"Step 4 & 5"** to open Prepare Me and view the generated briefing.
4. Click **"Step 6"** to add a follow-up meeting where Ravi delivers API docs and dark mode is approved.
5. Click **"Step 7"** to regenerate the briefing and verify that task status updates while historical context is preserved.
6. Click **"Step 8"** to run the **Client Isolation Test** for XYZ Corp, verifying zero cross-contamination.

---

### Feature 9: System Settings & Health Monitor

#### What It Does
Displays real-time status of the Express backend, Hindsight memory engine, and Gemini API provider. Provides 1-click database seeding and reset options.

#### 📝 Step-by-Step Guide: How to Check Health & Reset Data
1. Click **Settings & Demo** in the sidebar.
2. Review **Backend & Service Health** cards.
3. Click **"Preload Demo Data"** to reset and seed sample client meetings.
4. Click **"Reset Database"** to wipe all data and return to a clean slate.

---

## 5. Installation & Local Execution Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Step 1: Install & Build
Run the automated root setup script:
```bash
npm run setup
```
*This installs dependencies for both server and client, compiles TypeScript code, and builds the Vite production frontend.*

### Step 2: Environment Setup (Optional)
Create a `.env` file in the `server/` directory:
```env
PORT=5050
GEMINI_API_KEY=your_gemini_api_key_here
HINDSIGHT_API_URL=
HINDSIGHT_API_KEY=
```
*Note: If no API key is provided, the application automatically uses its built-in Hindsight engine and intelligent heuristic parser.*

### Step 3: Start the Application
```bash
npm start
```

Open your browser to:
👉 **`http://localhost:5050`**

*(Development mode with Vite HMR can be launched using `npm run dev:client` on port 3000).*

---

## 6. API Endpoint Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/meetings` | Create meeting & process AI memory extraction |
| `GET` | `/api/meetings` | List meetings (with `search` & `client` filters) |
| `GET` | `/api/meetings/:id` | Fetch single meeting details & extracted data |
| `DELETE` | `/api/meetings/:id` | Delete meeting |
| `POST` | `/api/briefings/generate` | Generate "Prepare Me" client briefing |
| `POST` | `/api/chat` | AI Chat query using retrieved memory |
| `GET` | `/api/commitments` | List commitments (filtered by `client`/`status`) |
| `PUT` | `/api/commitments/:id` | Update commitment status & sync Hindsight |
| `DELETE` | `/api/commitments/:id` | Delete commitment |
| `GET` | `/api/memories` | Inspect all Hindsight memory items |
| `PUT` | `/api/memories/:id` | Edit memory content/category/status |
| `DELETE` | `/api/memories/:id` | Delete memory item |
| `POST` | `/api/demo/seed` | Preload hackathon sample dataset |
| `POST` | `/api/demo/reset` | Reset database cleanly |
| `GET` | `/api/health` | System health check |

---

## 7. Troubleshooting & FAQs

- **Q: Why does the app run on port 5050 instead of 5000?**  
  *A: Port 5050 is used to eliminate port collisions with existing services running on port 5000 on Windows/macOS.*
- **Q: Does data persist after restarting the app?**  
  *A: Yes! All meetings, commitments, extracted details, and Hindsight memories are saved in `server/data/database.sqlite`.*
- **Q: What happens if Gemini API key is not set?**  
  *A: The app seamlessly switches to its built-in rule-based heuristic extraction engine, ensuring zero downtime or failures.*
