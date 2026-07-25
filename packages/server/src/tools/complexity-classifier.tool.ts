/**
 * PLACEHOLDER — Member A replaces this file.
 * Minimal stub so Member C's orchestration pipeline compiles and runs end-to-end.
 */
import { Injectable } from '@nitrostack/core';
import type { ComplexityResult, ComplexityScore, TaskType } from '../shared/types.js';

const CODE_PATTERN = /\b(function|const|import|class|def |SELECT |```)/i;
const REASONING_PATTERN = /\b(prove|theorem|step.?by.?step|derive|analyze why)\b/i;
const SUMMARY_PATTERN = /\b(summarize|summary|tl;dr|brief overview)\b/i;
const CREATIVE_PATTERN = /\b(story|poem|creative|write a)\b/i;
const DATA_PATTERN = /\b(csv|dataset|chart|analyze data|spreadsheet)\b/i;

@Injectable()
export class ComplexityClassifierService {
  classifyComplexity(prompt: string): ComplexityResult {
    const trimmed = prompt.trim();

    if (trimmed.length === 0) {
      return {
        complexityScore: 'simple',
        taskType: 'general-qa',
        reasoning: 'Empty prompt — defaulting to simple general Q&A.',
      };
    }

    const taskType = this.detectTaskType(trimmed);
    const complexityScore = this.detectComplexity(trimmed, taskType);

    return {
      complexityScore,
      taskType,
      reasoning: `Stub classifier: detected ${taskType} at ${complexityScore} complexity.`,
    };
  }

  private detectTaskType(prompt: string): TaskType {
    if (CODE_PATTERN.test(prompt)) return 'code-generation';
    if (REASONING_PATTERN.test(prompt)) return 'reasoning';
    if (SUMMARY_PATTERN.test(prompt)) return 'summarization';
    if (CREATIVE_PATTERN.test(prompt)) return 'creative-writing';
    if (DATA_PATTERN.test(prompt)) return 'data-analysis';
    return 'general-qa';
  }

  private detectComplexity(prompt: string, taskType: TaskType): ComplexityScore {
    if (prompt.length > 4000 || taskType === 'reasoning') return 'complex';
    if (prompt.length > 800 || taskType === 'code-generation') return 'moderate';
    return 'simple';
  }
}
