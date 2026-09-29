import React from 'react';
import { 
  FileText, 
  CheckSquare, 
  CheckCircle2, 
  AlertTriangle, 
  BrainCircuit, 
  Clock, 
  Sparkles, 
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { Meeting, Commitment, MemoryItem } from '../types';

interface DashboardViewProps {
  meetings: Meeting[];
  commitments: Commitment[];
  memories: MemoryItem[];
  onNavigateTab: (tab: any) => void;
  onOpenNewMeeting: () => void;
  onSelectClientForPrepare: (client: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  meetings,
  commitments,
  memories,
  onNavigateTab,
  onOpenNewMeeting,
  onSelectClientForPrepare
}) => {
  const activeCommitments = commitments.filter(c => c.status === 'pending' || c.status === 'in_progress');
  const completedTasks = commitments.filter(c => c.status === 'completed');
  const overdueTasks = commitments.filter(c => c.status === 'overdue');
  const unresolvedConcerns = memories.filter(m => m.category === 'unresolved_concern' && m.status === 'active');

  const clientsList = Array.from(new Set(meetings.map(m => m.client_name))).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Top Banner Callout */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Hindsight Long-Term Memory Active</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">AI-Powered Smart Meeting Memory</h2>
          <p className="text-indigo-100 text-sm leading-relaxed">
            Your assistant retains decisions, deadlines, unresolved concerns, and promises across meetings. Prepare for upcoming discussions with 1-click contextual briefings.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => {
                if (clientsList.length > 0) {
                  onSelectClientForPrepare(clientsList[0]);
                }
                onNavigateTab('prepare');
              }}
              className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold px-4 py-2.5 rounded-xl text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Prepare Me for Next Meeting</span>
            </button>
            <button
              onClick={onOpenNewMeeting}
              className="bg-indigo-500/30 hover:bg-indigo-500/40 text-white font-medium px-4 py-2.5 rounded-xl text-sm border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Record New Meeting</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Meetings */}
        <div 
          onClick={() => onNavigateTab('meetings')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Meetings</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{meetings.length}</div>
          <p className="text-xs text-slate-400 mt-1">Logged across all clients</p>
        </div>

        {/* Active Commitments */}
        <div 
          onClick={() => onNavigateTab('commitments')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Commitments</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{activeCommitments.length}</div>
          <p className="text-xs text-amber-600 font-medium mt-1">Pending delivery</p>
        </div>

        {/* Completed Tasks */}
        <div 
          onClick={() => onNavigateTab('commitments')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Tasks</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{completedTasks.length}</div>
          <p className="text-xs text-emerald-600 font-medium mt-1">Successfully delivered</p>
        </div>

        {/* Overdue Tasks */}
        <div 
          onClick={() => onNavigateTab('commitments')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Overdue Tasks</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{overdueTasks.length}</div>
          <p className="text-xs text-rose-600 font-medium mt-1">Requires attention</p>
        </div>

        {/* Unresolved Concerns */}
        <div 
          onClick={() => onNavigateTab('memories')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Open Concerns</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{unresolvedConcerns.length}</div>
          <p className="text-xs text-purple-600 font-medium mt-1">Tracked in Hindsight</p>
        </div>
      </div>

      {/* Main Content Grid: Recent Meetings & Deadlines / Memories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Meetings Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Recent Meetings</h3>
            <button
              onClick={() => onNavigateTab('meetings')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {meetings.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-800">No Meetings Recorded Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Start recording meeting notes to let the AI agent extract commitments, decisions, and retain persistent memories.
              </p>
              <button
                onClick={onOpenNewMeeting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                + Record First Meeting
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {meetings.slice(0, 4).map((meeting) => (
                <div
                  key={meeting.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {meeting.client_name}
                      </span>
                      {meeting.project_name && (
                        <span className="text-xs text-slate-400">({meeting.project_name})</span>
                      )}
                      <span className="text-xs text-slate-400 font-mono">{meeting.date}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{meeting.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{meeting.notes}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onSelectClientForPrepare(meeting.client_name);
                        onNavigateTab('prepare');
                      }}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Prepare Me</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar Column: Upcoming Deadlines & Recent Memories */}
        <div className="space-y-6">
          {/* Active Commitments & Deadlines */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Upcoming Commitments</h3>
              <button
                onClick={() => onNavigateTab('commitments')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                View All
              </button>
            </div>

            {activeCommitments.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No active commitments.</p>
            ) : (
              <div className="space-y-3">
                {activeCommitments.slice(0, 4).map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{c.client_name}</span>
                      <span className="text-amber-700 font-mono font-medium bg-amber-100 px-2 py-0.5 rounded-md text-[10px]">
                        {c.deadline || 'No deadline'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{c.task_description}</p>
                    <p className="text-[11px] text-slate-500">Assigned: {c.assigned_to || 'Team'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Hindsight Memory Feed */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">Hindsight Memory Feed</h3>
              </div>
              <button
                onClick={() => onNavigateTab('memories')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                Explorer
              </button>
            </div>

            {memories.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No memories stored in Hindsight yet.</p>
            ) : (
              <div className="space-y-2.5">
                {memories.slice(0, 4).map((m) => (
                  <div key={m.id} className="p-2.5 bg-purple-50/50 rounded-xl border border-purple-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-900">{m.client_name}</span>
                      <span className="uppercase text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-200/60 text-purple-800">
                        {m.category}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-snug">{m.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
