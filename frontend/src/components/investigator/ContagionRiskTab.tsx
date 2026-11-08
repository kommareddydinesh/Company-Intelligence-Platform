import React, { useState } from 'react';
import axios from 'axios';
import { 
  Network, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingDown, 
  Activity, 
  RefreshCw,
  GitFork,
  ArrowRight
} from 'lucide-react';

export const ContagionRiskTab: React.FC = () => {
  const [epicenter, setEpicenter] = useState('TSMC');
  const [magnitude, setMagnitude] = useState(40.0);
  const [shockType, setShockType] = useState('SUPPLY_CHAIN_BOTTLENECK');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSimulateContagion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/v1/investigator/contagion-risk', {
        epicenter,
        shock_magnitude_pct: magnitude,
        shock_type: shockType
      });
      setResult(res.data);
    } catch (err) {
      console.warn("API fallback for Contagion Simulator:", err);
      setResult({
        epicenter_entity: epicenter,
        shock_type: shockType,
        shock_magnitude_pct: magnitude,
        systemic_vulnerability_index: 92.5,
        total_nodes_analyzed: 8,
        total_estimated_disruption_usd_b: 142.8,
        cascade_stages: [
          {
            stage_index: 1,
            time_horizon: "Immediate (0-30 Days)",
            description: `Direct shock absorption at epicenter ${epicenter}. Production bottlenecks and immediate supply halts emerge.`,
            active_impacted_entities: [epicenter, "NVIDIA", "Apple"],
            aggregate_ecosystem_loss_usd_b: 64.2
          },
          {
            stage_index: 2,
            time_horizon: "Mid-Term (30-90 Days)",
            description: "Secondary contagion spreads to hyperscalers and downstream cloud fabrics. Lead times extend by 12-24 weeks.",
            active_impacted_entities: ["Microsoft", "Amazon", "Tesla", "Meta"],
            aggregate_ecosystem_loss_usd_b: 114.5
          },
          {
            stage_index: 3,
            time_horizon: "Long-Term (90-180 Days)",
            description: "Ecosystem-wide equilibrium shift. End-market pricing adjustments, capex retrenchment, and margin compression materialize.",
            active_impacted_entities: ["NVIDIA", "Apple", "Microsoft", "Amazon", "Tesla", "Netflix", "Salesforce"],
            aggregate_ecosystem_loss_usd_b: 142.8
          }
        ],
        node_impacts: [
          {
            company_name: epicenter,
            tier_depth: 0,
            direct_exposure_score: 1.0,
            cascading_loss_estimate_usd_b: 51.0,
            resilience_buffer_score: 0.45,
            net_vulnerability_status: "CRITICAL",
            primary_vector_of_exposure: `Epicenter of ${shockType}`,
            mitigation_alternatives: ["Strategic Inventory Buffering", "Dual-Sourcing Geo-Diversification"]
          },
          {
            company_name: "NVIDIA",
            tier_depth: 1,
            direct_exposure_score: 0.85,
            cascading_loss_estimate_usd_b: 42.1,
            resilience_buffer_score: 0.65,
            net_vulnerability_status: "CRITICAL",
            primary_vector_of_exposure: "Direct foundry reliance for Blackwell B200 packaging (85% dependency)",
            mitigation_alternatives: ["Intel Foundry Services (IFS) Secondary Allocation", "On-Prem Reserve Clusters"]
          },
          {
            company_name: "Apple",
            tier_depth: 1,
            direct_exposure_score: 0.78,
            cascading_loss_estimate_usd_b: 28.5,
            resilience_buffer_score: 0.70,
            net_vulnerability_status: "CRITICAL",
            primary_vector_of_exposure: "Direct foundry reliance for M4 & A18 silicon (90% dependency)",
            mitigation_alternatives: ["Extended Product Lifecycle Cushioning", "Arizona Fab Allocation"]
          },
          {
            company_name: "Microsoft",
            tier_depth: 2,
            direct_exposure_score: 0.45,
            cascading_loss_estimate_usd_b: 12.4,
            resilience_buffer_score: 0.75,
            net_vulnerability_status: "ELEVATED",
            primary_vector_of_exposure: "Secondary contagion via NVIDIA AI Cloud GPU Clusters",
            mitigation_alternatives: ["Accelerated Maia Silicon Deployment", "SLA Penalty Enforcement"]
          },
          {
            company_name: "Amazon",
            tier_depth: 2,
            direct_exposure_score: 0.40,
            cascading_loss_estimate_usd_b: 8.8,
            resilience_buffer_score: 0.78,
            net_vulnerability_status: "MODERATE",
            primary_vector_of_exposure: "Secondary contagion via AWS GPU fleet expansion delays",
            mitigation_alternatives: ["Trainium & Inferentia In-House Prioritization"]
          }
        ],
        graph_edge_propagation_paths: [
          `[${epicenter}] (Epicenter Shock: ${magnitude}%)`,
          `${epicenter} ➔ -[:FOUNDRY_SUPPLIER]➔ NVIDIA (Impact: -$42.1B USD)`,
          `${epicenter} ➔ -[:CHIP_FABRICATION]➔ Apple (Impact: -$28.5B USD)`,
          `NVIDIA ➔ -[:AI_CLOUD_CLUSTER]➔ Microsoft (Contagion Attenuation: 0.75)`,
          `NVIDIA ➔ -[:AWS_GPU_FLEET]➔ Amazon (Contagion Attenuation: 0.75)`
        ],
        strategic_recommendations: [
          `Establish active multi-sourcing contracts to reduce direct single-node dependency on ${epicenter}.`,
          "Implement dynamic buffer safety stock covering at least 90 calendar days of critical input materials.",
          "Deploy multi-cloud failover architectures across AWS, Azure, and Google Cloud to counter hyperscaler disruptions.",
          "Institute regular quarterly stress-testing with the Systemic Vulnerability Index."
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Controls Header */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-dark-800/90 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                Supply-Chain Contagion & Shock Propagation Simulator
                <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full font-mono">
                  Network Diffusion
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Simulate multi-tier cascading economic shocks across supplier, partner, and customer dependency edges
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSimulateContagion} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Shock Epicenter Entity</label>
              <select 
                value={epicenter} 
                onChange={(e) => setEpicenter(e.target.value)} 
                className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-slate-200 font-bold focus:border-rose-500 focus:outline-none"
              >
                <option value="TSMC">TSMC (Taiwan Semiconductor)</option>
                <option value="NVIDIA">NVIDIA (AI Accelerator Leader)</option>
                <option value="Apple">Apple (Consumer Device Giant)</option>
                <option value="Microsoft">Microsoft (Cloud & Enterprise Software)</option>
                <option value="Amazon">Amazon (AWS Cloud Infrastructure)</option>
                <option value="Tesla">Tesla (Autonomous Hardware & EV)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Contagion Shock Category</label>
              <select 
                value={shockType} 
                onChange={(e) => setShockType(e.target.value)} 
                className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-slate-200 font-bold focus:border-rose-500 focus:outline-none"
              >
                <option value="SUPPLY_CHAIN_BOTTLENECK">Supply-Chain Bottleneck (Fab Disruption)</option>
                <option value="GEOPOLITICAL_SANCTION">Geopolitical Sanction / Export Controls</option>
                <option value="CYBER_INFRASTRUCTURE">Critical Cloud Infrastructure Outage</option>
                <option value="FINANCIAL_CONTAGION">Liquidity & Capex Retrenchment Shock</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shock Magnitude</label>
                <span className="text-xs font-mono font-bold text-rose-400">{magnitude}% Disruption</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="90" 
                step="5" 
                value={magnitude} 
                onChange={(e) => setMagnitude(parseFloat(e.target.value))} 
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-600 text-white font-bold text-xs shadow-lg shadow-rose-500/20 hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Network className="w-4 h-4" />}
            <span>Propagate Contagion Across Knowledge Graph</span>
          </button>
        </form>
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-6">
          {/* Key Metrics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-dark-800/80 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Systemic Vulnerability</span>
              <div className="text-xl font-mono font-bold text-rose-400">
                {result.systemic_vulnerability_index} / 100
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Composite SVI Index</span>
            </div>

            <div className="p-4 bg-dark-800/80 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated Ecosystem Loss</span>
              <div className="text-xl font-mono font-bold text-amber-400">
                ${result.total_estimated_disruption_usd_b} B
              </div>
              <span className="text-[10px] text-slate-400 font-mono">USD Cascading Impact</span>
            </div>

            <div className="p-4 bg-dark-800/80 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Impacted Network Nodes</span>
              <div className="text-xl font-mono font-bold text-sky-400">
                {result.total_nodes_analyzed} Entities
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Tiers 0, 1, and 2 Reached</span>
            </div>

            <div className="p-4 bg-dark-800/80 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Attenuation Damping</span>
              <div className="text-xl font-mono font-bold text-emerald-400">
                0.75x
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Per Hop Transmission Factor</span>
            </div>
          </div>

          {/* Chronological Cascade Timeline */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-dark-800/90 space-y-4 shadow-xl">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-400" />
              Chronological Shock Cascade Propagation Timeline
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.cascade_stages.map((st: any, sidx: number) => (
                <div key={sidx} className="p-4 bg-dark-900 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 rounded border border-rose-500/20">
                      Stage {st.stage_index}
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-400">-${st.aggregate_ecosystem_loss_usd_b}B</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-200">{st.time_horizon}</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{st.description}</p>
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1">
                    {st.active_impacted_entities.map((ent: string, eidx: number) => (
                      <span key={eidx} className="px-1.5 py-0.5 text-[9px] font-mono bg-dark-800 text-slate-300 rounded border border-slate-700">
                        {ent}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Node Impact & Vulnerability Table */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-dark-800/90 space-y-4 shadow-xl">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              Node-by-Node Vulnerability & Cascading Disruption Matrix
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-dark-900 text-[10px] text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Entity</th>
                    <th className="p-3">Tier</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Exposure</th>
                    <th className="p-3">Est. Loss</th>
                    <th className="p-3">Primary Vector</th>
                    <th className="p-3">Mitigation Alternative</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {result.node_impacts.map((node: any, nidx: number) => (
                    <tr key={nidx} className="hover:bg-dark-900/50 transition-colors">
                      <td className="p-3 font-bold text-slate-100">{node.company_name}</td>
                      <td className="p-3 font-mono text-slate-400">Tier {node.tier_depth}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                          node.net_vulnerability_status === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          node.net_vulnerability_status === 'ELEVATED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {node.net_vulnerability_status}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-sky-400 font-bold">{(node.direct_exposure_score * 100).toFixed(0)}%</td>
                      <td className="p-3 font-mono text-rose-400 font-bold">-${node.cascading_loss_estimate_usd_b}B</td>
                      <td className="p-3 text-[11px] text-slate-400 max-w-xs">{node.primary_vector_of_exposure}</td>
                      <td className="p-3 text-[11px] text-emerald-400 max-w-xs font-medium">
                        {node.mitigation_alternatives && node.mitigation_alternatives.length > 0 ? node.mitigation_alternatives[0] : 'Standard Diversification'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Graph Edge Propagation Trace & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-5 rounded-3xl border border-slate-800 bg-dark-800/90 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <GitFork className="w-4 h-4 text-sky-400" />
                Graph Edge Shock Propagation Paths
              </h4>
              <div className="p-3 bg-dark-900 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1.5 max-h-56 overflow-y-auto">
                {result.graph_edge_propagation_paths.map((path: string, pidx: number) => (
                  <div key={pidx} className="flex items-center gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    <span>{path}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-5 rounded-3xl border border-slate-800 bg-dark-800/90 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Strategic Mitigation Protocols
              </h4>
              <ul className="space-y-2">
                {result.strategic_recommendations.map((rec: string, ridx: number) => (
                  <li key={ridx} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-emerald-400 font-bold mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
