import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#4338CA")) # Indigo

        # Running Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, letter[1] - 36, "SMART MEETING MEMORY AGENT -- OFFICIAL DOCUMENTATION")
            self.setStrokeColor(colors.HexColor("#E0E7FF"))
            self.setLineWidth(0.5)
            self.line(54, letter[1] - 42, letter[0] - 54, letter[1] - 42)

        # Running Footer (all pages)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(54, 36, "Confidential & Proprietary -- Smart Meeting Memory Agent Project Document")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 54, 36, page_str)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 46, letter[0] - 54, 46)

        self.restoreState()

def build_pdf(filename="Smart_Meeting_Memory_Agent_Documentation.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styles
    primary_color = colors.HexColor("#3730A3")   # Dark Indigo
    secondary_color = colors.HexColor("#4F46E5") # Indigo
    accent_purple = colors.HexColor("#7E22CE")   # Purple
    text_dark = colors.HexColor("#0F172A")       # Slate 900
    bg_light = colors.HexColor("#F8FAFC")        # Slate 50
    border_color = colors.HexColor("#E2E8F0")    # Slate 200

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=primary_color,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=secondary_color,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=accent_purple,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=text_dark,
        spaceAfter=6
    )

    bold_body = ParagraphStyle(
        'BoldBody',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    code_style = ParagraphStyle(
        'Code',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#1E1B4B"),
        backColor=colors.HexColor("#EEF2FF"),
        borderColor=colors.HexColor("#C7D2FE"),
        borderWidth=0.5,
        borderPadding=6,
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    story = []

    # Title Banner
    story.append(Paragraph("Smart Meeting Memory Agent", title_style))
    story.append(Paragraph("COMPLETE TECHNICAL DOCUMENTATION & STEP-BY-STEP USER GUIDE", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=secondary_color, spaceAfter=15))

    # Executive Summary
    story.append(Paragraph("1. Executive Summary & Purpose", h1_style))
    story.append(Paragraph(
        "Professionals attend multiple meetings daily with clients, managers, and cross-functional teams. "
        "Critical decisions, deadlines, assigned commitments, and unresolved concerns are often forgotten or scattered across raw notes. "
        "Traditional AI chatbots operate on single sessions and do not retain context across interactions, forcing users to repeat background context before every meeting.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Smart Meeting Memory Agent</b> solves this problem by acting as a persistent AI long-term memory system powered by <b>Hindsight</b> and <b>Google Gemini API</b>. "
        "It automatically extracts key facts, updates commitment statuses over time, isolates client memory contexts, and synthesizes structured executive briefings before upcoming meetings.",
        body_style
    ))

    # Architecture Table
    story.append(Spacer(1, 8))
    story.append(Paragraph("2. System Architecture & Tech Stack", h1_style))
    
    arch_data = [
        [Paragraph("<b>Component</b>", bold_body), Paragraph("<b>Technology Stack</b>", bold_body), Paragraph("<b>Key Function & Purpose</b>", bold_body)],
        [Paragraph("<b>Frontend UI</b>", body_style), Paragraph("React 18, TypeScript, Vite, Tailwind CSS v4, Lucide Icons", body_style), Paragraph("Responsive SaaS dashboard, interactive demo controls, modals, and real-time memory feeds.", body_style)],
        [Paragraph("<b>Backend API</b>", body_style), Paragraph("Node.js, Express.js (Port 5050), TypeScript", body_style), Paragraph("REST API routing, extraction pipeline, briefing generator, SQLite database controllers.", body_style)],
        [Paragraph("<b>Database Layer</b>", body_style), Paragraph("SQLite via <code>sql.js</code> (WASM + Atomic Disk Persistence)", body_style), Paragraph("Zero-config relational database storing meetings, extracted items, commitments, and settings.", body_style)],
        [Paragraph("<b>Long-Term Memory</b>", body_style), Paragraph("<b>Hindsight Memory System</b> (<code>hindsightService.ts</code>)", body_style), Paragraph("Persistent semantic fact retention, temporal status updates, and strict client isolation.", body_style)],
        [Paragraph("<b>AI Provider</b>", body_style), Paragraph("Google Gemini 2.5 Flash API + Heuristic Engine", body_style), Paragraph("Parses meeting notes, extracts structured facts, generates briefings, and answers Q&A chat.", body_style)],
    ]
    
    arch_table = Table(arch_data, colWidths=[1.1*inch, 2.3*inch, 3.1*inch])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#EEF2FF")),
        ('TEXTCOLOR', (0,0), (-1,0), primary_color),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(arch_table)

    # Hindsight Memory Deep Dive
    story.append(Spacer(1, 10))
    story.append(Paragraph("3. Hindsight Memory Architecture Deep Dive", h1_style))
    story.append(Paragraph(
        "Hindsight serves as the primary long-term memory engine. Unlike standard chatbots that append messages into a temporary window, "
        "Hindsight structures memories into discrete categories:",
        body_style
    ))
    story.append(Paragraph("- <b>Client Preferences</b>: Technical requirements, preferred modes, delivery styles (e.g. <i>'Client requested Dark Mode'</i>).", bullet_style))
    story.append(Paragraph("- <b>Decisions</b>: Formal agreements reached during meetings (e.g. <i>'Approved payment architecture B'</i>).", bullet_style))
    story.append(Paragraph("- <b>Commitments</b>: Tasks promised by team members or clients with assigned owners and deadlines.", bullet_style))
    story.append(Paragraph("- <b>Action Items</b>: Operational follow-ups and task assignments.", bullet_style))
    story.append(Paragraph("- <b>Unresolved Concerns</b>: Open issues, security risks, or pending questions raised by the client.", bullet_style))
    story.append(Paragraph("- <b>Historical Context</b>: Preserved records of past discussions.", bullet_style))
    story.append(Paragraph(
        "<b>Dynamic Memory Lifecycles</b>: When a new meeting is recorded, Hindsight inspects existing active memories. "
        "If new notes indicate a previously unresolved concern or task has been addressed, Hindsight updates the status of the older memory item to <code>resolved</code> or <code>completed</code> while preserving the historical record. "
        "Contexts for different clients are strictly isolated.",
        body_style
    ))

    story.append(PageBreak())

    # Exhaustive Feature Guide & Tasks
    story.append(Paragraph("4. Exhaustive Feature Guide & Step-by-Step Task Instructions", h1_style))

    features = [
        ("Feature 1: Dashboard Overview",
         "The Dashboard is the executive command center displaying top KPI metrics (Total Meetings, Active Commitments, Completed Tasks, Overdue Tasks, Open Concerns), recent meeting highlights, upcoming deadlines, and a live feed of memories recorded in Hindsight.",
         [
             "1. Click <b>Dashboard</b> in the sidebar navigation.",
             "2. Click any KPI card (e.g. <i>Active Commitments</i>) to jump directly to that filtered view.",
             "3. Click <b>'Prepare Me Now'</b> on the top purple banner to generate an immediate briefing.",
             "4. Click <b>'+ Add Meeting'</b> to open the meeting note recording drawer."
         ]),

        ("Feature 2: Meeting Capture & AI Information Extraction",
         "Allows users to input meeting notes or transcripts. When submitted, the backend AI model automatically parses text and extracts Confirmed Decisions, Commitments (task, assigned owner, deadline), Action Items, Unresolved Concerns, Client Preferences, and Follow-up Requirements.",
         [
             "1. Click <b>'+ Add Meeting'</b> in the top navigation bar or <b>'Record New Meeting'</b> on the Meetings view.",
             "2. Enter <b>Meeting Title</b> (e.g. <i>'ABC Client Payment Sync'</i>) and <b>Client Name</b> (e.g. <i>'ABC Client'</i>).",
             "3. Paste raw meeting notes or click <b>'Load Sample Meeting Notes'</b> to auto-populate sample text.",
             "4. Click <b>'Process & Save Meeting'</b>.",
             "5. Click <b>'View Details & Extraction'</b> on the saved meeting card to inspect AI extracted items."
         ]),

        ("Feature 3: Searchable Meeting History",
         "Provides a centralized repository of all historical meetings with client pill filtering and full-text keyword searching.",
         [
             "1. Click <b>Meetings</b> in the sidebar.",
             "2. <b>Filter by Client</b>: Click any client pill (e.g. <i>'ABC Client'</i>) at the top.",
             "3. <b>Search Notes</b>: Type key terms (e.g. <i>'security'</i>, <i>'dark mode'</i>) into the search bar.",
             "4. <b>View Details</b>: Click <b>'View Details & Extraction'</b> to view notes alongside extracted facts.",
             "5. <b>Delete Meeting</b>: Click the trash icon on a card to delete it."
         ]),

        ("Feature 4: Prepare Me for My Next Meeting (Briefings)",
         "Flagship feature. Select a client, and the AI queries Hindsight long-term memories, commitments, and past meetings to generate a structured executive briefing containing Previous Meeting Summary, Confirmed Decisions, Tracked Commitments & Status, Unresolved Concerns, Suggested Questions, Important Reminders, and a Natural-Language Memory Synthesis beginning with <i>'Here is what I remember about [Client]...'</i>.",
         [
             "1. Click <b>Prepare for Meeting</b> in the sidebar.",
             "2. Select the target client from the dropdown menu (e.g. <i>'ABC Client'</i>).",
             "3. Click <b>'Generate Briefing'</b>.",
             "4. Read the top purple <b>Hindsight Synthesis Card</b> for natural-language memory recollection.",
             "5. Review <b>Tracked Commitments</b> and <b>Suggested Questions</b> to frame your meeting agenda."
         ]),

        ("Feature 5: Commitment & Task Tracking",
         "Dedicated task dashboard tracking task description, client, assigned owner, deadline, and status (Pending, In Progress, Completed, Overdue). Updating a task status automatically syncs back to Hindsight memory!",
         [
             "1. Click <b>Commitments</b> in the sidebar.",
             "2. <b>Filter by Status</b>: Click tabs (<i>All</i>, <i>Pending</i>, <i>In Progress</i>, <i>Completed</i>, <i>Overdue</i>).",
             "3. <b>Update Status</b>: Click the status dropdown badge on any task card (e.g. change <i>Pending</i> to <i>Completed ✓</i>).",
             "4. Notice that marking a task completed updates its status in Hindsight memory for future briefings."
         ]),

        ("Feature 6: AI Assistant Conversational Chat",
         "Interactive AI chatbot where users can ask questions about past meetings, client requests, promises, or deadlines using retrieved Hindsight memories.",
         [
             "1. Click <b>AI Assistant</b> in the sidebar.",
             "2. (Optional) Filter chat context by selecting a specific client from the top right dropdown.",
             "3. Click any <b>Sample Question</b> button (e.g. <i>'What did Ravi promise?'</i>) or type a custom question.",
             "4. Press <b>Send</b> to view factual answers with memory citations."
         ]),

        ("Feature 7: Hindsight Memory Explorer",
         "Visual inspection tool allowing users to view, edit, or delete memories stored in Hindsight across categories (Preferences, Decisions, Commitments, Action Items, Unresolved Concerns, Historical Context). Edits directly shape future AI responses!",
         [
             "1. Click <b>Memory Explorer</b> in the sidebar.",
             "2. Click category pills to filter memories.",
             "3. <b>Edit Memory</b>: Click the pencil icon on a card, edit text/category, and click checkmark.",
             "4. <b>Delete Memory</b>: Click the trash icon to remove outdated or incorrect facts."
         ]),

        ("Feature 8: Hackathon 8-Step Interactive Demo Walkthrough",
         "A top banner allowing evaluators to test all core capabilities in an automated 8-step sequence.",
         [
             "1. Click <b>'Step 1: Seed ABC Client Discovery Meeting'</b> on the top banner.",
             "2. Click <b>'Step 2 & 3'</b> to inspect Hindsight memory explorer.",
             "3. Click <b>'Step 4 & 5'</b> to generate the Prepare Me briefing for ABC Client.",
             "4. Click <b>'Step 6'</b> to add a follow-up meeting resolving API docs.",
             "5. Click <b>'Step 7'</b> to regenerate briefing and verify status updates.",
             "6. Click <b>'Step 8'</b> to run the Client Isolation Test for XYZ Corp."
         ]),

        ("Feature 9: System Settings & Health Monitor",
         "Displays health status of Express backend, Hindsight memory engine, and Gemini API provider with 1-click database seed and reset controls.",
         [
             "1. Click <b>Settings & Demo</b> in the sidebar.",
             "2. Review <b>Backend & Service Health</b> cards.",
             "3. Click <b>'Preload Demo Data'</b> or <b>'Reset Database'</b> as needed."
         ])
    ]

    for title, desc, steps in features:
        story.append(Paragraph(title, h2_style))
        story.append(Paragraph(desc, body_style))
        story.append(Paragraph("<b>Step-by-Step Task Instructions:</b>", bold_body))
        for step in steps:
            story.append(Paragraph(step, bullet_style))
        story.append(Spacer(1, 4))

    story.append(PageBreak())

    # Installation & API Reference
    story.append(Paragraph("5. Installation & Local Execution Guide", h1_style))
    story.append(Paragraph("Follow these instructions to run the application on any local machine:", body_style))
    story.append(Paragraph("<b>Step 1: Install Dependencies & Build Project</b>", bold_body))
    story.append(Paragraph("<code>npm run setup</code>", code_style))
    story.append(Paragraph("<b>Step 2: Start the Application</b>", bold_body))
    story.append(Paragraph("<code>npm start</code>", code_style))
    story.append(Paragraph("Open your browser to: <b>http://localhost:5050</b> (Production) or <b>http://localhost:3000</b> (Dev).", body_style))

    story.append(Spacer(1, 10))
    story.append(Paragraph("6. Complete API Endpoint Reference", h1_style))

    api_data = [
        [Paragraph("<b>Method</b>", bold_body), Paragraph("<b>Endpoint</b>", bold_body), Paragraph("<b>Description & Purpose</b>", bold_body)],
        [Paragraph("POST", body_style), Paragraph("/api/meetings", body_style), Paragraph("Record meeting & process AI memory extraction.", body_style)],
        [Paragraph("GET", body_style), Paragraph("/api/meetings", body_style), Paragraph("List meetings (supports search & client filters).", body_style)],
        [Paragraph("GET", body_style), Paragraph("/api/meetings/:id", body_style), Paragraph("Fetch single meeting details & extracted data.", body_style)],
        [Paragraph("DELETE", body_style), Paragraph("/api/meetings/:id", body_style), Paragraph("Delete meeting record.", body_style)],
        [Paragraph("POST", body_style), Paragraph("/api/briefings/generate", body_style), Paragraph("Generate 'Prepare Me' client briefing.", body_style)],
        [Paragraph("POST", body_style), Paragraph("/api/chat", body_style), Paragraph("AI Chat query using retrieved Hindsight memory.", body_style)],
        [Paragraph("GET", body_style), Paragraph("/api/commitments", body_style), Paragraph("List commitments (filtered by client/status).", body_style)],
        [Paragraph("PUT", body_style), Paragraph("/api/commitments/:id", body_style), Paragraph("Update commitment status & sync Hindsight memory.", body_style)],
        [Paragraph("GET", body_style), Paragraph("/api/memories", body_style), Paragraph("Inspect all Hindsight memory items.", body_style)],
        [Paragraph("PUT", body_style), Paragraph("/api/memories/:id", body_style), Paragraph("Edit memory content, category, or status.", body_style)],
        [Paragraph("DELETE", body_style), Paragraph("/api/memories/:id", body_style), Paragraph("Delete memory item.", body_style)],
        [Paragraph("POST", body_style), Paragraph("/api/demo/seed", body_style), Paragraph("Preload hackathon sample dataset.", body_style)],
        [Paragraph("POST", body_style), Paragraph("/api/demo/reset", body_style), Paragraph("Reset database cleanly.", body_style)],
        [Paragraph("GET", body_style), Paragraph("/api/health", body_style), Paragraph("System health and Hindsight connection check.", body_style)],
    ]

    api_table = Table(api_data, colWidths=[0.8*inch, 2.2*inch, 3.5*inch])
    api_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#EEF2FF")),
        ('TEXTCOLOR', (0,0), (-1,0), primary_color),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(api_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] PDF Documentation generated successfully: {filename}")

if __name__ == "__main__":
    build_pdf()
