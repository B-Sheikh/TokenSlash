import React from 'react';
import { DollarSign, TrendingDown, Award, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CostComparison {
  currentModel: string;
  recommendedModel: string;
  currentCostPerRequest: number;
  recommendedCostPerRequest: number;
  currentMonthlyCost: number;
  recommendedMonthlyCost: number;
  savingsPercent: number;
}

interface CostComparisonTableProps {
  costComparison: CostComparison;
  monthlySavings: number;
  monthlyPromptVolume: number;
}

export const CostComparisonTable: React.FC<CostComparisonTableProps> = ({
  costComparison,
  monthlySavings,
  monthlyPromptVolume,
}) => {
  const chartData = [
    {
      name: costComparison.currentModel,
      cost: costComparison.currentMonthlyCost,
      color: '#ef4444',
      label: 'Current Spend',
    },
    {
      name: costComparison.recommendedModel,
      cost: costComparison.recommendedMonthlyCost,
      color: '#10b981',
      label: 'Optimized Spend',
    },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in" style={{ marginTop: '32px' }}>
      {/* Huge Glowing Hero Stat Banner */}
      <div
        className="glass-card flex flex-col md:flex-row items-center justify-between gap-6"
        style={{
          padding: '36px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(0, 242, 254, 0.1) 100%)',
          borderColor: 'rgba(16, 185, 129, 0.4)',
          boxShadow: '0 0 40px rgba(16, 185, 129, 0.2)',
        }}
      >
        <div className="flex items-center gap-4">
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'var(--gradient-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
            }}
          >
            <DollarSign size={36} color="#fff" />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              Member History Analysis Projection
            </span>
            <h2 style={{ fontSize: '38px', lineHeight: '1.1', color: '#fff' }}>
              ${monthlySavings.toFixed(2)} <span style={{ fontSize: '20px', color: 'var(--text-muted)', fontWeight: 500 }}>/ month saved</span>
            </h2>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1">
          <div className="badge badge-emerald" style={{ fontSize: '14px', padding: '6px 16px', background: 'rgba(16, 185, 129, 0.2)' }}>
            <TrendingDown size={16} /> {costComparison.savingsPercent}% Total Spend Reduction
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Based on your mock volume of <strong>{monthlyPromptVolume} prompts/mo</strong>
          </span>
        </div>
      </div>

      {/* Table and Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown Table */}
        <div className="glass-card flex flex-col justify-between" style={{ padding: '28px' }}>
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: '20px', color: '#fff' }}>
              <Award size={20} style={{ color: 'var(--accent-cyan)' }} />
              <h3 style={{ fontSize: '20px' }}>Direct Pricing Comparison</h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 8px' }}>Metric</th>
                    <th style={{ padding: '12px 8px' }}>{costComparison.currentModel}</th>
                    <th style={{ padding: '12px 8px', color: 'var(--accent-cyan)' }}>{costComparison.recommendedModel}</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Delta</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '16px 8px', fontWeight: 600, color: '#fff' }}>Per-Request Cost</td>
                    <td style={{ padding: '16px 8px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                      ${costComparison.currentCostPerRequest.toFixed(6)}
                    </td>
                    <td style={{ padding: '16px 8px', color: '#34d399', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                      ${costComparison.recommendedCostPerRequest.toFixed(6)}
                    </td>
                    <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                      <span className="badge badge-emerald">-{costComparison.savingsPercent}%</span>
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '16px 8px', fontWeight: 600, color: '#fff' }}>Projected Monthly Spend</td>
                    <td style={{ padding: '16px 8px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                      ${costComparison.currentMonthlyCost.toFixed(4)}
                    </td>
                    <td style={{ padding: '16px 8px', color: '#34d399', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                      ${costComparison.recommendedMonthlyCost.toFixed(4)}
                    </td>
                    <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                      <span className="badge badge-emerald">-${monthlySavings.toFixed(2)}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '16px 8px', fontWeight: 600, color: '#fff' }}>Annualized Savings</td>
                    <td style={{ padding: '16px 8px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                      ${(costComparison.currentMonthlyCost * 12).toFixed(2)}
                    </td>
                    <td style={{ padding: '16px 8px', color: '#34d399', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                      ${(costComparison.recommendedMonthlyCost * 12).toFixed(2)}
                    </td>
                    <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                      <span className="badge badge-cyan">${(monthlySavings * 12).toFixed(2)} / yr</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', fontSize: '12px', color: 'var(--text-dim)' }}>
            * Pricing data sourced from official OpenAI / Anthropic API tables as of Checkpoint 1.
          </div>
        </div>

        {/* Visual Recharts Bar Chart */}
        <div className="glass-card flex flex-col justify-between" style={{ padding: '28px' }}>
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
              <div className="flex items-center gap-2" style={{ color: '#fff' }}>
                <BarChart3 size={20} style={{ color: 'var(--accent-purple)' }} />
                <h3 style={{ fontSize: '20px' }}>Monthly Spend Visualizer ($)</h3>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Lower is better</span>
            </div>

            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderColor: 'var(--border-medium)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '13px',
                    }}
                    formatter={(val: unknown) => [`$${Number(val).toFixed(4)}`, 'Monthly Cost']}
                  />
                  <Bar dataKey="cost" radius={[8, 8, 0, 0]} barSize={50}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Visual Reduction:</span>
            <strong style={{ color: '#34d399', fontSize: '15px' }}>
              {costComparison.savingsPercent}% drop in monthly API overhead
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
