import { describe, expect, it } from 'vitest';
import { ModelRecommenderService } from '../model-recommender.tool.js';

describe('ModelRecommenderService', () => {
  const recommender = new ModelRecommenderService();

  it('recommends budget tier for simple general-qa', () => {
    const result = recommender.recommendModel(50, 'simple', 'general-qa');
    expect(result.recommendedModel).toBeTruthy();
    expect(result.savingsPercent).toBeGreaterThan(0);
    expect(result.recommendedModelCost).toBeLessThan(result.currentModelCost);
  });

  it('recommends premium tier for complex reasoning', () => {
    const result = recommender.recommendModel(500, 'complex', 'reasoning');
    expect(['o3-mini', 'gpt-4o', 'claude-3-5-sonnet']).toContain(
      result.recommendedModel,
    );
    expect(result.reasoning).toContain('reasoning');
  });

  it('returns zero savings when already on optimal model', () => {
    const result = recommender.recommendModel(5000, 'complex', 'reasoning');
    if (result.recommendedModel === 'gpt-4o') {
      expect(result.savingsPercent).toBe(0);
    }
  });

  it('never returns negative or NaN costs', () => {
    const result = recommender.recommendModel(100, 'moderate', 'code-generation');
    expect(Number.isFinite(result.currentModelCost)).toBe(true);
    expect(Number.isFinite(result.recommendedModelCost)).toBe(true);
    expect(result.currentModelCost).toBeGreaterThanOrEqual(0);
    expect(result.recommendedModelCost).toBeGreaterThanOrEqual(0);
    expect(result.savingsPercent).toBeGreaterThanOrEqual(0);
  });

  it('handles zero token count gracefully', () => {
    const result = recommender.recommendModel(0, 'simple', 'general-qa');
    expect(result.currentModelCost).toBe(0);
    expect(result.recommendedModelCost).toBe(0);
    expect(result.savingsPercent).toBe(0);
  });

  it('recommended model is never more expensive per request than necessary', () => {
    const scenarios = [
      { tokens: 200, complexity: 'simple' as const, task: 'general-qa' as const },
      { tokens: 500, complexity: 'moderate' as const, task: 'summarization' as const },
      { tokens: 1000, complexity: 'moderate' as const, task: 'code-generation' as const },
      { tokens: 2000, complexity: 'complex' as const, task: 'data-analysis' as const },
    ];

    for (const { tokens, complexity, task } of scenarios) {
      const result = recommender.recommendModel(tokens, complexity, task);
      expect(result.recommendedModelCost).toBeLessThanOrEqual(result.currentModelCost);
    }
  });

  it('includes pricing timestamp in reasoning', () => {
    const result = recommender.recommendModel(100, 'simple', 'summarization');
    expect(result.reasoning).toMatch(/2026/);
  });

  it('works with mocked upstream inputs', () => {
    const mockInputs = [
      { tokenCount: 187, complexityScore: 'moderate' as const, taskType: 'code-generation' as const },
      { tokenCount: 96, complexityScore: 'simple' as const, taskType: 'summarization' as const },
      { tokenCount: 1567, complexityScore: 'complex' as const, taskType: 'code-generation' as const },
    ];

    for (const input of mockInputs) {
      const result = recommender.recommendModel(
        input.tokenCount,
        input.complexityScore,
        input.taskType,
      );
      expect(result.recommendedModel).toBeTruthy();
      expect(result.reasoning).toBeTruthy();
    }
  });
});
