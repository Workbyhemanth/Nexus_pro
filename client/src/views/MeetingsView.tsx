import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Calendar, 
  UserCheck, 
  Building2, 
  Trash2, 
  Eye, 
  Sparkles,
  FileText
} from 'lucide-react';
import { Meeting } from '../types';

interface MeetingsViewProps {
  meetings: Meeting[];
  onOpenNewMeeting: () => void;
  onSelectMeetingDetails: (meetingId: string) => void;
  onDeleteMeeting: (meetingId: string) => void;
  onSelectClientForPrepare: (client: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const MeetingsView: React.FC<MeetingsViewProps> = ({
  meetings,
  onOpenNewMeeting,
  onSelectMeetingDetails,
  onDeleteMeeting,
  onSelectClientForPrepare,
  onNavigateTab
}) => {
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [filterSearch, setFilterSearch] = useState<string>('');

  const clients = Array.from(new Set(meetings.map((m) => m.client_name))).filter(Boolean);

  const filteredMeetings = meetings.filter((m) => {
    const matchesClient = selectedClient === 'all' || m.client_name.toLowerCase() === selectedClient.toLowerCase();
    const matchesSearch =
      !filterSearch ||
      m.title.toLowerCase().includes(filterSearch.toLowerCase()) ||
      m.notes.toLowerCase().includes(filterSearch.toLowerCase()) ||
      m.client_name.toLowerCase().includes(filterSearch.toLowerCase());
    return matchesClient && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Meeting History</h2>
          <p className="text-xs text-slate-500">View, search, and inspect past meetings and AI extracted facts.</p>
        </div>

        <button
          onClick={onOpenNewMeeting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Meeting</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            placeholder="Search meeting title or notes..."
            className="w-full bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-indigo-400 rounded-xl pl-10 pr-4 py-2 text-sm outline-hidden"
          />
        </div>

        {/* Client Filter Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedClient('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedClient === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Clients ({meetings.length})
          </button>

          {clients.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedClient(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedClient === c
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Meetings List */}
      {filteredMeetings.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-800">No Meetings Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No meeting records match your search criteria. Try clearing filters or record a new meeting.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMeetings.map((m) => (
            <div
              key={m.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1.5">
                    <Building2 className="w-3 h-3 text-indigo-500" />
                    <span>{m.client_name}</span>
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{m.date}</span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{m.title}</h3>

                {m.participants && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Participants: {m.participants}</span>
                  </div>
                )}

                <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50/80 p-3 rounded-xl border border-slate-100 italic">
                  "{m.notes}"
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onSelectMeetingDetails(m.id)}
                  className="text-xs font-semibold text-slate-700 hover:text-indigo-600 flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span>View Details & Extraction</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectClientForPrepare(m.client_name);
                      onNavigateTab('prepare');
                    }}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Prepare</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete meeting "${m.title}"?`)) {
                        onDeleteMeeting(m.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete meeting"
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
