import React, { useState } from 'react';
import { Sparkles, Play, Terminal, FileText, Database } from 'lucide-react';

interface PromptInputProps {
  onAnalyze: (promptText: string, userId: string) => void;
  isLoading: boolean;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
}

const SAMPLE_PROMPTS = [
  {
    title: 'Bloated Code Generation',
    icon: <Terminal size={16} />,
    badge: 'Code QA',
    text: 'Please kindly I would like you to write a Python function that sorts a list in ascending order. Make sure it is clean and handles edge cases properly, thank you so much in advance!',
  },
  {
    title: 'Verbose Data Analysis',
    icon: <Database size={16} />,
    badge: 'Analytics',
    text: 'I have a huge dataset in CSV format with columns: id, name, revenue, and churn_date. Can you please carefully analyze this and give me a complete step-by-step breakdown of how I can calculate monthly churn rate using pandas, without omitting any code details?',
  },
  {
    title: 'Repetitive Summarization',
    icon: <FileText size={16} />,
    badge: 'Summary',
    text: 'Please read the following text very carefully and summarize all the main points in a concise bulleted list format. Make sure not to include any unnecessary filler or extra conversational introductory remarks, just give me the bullet points directly.',
  },
];

export const PromptInput: React.FC<PromptInputProps> = ({
  onAnalyze,
  isLoading,
  isDemoMode,
  onToggleDemoMode,
}) => {
  const [promptText, setPromptText] = useState(SAMPLE_PROMPTS[0].text);
  const [userId, setUserId] = useState('demo-user-abhishek');

  const estimatedTokens = Math.ceil(promptText.trim().length / 4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    onAnalyze(promptText, userId);
  };

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '32px', marginBottom: '32px' }}>
      {/* Header & Mode Toggle */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4" style={{ marginBottom: '24px' }}>
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={22} style={{ color: 'var(--accent-cyan)' }} />
            <h2 style={{ fontSize: '24px' }}>AI Prompt Optimization Engine</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Multi-tool agentic pipeline running Token Estimator, Complexity Classifier, and Recommender in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3" style={{ background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '999px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Execution Mode:</span>
          <button
            type="button"
            onClick={onToggleDemoMode}
            style={{
              background: isDemoMode ? 'var(--gradient-hero)' : 'transparent',
              color: isDemoMode ? '#fff' : 'var(--text-muted)',
              border: isDemoMode ? 'none' : '1px solid var(--border-subtle)',
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            {isDemoMode ? '⚡ Demo Snapshot' : '🌐 Live Backend Seam'}
          </button>
        </div>
      </div>

      {/* Sample Prompt Presets */}
      <div style={{ marginBottom: '20px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
          Sample War-Room Presets:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3" style={{ marginTop: '8px' }}>
          {SAMPLE_PROMPTS.map((sample, idx) => (
            <div
              key={idx}
              onClick={() => setPromptText(sample.text)}
              className="glass-card glass-card-interactive flex flex-col justify-between"
              style={{ padding: '14px', background: promptText === sample.text ? 'rgba(0, 242, 254, 0.08)' : 'rgba(255, 255, 255, 0.02)', borderColor: promptText === sample.text ? 'var(--accent-cyan)' : 'var(--border-subtle)' }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
                <div className="flex items-center gap-2" style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>
                  <span style={{ color: 'var(--accent-cyan)' }}>{sample.icon}</span>
                  {sample.title}
                </div>
                <span className="badge badge-cyan" style={{ fontSize: '10px', padding: '2px 8px' }}>{sample.badge}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {sample.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div style={{ position: 'relative' }}>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Paste your raw AI prompt here to analyze token bloat, classify task complexity, and calculate model savings..."
            rows={5}
            style={{
              width: '100%',
              background: 'var(--bg-surface)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-medium)',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '15px',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              resize: 'vertical',
              transition: 'border-color 150ms ease, box-shadow 150ms ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-cyan)';
              e.target.style.boxShadow = '0 0 15px rgba(0, 242, 254, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-medium)';
              e.target.style.boxShadow = 'none';
            }}
          />
          <div
            className="flex items-center gap-3"
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '16px',
              background: 'rgba(14, 18, 26, 0.85)',
              padding: '4px 12px',
              borderRadius: '999px',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              color: 'var(--text-muted)',
            }}
          >
            <span>Characters: <strong style={{ color: '#fff' }}>{promptText.length}</strong></span>
            <span>•</span>
            <span>Est. Tokens: <strong style={{ color: 'var(--accent-cyan)' }}>~{estimatedTokens}</strong></span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4" style={{ marginTop: '4px' }}>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>User Profile ID:</span>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.4)',
                color: 'var(--accent-purple)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: 600,
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !promptText.trim()}
            className={`btn btn-primary ${isLoading ? 'animate-pulse-glow' : ''}`}
            style={{
              padding: '14px 32px',
              fontSize: '16px',
              opacity: isLoading || !promptText.trim() ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                Running Agentic Pipeline...
              </>
            ) : (
              <>
                <Play size={18} fill="currentColor" />
                Analyze & Optimize Prompt
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
