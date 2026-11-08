import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GitCompare, Building2, DollarSign, Users, Cpu, Award, Globe, BarChart2, TrendingUp, Sparkles, PieChart } from 'lucide-react';

interface CompanyData {
  name: string;
  industry: string;
  description: string;
  products: string[];
  technologies: string[];
  ceo_name?: string;
  employee_count: number;
  revenue_usd: number;
  total_funding_usd: number;
  valuation_usd: number;
  country: string;
  founded_year?: number;
}

const SAMPLE_COMPANIES: Record<string, CompanyData> = {
  "NVIDIA": {
    name: "NVIDIA",
    industry: "Artificial Intelligence & Hardware",
    description: "Global leader in GPU accelerated computing, graphics processing units, AI supercomputing hardware, CUDA software platforms, and Omniverse metaverse technology.",
    products: ["H100 Tensor Core GPU", "Blackwell B200 GPU", "CUDA Toolkit", "NVIDIA Omniverse"],
    technologies: ["GPU Compute", "CUDA", "TensorRT", "Deep Learning", "Ray Tracing"],
    ceo_name: "Jensen Huang",
    employee_count: 29600,
    revenue_usd: 60920000000.0,
    total_funding_usd: 18000000.0,
    valuation_usd: 3000000000000.0,
    country: "United States",
    founded_year: 1993
  },
  "OpenAI": {
    name: "OpenAI",
    industry: "Artificial Intelligence & LLMs",
    description: "AI research and deployment enterprise dedicated to ensuring AGI benefits humanity. Creator of ChatGPT, GPT-4o, DALL-E 3, Whisper, and Sora video generation models.",
    products: ["ChatGPT Plus", "GPT-4o API", "DALL-E 3", "OpenAI Assistants API", "Sora"],
    technologies: ["Transformer Architecture", "RLHF", "Deep Neural Networks", "PyTorch"],
    ceo_name: "Sam Altman",
    employee_count: 1200,
    revenue_usd: 2000000000.0,
    total_funding_usd: 13000000000.0,
    valuation_usd: 80000000000.0,
    country: "United States",
    founded_year: 2015
  },
  "Tesla": {
    name: "Tesla",
    industry: "Electric Vehicles & Clean Energy",
    description: "Designs, manufactures, and sells electric vehicles, solar power generation systems, battery energy storage products, and autonomous Full Self-Driving (FSD) vision neural networks.",
    products: ["Model S", "Model 3", "Model X", "Model Y", "Cybertruck", "Powerwall", "FSD"],
    technologies: ["Computer Vision", "End-to-End Neural Networks", "Dojo Supercomputer", "Battery Chemistry"],
    ceo_name: "Elon Musk",
    employee_count: 140000,
    revenue_usd: 96770000000.0,
    total_funding_usd: 200000000.0,
    valuation_usd: 750000000000.0,
    country: "United States",
    founded_year: 2003
  },
  "Anthropic": {
    name: "Anthropic",
    industry: "Artificial Intelligence & LLMs",
    description: "AI safety and research company behind the Claude 3 model family (Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku). Pioneered Constitutional AI and mechanistic interpretability.",
    products: ["Claude 3.5 Sonnet", "Claude 3 Opus", "Claude API", "Constitutional AI"],
    technologies: ["Constitutional AI", "Transformer Networks", "RLHF", "Mechanistic Interpretability"],
    ceo_name: "Dario Amodei",
    employee_count: 500,
    revenue_usd: 800000000.0,
    total_funding_usd: 7300000000.0,
    valuation_usd: 18000000000.0,
    country: "United States",
    founded_year: 2021
  },
  "Google (Alphabet)": {
    name: "Google (Alphabet)",
    industry: "Search, Cloud & AI Research",
    description: "Alphabet Inc. is a multinational technology conglomerate operating Google Search, Google Cloud (GCP), Google DeepMind, Android OS, YouTube, and Gemini multimodal AI models.",
    products: ["Google Search", "Google Cloud Platform", "Gemini AI", "YouTube", "Waymo"],
    technologies: ["TPU Chips", "TensorFlow", "JAX", "Transformer Network", "Kubernetes"],
    ceo_name: "Sundar Pichai",
    employee_count: 182000,
    revenue_usd: 307390000000.0,
    total_funding_usd: 25000000.0,
    valuation_usd: 2100000000000.0,
    country: "United States",
    founded_year: 1998
  },
  "Microsoft": {
    name: "Microsoft",
    industry: "Software, Cloud & Enterprise AI",
    description: "Develops operating systems, enterprise cloud computing (Azure), developer platforms (GitHub), workplace productivity software (Office 365, Copilot), and invests heavily in OpenAI.",
    products: ["Microsoft Azure", "Windows 11", "GitHub", "Microsoft 365 Copilot", "LinkedIn"],
    technologies: ["C#", ".NET", "Azure Cosmos DB", "TypeScript", "OpenAI Model Runtime"],
    ceo_name: "Satya Nadella",
    employee_count: 221000,
    revenue_usd: 245120000000.0,
    total_funding_usd: 1000000.0,
    valuation_usd: 3200000000000.0,
    country: "United States",
    founded_year: 1975
  },
  "Meta": {
    name: "Meta",
    industry: "Social Media, Open AI & VR",
    description: "Connects billions through Facebook, Instagram, WhatsApp, and leads open-source AI innovation with Llama 3.1 LLMs, PyTorch, and Quest VR virtual reality headsets.",
    products: ["Llama 3.1 405B", "PyTorch", "Instagram", "WhatsApp", "Meta Quest 3"],
    technologies: ["PyTorch", "React", "C++", "Open LLM Weights", "H100 Clusters"],
    ceo_name: "Mark Zuckerberg",
    employee_count: 67000,
    revenue_usd: 134900000000.0,
    total_funding_usd: 500000000.0,
    valuation_usd: 1250000000000.0,
    country: "United States",
    founded_year: 2004
  },
  "SpaceX": {
    name: "SpaceX",
    industry: "Aerospace & Satellite Communications",
    description: "Designs, manufactures, and launches advanced rockets and spacecraft. Creator of Falcon 9, Falcon Heavy, Starship, and Starlink satellite constellation.",
    products: ["Falcon 9", "Starship", "Starlink Satellite Internet", "Dragon Spacecraft"],
    technologies: ["Rocket Engines", "Methane Propulsion", "Phased Array Antennas", "C++"],
    ceo_name: "Elon Musk",
    employee_count: 13000,
    revenue_usd: 9000000000.0,
    total_funding_usd: 10000000000.0,
    valuation_usd: 180000000000.0,
    country: "United States",
    founded_year: 2002
  },
  "Palantir Technologies": {
    name: "Palantir Technologies",
    industry: "Big Data & Enterprise AI Analytics",
    description: "Builds enterprise data fusion software platforms (Foundry, Gotham, Apollo, AIP) for government defense and commercial intelligence decision-making.",
    products: ["Palantir AIP", "Palantir Foundry", "Palantir Gotham", "Apollo"],
    technologies: ["Data Fusion", "Ontology Engine", "Distributed Analytics", "Java"],
    ceo_name: "Alex Karp",
    employee_count: 3800,
    revenue_usd: 2230000000.0,
    total_funding_usd: 3000000000.0,
    valuation_usd: 60000000000.0,
    country: "United States",
    founded_year: 2003
  },
  "Databricks": {
    name: "Databricks",
    industry: "Data Engineering & Enterprise AI",
    description: "Provides a unified Data Intelligence Platform powered by Lakehouse architecture, Apache Spark, Delta Lake, MLflow, and DBRX open generative AI models.",
    products: ["Databricks Lakehouse", "Delta Lake", "MLflow", "Unity Catalog", "DBRX"],
    technologies: ["Apache Spark", "Delta Lake", "Vector Search", "Scala", "Python", "Kubernetes"],
    ceo_name: "Ali Ghodsi",
    employee_count: 6500,
    revenue_usd: 1600000000.0,
    total_funding_usd: 4000000000.0,
    valuation_usd: 43000000000.0,
    country: "United States",
    founded_year: 2013
  },
  "Stripe": {
    name: "Stripe",
    industry: "Fintech & Payments Infrastructure",
    description: "Financial infrastructure platform for businesses. Millions of companies from startups to Fortune 500s use Stripe software and APIs to accept online payments and manage subscriptions.",
    products: ["Stripe Payments", "Stripe Connect", "Stripe Billing", "Stripe Radar"],
    technologies: ["Ruby", "Go", "Distributed Ledger", "Machine Learning Fraud Detection", "PostgreSQL"],
    ceo_name: "Patrick Collison",
    employee_count: 8000,
    revenue_usd: 14000000000.0,
    total_funding_usd: 8700000000.0,
    valuation_usd: 65000000000.0,
    country: "United States",
    founded_year: 2010
  }
};

