/**
 * SYNCED COPY of packages/server/src/shared/types.ts
 * ---------------------------------------------------------------------------
 * Source of truth lives with Member C on the backend.
 * When packages/server lands, prefer importing from @shared/types via the
 * Vite alias (packages/server/src/shared). Until then this file is the
 * contract the UI builds against — do NOT invent a parallel shape.
 *
 * Graceful degradation: fields may be the literal string "unavailable"
 * when a pipeline stage fails. UI must render what's present and never crash.
 */

export type Unavailable = "unavailable";

export type MaybeUnavailable<T> = T | Unavailable;

export function isUnavailable(value: unknown): value is Unavailable {
  return value === "unavailable";
}

export function isAvailable<T>(value: MaybeUnavailable<T>): value is T {
  return value !== "unavailable";
}

/** Per-model cost line used in the direct comparison table. */
export interface ModelCostBreakdown {
  model: string;
  /** USD cost for a single request with this prompt. */
  perRequestUsd: MaybeUnavailable<number>;
  /** USD cost extrapolated to assumedMonthlyRequests. */
  monthlyUsd: MaybeUnavailable<number>;
  inputTokens: MaybeUnavailable<number>;
  outputTokens: MaybeUnavailable<number>;
}

export interface CostComparison {
  current: ModelCostBreakdown;
  recommended: ModelCostBreakdown;
}

/**
 * FinalReport — the sole payload the frontend renders after analyze.
 * Produced by the NitroStack backend pipeline (Checkpoint 2+).
 */
export interface FinalReport {
  /** Exact prompt the user submitted. */
  originalPrompt: string;
  /** AI-rewritten, token-efficient prompt. */
  optimizedPrompt: MaybeUnavailable<string>;
  /** Percentage of tokens saved vs original (0–100). */
  tokenSavingsPercent: MaybeUnavailable<number>;
  /** Cheaper model recommended for this workload. */
  recommendedModel: MaybeUnavailable<string>;
  /** Short rationale for the model recommendation. */
  recommendedModelReasoning: MaybeUnavailable<string>;
  /** Side-by-side current vs recommended cost lines. */
  costComparison: MaybeUnavailable<CostComparison>;
  /**
   * Personalized monthly savings in USD — the hero metric on the report.
   * (current monthly − recommended monthly), given assumedMonthlyRequests.
   */
  monthlySavingsEstimateUsd: MaybeUnavailable<number>;
  /** Requests/month used to personalize the savings estimate. */
  assumedMonthlyRequests: number;
  /** Model the user is currently on (for labeling). */
  currentModel: string;
}
