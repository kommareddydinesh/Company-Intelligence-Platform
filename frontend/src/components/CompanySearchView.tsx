import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Sparkles, Filter, Building2, Cpu, Globe, ArrowRight, ExternalLink, Sliders, DollarSign, Users } from 'lucide-react';
import { CompanyDetailModal } from './CompanyDetailModal';

interface VectorResult {
  id: string;
  name: string;
  industry: string;
  country: string;
  description: string;
  similarity_score: number;
  matched_technologies: string[];
  valuation_usd?: number;
  revenue_usd?: number;
}

interface CompanySearchViewProps {
  onSelectCompare?: (name: string) => void;
}

const ALL_COMPANIES_DATASET: VectorResult[] = [
  {
    id: '1',
    name: 'NVIDIA',
    industry: 'Artificial Intelligence & Hardware',
    country: 'United States',
    description: 'Global leader in GPU accelerated computing, graphics processing units, AI supercomputing hardware, CUDA software platforms, and Omniverse metaverse technology.',
    similarity_score: 0.965,
    matched_technologies: ['GPU Compute', 'CUDA', 'TensorRT', 'Deep Learning'],
    valuation_usd: 3000000000000,
    revenue_usd: 60920000000
  },
  {
    id: '2',
    name: 'OpenAI',
    industry: 'Artificial Intelligence & LLMs',
    country: 'United States',
    description: 'AI research and deployment enterprise dedicated to ensuring AGI benefits humanity. Creator of ChatGPT, GPT-4o, DALL-E 3, Whisper, and Sora video generation models.',
    similarity_score: 0.912,
    matched_technologies: ['Transformer Architecture', 'RLHF', 'PyTorch', 'Kubernetes'],
    valuation_usd: 80000000000,
    revenue_usd: 2000000000
  },
  {
    id: '3',
    name: 'Tesla',
    industry: 'Electric Vehicles & Clean Energy',
    country: 'United States',
    description: 'Designs, manufactures, and sells electric vehicles, solar power generation systems, battery energy storage products, and autonomous Full Self-Driving (FSD) vision neural networks.',
    similarity_score: 0.884,
    matched_technologies: ['Computer Vision', 'End-to-End Neural Networks', 'Dojo Supercomputer'],
    valuation_usd: 750000000000,
    revenue_usd: 96770000000
  },
  {
    id: '4',
    name: 'Anthropic',
    industry: 'Artificial Intelligence & LLMs',
    country: 'United States',
    description: 'AI safety and research company behind the Claude 3 model family (Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku). Pioneered Constitutional AI and mechanistic interpretability.',
    similarity_score: 0.865,
    matched_technologies: ['Constitutional AI', 'Transformer Networks', 'RLHF', 'Python'],
    valuation_usd: 18000000000,
    revenue_usd: 800000000
  },
  {
    id: '5',
    name: 'Google (Alphabet)',
    industry: 'Search, Cloud & AI Research',
    country: 'United States',
    description: 'Multinational technology conglomerate operating Google Search, Google Cloud (GCP), Google DeepMind, Android OS, YouTube, and Gemini multimodal AI models.',
    similarity_score: 0.852,
    matched_technologies: ['TPU Chips', 'TensorFlow', 'JAX', 'Kubernetes'],
    valuation_usd: 2100000000000,
    revenue_usd: 307390000000
  },
  {
    id: '6',
    name: 'Microsoft',
    industry: 'Software, Cloud & Enterprise AI',
    country: 'United States',
    description: 'Develops operating systems, enterprise cloud computing (Azure), developer platforms (GitHub), workplace productivity software (Office 365, Copilot), and invests in OpenAI.',
    similarity_score: 0.848,
    matched_technologies: ['C#', '.NET', 'Azure Cosmos DB', 'TypeScript'],
    valuation_usd: 3200000000000,
    revenue_usd: 245120000000
  },
  {
    id: '7',
    name: 'Meta',
    industry: 'Social Media, Open AI & VR',
    country: 'United States',
    description: 'Connects billions through Facebook, Instagram, WhatsApp, and leads open-source AI innovation with Llama 3.1 LLMs, PyTorch, and Quest VR virtual reality headsets.',
    similarity_score: 0.835,
    matched_technologies: ['PyTorch', 'React', 'C++', 'Open LLM Weights'],
    valuation_usd: 1250000000000,
    revenue_usd: 134900000000
  },
  {
    id: '8',
    name: 'Databricks',
    industry: 'Data Engineering & Enterprise AI',
    country: 'United States',
    description: 'Provides a unified Data Intelligence Platform powered by Lakehouse architecture, Apache Spark, Delta Lake, MLflow, and DBRX open generative AI models.',
    similarity_score: 0.820,
    matched_technologies: ['Apache Spark', 'Delta Lake', 'Vector Search', 'Python'],
    valuation_usd: 43000000000,
    revenue_usd: 1600000000
  }
];

