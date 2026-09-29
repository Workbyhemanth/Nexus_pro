import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Building2, 
  CheckSquare, 
  AlertTriangle, 
  HelpCircle, 
  Bookmark, 
  BrainCircuit, 
  RefreshCw,
  Clock,
  UserCheck
} from 'lucide-react';
import { BriefingSection, Meeting } from '../types';
import { api } from '../services/api';

interface PrepareViewProps {
  meetings: Meeting[];
  selectedClient: string;
  onSelectClient: (client: string) => void;
}

export const PrepareView: React.FC<PrepareViewProps> = ({
  meetings,
  selectedClient,
  onSelectClient
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [briefing, setBriefing] = useState<BriefingSection | null>(null);
  const [error, setError] = useState<string>('');

  const clients = Array.from(new Set(meetings.map((m) => m.client_name))).filter(Boolean);

  // Auto select first client if none selected
  useEffect(() => {
    if (!selectedClient && clients.length > 0) {
      onSelectClient(clients[0]);
    }
  }, [clients, selectedClient]);

  const handleGenerateBriefing = async () => {
    if (!selectedClient) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.generateBriefing(selectedClient);
      setBriefing(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate briefing');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClient) {
      handleGenerateBriefing();
    }
  }, [selectedClient]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Client Selector */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Contextual Briefing Generator</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Prepare Me for My Next Meeting</h2>
            <p className="text-xs text-slate-500">
              Select a client to retrieve long-term memories, active commitments, open concerns, and personalized reminders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={selectedClient}
                onChange={(e) => onSelectClient(e.target.value)}
                className="bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-xl pl-9 pr-8 py-2 text-sm font-semibold text-slate-800 outline-hidden cursor-pointer"
              >
                <option value="" disabled>Select a Client...</option>
                {clients.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerateBriefing}
              disabled={loading || !selectedClient}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-4 py-2 rounded-xl text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Sparkles className="w-4 h-4 fill-white/20" />
              )}
              <span>{loading ? 'Retrieving Memories...' : 'Generate Briefing'}</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      {loading && !briefing && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto animate-pulse">
            <BrainCircuit className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="font-semibold text-slate-800">Searching Hindsight Memory Bank...</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Retrieving past decisions, unresolved concerns, deadlines, and client preferences for {selectedClient}.
          </p>
        </div>
      )}

      {briefing && !loading && (
        <div className="space-y-6">
          {/* Section 6: Natural Language Memory Banner */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 p-6 rounded-2xl text-white shadow-md relative overflow-hidden border border-purple-800">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0">
                <BrainCircuit className="w-6 h-6 text-purple-300" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Hindsight Long-Term Memory Synthesis
                </span>
                <p className="text-sm font-medium text-purple-100 leading-relaxed italic bg-purple-950/40 p-3 rounded-xl border border-purple-800/60">
                  "{briefing.personalized_memory}"
                </p>
              </div>
            </div>
          </div>

          {/* Section 1 & 2 Grid: Summary & Commitments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Previous Meeting Summary */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Previous Meeting Summary & Decisions</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Key Highlights</h4>
                  <ul className="space-y-2">
                    {briefing.previous_meeting_summary.map((pt, i) => (
                      <li key={i} className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Confirmed Decisions</h4>
                  <ul className="space-y-2">
                    {briefing.decisions_made.map((dec, i) => (
                      <li key={i} className="text-xs text-slate-700 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <span className="font-medium text-emerald-950">{dec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Commitments & Tasks */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <CheckSquare className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-base">Tracked Commitments & Status</h3>
              </div>

              {briefing.commitments.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No previous commitments logged for this client.</p>
              ) : (
                <div className="space-y-2.5">
                  {briefing.commitments.map((comm, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{comm.task}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                          comm.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : comm.status === 'overdue'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {comm.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-slate-400" />
                          Assigned: {comm.assigned_to || 'Team'}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Deadline: {comm.deadline || 'TBD'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 3 & 4 Grid: Concerns & Questions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Unresolved Concerns */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <AlertTriangle className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-base">Unresolved Concerns & Pending Issues</h3>
              </div>

              {briefing.unresolved_concerns.length === 0 ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium border border-emerald-100">
                  ✓ No unresolved concerns recorded for {selectedClient}.
                </div>
              ) : (
                <ul className="space-y-2">
                  {briefing.unresolved_concerns.map((con, i) => (
                    <li key={i} className="text-xs text-purple-950 bg-purple-50 p-3 rounded-xl border border-purple-100 flex items-start gap-2 font-medium">
                      <AlertTriangle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Suggested Questions */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Suggested Meeting Questions</h3>
              </div>

              <ul className="space-y-2">
                {briefing.suggested_questions.map((q, i) => (
                  <li key={i} className="text-xs text-indigo-950 bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 flex items-start gap-2.5 font-medium">
                    <span className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-800 flex items-center justify-center text-[10px] font-bold shrink-0">
                      Q{i + 1}
                    </span>
                    <span className="leading-snug">{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 5: Important Reminders */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Bookmark className="w-4 h-4 text-slate-700" />
              <h3 className="font-bold text-slate-900 text-base">Important Reminders & Preferences</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Client Preferences */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Client Preferences</h4>
                <ul className="space-y-1.5">
                  {briefing.important_reminders.client_preferences.map((p, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Promises Made */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Promises Made</h4>
                <ul className="space-y-1.5">
                  {briefing.important_reminders.promises_made.map((p, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Upcoming Deadlines */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Upcoming Deadlines</h4>
                <ul className="space-y-1.5">
                  {briefing.important_reminders.upcoming_deadlines.map((d, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
