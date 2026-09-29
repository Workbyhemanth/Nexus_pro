import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Sparkles, 
  CheckSquare, 
  BrainCircuit, 
  MessageSquare, 
  Settings,
  Zap
} from 'lucide-react';

export type NavTab = 
  | 'dashboard' 
  | 'meetings' 
  | 'prepare' 
  | 'commitments' 
  | 'chat' 
  | 'memories' 
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenQuickPrepare: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenQuickPrepare
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'meetings', label: 'Meetings', icon: FileText },
    { id: 'prepare', label: 'Prepare for Meeting', icon: Sparkles, badge: 'AI' },
    { id: 'commitments', label: 'Commitments', icon: CheckSquare },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'memories', label: 'Memory Explorer', icon: BrainCircuit, badge: 'Hindsight' },
    { id: 'settings', label: 'Settings & Demo', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shadow-xs z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200 text-white">
          <BrainCircuit className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 text-base leading-snug tracking-tight">Smart Meeting</h1>
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Memory Agent</p>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="p-4">
        <button
          onClick={onOpenQuickPrepare}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all duration-200 cursor-pointer text-sm"
        >
          <Zap className="w-4 h-4 fill-white/20" />
          <span>Prepare Me Now</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as NavTab)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.badge === 'Hindsight' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Hindsight Memory Active</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Hackathon Build v1.0</p>
      </div>
    </aside>
  );
};
