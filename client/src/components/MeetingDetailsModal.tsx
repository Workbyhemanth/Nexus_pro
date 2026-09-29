import React, { useState, useEffect } from 'react';
import { X, Calendar, Building2, CheckSquare, AlertTriangle, Sparkles, UserCheck } from 'lucide-react';
import { Meeting, ExtractedData, Commitment } from '../types';
import { api } from '../services/api';

interface MeetingDetailsModalProps {
  meetingId: string | null;
  onClose: () => void;
}

export const MeetingDetailsModal: React.FC<MeetingDetailsModalProps> = ({
  meetingId,
  onClose
}) => {
  const [data, setData] = useState<{ meeting: Meeting; extracted: ExtractedData[]; commitments: Commitment[] } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (meetingId) {
      setLoading(true);
      api.getMeetingById(meetingId)
        .then((res) => setData(res))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setData(null);
    }
  }, [meetingId]);

  if (!meetingId) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {loading || !data ? (
          <div className="p-12 text-center text-slate-400">Loading meeting details...</div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                    {data.meeting.client_name}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{data.meeting.date}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-xl">{data.meeting.title}</h3>
                {data.meeting.participants && (
                  <p className="text-xs text-slate-500">Participants: {data.meeting.participants}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Original Meeting Notes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Original Meeting Notes</h4>
              <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed font-mono whitespace-pre-wrap">
                {data.meeting.notes}
              </p>
            </div>

            {/* AI Extracted Information Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-900">AI Extracted Information & Memory Sync</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.extracted.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        item.type === 'commitment'
                          ? 'bg-amber-100 text-amber-800'
                          : item.type === 'unresolved_concern'
                          ? 'bg-purple-100 text-purple-800'
                          : item.type === 'decision'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {item.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-800 font-medium">{item.content}</p>
                    {(item.assigned_to || item.deadline) && (
                      <p className="text-[11px] text-slate-400 pt-1">
                        Assigned: {item.assigned_to || 'Team'} | Deadline: {item.deadline || 'TBD'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={onClose}
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
