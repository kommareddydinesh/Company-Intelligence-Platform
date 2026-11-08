import React, { useState, useEffect } from 'react';
import { 
  Search, 
  BarChart3, 
  Share2, 
  MessageSquare, 
  GitCompare, 
  FileText, 
  Building2, 
  X, 
  Sparkles, 
  ArrowRight,
  Zap
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelectTab }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: 'dashboard', label: 'Go to BI Analytics Dashboard', category: 'Navigation', icon: BarChart3 },
    { id: 'search', label: 'Go to Semantic Company Search', category: 'Navigation', icon: Search },
    { id: 'graph', label: 'Go to Interactive Knowledge Graph Explorer', category: 'Navigation', icon: Share2 },
    { id: 'chatbot', label: 'Launch Pro AI RAG Chatbot & Copilot', category: 'Navigation', icon: MessageSquare },
    { id: 'compare', label: 'Go to Company Comparison & Charts', category: 'Navigation', icon: GitCompare },
    { id: 'reports', label: 'Generate AI Executive PDF Reports', category: 'Navigation', icon: FileText },
  ];

  const filtered = actions.filter(a => 
    a.label.toLowerCase().includes(query.toLowerCase()) || 
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-dark-900/80 backdrop-blur-md flex items-start justify-center pt-24 p-4">
      <div className="glass-card w-full max-w-xl rounded-2xl border border-slate-800 bg-dark-800/95 overflow-hidden shadow-2xl space-y-0 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3 bg-dark-900/90">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search companies... (e.g. 'NVIDIA', 'Dashboard', 'Reports')"
            className="w-full bg-transparent text-slate-100 text-sm focus:outline-none placeholder:text-slate-500"
          />
          <div className="px-2 py-1 bg-dark-800 text-[10px] font-mono text-slate-400 rounded border border-slate-700">
            ESC
          </div>
        </div>

        {/* Actions List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {filtered.length > 0 ? (
            filtered.map((act) => {
              const Icon = act.icon;
              return (
                <button
                  key={act.id}
                  onClick={() => {
                    onSelectTab(act.id);
                    onClose();
                  }}
                  className="w-full p-3 rounded-xl hover:bg-slate-800/80 text-left flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-dark-900 rounded-lg border border-slate-800 text-sky-400 group-hover:border-sky-500/30">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200 group-hover:text-sky-400">{act.label}</p>
                      <p className="text-[10px] text-slate-500">{act.category}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-sky-400 transition-colors" />
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              No matching commands or companies found.
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2.5 bg-dark-900/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Pro Command Palette
          </span>
          <span className="font-mono">Press Ctrl+K anytime</span>
        </div>

      </div>
    </div>
  );
};
