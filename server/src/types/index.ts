export interface Meeting {
  id: string;
  title: string;
  client_name: string;
  project_name?: string;
  date: string;
  participants: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export type ExtractedType = 
  | 'decision' 
  | 'commitment' 
  | 'action_item' 
  | 'unresolved_concern' 
  | 'preference' 
  | 'follow_up';

export interface ExtractedData {
  id: string;
  meeting_id: string;
  type: ExtractedType;
  content: string;
  assigned_to?: string;
  deadline?: string;
  status?: string;
  created_at: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export interface Commitment {
  id: string;
  meeting_id: string;
  task_description: string;
  client_name: string;
  project_name?: string;
  assigned_to: string;
  deadline: string;
  status: TaskStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type MemoryCategory = 
  | 'preference' 
  | 'decision' 
  | 'commitment' 
  | 'action_item' 
  | 'unresolved_concern' 
  | 'historical_context';

export interface MemoryItem {
  id: string;
  client_name: string;
  project_name?: string;
  category: MemoryCategory;
  content: string;
  entity_type: string;
  status: 'active' | 'resolved' | 'updated' | 'archived';
  source_meeting_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ExtractionResult {
  decisions: Array<{ content: string }>;
  commitments: Array<{ content: string; assigned_to: string; deadline: string }>;
  action_items: Array<{ content: string; assigned_to: string; deadline: string }>;
  unresolved_concerns: Array<{ content: string }>;
  client_preferences: Array<{ content: string }>;
  follow_ups: Array<{ content: string }>;
}

export interface BriefingSection {
  previous_meeting_summary: string[];
  decisions_made: string[];
  commitments: Array<{
    task: string;
    assigned_to: string;
    deadline: string;
    status: string;
  }>;
  unresolved_concerns: string[];
  suggested_questions: string[];
  important_reminders: {
    client_preferences: string[];
    promises_made: string[];
    upcoming_deadlines: string[];
  };
  personalized_memory: string; // "Here's what I remember about [Client]..."
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  retrieved_memories?: MemoryItem[];
}
