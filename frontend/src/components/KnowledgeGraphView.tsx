import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Share2, 
  Search, 
  Filter, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Code2, 
  Building2, 
  Cpu, 
  Users, 
  Globe, 
  Sliders, 
  RefreshCw, 
  Play, 
  Info,
  ChevronRight,
  Zap,
  Layers
} from 'lucide-react';

interface Node {
  id: string;
  name: string;
  type: 'COMPANY' | 'INDUSTRY' | 'TECHNOLOGY' | 'INVESTOR' | 'CEO';
  val: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

interface Edge {
  source: string;
  target: string;
  relation: string;
}

const INITIAL_NODES: Node[] = [
  { id: 'n1', name: 'NVIDIA', type: 'COMPANY', val: 30, x: 250, y: 200, vx: 0, vy: 0, color: '#0284C7' },
  { id: 'n2', name: 'OpenAI', type: 'COMPANY', val: 26, x: 450, y: 150, vx: 0, vy: 0, color: '#0284C7' },
  { id: 'n3', name: 'Tesla', type: 'COMPANY', val: 25, x: 150, y: 350, vx: 0, vy: 0, color: '#0284C7' },
  { id: 'n4', name: 'Anthropic', type: 'COMPANY', val: 22, x: 550, y: 300, vx: 0, vy: 0, color: '#0284C7' },
  { id: 'n5', name: 'Google (Alphabet)', type: 'COMPANY', val: 28, x: 350, y: 380, vx: 0, vy: 0, color: '#0284C7' },
  
  { id: 'n6', name: 'Artificial Intelligence', type: 'INDUSTRY', val: 24, x: 350, y: 250, vx: 0, vy: 0, color: '#10B981' },
  { id: 'n7', name: 'GPU Compute & CUDA', type: 'TECHNOLOGY', val: 20, x: 180, y: 120, vx: 0, vy: 0, color: '#06B6D4' },
  { id: 'n8', name: 'Transformer Networks', type: 'TECHNOLOGY', val: 20, x: 500, y: 220, vx: 0, vy: 0, color: '#06B6D4' },
  { id: 'n9', name: 'Microsoft', type: 'INVESTOR', val: 22, x: 620, y: 120, vx: 0, vy: 0, color: '#8B5CF6' },
  { id: 'n10', name: 'Sequoia Capital', type: 'INVESTOR', val: 22, x: 280, y: 80, vx: 0, vy: 0, color: '#8B5CF6' },
  { id: 'n11', name: 'Jensen Huang', type: 'CEO', val: 18, x: 120, y: 240, vx: 0, vy: 0, color: '#F59E0B' },
  { id: 'n12', name: 'Sam Altman', type: 'CEO', val: 18, x: 420, y: 60, vx: 0, vy: 0, color: '#F59E0B' },
];

const INITIAL_EDGES: Edge[] = [
  { source: 'n1', target: 'n6', relation: 'OPERATES_IN' },
  { source: 'n2', target: 'n6', relation: 'OPERATES_IN' },
  { source: 'n4', target: 'n6', relation: 'OPERATES_IN' },
  { source: 'n1', target: 'n7', relation: 'USES_TECHNOLOGY' },
  { source: 'n2', target: 'n8', relation: 'USES_TECHNOLOGY' },
  { source: 'n4', target: 'n8', relation: 'USES_TECHNOLOGY' },
  { source: 'n9', target: 'n2', relation: 'BACKED_BY' },
  { source: 'n10', target: 'n1', relation: 'BACKED_BY' },
  { source: 'n11', target: 'n1', relation: 'LED_BY_CEO' },
  { source: 'n12', target: 'n2', relation: 'LED_BY_CEO' },
  { source: 'n1', target: 'n2', relation: 'SUPPLIES_HARDWARE_TO' },
  { source: 'n2', target: 'n4', relation: 'COMPETES_WITH' },
];

export const KnowledgeGraphView: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [repulsionStrength, setRepulsionStrength] = useState(80);
  const [selectedNode, setSelectedNode] = useState<Node | null>(nodes[0]);
  const [activeCypher, setActiveCypher] = useState(`MATCH (c:Company)-[r:COMPETES_WITH|USES_TECHNOLOGY]->(n) RETURN c, r, n LIMIT 25`);
  const [isRunningPhysics, setIsRunningPhysics] = useState(true);

  const svgRef = useRef<SVGSVGElement>(null);

