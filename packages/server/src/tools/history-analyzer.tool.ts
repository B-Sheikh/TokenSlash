import { Injectable } from '@nitrostack/core';
import type {
  ComplexityScore,
  HistoryInsight,
  TaskType,
} from '../shared/types.js';
import { loadJsonData } from '../lib/load-data.js';
import { ModelRecommenderService } from './model-recommender.tool.js';

type HistoryEntry = {
  promptPreview: string;
  tokenCount: number;
  modelUsed: string;
  taskType: TaskType;
  complexityScore: ComplexityScore;
  timestamp: string;
};

type MockHistory = {
  asOf: string;
  users: Record<
    string,
    {
      displayName: string;
      entries: HistoryEntry[];
    }
  >;
  defaultProfile: {
    monthlyPromptVolume: number;
    dominantTaskTypes: TaskType[];
    typicalModel: string;
  };
};

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Mock history stores prompt-side token counts; multiply to approximate
 * full session billing (input + typical model output).
 */
const SESSION_BILLING_MULTIPLIER = 150;

function loadMockHistory(): MockHistory {
  return loadJsonData<MockHistory>('mock-history.json');
}

@Injectable()
export class HistoryAnalyzerService {
  private readonly history: MockHistory;

  constructor(private readonly recommender: ModelRecommenderService) {
    this.history = loadMockHistory();
  }

  /**
   * Analyzes mock prompt history for a user and projects monthly savings
   * if model recommendations had been applied historically.
   */
  analyzeHistory(userId: string, _currentPrompt: string): HistoryInsight {
    const user = this.history.users[userId];

    if (!user) {
      return this.buildDefaultProfile(userId);
    }

    const recentEntries = this.filterRecentEntries(user.entries);
    const monthlyPromptVolume = recentEntries.length;

    let totalActualCost = 0;
    let totalOptimizedCost = 0;
    const taskTypeCounts: Record<string, number> = {};
    let overProvisionedCount = 0;

    for (const entry of recentEntries) {
      const billableTokens = entry.tokenCount * SESSION_BILLING_MULTIPLIER;
      const actualCost = this.recommender.estimateRequestCost(
        entry.modelUsed,
        billableTokens,
      );
      const recommendation = this.recommender.recommendModel(
        billableTokens,
        entry.complexityScore,
        entry.taskType,
      );

      totalActualCost += actualCost;
      totalOptimizedCost += recommendation.recommendedModelCost;

      taskTypeCounts[entry.taskType] = (taskTypeCounts[entry.taskType] ?? 0) + 1;

      if (recommendation.savingsPercent > 0) {
        overProvisionedCount += 1;
      }
    }

    const projectedMonthlySavings = Number(
      Math.max(0, totalActualCost - totalOptimizedCost).toFixed(2),
    );

    const dominantTask = this.findDominantTaskType(taskTypeCounts);
    const overProvisionedPct =
      monthlyPromptVolume > 0
        ? Math.round((overProvisionedCount / monthlyPromptVolume) * 100)
        : 0;

    const userPatternSummary = this.buildSummary(
      user.displayName,
      monthlyPromptVolume,
      dominantTask,
      overProvisionedPct,
      projectedMonthlySavings,
    );

    return {
      monthlyPromptVolume,
      projectedMonthlySavings,
      userPatternSummary,
    };
  }

  private filterRecentEntries(entries: HistoryEntry[]): HistoryEntry[] {
    const cutoff = Date.now() - THIRTY_DAYS_MS;
    return entries.filter((e) => new Date(e.timestamp).getTime() >= cutoff);
  }

  private findDominantTaskType(counts: Record<string, number>): TaskType {
    let best: TaskType = 'general-qa';
    let bestCount = 0;

    for (const [type, count] of Object.entries(counts)) {
      if (count > bestCount) {
        bestCount = count;
        best = type as TaskType;
      }
    }

    return best;
  }

  private buildDefaultProfile(userId: string): HistoryInsight {
    const profile = this.history.defaultProfile;
    const avgTokens = 120;
    const sampleSavings = this.recommender.recommendModel(
      avgTokens,
      'simple',
      profile.dominantTaskTypes[0] ?? 'general-qa',
    );

    const perRequestSavings = Math.max(
      0,
      sampleSavings.currentModelCost - sampleSavings.recommendedModelCost,
    );
    const projectedMonthlySavings = Number(
      (perRequestSavings * profile.monthlyPromptVolume).toFixed(2),
    );

    return {
      monthlyPromptVolume: profile.monthlyPromptVolume,
      projectedMonthlySavings,
      userPatternSummary:
        `Unknown user "${userId}" — using average profile: ~${profile.monthlyPromptVolume} prompts/month ` +
        `on ${profile.typicalModel}, mostly ${profile.dominantTaskTypes.join(' and ')} tasks. ` +
        `Estimated savings with tier-appropriate models: $${projectedMonthlySavings.toFixed(2)}/mo.`,
    };
  }

  private buildSummary(
    displayName: string,
    volume: number,
    dominantTask: TaskType,
    overProvisionedPct: number,
    savings: number,
  ): string {
    const taskLabel = dominantTask.replace('-', ' ');
    return (
      `${displayName}: ${volume} prompts in the last 30 days, primarily ${taskLabel}. ` +
      `${overProvisionedPct}% used a more expensive model than necessary. ` +
      `Projected savings with optimized model selection: $${savings.toFixed(2)}/mo.`
    );
  }
}
