import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Search, 
  Building2, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Sparkles,
  Layers
} from 'lucide-react';
import { MemoryItem, MemoryCategory } from '../types';

interface MemoryExplorerViewProps {
  memories: MemoryItem[];
  onUpdateMemory: (id: string, data: { content: string; category?: string; status?: string }) => void;
  onDeleteMemory: (id: string) => void;
}

export const MemoryExplorerView: React.FC<MemoryExplorerViewProps> = ({
  memories,
  onUpdateMemory,
  onDeleteMemory
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [editCategory, setEditCategory] = useState<MemoryCategory>('preference');

  const clients = Array.from(new Set(memories.map((m) => m.client_name))).filter(Boolean);

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Categories' },
    { id: 'preference', label: 'Client Preferences' },
    { id: 'decision', label: 'Decisions' },
    { id: 'commitment', label: 'Commitments' },
    { id: 'action_item', label: 'Action Items' },
    { id: 'unresolved_concern', label: 'Unresolved Concerns' },
    { id: 'historical_context', label: 'Historical Context' }
  ];

  const filteredMemories = memories.filter((m) => {
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesClient = selectedClient === 'all' || m.client_name.toLowerCase() === selectedClient.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.client_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesClient && matchesSearch;
  });

  const handleStartEdit = (m: MemoryItem) => {
    setEditingId(m.id);
    setEditContent(m.content);
    setEditCategory(m.category);
  };

  const handleSaveEdit = (id: string) => {
    if (!editContent.trim()) return;
    onUpdateMemory(id, { content: editContent.trim(), category: editCategory });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Hindsight Long-Term Memory Explorer</h2>
            <p className="text-xs text-slate-500">
              Inspect, correct, and manage persistent memories stored across meetings. Edits directly update future AI responses.
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memory contents..."
            className="w-full bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-indigo-400 rounded-xl pl-10 pr-4 py-2 text-sm outline-hidden"
          />
        </div>

        {/* Client Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 outline-hidden cursor-pointer"
          >
            <option value="all">All Clients ({clients.length})</option>
            {clients.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-purple-700 text-white'
                : 'bg-white text-slate-600 hover:bg-purple-50 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Memories Cards Grid */}
      {filteredMemories.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-800">No Memories Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No long-term memories match the selected category or client filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMemories.map((m) => (
            <div
              key={m.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-300 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 uppercase tracking-wider">
                    {m.category.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {m.client_name}
                  </span>
                </div>

                {editingId === m.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 text-xs border border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-hidden"
                      rows={3}
                    />
                    <div className="flex items-center gap-2">
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as MemoryCategory)}
                        className="text-xs border rounded-lg p-1 bg-white"
                      >
                        <option value="preference">Preference</option>
                        <option value="decision">Decision</option>
                        <option value="commitment">Commitment</option>
                        <option value="action_item">Action Item</option>
                        <option value="unresolved_concern">Unresolved Concern</option>
                        <option value="historical_context">Historical Context</option>
                      </select>
                      <button
                        onClick={() => handleSaveEdit(m.id)}
                        className="p-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                        title="Save memory edit"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-800 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {m.content}
                  </p>
                )}
              </div>

              {/* Memory Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[10px]">
                  Status: <strong className="text-slate-600 uppercase">{m.status}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartEdit(m)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit memory item"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Delete this memory item from Hindsight?')) {
                        onDeleteMemory(m.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete memory"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
