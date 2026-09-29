import { GoogleGenerativeAI } from '@google/generative-ai';
import { ExtractionResult, BriefingSection, MemoryItem, Commitment, Meeting } from '../types';

export class AIService {
  private getApiKey(): string | null {
    return process.env.GEMINI_API_KEY || null;
  }

  /**
   * Extract structured information from meeting notes
   */
  async extractMeetingDetails(notes: string, title: string, clientName: string): Promise<ExtractionResult> {
    const apiKey = this.getApiKey();

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `You are an AI meeting assistant. Analyze the following meeting notes for client "${clientName}" (Title: "${title}").
Extract the structured information into valid JSON only. Do not include markdown code block syntax (like \`\`\`json).

Return a single JSON object with this exact structure:
{
  "decisions": [{"content": "string"}],
  "commitments": [{"content": "string", "assigned_to": "string", "deadline": "string"}],
  "action_items": [{"content": "string", "assigned_to": "string", "deadline": "string"}],
  "unresolved_concerns": [{"content": "string"}],
  "client_preferences": [{"content": "string"}],
  "follow_ups": [{"content": "string"}]
}

Meeting Notes:
"${notes}"
`;

        const response = await model.generateContent(prompt);
        const text = response.response.text().trim();
        // Remove triple backticks if present
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned) as ExtractionResult;
        
