import React, { useState } from 'react';
import { X, Sparkles, FileText, Calendar, Building2, UserCheck } from 'lucide-react';
import { api } from '../services/api';

interface NewMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NewMeetingModal: React.FC<NewMeetingModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [title, setTitle] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [participants, setParticipants] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientName.trim() || !notes.trim()) {
      setError('Please fill in Title, Client Name, and Meeting Notes.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.createMeeting({
        title: title.trim(),
        client_name: clientName.trim(),
        project_name: projectName.trim(),
        date,
        participants: participants.trim(),
        notes: notes.trim()
      });

      // Clear form
      setTitle('');
      setClientName('');
      setProjectName('');
      setNotes('');
      setParticipants('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit meeting notes');
    } finally {
      setLoading(false);
    }
  };

  const handleInsertSample = () => {
    setTitle('ABC Client Payment Module & Security Sync');
    setClientName('ABC Client');
    setProjectName('FinTech Engine');
    setDate(new Date().toISOString().split('T')[0]);
    setParticipants('Ravi (Lead Dev), Alex (PM), ABC Tech Team');
    setNotes('ABC client requested the payment module by October 10. Ravi will send the API documentation. The client raised concerns about security. Dark mode was also requested.');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Record New Meeting</h3>
              <p className="text-xs text-slate-500">AI will automatically extract decisions, commitments, concerns & memories.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}

        {/* Quick Sample Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleInsertSample}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer bg-indigo-50 px-2.5 py-1 rounded-lg"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample Meeting Notes</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Meeting Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q4 Roadmap Sync"
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-xl px-3.5 py-2 text-sm outline-hidden"
              required
            />
          </div>

          {/* Client & Project Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Client / Team Name *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. ABC Client"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-xl pl-9 pr-3.5 py-2 text-sm outline-hidden"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Payment Gateway"
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-xl px-3.5 py-2 text-sm outline-hidden"
              />
            </div>
          </div>

          {/* Date & Participants */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-xl pl-9 pr-3.5 py-2 text-sm outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Participants
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  placeholder="e.g. Ravi, Sarah, Alex"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-xl pl-9 pr-3.5 py-2 text-sm outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Notes Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Meeting Notes / Transcript *
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste raw meeting notes or transcript here..."
              rows={5}
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-xl p-3.5 text-sm outline-hidden"
              required
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-xl text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 fill-white/20" />
              )}
              <span>{loading ? 'Processing with AI & Hindsight...' : 'Process & Save Meeting'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
