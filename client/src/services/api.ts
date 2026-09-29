import { Meeting, Commitment, MemoryItem, BriefingSection, ExtractedData } from '../types';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errMessage = 'API Request failed';
    try {
      const data = await res.json();
      errMessage = data.error || errMessage;
    } catch {
      errMessage = await res.text();
    }
    throw new Error(errMessage);
  }

  return res.json();
}

export const api = {
  // Health
  getHealth: () => fetchJson<{ status: string; hindsight_integration: string; gemini_ai_configured: boolean }>('/health'),

  // Meetings
  getMeetings: (search?: string, client?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (client) params.append('client', client);
    return fetchJson<Meeting[]>(`/meetings?${params.toString()}`);
  },

  getMeetingById: (id: string) => 
    fetchJson<{ meeting: Meeting; extracted: ExtractedData[]; commitments: Commitment[] }>(`/meetings/${id}`),

  createMeeting: (data: {
    title: string;
    client_name: string;
    project_name?: string;
    date: string;
    participants?: string;
    notes: string;
  }) => fetchJson<{ meeting: Meeting; extracted: ExtractedData[]; commitments: Commitment[] }>('/meetings', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  deleteMeeting: (id: string) => fetchJson<{ success: boolean }>(`/meetings/${id}`, { method: 'DELETE' }),

  // Briefings
  generateBriefing: (client_name: string) => 
    fetchJson<BriefingSection>('/briefings/generate', {
      method: 'POST',
      body: JSON.stringify({ client_name }),
    }),

  // AI Chat
  sendChatMessage: (query: string, client_name?: string) => 
    fetchJson<{ answer: string; memories: MemoryItem[] }>('/chat', {
      method: 'POST',
      body: JSON.stringify({ query, client_name }),
    }),

  // Commitments
  getCommitments: (client?: string, status?: string, search?: string) => {
    const params = new URLSearchParams();
    if (client) params.append('client', client);
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    return fetchJson<Commitment[]>(`/commitments?${params.toString()}`);
  },

  updateCommitmentStatus: (id: string, status: string, notes?: string) =>
    fetchJson<Commitment>(`/commitments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    }),

  deleteCommitment: (id: string) => fetchJson<{ success: boolean }>(`/commitments/${id}`, { method: 'DELETE' }),

  // Memories
  getMemories: (client?: string, category?: string) => {
    const params = new URLSearchParams();
    if (client) params.append('client', client);
    if (category) params.append('category', category);
    return fetchJson<MemoryItem[]>(`/memories?${params.toString()}`);
  },

  updateMemory: (id: string, data: { content: string; category?: string; status?: string }) =>
    fetchJson<MemoryItem>(`/memories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteMemory: (id: string) => fetchJson<{ success: boolean }>(`/memories/${id}`, { method: 'DELETE' }),

  // Demo
  seedDemo: () => fetchJson<any>('/demo/seed', { method: 'POST' }),
  followupDemo: () => fetchJson<any>('/demo/followup', { method: 'POST' }),
  resetDemo: () => fetchJson<any>('/demo/reset', { method: 'POST' }),
};
