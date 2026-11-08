import React, { useState } from 'react';
import { 
  Play, 
  Code2, 
  Terminal, 
  Database, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  FileText, 
  Share2, 
  Download,
  Trash2
} from 'lucide-react';

interface Cell {
  id: string;
  type: 'code' | 'markdown';
  content: string;
  output?: string;
  outputType?: 'table' | 'json' | 'text';
  executionTime?: string;
}

export const NotebookView: React.FC = () => {
  const [cells, setCells] = useState<Cell[]>([
    {
      id: 'c1',
      type: 'markdown',
      content: '# 📓 Enterprise Intelligence AI Research Notebook\nAnalyze company valuation multiples, vector similarity scores, and Neo4j Cypher relationship paths directly using python and SQL cells.'
    },
    {
      id: 'c2',
      type: 'code',
      content: `import pandas as pd
from backend.database.postgres import db
from backend.knowledge_graph.neo4j_client import neo4j_client

# Query Top 5 AI Companies by Valuation
df = db.query("""
    SELECT name, industry, valuation_usd, revenue_usd 
    FROM companies 
    ORDER BY valuation_usd DESC 
    LIMIT 5
""")
df['valuation_billions'] = df['valuation_usd'] / 1e9
print(df[['name', 'industry', 'valuation_billions']])`,
      outputType: 'table',
      output: JSON.stringify([
        { name: 'Microsoft', industry: 'Software & Cloud', valuation_billions: '$3,200.0B' },
        { name: 'NVIDIA', industry: 'AI & Hardware', valuation_billions: '$3,000.0B' },
        { name: 'Google (Alphabet)', industry: 'Search & Cloud', valuation_billions: '$2,100.0B' },
        { name: 'Meta', industry: 'Social & Open AI', valuation_billions: '$1,250.0B' },
        { name: 'Tesla', industry: 'EV & Clean Energy', valuation_billions: '$750.0B' }
      ]),
      executionTime: '0.14 ms'
    },
    {
      id: 'c3',
      type: 'code',
      content: `# Execute Neo4j Cypher Path Traversal
cypher_query = """
MATCH (c1:Company)-[r:COMPETES_WITH]-(c2:Company)
RETURN c1.name AS CompanyA, c2.name AS CompanyB, r.sector AS Industry
"""
results = neo4j_client.execute_cypher(cypher_query)
print(results)`,
      outputType: 'json',
      output: JSON.stringify([
        { CompanyA: 'OpenAI', CompanyB: 'Anthropic', Industry: 'Artificial Intelligence' },
        { CompanyA: 'Google', CompanyB: 'Microsoft', Industry: 'Cloud & AI' }
      ], null, 2),
      executionTime: '0.82 ms'
    }
  ]);

  const [executingId, setExecutingId] = useState<string | null>(null);

  const runCell = (id: string) => {
    setExecutingId(id);
    setTimeout(() => {
      setExecutingId(null);
    }, 400);
  };

  const addCell = (type: 'code' | 'markdown') => {
    const newCell: Cell = {
      id: `c-${Date.now()}`,
      type,
      content: type === 'code' ? `# New Python Analysis Cell\nprint("Executing Graph RAG analysis...")` : '### New Research Section',
      outputType: 'text',
      output: type === 'code' ? 'Executing Graph RAG analysis...\nDone (0.12 ms).' : undefined
    };
    setCells(prev => [...prev, newCell]);
  };

  const deleteCell = (id: string) => {
    setCells(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-dark-800/90 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-500/20">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Interactive AI Research Notebook Workbench
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full font-mono">
                Python 3.12 Kernel
              </span>
            </h2>
            <p className="text-xs text-slate-400">Jupyter/Notion-style interactive code execution against PostgreSQL, Neo4j, and ChromaDB</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => addCell('code')}
            className="px-3 py-1.5 bg-dark-900 hover:bg-slate-800 text-sky-400 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Code Cell</span>
          </button>
          <button
            onClick={() => addCell('markdown')}
            className="px-3 py-1.5 bg-dark-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Text Cell</span>
          </button>
        </div>
      </div>

      {/* Cells List */}
      <div className="space-y-4">
        {cells.map((cell, idx) => (
          <div key={cell.id} className="glass-card rounded-2xl border border-slate-800 bg-dark-800/90 overflow-hidden shadow-xl space-y-0">
            
            {/* Cell Top Bar */}
            <div className="px-4 py-2 bg-dark-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sky-400">[{idx + 1}]</span>
                <span className="uppercase text-[10px] font-sans font-bold text-slate-500">{cell.type} Cell</span>
              </div>
              <div className="flex items-center space-x-2">
                {cell.type === 'code' && (
                  <button
                    onClick={() => runCell(cell.id)}
                    disabled={executingId === cell.id}
                    className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30 flex items-center gap-1 font-sans text-[10px] font-bold transition-all"
                  >
                    <Play className="w-3 h-3 fill-emerald-400" />
                    <span>{executingId === cell.id ? 'Running...' : 'Run Cell'}</span>
                  </button>
                )}
                <button
                  onClick={() => deleteCell(cell.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Cell Editor Content */}
            <div className="p-4 bg-dark-900/60 font-mono text-xs text-slate-100">
              <textarea
                value={cell.content}
                onChange={(e) => {
                  const val = e.target.value;
                  setCells(prev => prev.map(c => c.id === cell.id ? { ...c, content: val } : c));
                }}
                rows={Math.max(3, cell.content.split('\n').length)}
                className="w-full bg-transparent border-0 text-xs font-mono text-cyan-300 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Cell Output Display */}
            {cell.output && (
              <div className="p-4 border-t border-slate-800 bg-dark-900/90 text-xs space-y-2">
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>Output ({cell.executionTime || '0.12 ms'})</span>
                  <span className="text-emerald-400">✓ Executed</span>
                </div>

                {cell.outputType === 'table' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 font-mono text-[10px] text-slate-400 uppercase">
                          <th className="py-2 px-3">Company</th>
                          <th className="py-2 px-3">Industry</th>
                          <th className="py-2 px-3 text-right">Valuation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-200">
                        {JSON.parse(cell.output).map((row: any, rindex: number) => (
                          <tr key={rindex}>
                            <td className="py-2 px-3 font-bold">{row.name}</td>
                            <td className="py-2 px-3 text-slate-400">{row.industry}</td>
                            <td className="py-2 px-3 text-right font-mono text-emerald-400 font-bold">{row.valuation_billions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <pre className="overflow-x-auto text-[11px] font-mono text-slate-300">
                    {cell.output}
                  </pre>
                )}
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
};
