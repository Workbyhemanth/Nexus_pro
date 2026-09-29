import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, BrainCircuit, Building2 } from 'lucide-react';
import { ChatMessage, Meeting } from '../types';
import { api } from '../services/api';

interface ChatViewProps {
  meetings: Meeting[];
}

export const ChatView: React.FC<ChatViewProps> = ({ meetings }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your Smart Meeting Memory AI Assistant. Ask me anything about previous meeting notes, client commitments, promises made, or open concerns across all your meetings.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(false);

  const clients = Array.from(new Set(meetings.map((m) => m.client_name))).filter(Boolean);

  const sampleQuestions = [
    'What did ABC client ask us to deliver?',
    'What concerns did the client raise last time?',
    'What did Ravi promise?',
    'Which commitments are overdue?',
    'Has the security issue been resolved?'
  ];

  const handleSendMessage = async (queryText?: string) => {
    const text = queryText || inputQuery;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage(text, selectedClient);
      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        retrieved_memories: res.memories
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: `Error retrieving memory answer: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">AI Meeting Memory Assistant</h3>
            <p className="text-xs text-slate-500">Powered by Hindsight Long-Term Memory & Gemini API</p>
          </div>
        </div>

        {/* Client Selector Filter */}
        <div className="flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1 text-xs font-semibold text-slate-700 outline-hidden cursor-pointer"
          >
            <option value="all">All Clients Context</option>
            {clients.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className="space-y-1">
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-100/90 text-slate-800 rounded-tl-none border border-slate-200/60'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>

              <div className="text-[10px] text-slate-400 px-1">{msg.timestamp}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium p-2">
            <BrainCircuit className="w-4 h-4 animate-spin" />
            <span>Consulting Hindsight Memory Bank...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Questions */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2 overflow-x-auto">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">Try asking:</span>
        {sampleQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(q)}
            className="text-xs bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-medium px-3 py-1 rounded-xl border border-slate-200 whitespace-nowrap transition-colors cursor-pointer shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask a question about past meetings, promises, decisions..."
          className="flex-1 bg-slate-100 focus:bg-white border border-transparent focus:border-indigo-400 rounded-xl px-4 py-2.5 text-sm outline-hidden"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium p-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
