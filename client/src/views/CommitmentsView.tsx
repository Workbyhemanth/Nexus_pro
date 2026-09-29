import React, { useState } from 'react';
import { 
  CheckSquare, 
  Search, 
  Building2, 
  Calendar, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Trash2,
  Edit2
} from 'lucide-react';
import { Commitment, TaskStatus } from '../types';

interface CommitmentsViewProps {
  commitments: Commitment[];
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onDeleteCommitment: (id: string) => void;
}

export const CommitmentsView: React.FC<CommitmentsViewProps> = ({
  commitments,
  onUpdateStatus,
  onDeleteCommitment
}) => {
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const clients = Array.from(new Set(commitments.map((c) => c.client_name))).filter(Boolean);

  const filteredCommitments = commitments.filter((c) => {
    const matchesClient = selectedClient === 'all' || c.client_name.toLowerCase() === selectedClient.toLowerCase();
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
    const matchesSearch =
      !searchQuery ||
      c.task_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.assigned_to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.client_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClient && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Commitment & Task Tracking</h2>
          <p className="text-xs text-slate-500">Track promises, action items, assigned owners, deadlines, and delivery statuses.</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search task or assigned person..."
            className="w-full bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-indigo-400 rounded-xl pl-10 pr-4 py-2 text-sm outline-hidden"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['all', 'pending', 'in_progress', 'completed', 'overdue'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                selectedStatus === st
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Commitments Grid */}
      {filteredCommitments.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-800">No Commitments Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No active or historical commitments match your current filters.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCommitments.map((c) => (
            <div
              key={c.id}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span>{c.client_name}</span>
                  </span>
                  {c.project_name && (
                    <span className="text-xs text-slate-400 font-medium">({c.project_name})</span>
                  )}
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Deadline: {c.deadline || 'TBD'}</span>
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{c.task_description}</h3>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                    Assigned: <strong className="text-slate-800">{c.assigned_to || 'Unassigned'}</strong>
                  </span>
                </div>
              </div>

              {/* Status Selector & Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <select
                  value={c.status}
                  onChange={(e) => onUpdateStatus(c.id, e.target.value as TaskStatus)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border outline-hidden cursor-pointer ${
                    c.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : c.status === 'overdue'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : c.status === 'in_progress'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed ✓</option>
                  <option value="overdue">Overdue ⚠</option>
                </select>

                <button
                  onClick={() => {
                    if (confirm(`Delete commitment "${c.task_description}"?`)) {
                      onDeleteCommitment(c.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete commitment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