export const CompanyComparisonView: React.FC = () => {
  const [nameA, setNameA] = useState('Google (Alphabet)');
  const [nameB, setNameB] = useState('Microsoft');
  
  const [dataA, setDataA] = useState<CompanyData>(SAMPLE_COMPANIES['Google (Alphabet)']);
  const [dataB, setDataB] = useState<CompanyData>(SAMPLE_COMPANIES['Microsoft']);

  useEffect(() => {
    if (SAMPLE_COMPANIES[nameA]) setDataA(SAMPLE_COMPANIES[nameA]);
  }, [nameA]);

  useEffect(() => {
    if (SAMPLE_COMPANIES[nameB]) setDataB(SAMPLE_COMPANIES[nameB]);
  }, [nameB]);

  const companyKeys = Object.keys(SAMPLE_COMPANIES);

  // Maximum values for normalization in chart bars
  const maxValuation = Math.max(dataA.valuation_usd, dataB.valuation_usd, 1);
  const maxFunding = Math.max(dataA.total_funding_usd, dataB.total_funding_usd, 1);
  const maxRevenue = Math.max(dataA.revenue_usd, dataB.revenue_usd, 1);
  const maxEmployees = Math.max(dataA.employee_count, dataB.employee_count, 1);

  return (
    <div className="space-y-6">
      {/* Selector Header */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full">
          <label className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Select Enterprise A</label>
          <select
            value={nameA}
            onChange={(e) => setNameA(e.target.value)}
            className="w-full bg-dark-900 text-slate-100 text-sm font-bold px-3 py-2.5 rounded-xl border border-slate-700 mt-1 focus:outline-none focus:border-sky-500"
          >
            {companyKeys.map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>

        <div className="p-3 bg-gradient-to-tr from-sky-500 to-violet-600 text-white rounded-full shrink-0 shadow-lg shadow-sky-500/20">
          <GitCompare className="w-5 h-5" />
        </div>

        <div className="flex-1 w-full">
          <label className="text-xs font-semibold text-violet-400 uppercase tracking-wider">Select Enterprise B</label>
          <select
            value={nameB}
            onChange={(e) => setNameB(e.target.value)}
            className="w-full bg-dark-900 text-slate-100 text-sm font-bold px-3 py-2.5 rounded-xl border border-slate-700 mt-1 focus:outline-none focus:border-violet-500"
          >
            {companyKeys.map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Visual Chart Metrics Comparison Section */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-slate-100">Financial & Scale Comparison Chart</h3>
          </div>
          <div className="flex items-center space-x-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="w-3 h-3 rounded-full bg-sky-500"></span> {dataA.name}
            </span>
            <span className="flex items-center gap-1.5 text-violet-400">
              <span className="w-3 h-3 rounded-full bg-violet-500"></span> {dataB.name}
            </span>
          </div>
        </div>

        {/* Dynamic Comparison Bar Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Valuation Chart */}
          <div className="p-4 bg-dark-900/90 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span>Market Valuation (USD)</span>
            </div>
            <div className="space-y-2 pt-1">
              <div>
                <div className="flex justify-between text-[11px] font-mono text-sky-400 mb-1">
                  <span>{dataA.name}</span>
                  <span>${(dataA.valuation_usd / 1e9).toFixed(2)}B</span>
                </div>
                <div className="w-full h-3 bg-dark-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, (dataA.valuation_usd / maxValuation) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono text-violet-400 mb-1">
                  <span>{dataB.name}</span>
                  <span>${(dataB.valuation_usd / 1e9).toFixed(2)}B</span>
                </div>
                <div className="w-full h-3 bg-dark-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-violet-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, (dataB.valuation_usd / maxValuation) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Funding Chart */}
          <div className="p-4 bg-dark-900/90 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span>Total Raised Funding (USD)</span>
            </div>
            <div className="space-y-2 pt-1">
              <div>
                <div className="flex justify-between text-[11px] font-mono text-sky-400 mb-1">
                  <span>{dataA.name}</span>
                  <span>${(dataA.total_funding_usd / 1e9).toFixed(2)}B</span>
                </div>
                <div className="w-full h-3 bg-dark-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, (dataA.total_funding_usd / maxFunding) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono text-violet-400 mb-1">
                  <span>{dataB.name}</span>
                  <span>${(dataB.total_funding_usd / 1e9).toFixed(2)}B</span>
                </div>
                <div className="w-full h-3 bg-dark-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-violet-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, (dataB.total_funding_usd / maxFunding) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="p-4 bg-dark-900/90 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span>Annual Revenue (USD)</span>
            </div>
            <div className="space-y-2 pt-1">
              <div>
                <div className="flex justify-between text-[11px] font-mono text-sky-400 mb-1">
                  <span>{dataA.name}</span>
                  <span>${(dataA.revenue_usd / 1e9).toFixed(2)}B</span>
                </div>
                <div className="w-full h-3 bg-dark-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, (dataA.revenue_usd / maxRevenue) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono text-violet-400 mb-1">
                  <span>{dataB.name}</span>
                  <span>${(dataB.revenue_usd / 1e9).toFixed(2)}B</span>
                </div>
                <div className="w-full h-3 bg-dark-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-violet-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, (dataB.revenue_usd / maxRevenue) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Employees Chart */}
          <div className="p-4 bg-dark-900/90 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span>Employee Headcount</span>
            </div>
            <div className="space-y-2 pt-1">
              <div>
                <div className="flex justify-between text-[11px] font-mono text-sky-400 mb-1">
                  <span>{dataA.name}</span>
                  <span>{dataA.employee_count.toLocaleString()}</span>
                </div>
                <div className="w-full h-3 bg-dark-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, (dataA.employee_count / maxEmployees) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono text-violet-400 mb-1">
                  <span>{dataB.name}</span>
                  <span>{dataB.employee_count.toLocaleString()}</span>
                </div>
                <div className="w-full h-3 bg-dark-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-violet-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, (dataB.employee_count / maxEmployees) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Side-by-Side Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Enterprise A Details */}
        <div className="glass-card p-6 rounded-2xl border border-sky-500/30 space-y-4 bg-gradient-to-b from-sky-500/5 to-transparent">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">Primary Entity</span>
              <h3 className="text-2xl font-bold text-slate-100">{dataA.name}</h3>
              <p className="text-xs text-slate-400">{dataA.industry}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center font-bold text-lg">
              A
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{dataA.description}</p>

          <div className="pt-2 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Core Technologies
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {dataA.technologies.map((t, i) => (
                <span key={i} className="px-2 py-1 bg-dark-900 text-slate-300 text-[11px] rounded border border-slate-800 font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Enterprise B Details */}
        <div className="glass-card p-6 rounded-2xl border border-violet-500/30 space-y-4 bg-gradient-to-b from-violet-500/5 to-transparent">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider">Comparison Entity</span>
              <h3 className="text-2xl font-bold text-slate-100">{dataB.name}</h3>
              <p className="text-xs text-slate-400">{dataB.industry}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center font-bold text-lg">
              B
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{dataB.description}</p>

          <div className="pt-2 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-violet-400" />
              Core Technologies
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {dataB.technologies.map((t, i) => (
                <span key={i} className="px-2 py-1 bg-dark-900 text-slate-300 text-[11px] rounded border border-slate-800 font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
