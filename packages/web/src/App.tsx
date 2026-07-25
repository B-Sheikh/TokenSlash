import React, { useState } from 'react';
import { PromptInput } from './components/PromptInput';
import { ReportView, type FinalReport } from './components/ReportView';
import { CostComparisonTable } from './components/CostComparisonTable';
import mockData from './mocks/mockFinalReport.json';
import { Zap, Terminal, Cpu, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [report, setReport] = useState<FinalReport>(mockData as unknown as FinalReport);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyze = async (promptText: string, userId: string) => {
    setIsLoading(true);
    setErrorMsg(null);

    if (isDemoMode) {
      // Simulate 700ms multi-tool agentic execution delay
      setTimeout(() => {
        const charCount = promptText.trim().length;
        const estTokens = Math.ceil(charCount / 4);
        const savedTokens = Math.max(1, Math.floor(estTokens * 0.38));
        const newTokens = estTokens - savedTokens;
        const savingsPct = Math.round((savedTokens / estTokens) * 100);

        const updatedReport: FinalReport = {
          ...mockData,
          originalPrompt: promptText,
          optimizedPrompt: promptText.replace(/please|kindly|thank you|very carefully|in advance|so much/gi, '').trim(),
          tokenCount: estTokens,
          tokenSavingsPercent: savingsPct,
          userPatternSummary: `User Profile (${userId}): 142 prompts in the last 30 days. High routing optimization potential detected.`,
          generatedAt: new Date().toISOString(),
          costComparison: {
            ...mockData.costComparison,
            currentCostPerRequest: estTokens * 0.0000075,
            recommendedCostPerRequest: newTokens * 0.0000012,
            savingsPercent: Math.min(88, savingsPct + 45),
          },
        };
        setReport(updatedReport);
        setIsLoading(false);
      }, 700);
    } else {
      // Live API Seam
      try {
        const response = await fetch('http://localhost:3000/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: promptText, userId }),
        });
        if (!response.ok) throw new Error(`Server returned HTTP ${response.status}`);
        const data = await response.json();
        setReport(data.finalReport || data);
      } catch (err) {
        console.warn('Live API unreachable, degrading gracefully to snapshot mode:', err);
        setErrorMsg('Live backend unreachable at localhost:3000. Displaying simulated offline snapshot.');
        // Degrade cleanly without crashing
        setTimeout(() => setIsLoading(false), 500);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '64px' }}>
      {/* Navbar / Header */}
      <header
        className="flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          padding: '24px 0',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '32px',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--gradient-hero)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)',
            }}
          >
            <Zap size={24} color="#fff" fill="currentColor" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 style={{ fontSize: '26px', letterSpacing: '-0.03em' }}>TokenSlash</h1>
              <span className="badge badge-cyan" style={{ fontSize: '11px', padding: '2px 8px' }}>
                v0.1.0-beta
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              15-Hour War Room • Agentic Prompt Cost & Token Waste Optimizer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1"><Terminal size={14} color="var(--accent-cyan)" /> Member A</span>
            <span style={{ color: 'var(--border-medium)' }}>/</span>
            <span className="flex items-center gap-1"><Cpu size={14} color="var(--accent-purple)" /> Member B</span>
            <span style={{ color: 'var(--border-medium)' }}>/</span>
            <span className="flex items-center gap-1"><ShieldCheck size={14} color="#34d399" /> Member C & D</span>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '13px', borderRadius: '8px' }}
          >
            <Terminal size={16} /> Repo
          </a>
        </div>
      </header>

      {/* Optional Error Notice */}
      {errorMsg && (
        <div
          className="glass-card animate-fade-in"
          style={{
            padding: '12px 20px',
            marginBottom: '20px',
            background: 'rgba(244, 63, 94, 0.1)',
            borderColor: 'rgba(244, 63, 94, 0.4)',
            color: '#fda4af',
            fontSize: '13px',
          }}
        >
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Main Form Area */}
      <main>
        <PromptInput
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          isDemoMode={isDemoMode}
          onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
        />

        {/* Dynamic Report View */}
        <section style={{ marginTop: '16px' }}>
          <ReportView report={report} />
          <CostComparisonTable
            costComparison={report.costComparison}
            monthlySavings={report.monthlySavings}
            monthlyPromptVolume={report.monthlyPromptVolume}
          />
        </section>
      </main>

      {/* Footer */}
      <footer
        className="flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          marginTop: '64px',
          paddingTop: '32px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '13px',
          color: 'var(--text-dim)',
        }}
      >
        <div>
          Built with <strong>NitroStack</strong> (@Tool decorators, Zod schemas, React SDK) • 15-Hour Hackathon Execution Blueprint.
        </div>
        <div className="flex items-center gap-4">
          <span>Checkpoint 3: H13:00 Feature Freeze</span>
          <span>•</span>
          <span style={{ color: '#34d399' }}>● System Online</span>
        </div>
      </footer>
    </div>
  );
};