        return {
          decisions: Array.isArray(parsed.decisions) ? parsed.decisions : [],
          commitments: Array.isArray(parsed.commitments) ? parsed.commitments : [],
          action_items: Array.isArray(parsed.action_items) ? parsed.action_items : [],
          unresolved_concerns: Array.isArray(parsed.unresolved_concerns) ? parsed.unresolved_concerns : [],
          client_preferences: Array.isArray(parsed.client_preferences) ? parsed.client_preferences : [],
          follow_ups: Array.isArray(parsed.follow_ups) ? parsed.follow_ups : []
        };
      } catch (err) {
        console.warn('Gemini API extraction failed, using heuristic rule parser:', err);
      }
    }

    // Heuristic Fallback Parser
    return this.fallbackExtraction(notes);
  }

  /**
   * Fallback rule-based extractor if API is offline or key missing
   */
  private fallbackExtraction(notes: string): ExtractionResult {
    const lines = notes.split(/(?:\. |\n)+/).map(s => s.trim()).filter(Boolean);
    
    const decisions: Array<{ content: string }> = [];
    const commitments: Array<{ content: string; assigned_to: string; deadline: string }> = [];
    const action_items: Array<{ content: string; assigned_to: string; deadline: string }> = [];
    const unresolved_concerns: Array<{ content: string }> = [];
    const client_preferences: Array<{ content: string }> = [];
    const follow_ups: Array<{ content: string }> = [];

    // Extract names, dates, key action verbs
    for (const line of lines) {
      const lower = line.toLowerCase();

      // Check for deadline patterns e.g. "by Friday", "by October 10", "next week"
      let deadline = '';
      const deadlineMatch = line.match(/by\s+([A-Za-z0-9\s]+?)(?=\.|$|,)/i);
      if (deadlineMatch) {
        deadline = deadlineMatch[1].trim();
      }

      // Check for assigned person e.g. "Ravi will...", "John to...", "Alice agreed..."
      let assigned_to = 'Unassigned';
      const nameMatch = line.match(/\b([A-Z][a-z]+)\s+(?:will|to|promised|agreed|shall|should|must|is assigned)\b/);
      if (nameMatch) {
        assigned_to = nameMatch[1];
      }

      if (lower.includes('concern') || lower.includes('issue') || lower.includes('worried') || lower.includes('risk') || lower.includes('problem') || lower.includes('security')) {
        unresolved_concerns.push({ content: line });
      } else if (lower.includes('requested') || lower.includes('preference') || lower.includes('dark mode') || lower.includes('wants') || lower.includes('like')) {
        client_preferences.push({ content: line });
      } else if (lower.includes('promise') || lower.includes('will send') || lower.includes('will deliver') || lower.includes('deliver') || lower.includes('commit')) {
        commitments.push({ content: line, assigned_to, deadline });
      } else if (lower.includes('approved') || lower.includes('decided') || lower.includes('agreed on') || lower.includes('selected')) {
        decisions.push({ content: line });
      } else if (lower.includes('send') || lower.includes('create') || lower.includes('build') || lower.includes('action') || lower.includes('do')) {
        action_items.push({ content: line, assigned_to, deadline });
      } else if (lower.includes('follow up') || lower.includes('check') || lower.includes('next meeting')) {
        follow_ups.push({ content: line });
      } else {
        action_items.push({ content: line, assigned_to, deadline });
      }
    }

    return {
      decisions,
      commitments,
      action_items,
      unresolved_concerns,
      client_preferences,
      follow_ups
    };
  }

  /**
   * Generate "Prepare Me" structured meeting briefing using retrieved memories
   */
  async generateBriefing(
    clientName: string,
    memories: MemoryItem[],
    commitments: Commitment[],
    meetings: Meeting[]
  ): Promise<BriefingSection> {
    const apiKey = this.getApiKey();

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `You are Smart Meeting Memory Agent preparing a personalized executive briefing for an upcoming meeting with client "${clientName}".

Use the following retrieved memories, commitments, and historical meetings to produce a structured JSON response.

Retrieved Memories:
${JSON.stringify(memories, null, 2)}

Active Commitments:
${JSON.stringify(commitments, null, 2)}

Previous Meetings:
${JSON.stringify(meetings.map(m => ({ title: m.title, date: m.date, notes: m.notes })), null, 2)}

Return valid JSON only with this exact schema (no markdown formatting around it):
{
  "previous_meeting_summary": ["Point 1", "Point 2"],
  "decisions_made": ["Decision 1"],
  "commitments": [
    {"task": "Task description", "assigned_to": "Person", "deadline": "Date", "status": "Pending/Completed/Overdue"}
  ],
  "unresolved_concerns": ["Concern 1"],
  "suggested_questions": ["Question 1", "Question 2"],
  "important_reminders": {
    "client_preferences": ["Preference 1"],
    "promises_made": ["Promise 1"],
    "upcoming_deadlines": ["Deadline 1"]
  },
  "personalized_memory": "Here's what I remember about ${clientName}..."
}
`;

        const response = await model.generateContent(prompt);
        const text = response.response.text().trim();
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned) as BriefingSection;
      } catch (err) {
        console.warn('Gemini briefing generation error, using smart synthesis:', err);
      }
    }

    // Fallback Smart Briefing Synthesis
    return this.fallbackBriefing(clientName, memories, commitments, meetings);
  }

  /**
   * Fallback synthesis for Briefing
   */
  private fallbackBriefing(
    clientName: string,
    memories: MemoryItem[],
    commitments: Commitment[],
    meetings: Meeting[]
  ): BriefingSection {
    const previousSummary = meetings.length > 0 
      ? meetings.map(m => `${m.title} (${m.date}): ${m.notes.slice(0, 120)}...`)
      : [`Previous interaction on record for ${clientName}.`];

    const decisions = memories.filter(m => m.category === 'decision').map(m => m.content);
    const concerns = memories.filter(m => m.category === 'unresolved_concern' && m.status === 'active').map(m => m.content);
    const prefs = memories.filter(m => m.category === 'preference').map(m => m.content);

    const mappedCommitments = commitments.map(c => ({
      task: c.task_description,
      assigned_to: c.assigned_to || 'Team',
      deadline: c.deadline || 'TBD',
      status: c.status
    }));

    const suggestedQuestions: string[] = [];
    if (concerns.length > 0) {
      concerns.forEach(c => suggestedQuestions.push(`Has the concern regarding "${c}" been fully resolved?`));
    }
    commitments.filter(c => c.status !== 'completed').forEach(c => {
      suggestedQuestions.push(`What is the progress on delivering "${c.task_description}" assigned to ${c.assigned_to}?`);
    });
    if (suggestedQuestions.length === 0) {
      suggestedQuestions.push('What are the key milestones for the upcoming quarter?');
      suggestedQuestions.push('Are there any new requirements or integration blockers?');
    }

    const promises = commitments.map(c => `${c.assigned_to} to deliver ${c.task_description} by ${c.deadline || 'specified deadline'}`);
    const deadlines = commitments.filter(c => c.deadline).map(c => `${c.task_description}: ${c.deadline} (${c.status})`);

    const personalizedMemory = memories.length > 0
      ? `Here's what I remember about ${clientName}: You have had ${meetings.length} previous meeting(s). Key preferences include ${prefs.join(', ') || 'standard delivery specs'}. Outstanding items include ${concerns.length} open concern(s) and ${commitments.filter(c => c.status !== 'completed').length} pending commitment(s).`
      : `Here's what I remember about ${clientName}: This client is newly onboarded with default project tracking.`;

    return {
      previous_meeting_summary: previousSummary,
      decisions_made: decisions.length > 0 ? decisions : ['No major decisions recorded yet.'],
      commitments: mappedCommitments,
      unresolved_concerns: concerns.length > 0 ? concerns : ['No open unresolved concerns currently logged.'],
      suggested_questions: suggestedQuestions,
      important_reminders: {
        client_preferences: prefs.length > 0 ? prefs : ['None recorded.'],
        promises_made: promises.length > 0 ? promises : ['No active promises outstanding.'],
        upcoming_deadlines: deadlines.length > 0 ? deadlines : ['No pending deadlines.']
      },
      personalized_memory: personalizedMemory
    };
  }

  /**
   * Conversational Chat using memory retrieval
   */
  async answerChatQuestion(
    userQuestion: string,
    memories: MemoryItem[],
    commitments: Commitment[],
    meetings: Meeting[]
  ): Promise<string> {
    const apiKey = this.getApiKey();

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `You are an intelligent Smart Meeting Memory AI Assistant.
Answer the user's question accurately using ONLY the provided memory records, commitments, and past meetings.
If the information is NOT present in the memory or past meetings, state clearly that you do not have record of that in memory. Do NOT fabricate facts, promises, or deadlines.

Context Data:
Memories: ${JSON.stringify(memories)}
Commitments: ${JSON.stringify(commitments)}
Meetings: ${JSON.stringify(meetings.map(m => ({ title: m.title, client: m.client_name, date: m.date, notes: m.notes })))}

User Question: "${userQuestion}"
`;

        const response = await model.generateContent(prompt);
        return response.response.text().trim();
      } catch (err) {
        console.warn('Gemini chat error, fallback to memory lookup:', err);
      }
    }

    // Heuristic Chat Answer Generation
    const qLower = userQuestion.toLowerCase();
    const responses: string[] = [];

    // Search memories matching query keywords
    const matchingMemories = memories.filter(m => 
      qLower.split(' ').some(w => w.length > 3 && m.content.toLowerCase().includes(w))
    );

    const matchingCommitments = commitments.filter(c =>
      qLower.split(' ').some(w => w.length > 3 && (c.task_description.toLowerCase().includes(w) || c.assigned_to.toLowerCase().includes(w)))
    );

    if (matchingMemories.length > 0 || matchingCommitments.length > 0) {
      responses.push(`Based on your meeting memory records:`);
      matchingMemories.forEach(m => responses.push(`• [${m.category.toUpperCase()}] ${m.content} (Status: ${m.status})`));
      matchingCommitments.forEach(c => responses.push(`• [COMMITMENT] ${c.assigned_to} is responsible for "${c.task_description}" by ${c.deadline || 'TBD'} (Status: ${c.status})`));
    } else if (memories.length > 0) {
      responses.push(`I checked your meeting memory records. Here is what is stored:`);
      memories.slice(0, 5).forEach(m => responses.push(`• ${m.content}`));
    } else {
      responses.push(`I don't have any recorded meeting memories matching your request yet. Please add a meeting or notes to populate memory.`);
    }

    return responses.join('\n');
  }
}

export const aiService = new AIService();
