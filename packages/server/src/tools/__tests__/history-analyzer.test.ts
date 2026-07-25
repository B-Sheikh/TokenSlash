import { describe, expect, it } from 'vitest';
import { HistoryAnalyzerService } from '../history-analyzer.tool.js';
import { ModelRecommenderService } from '../model-recommender.tool.js';

describe('HistoryAnalyzerService', () => {
  const recommender = new ModelRecommenderService();
  const analyzer = new HistoryAnalyzerService(recommender);

  it('returns insights for demo-user', () => {
    const result = analyzer.analyzeHistory('demo-user', 'test prompt');
    expect(result.monthlyPromptVolume).toBeGreaterThan(0);
    expect(result.projectedMonthlySavings).toBeGreaterThan(0);
    expect(result.userPatternSummary).toContain('Demo Developer');
  });

  it('returns insights for power-user with higher volume', () => {
    const demo = analyzer.analyzeHistory('demo-user', '');
    const power = analyzer.analyzeHistory('power-user', '');

    expect(power.monthlyPromptVolume).toBeGreaterThan(demo.monthlyPromptVolume);
    expect(power.projectedMonthlySavings).toBeGreaterThan(0);
    expect(power.userPatternSummary).toContain('summarization');
  });

  it('falls back to default profile for unknown userId', () => {
    const result = analyzer.analyzeHistory('unknown-user-xyz', 'hello');
    expect(result.monthlyPromptVolume).toBe(75);
    expect(result.projectedMonthlySavings).toBeGreaterThanOrEqual(0);
    expect(result.userPatternSummary).toContain('Unknown user');
  });

  it('never returns negative savings', () => {
    const users = ['demo-user', 'power-user', 'startup-founder', 'nonexistent'];
    for (const userId of users) {
      const result = analyzer.analyzeHistory(userId, 'test');
      expect(result.projectedMonthlySavings).toBeGreaterThanOrEqual(0);
      expect(result.projectedMonthlySavings).toBeLessThan(500);
    }
  });

  it('returns plausible monthly volume for startup-founder', () => {
    const result = analyzer.analyzeHistory('startup-founder', '');
    expect(result.monthlyPromptVolume).toBeGreaterThan(0);
    expect(result.monthlyPromptVolume).toBeLessThan(100);
    expect(result.userPatternSummary).toBeTruthy();
  });

  it('includes over-provisioning percentage in summary', () => {
    const result = analyzer.analyzeHistory('demo-user', '');
    expect(result.userPatternSummary).toMatch(/\d+%/);
  });
});
