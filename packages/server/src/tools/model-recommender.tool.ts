/**
 * PLACEHOLDER — Member B replaces this file.
 * Minimal stub so Member C's orchestration pipeline compiles and runs end-to-end.
 */
import { Injectable } from '@nitrostack/core';
import type {
  ComplexityScore,
  ModelRecommendation,
  TaskType,
} from '../shared/types.js';
import { DEFAULT_CURRENT_MODEL } from '../shared/types.js';

@Injectable()
export class ModelRecommenderService {
  recommendModel(
    tokenCount: number,
    complexityScore: ComplexityScore,
    taskType: TaskType,
  ): ModelRecommendation {
    const currentModel = DEFAULT_CURRENT_MODEL;
    const recommendedModel = this.pickModel(complexityScore, taskType);

    const currentCost = this.estimateCost(currentModel, tokenCount);
    const recommendedCost = this.estimateCost(recommendedModel, tokenCount);
    const savingsPercent =
      currentCost > 0
        ? Math.max(0, Math.round(((currentCost - recommendedCost) / currentCost) * 100))
        : 0;

    return {
      recommendedModel,
      currentModelCost: currentCost,
      recommendedModelCost: recommendedCost,
      savingsPercent,
      reasoning: `Stub recommender: ${complexityScore} ${taskType} → ${recommendedModel}.`,
    };
  }

  private pickModel(complexity: ComplexityScore, taskType: TaskType): string {
    if (complexity === 'complex' || taskType === 'reasoning') return 'gpt-4o';
    if (complexity === 'moderate' || taskType === 'code-generation') return 'gpt-4o-mini';
    return 'gpt-4o-mini';
  }

  private estimateCost(model: string, tokenCount: number): number {
    const ratePer1k = model.includes('mini') ? 0.00015 : 0.0025;
    return Number(((tokenCount / 1000) * ratePer1k).toFixed(6));
  }
}
