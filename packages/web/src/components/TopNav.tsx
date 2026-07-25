import React from 'react';
import { Sparkles, Search, Bell, Settings, User, Radio, Zap } from 'lucide-react';

interface TopNavProps {
  status: 'connected' | 'analyzing' | 'offline' | 'waiting';
}

export const TopNav: React.FC<TopNavProps> = ({ status }) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'analyzing':
        return {
          label: 'Analyzing Prompt...',
          color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
          dot: 'bg-cyan-400 animate-ping',
        };
      case 'offline':
        return {
          label: 'Offline (Mock Mode)',
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          dot: 'bg-amber-400',
        };
      case 'waiting':
        return {
          label: 'Waiting for Input',
          color: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
          dot: 'bg-slate-400 animate-pulse',
        };
      case 'connected':
      default:
        return {
          label: 'MCP Server Connected',
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
          dot: 'bg-emerald-400 animate-pulse',
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <header className="sticky top-0 z-40 h-16 w-full px-6 bg-[#0B0F14]/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between transition-all">
      {/* Left: Branding */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,254,0.3)]">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
              TokenSlash
            </span>
            <span className="ml-2 px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded">
              PRO
            </span>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

        <span className="text-xs font-mono text-slate-400 hidden sm:block">
          NitroStack MCP Engine v1.4
        </span>
      </div>

      {/* Middle: Search bar */}
      <div className="hidden md:flex items-center max-w-md w-full mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search prompts, history, models..."
            className="w-full bg-[#161B22]/80 border border-white/[0.06] rounded-xl pl-10 pr-12 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-[#0B0F14] border border-white/10 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions & Telemetry Badge */}
      <div className="flex items-center gap-4">
        {/* Status Indicator */}
        <div className={`px-3 py-1 rounded-full border flex items-center gap-2 text-xs font-mono transition-all ${badge.color}`}>
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${badge.dot}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${badge.dot}`}></span>
          </span>
          <span className="font-medium hidden sm:inline">{badge.label}</span>
        </div>

        {/* Quick action icons */}
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors relative" title="Notifications">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-cyan-400 rounded-full glow-cyan" />
          </button>
          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors" title="Settings">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-400 p-[1px]">
            <div className="w-full h-full rounded-full bg-[#111827] flex items-center justify-center">
              <User className="w-4 h-4 text-slate-300" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
