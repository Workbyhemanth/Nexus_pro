import React, { useState, useEffect } from 'react';
import { Settings, Database, Sparkles, CheckCircle2, ShieldAlert, Play, RotateCcw, Download, FileText } from 'lucide-react';
import { api } from '../services/api';

interface SettingsViewProps {
  onRefreshData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onRefreshData }) => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>('');

  const checkHealth = async () => {
    try {
      const res = await api.getHealth();
      setHealth(res);
    } catch (e: any) {
      setHealth({ status: 'error', details: e.message });
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleSeed = async () => {
    setLoading(true);
    setMsg('');
    try {
      const res = await api.seedDemo();
      onRefreshData();
      setMsg(res.message || 'Demo data preloaded successfully!');
    } catch (e: any) {
      setMsg(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all data?')) {
      setLoading(true);
      setMsg('');
      try {
        await api.resetDemo();
        onRefreshData();
        setMsg('Database reset cleanly.');
      } catch (e: any) {
        setMsg(`Error: ${e.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">System Settings & Documentation</h2>
              <p className="text-xs text-slate-500">Configure AI providers, inspect Hindsight status, and download full documentation.</p>
            </div>
          </div>

          <a
            href="/api/documentation/pdf"
            download="Smart_Meeting_Memory_Agent_Documentation.pdf"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Documentation</span>
          </a>
        </div>
      </div>

      {/* Download Box */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-6 rounded-2xl text-white space-y-3 shadow-md border border-indigo-800">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-indigo-300" />
          <h3 className="font-bold text-base">Downloadable Official PDF Manual</h3>
        </div>
        <p className="text-xs text-indigo-100/90 leading-relaxed">
          The complete project documentation is formatted into a publication-ready PDF document containing system architecture diagrams, Hindsight memory deep-dive explanations, step-by-step user task guides, and full API endpoint specifications.
        </p>
        <a
          href="/api/documentation/pdf"
          download="Smart_Meeting_Memory_Agent_Documentation.pdf"
          className="inline-flex items-center gap-2 bg-white text-indigo-900 hover:bg-indigo-50 text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all"
        >
          <Download className="w-4 h-4 text-indigo-700" />
          <span>Save Documentation PDF (Smart_Meeting_Memory_Agent_Documentation.pdf)</span>
        </a>
      </div>

      {/* System Integration Status */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Backend & Service Health</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hindsight Memory Status */}
          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-slate-900 text-sm">Hindsight Memory</span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Active</span>
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Mode: <strong className="text-purple-900 font-mono">{health?.hindsight_integration || 'embedded_hindsight_sqlite'}</strong>
            </p>
            <p className="text-[11px] text-slate-500">
              Stores long-term facts, client preferences, promises, and updates status across meetings.
            </p>
          </div>

          {/* Gemini AI Status */}
          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-slate-900 text-sm">Gemini AI Provider</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                health?.gemini_ai_configured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {health?.gemini_ai_configured ? <CheckCircle2 className="w-3 h-3" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                <span>{health?.gemini_ai_configured ? 'API Key Configured' : 'Smart Heuristic Engine Active'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Provider: <strong className="text-indigo-900">Google Gemini 2.5 Flash / Fallback Engine</strong>
            </p>
            <p className="text-[11px] text-slate-500">
              Set <code className="bg-white px-1 rounded border">GEMINI_API_KEY</code> in <code className="bg-white px-1 rounded border">server/.env</code> for live API generation.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Hackathon Demo Dataset Controls</h3>
        <p className="text-xs text-slate-500">
          Preload or reset test datasets for ABC Client and XYZ Corp to showcase memory retention and client isolation.
        </p>

        {msg && (
          <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold rounded-xl">
            {msg}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeed}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Preload Demo Data (ABC & XYZ Clients)</span>
          </button>

          <button
            onClick={handleReset}
            disabled={loading}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Database</span>
          </button>
        </div>
      </div>
    </div>
  );
};
