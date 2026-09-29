import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle2, ChevronRight, Sparkles, Layers } from 'lucide-react';
import { api } from '../services/api';

interface DemoBannerProps {
  onRefreshData: () => void;
  onNavigateTab: (tab: any) => void;
  onSelectClientForPrepare: (client: string) => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  onRefreshData,
  onNavigateTab,
  onSelectClientForPrepare
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');

  const steps = [
    {
      title: 'Step 1: Seed ABC Client Discovery Meeting',
      description: 'Preloads Meeting #1 with ABC Client (Payment module by Oct 10, Ravi API docs, security concern, dark mode).',
      action: async () => {
        setLoading(true);
        try {
          const res = await api.seedDemo();
          onRefreshData();
          setFeedback('Meeting #1 with ABC Client & XYZ Corp created! AI extracted commitments & saved facts to Hindsight.');
          setCurrentStep(1);
        } catch (e: any) {
          setFeedback(`Error: ${e.message}`);
        } finally {
          setLoading(false);
        }
      }
    },
    {
      title: 'Step 2 & 3: View Extracted Memories & Commitments',
      description: 'Navigate to Memory Explorer to see Hindsight memory bank categorizing preferences, concerns & action items.',
      action: async () => {
        onNavigateTab('memories');
        setFeedback('Showing Memory Explorer: Notice facts categorized as Preferences, Commitments, and Unresolved Security Concerns.');
        setCurrentStep(2);
      }
    },
    {
      title: 'Step 4 & 5: Prepare Me for Next ABC Meeting',
      description: 'Generates structured AI briefing for ABC Client recalling dark mode preference, Ravi commitment, and security concern.',
      action: async () => {
        onSelectClientForPrepare('ABC Client');
        onNavigateTab('prepare');
        setFeedback('Prepared briefing for ABC Client! Notice natural language recollection ("Here is what I remember about ABC...")');
        setCurrentStep(3);
      }
    },
    {
      title: 'Step 6: Add Follow-up Meeting for ABC Client',
      description: 'Adds Meeting #2 where Ravi delivers API docs and dark mode is approved, while security concern remains open.',
      action: async () => {
        setLoading(true);
        try {
          await api.followupDemo();
          onRefreshData();
          setFeedback('Follow-up meeting added for ABC Client! Hindsight updated commitments and memories.');
          setCurrentStep(4);
        } catch (e: any) {
          setFeedback(`Error: ${e.message}`);
        } finally {
          setLoading(false);
        }
      }
    },
    {
      title: 'Step 7: Re-generate Briefing with Updated Context',
      description: 'Regenerate Prepare Me briefing for ABC Client to verify updated commitment status without losing historical context.',
      action: async () => {
        onSelectClientForPrepare('ABC Client');
        onNavigateTab('prepare');
        setFeedback('Updated briefing generated! Dark mode is confirmed and API docs delivered, while security concern persists.');
        setCurrentStep(5);
      }
    },
    {
      title: 'Step 8: Client Isolation Test (XYZ Corp)',
      description: 'Prepare briefing for XYZ Corp to verify zero cross-contamination of ABC Client memories.',
      action: async () => {
        onSelectClientForPrepare('XYZ Corp');
        onNavigateTab('prepare');
        setFeedback('Client Isolation verified! XYZ Corp briefing shows only Mobile SDK details, separate from ABC Client.');
        setCurrentStep(6);
      }
    }
  ];

  const handleReset = async () => {
    if (confirm('Reset database to clean empty state?')) {
      setLoading(true);
      try {
        await api.resetDemo();
        onRefreshData();
        setCurrentStep(0);
        setFeedback('Database reset cleanly.');
      } catch (e: any) {
        setFeedback(`Error: ${e.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 border-b border-indigo-900 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Banner Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-white">Hackathon Interactive Demo Mode</span>
              <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                8-Step Evaluation Sequence
              </span>
            </div>
            <p className="text-xs text-indigo-200/80">
              Run guided test cases validating AI Memory Extraction, Hindsight Persistence, Briefing & Client Isolation.
            </p>
          </div>
        </div>

        {/* Step Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={steps[currentStep >= steps.length ? 0 : currentStep].action}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            {loading ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white" />
            )}
            <span>{currentStep >= steps.length ? 'Restart Demo' : steps[currentStep].title.split(':')[0]}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleReset}
            disabled={loading}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset DB</span>
          </button>
        </div>
      </div>

      {/* Step Stepper Indicators */}
      <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-indigo-900/60 flex items-center justify-between text-xs overflow-x-auto gap-2">
        {steps.map((s, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentStep(idx);
              s.action();
            }}
            className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              idx === currentStep
                ? 'bg-indigo-500/30 text-white border border-indigo-400/40 font-semibold'
                : idx < currentStep
                ? 'text-emerald-400 font-medium'
                : 'text-indigo-300/50 hover:text-indigo-200'
            }`}
          >
            {idx < currentStep ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <span className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center font-mono">
                {idx + 1}
              </span>
            )}
            <span>{s.title.split(':')[0]}</span>
          </button>
        ))}
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div className="max-w-7xl mx-auto mt-2 bg-indigo-900/40 border border-indigo-500/30 rounded-lg px-3 py-1.5 text-xs text-indigo-100 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}
    </div>
  );
};