export const CompanySearchView: React.FC<CompanySearchViewProps> = ({ onSelectCompare }) => {
  const [query, setQuery] = useState('AI hardware, GPU computing, supercomputers');
  const [results, setResults] = useState<VectorResult[]>(ALL_COMPANIES_DATASET);
  const [loading, setLoading] = useState(false);
  const [minValuationB, setMinValuationB] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/v1/search/semantic', {
        query,
        top_k: 8,
        hybrid_alpha: 0.5
      });
      if (res.data && res.data.length > 0) {
        setResults(res.data);
      }
    } catch (err) {
      console.warn('Vector Search notice, filtering dataset locally:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const filteredResults = results.filter(c => {
    const valB = (c.valuation_usd || 0) / 1e9;
    return valB >= minValuationB;
  });

  return (
    <div className="space-y-6">
      {/* Modal Inspector */}
      {selectedCompany && (
        <CompanyDetailModal
          companyName={selectedCompany}
          onClose={() => setSelectedCompany(null)}
          onSelectCompare={onSelectCompare}
        />
      )}

      {/* Semantic Search & Financial Screener Header */}
      <form onSubmit={handleSearch} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies by natural language concept (e.g. 'LLM safety research labs', 'Autonomous EV vision networks')..."
              className="w-full bg-dark-900/90 text-slate-100 pl-11 pr-4 py-3 rounded-2xl border border-slate-800 text-xs focus:outline-none focus:border-sky-500 transition-all shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-600 hover:opacity-90 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-500/25 flex items-center space-x-2 transition-all shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Searching...' : 'Vector Search'}</span>
          </button>
        </div>

        {/* Real-time Screener Controls */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <Sliders className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="font-semibold text-slate-300">Min Valuation:</span>
            <input
              type="range"
              min={0}
              max={1000}
              step={50}
              value={minValuationB}
              onChange={(e) => setMinValuationB(Number(e.target.value))}
              className="w-36 accent-sky-500 cursor-pointer"
            />
            <span className="font-mono text-sky-400 font-bold">${minValuationB}B+</span>
          </div>

          <p className="text-[11px] font-mono text-slate-500">ChromaDB 384d Cosine Similarity Index + Financial Screener</p>
        </div>
      </form>

      {/* Results List */}
      <div className="space-y-4">
        {filteredResults.map((item, idx) => (
          <div 
            key={item.id || idx} 
            onClick={() => setSelectedCompany(item.name)}
            className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-sky-500/50 cursor-pointer transition-all hover:scale-[1.005] group shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-sky-400 transition-colors flex items-center gap-2">
                    {item.name}
                    <ExternalLink className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full">
                    {item.industry}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.description}</p>
              </div>

              {/* Similarity Pill */}
              <div className="text-right shrink-0 ml-4">
                <div className="px-3 py-1 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl font-mono text-xs font-bold">
                  {(item.similarity_score * 100).toFixed(1)}% Match
                </div>
                {item.valuation_usd && (
                  <p className="text-[10px] font-mono text-slate-400 mt-1 font-bold">
                    ${(item.valuation_usd / 1e9).toFixed(1)}B Valuation
                  </p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <div className="flex flex-wrap gap-1.5">
                  {item.matched_technologies.map((tech, tidx) => (
                    <span key={tidx} className="px-2 py-0.5 bg-dark-900 text-slate-300 rounded text-[11px] font-medium border border-slate-800">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-1 text-slate-400 font-medium">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{item.country}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
