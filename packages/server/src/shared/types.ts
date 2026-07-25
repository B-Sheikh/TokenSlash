/**
 * TokenSlash shared type contract.
 * Owned by Member C (Integration Lead). Treat as near-frozen after H0:30 —
 * additive changes only (optional fields), never rename or remove without team notice.
 */

/** Supported complexity tiers from the Complexity Classifier. */
export type ComplexityScore = 'simple' | 'moderate' | 'complex';

/** Fixed task-type taxonomy — Member A implements classification against this set. */
export type TaskType =
  | 'summarization'
  | 'code-generation'
  | 'creative-writing'
  | 'data-analysis'
  | 'general-qa'
  | 'reasoning';

/** Module 1 — Token Estimator output. */
export interface TokenEstimate {
  tokenCount: number;
  tokenizerUsed: string;
}

/** Module 2 — Complexity Classifier output. */
export interface ComplexityResult {
  complexityScore: ComplexityScore;
  taskType: TaskType;
  reasoning: string;
}

/** Module 3 — Model Recommender output. */
export interface ModelRecommendation {
  recommendedModel: string;
  currentModelCost: number;
  recommendedModelCost: number;
  savingsPercent: number;
  reasoning: string;
}

/** Module 4 — History Analyzer output. */
export interface HistoryInsight {
  monthlyPromptVolume: number;
  projectedMonthlySavings: number;
  userPatternSummary: string;
}

/** Module 5 — Prompt Rewriter output. */
export interface RewriteResult {
  optimizedPrompt: string;
  tokenSavingsPercent: number;
}

/** Cost breakdown rendered in the dashboard. */
export interface CostComparison {
  currentModel: string;
  recommendedModel: string;
  currentCostPerRequest: number;
  recommendedCostPerRequest: number;
  currentMonthlyCost: number;
  recommendedMonthlyCost: number;
  savingsPercent: number;
}

/** Tracks which pipeline modules succeeded vs. degraded. */
export interface ModuleAvailability {
  tokenEstimate: boolean;
  complexity: boolean;
  modelRecommendation: boolean;
  history: boolean;
  rewrite: boolean;
}

/** Per-module errors keyed by module name (only present when a module failed). */
export type ModuleErrors = Partial<
  Record<
    | 'tokenEstimate'
    | 'complexity'
    | 'modelRecommendation'
    | 'history'
    | 'rewrite'
    | 'synthesis',
    string
  >
>;

/** Module 6 — Meta-Synthesizer output (the object the dashboard renders). */
export interface FinalReport {
  originalPrompt: string;
  optimizedPrompt: string;
  tokenSavingsPercent: number;
  recommendedModel: string;
  costComparison: CostComparison;
  monthlySavings: number;
  tokenCount: number;
  complexityScore: ComplexityScore;
  taskType: TaskType;
  modelRecommendationReasoning: string;
  userPatternSummary: string;
  monthlyPromptVolume: number;
  availability: ModuleAvailability;
  errors: ModuleErrors;
  generatedAt: string;
}

/** Top-level orchestration input. */
export interface OrchestrationInput {
  prompt: string;
  userId: string;
}

/** Top-level orchestration output. */
export interface OrchestrationOutput {
  finalReport: FinalReport;
}

/** Inputs passed to Meta-Synthesizer from upstream module results. */
export interface SynthesisInput {
  originalPrompt: string;
  tokenEstimate: ModuleResult<TokenEstimate>;
  complexity: ModuleResult<ComplexityResult>;
  modelRecommendation: ModuleResult<ModelRecommendation>;
  history: ModuleResult<HistoryInsight>;
  rewrite: ModuleResult<RewriteResult>;
}

/** Wrapper for graceful per-module degradation in the orchestrator. */
export interface ModuleResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

/** Default assumption for "current model" when History Analyzer has no signal. */
export const DEFAULT_CURRENT_MODEL = 'gpt-4o';

/** Default mock user when no userId is supplied. */
export const DEFAULT_USER_ID = 'demo-user';

/** All valid task types — used for Zod enums in tool schemas. */
export const TASK_TYPES: readonly TaskType[] = [
  'summarization',
  'code-generation',
  'creative-writing',
  'data-analysis',
  'general-qa',
  'reasoning',
] as const;

/** All valid complexity scores. */
export const COMPLEXITY_SCORES: readonly ComplexityScore[] = [
  'simple',
  'moderate',
  'complex',
] as const;
