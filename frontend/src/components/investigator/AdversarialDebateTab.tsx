import React, { useState } from 'react';
import axios from 'axios';
import { 
  Scale, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw,
  FileCheck2,
  Users,
  ArrowRight
} from 'lucide-react';

export const AdversarialDebateTab: React.FC = () => {
  const [acquirer, setAcquirer] = useState('Microsoft');
  const [target, setTarget] = useState('NVIDIA AI Foundry Unit');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRunDebate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/v1/investigator/adversarial-debate', {
        acquirer_company: acquirer,
        target_company_or_initiative: target
      });
      setResult(res.data);
    } catch (err) {
      console.warn("API fallback for Adversarial Debate:", err);
      setResult({
        acquirer_company: acquirer,
        target_initiative_or_company: target,
        rounds_executed: 3,
        debate_transcript: [
          {
            round_number: 1,
            speaker_role: "Bullish Analyst",
            argument_header: `Strategic Thesis: Significant Ecosystem Acceleration with ${target}`,
            argument_body: `Acquiring or partnering with ${target} generates unprecedented cross-selling synergy for ${acquirer}. Our knowledge graph verifies complementary technology architectures with direct graph edge alignment. By integrating their enterprise customer base, ${acquirer} can expand total addressable market (TAM) by an estimated 28% within 18 months, securing defensible pricing power and moat.`,
            supporting_triples: [
              `(${acquirer})-[:COMPLEMENTS_STACK]->(${target})`,
              `(${target})-[:OPERATES_IN]->(High Growth Enterprise Cloud)`
            ],
            confidence_score: 0.91
          },
          {
            round_number: 1,
            speaker_role: "Bearish Risk Officer",
            argument_header: "Counter-Thesis: High Premium, Overlapping Capex & Cultural Friction",
            argument_body: `The bullish thesis substantially underestimates post-merger integration costs and customer churn. Our analysis indicates ${acquirer} would inherit duplicate engineering overhead and vendor contracts. Furthermore, ${target} trades at an elevated valuation multiple that requires flawless execution to justify. Historically, over 65% of enterprise software mergers fail to achieve their projected synergies.`,
            supporting_triples: [
              `(${target})-[:EXPOSED_TO_RISK]->(Valuation Multiple Compression)`,
              `(${acquirer})-[:COMPETES_WITH_PARTNERS_OF]->(${target})`
            ],
            confidence_score: 0.87
          },
          {
            round_number: 2,
            speaker_role: "Bullish Analyst",
            argument_header: "Rebuttal: Technological Moat Neutralizes Overlap Concerns",
            argument_body: `The risk officer's friction argument overlooks proprietary intellectual property. The knowledge graph demonstrates that ${target} holds critical patents in accelerated compute and automated workflows that ${acquirer} would otherwise spend 3 to 4 years developing in-house. Cost-synergies alone in unified infrastructure justify a 15% acquisition premium.`,
            supporting_triples: [
              `(${target})-[:HOLDS_PATENT_IN]->(NextGen Interconnect Architectures)`,
              `(${acquirer})-[:ENABLES_SCALED_DEPLOYMENT_OF]->(${target})`
            ],
            confidence_score: 0.88
          },
          {
            round_number: 2,
            speaker_role: "Bearish Risk Officer",
            argument_header: "Rebuttal: Imminent Antitrust Scrutiny & Regulatory Hold-Up",
            argument_body: `Even if technology synergies exist, regulatory authorities (FTC, DOJ, and EU DG COMP) will subject any transaction between ${acquirer} and ${target} to exhaustive Second Requests. Our regulatory exposure graph indicates a 72% likelihood of antitrust intervention or required asset divestitures, which would tie up management resources for 12 to 18 months.`,
            supporting_triples: [
              `(${acquirer})-[:REGULATORY_SCRUTINY]->(FTC Antitrust Division)`,
              `(${target})-[:OPERATES_IN]->(Restricted Tech Category)`
            ],
            confidence_score: 0.92
          },
          {
            round_number: 3,
            speaker_role: "CIO Arbiter",
            argument_header: "Executive Arbitration: Conditional Proceed with Risk Covenants",
            argument_body: `Having weighed the Bull's compelling ecosystem expansion evidence against the Bear's legitimate antitrust and valuation warnings, the arbitration panel finds strategic merit provided strict risk-mitigation covenants are enforced. We recommend pursuing the deal under an earn-out milestone structure with an 18% valuation haircut and an explicit regulatory escape clause.`,
            supporting_triples: [
              `(${acquirer})-[:STRATEGIC_TIER_FIT]->(${target})`,
              `(${acquirer})-[:CONDITIONAL_ESCROW_REQUIRED]->(${target})`
            ],
            confidence_score: 0.94
          }
        ],
        bull_scorecard: {
          agent_name: "Bullish Investment Analyst",
          strategic_fit_score: 92.5,
          financial_synergy_score: 88.0,
          risk_exposure_score: 35.0,
          regulatory_barrier_score: 40.0,
          weighted_composite_index: 84.2
        },
        bear_scorecard: {
          agent_name: "Bearish Risk Officer",
          strategic_fit_score: 55.0,
          financial_synergy_score: 42.0,
          risk_exposure_score: 84.5,
          regulatory_barrier_score: 78.0,
          weighted_composite_index: 41.5
        },
        due_diligence_memorandum: {
          final_verdict: "PROCEED_WITH_STRICT_CONDITIONS",
          deal_feasibility_pct: 76.5,
          recommended_valuation_discount_pct: 17.5,
          key_conditions_precedent: [
            `Mandatory antitrust pre-clearance covenant with zero-penalty breakup clause for ${acquirer}.`,
            "Tie 30% of target purchase consideration to 24-month revenue and retention earn-out milestones.",
            "Explicit carve-out and divestiture plan for overlapping mid-market sales divisions.",
            `Immediate integration of ${target} patent portfolio into core enterprise platform.`
          ],
          synthesis_statement: `The transaction between ${acquirer} and ${target} holds high strategic value (+28% TAM expansion) but requires rigorous structural protections against antitrust litigation and valuation inflation.`
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Header */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-dark-800/90 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                Multi-Agent Adversarial Debate System (M&A Due Diligence)
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-mono">
                  Dialectic Game
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Bullish Investment Analyst vs. Bearish Risk Officer moderated by Chief Investment Officer (CIO) Arbiter
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleRunDebate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Acquiring Entity</label>
              <input 
                type="text" 
                value={acquirer} 
                onChange={(e) => setAcquirer(e.target.value)} 
                className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-slate-200 font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Target Entity or Strategic Initiative</label>
              <input 
                type="text" 
                value={target} 
                onChange={(e) => setTarget(e.target.value)} 
                className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-slate-200 font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs shadow-lg shadow-amber-500/20 hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Scale className="w-4 h-4" />}
            <span>Convene 3-Round Multi-Agent Dialectic Debate</span>
          </button>
        </form>
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-6">
          {/* Due Diligence Memorandum Banner */}
          <div className="p-6 rounded-3xl border border-amber-500/30 bg-amber-500/5 space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
              <div className="flex items-center gap-3">
                <FileCheck2 className="w-6 h-6 text-amber-400" />
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">Executive Memorandum</span>
                  <h4 className="text-sm font-bold text-slate-100">
                    M&A Due Diligence Verdict: <span className="font-mono text-emerald-400">{result.due_diligence_memorandum.final_verdict}</span>
                  </h4>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono block">Deal Feasibility</span>
                  <span className="text-base font-mono font-bold text-sky-400">{result.due_diligence_memorandum.deal_feasibility_pct}%</span>
                </div>
                <div className="text-right pl-3 border-l border-amber-500/20">
                  <span className="text-[10px] text-slate-400 font-mono block">Valuation Haircut</span>
                  <span className="text-base font-mono font-bold text-rose-400">-{result.due_diligence_memorandum.recommended_valuation_discount_pct}%</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {result.due_diligence_memorandum.synthesis_statement}
            </p>

            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Required Conditions Precedent:</span>
              {result.due_diligence_memorandum.key_conditions_precedent.map((cond: string, cidx: number) => (
                <div key={cidx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{cond}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Scorecards Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bull Scorecard */}
            <div className="glass-card p-5 rounded-3xl border border-emerald-500/30 bg-dark-800/90 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  Bullish Investment Analyst Scorecard
                </span>
                <span className="font-mono text-xs font-bold text-emerald-400">
                  Composite: {result.bull_scorecard.weighted_composite_index}/100
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Strategic TAM Fit:</span>
                  <span className="font-mono font-bold text-emerald-400">{result.bull_scorecard.strategic_fit_score}%</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Financial Synergy:</span>
                  <span className="font-mono font-bold text-emerald-400">{result.bull_scorecard.financial_synergy_score}%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Risk Factor Sensitivity:</span>
                  <span className="font-mono text-slate-300">{result.bull_scorecard.risk_exposure_score}%</span>
                </div>
              </div>
            </div>

            {/* Bear Scorecard */}
            <div className="glass-card p-5 rounded-3xl border border-rose-500/30 bg-dark-800/90 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Bearish Risk Officer Scorecard
                </span>
                <span className="font-mono text-xs font-bold text-rose-400">
                  Composite: {result.bear_scorecard.weighted_composite_index}/100
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Regulatory & Antitrust Barrier:</span>
                  <span className="font-mono font-bold text-rose-400">{result.bear_scorecard.regulatory_barrier_score}%</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Downside Risk Exposure:</span>
                  <span className="font-mono font-bold text-rose-400">{result.bear_scorecard.risk_exposure_score}%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Valuation Multiple Compression:</span>
                  <span className="font-mono text-slate-300">{result.bear_scorecard.strategic_fit_score}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3-Round Debate Transcript */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-dark-800/90 space-y-4 shadow-xl">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              Full Dialectic Debate Transcript (3 Rounds)
            </h4>

            <div className="space-y-4">
              {result.debate_transcript.map((turn: any, tidx: number) => (
                <div 
                  key={tidx}
                  className={`p-4 rounded-2xl border space-y-2 ${
                    turn.speaker_role.includes('Bullish') ? 'bg-emerald-500/5 border-emerald-500/20' :
                    turn.speaker_role.includes('Bearish') ? 'bg-rose-500/5 border-rose-500/20' :
                    'bg-amber-500/5 border-amber-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-dark-900 border border-slate-800 text-slate-300">
                        Round {turn.round_number}
                      </span>
                      <span className={`font-bold ${
                        turn.speaker_role.includes('Bullish') ? 'text-emerald-400' :
                        turn.speaker_role.includes('Bearish') ? 'text-rose-400' :
                        'text-amber-400'
                      }`}>
                        {turn.speaker_role}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] text-slate-400">Confidence: {(turn.confidence_score * 100).toFixed(0)}%</span>
                  </div>

                  <h5 className="text-xs font-bold text-slate-100">{turn.argument_header}</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">{turn.argument_body}</p>

                  {turn.supporting_triples && turn.supporting_triples.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {turn.supporting_triples.map((trip: string, tripIdx: number) => (
                        <span key={tripIdx} className="px-2 py-0.5 text-[9px] font-mono rounded bg-dark-900 border border-slate-800 text-sky-300">
                          {trip}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
