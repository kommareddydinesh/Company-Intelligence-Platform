import React from 'react';
import { 
  BarChart3, 
  Search, 
  Share2, 
  MessageSquare, 
  GitCompare, 
  FileText, 
  Zap,
  Building2,
  ShieldCheck,
  Globe,
  Code2,
  TrendingUp,
  Target
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'BI Dashboard', icon: BarChart3 },
    { id: 'investigator', label: 'GraphRAG Investigator', icon: Target },
    { id: 'search', label: 'Semantic Search', icon: Search },
    { id: 'graph', label: 'Knowledge Graph', icon: Share2 },
    { id: 'chatbot', label: 'AI RAG Chatbot', icon: MessageSquare },
    { id: 'compare', label: 'Company Comparison', icon: GitCompare },
    { id: 'forecast', label: 'AI Valuation Forecast', icon: TrendingUp },
    { id: 'notebook', label: 'AI AI Notebook', icon: Code2 },
    { id: 'reports', label: 'AI PDF Reports', icon: FileText },
    { id: 'admin', label: 'Admin Governance', icon: ShieldCheck },
    { id: 'landing', label: 'Landing Showcase', icon: Globe },
  ];

  return (
    <aside className="w-64 bg-dark-800 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-40">
      <div>
        {/* Brand Header */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="h-16 px-6 flex items-center space-x-3 border-b border-slate-800 cursor-pointer hover:bg-slate-800/40 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wide text-slate-100">Enterprise AI</h2>
            <p className="text-[10px] text-cyan-400 font-medium">GraphRAG Investigation</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Platform Modules
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(item.id);
                }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500/20 to-violet-500/10 text-sky-400 border border-sky-500/30 shadow-md shadow-sky-500/10 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-dark-900/80 p-3 rounded-xl border border-slate-800 flex items-center space-x-3">
          <Zap className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
          <div>
            <p className="text-xs font-semibold text-slate-200">Graph RAG Active</p>
            <p className="text-[10px] text-slate-400">Hybrid Vector & Knowledge Retrieval</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
