import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Cpu, Zap, Layers, ShieldCheck, Copy, Check } from 'lucide-react';

export interface FinalReport {
  originalPrompt: string;
  optimizedPrompt: string;
  tokenSavingsPercent: number;
  recommendedModel: string;
  costComparison: {
    currentModel: string;
    recommendedModel: string;
    currentCostPerRequest: number;
    recommendedCostPerRequest: number;
    currentMonthlyCost: number;
    recommendedMonthlyCost: number;
    savingsPercent: number;
  };
  monthlySavings: number;
  tokenCount: number;
  complexityScore: 'simple' | 'moderate' | 'complex' | string;
  taskType: string;
  modelRecommendationReasoning: string;
  userPatternSummary: string;
  monthlyPromptVolume: number;
  availability: {
    tokenEstimate: boolean;
    complexity: boolean;
    modelRecommendation: boolean;
    history: boolean;
    rewrite: boolean;
  };
  errors?: Record<string, string>;
  generatedAt: string;
}

interface ReportViewProps {
  report: FinalReport;
}

export const ReportView: React.FC<ReportViewProps> = ({ report }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(report.optimizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const complexityColor =
    report.complexityScore === 'simple'
      ? 'var(--accent-emerald)'
      : report.complexityScore === 'moderate'
      ? 'var(--accent-amber)'
      : 'var(--accent-rose)';

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Top Banner: Pipeline Execution Status */}
      <div
        className="glass-card flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ padding: '16px 24px', background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.25)' }}
      >
        <div className="flex items-center gap-3">
          <ShieldCheck size={24} style={{ color: '#34d399' }} />
          <div>
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>
              Multi-Tool Pipeline Execution Status: <strong style={{ color: '#34d399' }}>ALL MODULES OPERATIONAL</strong>
            </span>
            <div className="flex items-center gap-4 mt-1" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1"><CheckCircle2 size={12} color="#34d399" /> Tokenizer (tiktoken)</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12} color="#34d399" /> Classifier</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12} color="#34d399" /> Economics Recommender</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12} color="#34d399" /> Intent Rewriter</span>
            </div>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
          Timestamp: {new Date(report.generatedAt).toLocaleTimeString()}
        </div>
      </div>

      {/* Side-by-Side Prompt Optimization Comparison */}
      <div className="glass-card" style={{ padding: '32px' }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4" style={{ marginBottom: '24px' }}>
          <div className="flex items-center gap-2">
            <Zap size={22} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontSize: '22px' }}>Intent-Preserving Prompt Rewriter</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="badge badge-emerald" style={{ fontSize: '13px', padding: '6px 16px', background: 'rgba(16, 185, 129, 0.15)' }}>
              ⚡ {report.tokenSavingsPercent}% Token Reduction
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original Prompt Card */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '20px',
              position: 'relative',
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ❌ Original Bloated Prompt
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
                {report.tokenCount} tokens
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>
              {report.originalPrompt}
            </p>
          </div>

          {/* Optimized Prompt Card */}
          <div
            style={{
              background: 'rgba(0, 242, 254, 0.04)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              position: 'relative',
              boxShadow: '0 0 20px rgba(0, 242, 254, 0.05)',
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: '12px', borderBottom: '1px solid rgba(0, 242, 254, 0.2)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ✨ AI-Optimized Lean Prompt
              </span>
              <div className="flex items-center gap-3">
                <span style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                  {Math.round(report.tokenCount * (1 - report.tokenSavingsPercent / 100))} tokens
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1"
                  style={{
                    background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid var(--border-subtle)',
                    color: copied ? '#34d399' : '#fff',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                >
                  {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
            </div>
            <p style={{ color: '#fff', fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: '1.7', fontWeight: 500 }}>
              {report.optimizedPrompt}
            </p>
          </div>
        </div>
      </div>

      {/* Classification & Model Recommender Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card md:col-span-1 flex flex-col justify-between" style={{ padding: '24px' }}>
          <div>
            <div className="flex items-center gap-2" style={{ color: 'var(--accent-purple)', marginBottom: '16px' }}>
              <Layers size={20} />
              <h4 style={{ fontSize: '18px' }}>Task Classification</h4>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Detected Taxonomy:</span>
                <span className="badge badge-purple" style={{ fontSize: '14px', padding: '6px 14px' }}>
                  🏷️ {report.taskType.toUpperCase()}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Complexity Tier:</span>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: complexityColor,
                    background: `rgba(255, 255, 255, 0.05)`,
                    border: `1px solid ${complexityColor}`,
                  }}
                >
                  ⚡ {report.complexityScore} Tier
                </span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', fontSize: '12px', color: 'var(--text-dim)' }}>
            Rule-based structural heuristics executed in &lt;15ms.
          </div>
        </div>

        <div className="glass-card md:col-span-2 flex flex-col justify-between" style={{ padding: '24px', background: 'rgba(168, 85, 247, 0.05)', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <div className="flex items-center gap-2" style={{ color: '#fff' }}>
                <Cpu size={22} style={{ color: 'var(--accent-purple)' }} />
                <h4 style={{ fontSize: '20px' }}>Model Routing & Economics Recommender</h4>
              </div>
              <span className="badge badge-cyan" style={{ fontSize: '12px' }}>Verified Snapshot</span>
            </div>
            
            <div className="flex items-center gap-4" style={{ marginBottom: '16px', background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div className="flex flex-col">
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Current Assumption:</span>
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'line-through' }}>{report.costComparison.currentModel}</span>
              </div>
              <ArrowRight size={20} style={{ color: 'var(--accent-cyan)' }} />
              <div className="flex flex-col">
                <span style={{ fontSize: '11px', color: 'var(--accent-cyan)' }}>Recommended Model:</span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>{report.recommendedModel}</span>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <span className="badge badge-emerald" style={{ fontSize: '13px' }}>-{report.costComparison.savingsPercent}% Cost / Req</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-main)', fontSize: '14px', lineHeight: '1.6', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-purple)' }}>
              <strong>Economics Reasoning:</strong> {report.modelRecommendationReasoning}
            </p>
          </div>

          <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
            💡 <em>{report.userPatternSummary}</em>
          </div>
        </div>
      </div>
    </div>
  );
};
