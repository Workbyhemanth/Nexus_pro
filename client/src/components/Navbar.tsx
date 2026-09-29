import React from 'react';
import { Search, Sparkles, Database, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  title: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenNewMeeting: () => void;
  onOpenPrepare: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  title,
  searchQuery,
  onSearchChange,
  onOpenNewMeeting,
  onOpenPrepare
}) => {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Title & Context */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
      </div>

      {/* Center Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search meetings, commitments, or memories..."
            className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-indigo-300 rounded-xl pl-10 pr-4 py-1.5 text-sm transition-all outline-hidden focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600">
          <Database className="w-3.5 h-3.5 text-purple-600" />
          <span>Hindsight API</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        </div>

        <button
          onClick={onOpenPrepare}
          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-3.5 py-1.5 rounded-xl text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Prepare Me</span>
        </button>

        <button
          onClick={onOpenNewMeeting}
          className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-1.5 rounded-xl text-sm transition-colors shadow-xs cursor-pointer"
        >
          + Add Meeting
        </button>
      </div>
    </header>
  );
};
