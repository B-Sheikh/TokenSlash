export type CapabilityTier = 'light' | 'standard' | 'advanced' | 'reasoning';

export interface TokenCount {
  inputTokens: number;
  outputTokens: number;
  totalTokens?: number;
}

export interface ComplexityClassification {
  complexityScore: number; // Scale 1 - 10
  taskType: string; // e.g. "summarization", "code_generation", "reasoning", "creative_writing"
  reasoning: string;
  minimumCapableTier: CapabilityTier;
}

export interface ModelPricing {
  provider: string;
  model: string;
  tier: CapabilityTier;
  inputCostPerM: number; // Cost in USD per 1M input tokens
  outputCostPerM: number; // Cost in USD per 1M output tokens
  maxContextTokens?: number;
  source: string;
}

export interface PricingTableData {
  asOf: string;
  sources: Record<string, string>;
  models: ModelPricing[];
}

export interface PromptHistoryEntry {
  id: string;
  userId: string;
  timestamp: string;
  promptText: string;
  inputTokens: number;
  outputTokens: number;
  modelUsed: string;
  complexityScore: number;
  taskType: string;
  retriesCount: number;
  userSatisfied: boolean;
  timeToSatisfactionSeconds: number;
  cost: number;
}

export interface ModelRecommendationResult {
  recommendedModel: string;
  currentModelCost: number;
  recommendedModelCost: number;
  savingsPercent: number;
  reasoning: string;
}

export interface SatisfactionMetrics {
  avgSatisfactionRate: number;
  avgTimeToSatisfactionSec: number;
  satisfactionScore: number;
  recommendedAdjustment: string;
}

export interface HistoryAnalyzerResult {
  monthlyPromptVolume: number;
  projectedMonthlySavings: number;
  userPatternSummary: string;
  satisfactionMetrics?: SatisfactionMetrics;
}

export interface SatisfactionModelWeights {
  intercept: number;
  featureWeights: {
    complexityScore: number;
    tokenVolume: number;
    tierMismatch: number;
    retryCountPenalty: number;
  };
  accuracy: number;
  precision: number;
  recall: number;
  trainedAt: string;
}