  // Physics animation loop simulation
  useEffect(() => {
    if (!isRunningPhysics) return;
    const interval = setInterval(() => {
      setNodes(prevNodes => {
        return prevNodes.map(node => {
          // Subtle organic floating physics motion
          const dx = (Math.random() - 0.5) * 0.8;
          const dy = (Math.random() - 0.5) * 0.8;
          const newX = Math.max(50, Math.min(750, node.x + dx));
          const newY = Math.max(50, Math.min(450, node.y + dy));
          return { ...node, x: newX, y: newY };
        });
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isRunningPhysics]);

  const filteredNodes = nodes.filter(n => {
    const matchesType = selectedType === 'ALL' || n.type === selectedType;
    const matchesSearch = n.name.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesType && matchesSearch;
  });

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = edges.filter(e => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target));

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-dark-800/90 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-500/20">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Neo4j Force-Directed Knowledge Graph Visualizer
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full">
                Physics Physics Engine v2
              </span>
            </h2>
            <p className="text-xs text-slate-400">Multi-hop relationship topology mapping across corporate entities, tech stacks, and investors</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 text-xs font-semibold overflow-x-auto">
          {['ALL', 'COMPANY', 'INDUSTRY', 'TECHNOLOGY', 'INVESTOR', 'CEO'].map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                selectedType === t 
                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/30 font-bold' 
                  : 'bg-dark-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas Graph Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Interactive SVG Canvas */}
        <div className="lg:col-span-2 glass-card rounded-3xl border border-slate-800 bg-dark-900/80 p-4 space-y-3 relative overflow-hidden shadow-2xl min-h-[480px] flex flex-col justify-between">
          
          {/* Controls Bar */}
          <div className="flex items-center justify-between z-10 bg-dark-800/90 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter graph nodes..."
                className="bg-transparent text-xs text-slate-100 focus:outline-none placeholder:text-slate-500 w-36 sm:w-48"
              />
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsRunningPhysics(!isRunningPhysics)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border flex items-center gap-1 transition-all ${
                  isRunningPhysics ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-dark-900 text-slate-400 border-slate-800'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>{isRunningPhysics ? 'Physics Active' : 'Physics Paused'}</span>
              </button>

              <button onClick={() => setZoomLevel(Math.min(1.5, zoomLevel + 0.1))} className="p-1.5 bg-dark-900 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button onClick={() => setZoomLevel(Math.max(0.6, zoomLevel - 0.1))} className="p-1.5 bg-dark-900 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800">
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SVG Force-Directed Rendering Canvas */}
          <div className="w-full flex-1 flex items-center justify-center overflow-hidden">
            <svg
              ref={svgRef}
              viewBox="0 0 800 500"
              className="w-full h-full max-h-[420px] transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                </marker>
              </defs>

              {/* Render Graph Edges */}
              {filteredEdges.map((edge, idx) => {
                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const isHighlighted = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);

                return (
                  <g key={idx}>
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={isHighlighted ? '#0284C7' : '#334155'}
                      strokeWidth={isHighlighted ? 2.5 : 1.2}
                      strokeDasharray={edge.relation.includes('COMPETES') ? '4,4' : 'none'}
                      markerEnd="url(#arrow)"
                    />
                    <text
                      x={(sourceNode.x + targetNode.x) / 2}
                      y={(sourceNode.y + targetNode.y) / 2 - 4}
                      fill="#64748B"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {edge.relation}
                    </text>
                  </g>
                );
              })}

              {/* Render Graph Nodes */}
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => {
                      setSelectedNode(node);
                      setActiveCypher(`MATCH (n:${node.type} {name: '${node.name}'})-[r]-(m) RETURN n, r, m LIMIT 15`);
                    }}
                    className="cursor-pointer transition-all hover:opacity-90"
                  >
                    <circle
                      r={node.val}
                      fill={node.color}
                      fillOpacity={isSelected ? 0.3 : 0.15}
                      stroke={node.color}
                      strokeWidth={isSelected ? 3 : 1.5}
                      className={isSelected ? 'animate-pulse' : ''}
                    />
                    <circle r={6} fill={node.color} />
                    <text
                      y={node.val + 14}
                      fill="#E2E8F0"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="pointer-events-none drop-shadow"
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Cypher Query Footer Output */}
          <div className="p-3 bg-dark-800/90 rounded-2xl border border-slate-800 font-mono text-[11px] text-cyan-300 space-y-1 z-10">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-sky-400" />
                Active Neo4j Cypher Traversal Statement
              </span>
              <span className="text-emerald-400 font-mono">Exec Time: 0.8ms</span>
            </div>
            <pre className="overflow-x-auto text-[11px] text-cyan-300 pt-0.5">
              {activeCypher}
            </pre>
          </div>

        </div>

        {/* Right Node Inspector Drawer Card */}
        {selectedNode ? (
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 bg-dark-800/90 self-start shadow-xl">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-md"
                style={{ backgroundColor: selectedNode.color }}
              >
                {selectedNode.name[0]}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">{selectedNode.name}</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full">
                  Node Type: {selectedNode.type}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Degree Centrality:</span>
                <span className="font-mono text-emerald-400 font-bold">4 Edge Connections</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Graph Cluster:</span>
                <span className="font-mono text-sky-400">Enterprise AI Verticals</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                Direct Graph Topology Links
              </h4>
              <div className="space-y-1.5">
                {edges
                  .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                  .map((e, idx) => {
                    const otherNode = nodes.find(n => n.id === (e.source === selectedNode.id ? e.target : e.source));
                    return (
                      <div key={idx} className="p-2.5 bg-dark-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <span className="font-mono text-slate-400 text-[10px] uppercase">[{e.relation}]</span>
                        <span className="font-bold text-slate-200">{otherNode?.name}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card p-6 rounded-3xl border border-slate-800 text-center text-xs text-slate-500">
            Click any node on the graph canvas to inspect topological relationships.
          </div>
        )}

      </div>
    </div>
  );
};
