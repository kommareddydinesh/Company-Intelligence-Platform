import React from 'react';
import { 
  Building2, 
  Sparkles, 
  Share2, 
  Database, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  BarChart3, 
  CheckCircle2, 
  Globe, 
  Lock,
  Cpu,
  Layers,
  Bot
} from 'lucide-react';

interface LandingPageViewProps {
  onEnterApp: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 font-sans selection:bg-sky-500 selection:text-white">
      
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-dark-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-violet-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-slate-100">
              Enterprise<span className="text-sky-400">AI</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onEnterApp}
              className="px-5 py-2.5 bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-600 hover:opacity-90 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-500/25 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 max-w-7xl mx-auto text-center space-y-8">
        
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>Next-Gen Enterprise Business Intelligence Platform</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-100 tracking-tight leading-tight max-w-4xl mx-auto">
          Intelligent Corporate Knowledge Graphs & <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">Graph RAG AI</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Unify company datasets across PostgreSQL, Neo4j Multi-Hop Property Graphs, and ChromaDB Dense Vector Search powered by Autonomous Agentic AI.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center space-x-4 pt-4">
          <button
            onClick={onEnterApp}
            className="px-7 py-3.5 bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-600 hover:opacity-90 text-white font-bold text-sm rounded-2xl shadow-xl shadow-sky-500/25 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <span>Explore Live Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Live Metrics Ticker Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
          <div className="p-6 bg-dark-800/80 rounded-2xl border border-slate-800">
            <p className="text-2xl font-extrabold text-sky-400">$3.2T+</p>
            <p className="text-xs text-slate-400 mt-1">Indexed Corporate Assets</p>
          </div>
          <div className="p-6 bg-dark-800/80 rounded-2xl border border-slate-800">
            <p className="text-2xl font-extrabold text-cyan-400">384-Dim</p>
            <p className="text-xs text-slate-400 mt-1">Dense Vector Embeddings</p>
          </div>
          <div className="p-6 bg-dark-800/80 rounded-2xl border border-slate-800">
            <p className="text-2xl font-extrabold text-violet-400">0.8 ms</p>
            <p className="text-xs text-slate-400 mt-1">Neo4j Cypher Traversal</p>
          </div>
          <div className="p-6 bg-dark-800/80 rounded-2xl border border-slate-800">
            <p className="text-2xl font-extrabold text-emerald-400">99.4%</p>
            <p className="text-xs text-slate-400 mt-1">RAG Precision Accuracy</p>
          </div>
        </div>
      </section>

      {/* Core Platform Features Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">Enterprise Platform Architecture</h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">Built for institutional analysts, venture capital investors, and executive researchers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-dark-800/90 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Neo4j Knowledge Graph</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-hop property graph topology mapping enterprise relationships across CEOs, tech stacks, investors, and competitors.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-dark-800/90 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">ChromaDB Vector Store</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              SentenceTransformer dense vector similarity search retrieving semantic context across unstructured corporate filings.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-dark-800/90 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Multi-Agent RAG Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Autonomous 5-agent pipeline handling query planning, graph traversal, vector retrieval, and executive report synthesis.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6 text-center text-xs text-slate-500">
        <p>© 2026 Enterprise Company Intelligence Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};
