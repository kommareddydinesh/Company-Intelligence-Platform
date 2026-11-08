import React from 'react';
import { Search, Bell, Shield, Database, Cpu, Command } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onOpenCommandPalette }) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-dark-800/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400 bg-clip-text text-transparent capitalize">
          {activeTab.replace('-', ' ')}
        </h1>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Postgres + Neo4j + ChromaDB Active
        </span>
      </div>

      <div className="flex items-center space-x-3">
        {/* Command Palette Trigger */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="px-3 py-1.5 bg-dark-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs rounded-xl border border-slate-700/80 flex items-center gap-2 transition-all cursor-pointer shadow-inner"
          >
            <Search className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Command Palette</span>
            <span className="px-1.5 py-0.5 bg-dark-800 text-[10px] font-mono text-slate-300 rounded border border-slate-700">
              Ctrl+K
            </span>
          </button>
        )}

        {/* Environment Status Pills */}
        <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-400 bg-dark-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-1">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>Llama 3.1 / GPT-4o</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center space-x-1">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>bge-small 384d</span>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3 border-l border-slate-800 pl-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-violet-600 flex items-center justify-center font-bold text-xs text-white shadow-lg shadow-sky-500/20">
            SA
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-medium text-slate-200">Senior Enterprise Analyst</p>
            <p className="text-[10px] text-slate-400 font-mono">admin@enterprise.com</p>
          </div>
        </div>
      </div>
    </header>
  );
};
