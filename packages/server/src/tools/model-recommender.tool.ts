import { Injectable } from '@nitrostack/core';
import type {
  ComplexityScore,
  ModelRecommendation,
  TaskType,
} from '../shared/types.js';
import { DEFAULT_CURRENT_MODEL } from '../shared/types.js';
import type { ModelTier } from '../lib/taxonomy.js';
import {
  COMPLEXITY_TIER_MAP,
  TASK_TYPE_MIN_TIER,
} from '../lib/taxonomy.js';
import { loadJsonData } from '../lib/load-data.js';

type ModelPricing = {
  inputPer1M: number;
  outputPer1M: number;
  tier: ModelTier;
  contextWindow: number;
};

type PricingTable = {
  asOf: string;
  defaultCurrentModel: string;
  outputTokenRatio: number;
  providers: Record<
    string,
    {
      source: string;
      models: Record<string, ModelPricing>;
    }
  >;
};

const TIER_ORDER: Record<ModelTier, number> = {
  budget: 0,
  standard: 1,
  premium: 2,
  reasoning: 3,
};

function loadPricingTable(): PricingTable {
  return loadJsonData<PricingTable>('pricing-table.json');
}

function flattenModels(
  table: PricingTable,
): Array<{ id: string; pricing: ModelPricing }> {
  const models: Array<{ id: string; pricing: ModelPricing }> = [];
  for (const provider of Object.values(table.providers)) {
    for (const [id, pricing] of Object.entries(provider.models)) {
      models.push({ id, pricing });
    }
  }
  return models;
}

@Injectable()
export class ModelRecommenderService {
  private readonly pricingTable: PricingTable;
  private readonly allModels: Array<{ id: string; pricing: ModelPricing }>;

  constructor() {
    this.pricingTable = loadPricingTable();
    this.allModels = flattenModels(this.pricingTable);
  }

  /**
   * Recommends the cheapest model that meets complexity and task-type requirements.
   * Costs are computed from the static pricing table (as of build date).
   */
  recommendModel(
    tokenCount: number,
    complexityScore: ComplexityScore,
    taskType: TaskType,
  ): ModelRecommendation {
    const safeTokenCount = Number.isFinite(tokenCount) && tokenCount >= 0 ? tokenCount : 0;
    const currentModel = this.pricingTable.defaultCurrentModel ?? DEFAULT_CURRENT_MODEL;
    const minTier = this.resolveMinimumTier(complexityScore, taskType);

    const eligible = this.allModels.filter(
      (m) => TIER_ORDER[m.pricing.tier] >= TIER_ORDER[minTier],
    );

    const recommended =
      eligible.length > 0
        ? eligible.reduce((cheapest, candidate) =>
            this.estimateRequestCost(candidate.id, safeTokenCount) <
            this.estimateRequestCost(cheapest.id, safeTokenCount)
              ? candidate
              : cheapest,
          )
        : this.allModels.find((m) => m.id === currentModel) ?? this.allModels[0];

    const currentCost = this.estimateRequestCost(currentModel, safeTokenCount);
    const recommendedCost = this.estimateRequestCost(recommended.id, safeTokenCount);

    const savingsPercent =
      currentCost > 0
        ? Math.max(
            0,
            Math.round(((currentCost - recommendedCost) / currentCost) * 100),
          )
        : 0;

    const reasoning = this.buildReasoning(
      complexityScore,
      taskType,
      minTier,
      currentModel,
      recommended.id,
      savingsPercent,
    );

    return {
      recommendedModel: recommended.id,
      currentModelCost: currentCost,
      recommendedModelCost: recommendedCost,
      savingsPercent,
      reasoning,
    };
  }

  /** Exposed for History Analyzer to project savings on past entries. */
  estimateRequestCost(modelId: string, tokenCount: number): number {
    const model = this.allModels.find((m) => m.id === modelId);
    if (!model || tokenCount <= 0) return 0;

    const inputCost = (tokenCount / 1_000_000) * model.pricing.inputPer1M;
    const outputTokens = tokenCount * this.pricingTable.outputTokenRatio;
    const outputCost = (outputTokens / 1_000_000) * model.pricing.outputPer1M;
    const total = inputCost + outputCost;

    return Number(Math.max(0, total).toFixed(6));
  }

  getPricingAsOf(): string {
    return this.pricingTable.asOf;
  }

  private resolveMinimumTier(
    complexityScore: ComplexityScore,
    taskType: TaskType,
  ): ModelTier {
    const fromComplexity = COMPLEXITY_TIER_MAP[complexityScore];
    const fromTask = TASK_TYPE_MIN_TIER[taskType];

    if (!fromTask) return fromComplexity;
    return TIER_ORDER[fromTask] > TIER_ORDER[fromComplexity]
      ? fromTask
      : fromComplexity;
  }

  private buildReasoning(
    complexityScore: ComplexityScore,
    taskType: TaskType,
    minTier: ModelTier,
    currentModel: string,
    recommendedModel: string,
    savingsPercent: number,
  ): string {
    if (recommendedModel === currentModel || savingsPercent === 0) {
      return (
        `${complexityScore} ${taskType} task requires ${minTier}-tier capability. ` +
        `${currentModel} is already the optimal choice for this workload.`
      );
    }

    return (
      `${complexityScore} ${taskType} task needs at least ${minTier}-tier models. ` +
      `Switching from ${currentModel} to ${recommendedModel} saves ~${savingsPercent}% per request ` +
      `(pricing as of ${this.pricingTable.asOf.slice(0, 10)}).`
    );
  }
}
