import React, { useState } from 'react';
import { 
  Bot, 
  BrainCircuit, 
  Database, 
  Share2, 
  Zap, 
  CheckCircle2, 
  X, 
  Cpu, 
  ArrowRight,
  Code2,
  Activity
} from 'lucide-react';

interface AgenticWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  queryText?: string;
}

export const AgenticWorkflowModal: React.FC<AgenticWorkflowModalProps> = ({ isOpen, onClose, queryText = "Compare OpenAI and Anthropic AI models" }) => {
  const [activeStep, setActiveStep] = useState<number>(5);

  if (!isOpen) return null;

  const steps = [
    {
      id: 1,
      name: 'Agent 1: Intent Detection Agent',
      status: 'COMPLETED',
      latency: '0.12 ms',
      detail: 'Classified query intent as COMPARISON with 96% confidence score.',
      icon: BrainCircuit
    },
    {
      id: 2,
      name: 'Agent 2: Query Planner Agent',
      status: 'COMPLETED',
      latency: '0.18 ms',
      detail: 'Generated parallel execution plan: Vector Search (Top-3 HNSW) + Neo4j Cypher Traversal.',
      icon: Cpu
    },
    {
      id: 3,
      name: 'Agent 3: Vector Search Agent',
      status: 'COMPLETED',
      latency: '0.45 ms',
      detail: 'Retrieved 384-dimensional dense embeddings from ChromaDB (all-MiniLM-L6-v2).',
      icon: Database
    },
    {
      id: 4,
      name: 'Agent 4: Knowledge Graph Agent',
      status: 'COMPLETED',
      latency: '0.82 ms',
      detail: 'Executed Neo4j Cypher multi-hop graph traversal across (Company)-[:COMPETES_WITH]-(Company).',
      icon: Share2
    },
    {
      id: 5,
      name: 'Agent 5: Context Merger Agent',
      status: 'COMPLETED',
      latency: '0.34 ms',
      detail: 'Fused vector similarity context with graph topology and synthesized executive Markdown answer.',
      icon: Bot
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-dark-900/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-3xl rounded-3xl border border-sky-500/30 bg-dark-800/95 overflow-hidden shadow-2xl space-y-0 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-dark-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Live Multi-Agent Workflow Execution Telemetry
                <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  5 Agents Active
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">Query: "{queryText}"</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 bg-dark-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry Metrics Bar */}
        <div className="grid grid-cols-4 gap-3 p-4 bg-dark-900/60 border-b border-slate-800 text-xs font-mono">
          <div className="p-3 bg-dark-900 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block font-sans font-bold">Total Latency</span>
            <span className="text-sky-400 font-bold">1.91 ms</span>
          </div>
          <div className="p-3 bg-dark-900 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block font-sans font-bold">Vector Similarity</span>
            <span className="text-emerald-400 font-bold">96.8%</span>
          </div>
          <div className="p-3 bg-dark-900 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block font-sans font-bold">Graph Hops</span>
            <span className="text-violet-400 font-bold">2 Hops</span>
          </div>
          <div className="p-3 bg-dark-900 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block font-sans font-bold">RAG Accuracy</span>
            <span className="text-cyan-400 font-bold">99.4%</span>
          </div>
        </div>

        {/* Workflow Steps Feed */}
        <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="p-4 bg-dark-900/80 rounded-2xl border border-slate-800 flex items-start space-x-4 transition-all hover:border-sky-500/30"
              >
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-200">{step.name}</h3>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {step.latency}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{step.detail}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
