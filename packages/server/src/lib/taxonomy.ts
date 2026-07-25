import type { ComplexityScore, TaskType } from '../shared/types.js';

/** Human-readable definitions for each task type in the classifier taxonomy. */
export interface TaskTypeDefinition {
  id: TaskType;
  label: string;
  description: string;
  /** Keyword/regex signals used by the rule-based classifier. */
  signals: readonly string[];
}

/** Minimum model capability tier required for a complexity level. */
export type ModelTier = 'budget' | 'standard' | 'premium' | 'reasoning';

export const TASK_TYPE_DEFINITIONS: readonly TaskTypeDefinition[] = [
  {
    id: 'summarization',
    label: 'Summarization',
    description: 'Condensing documents, articles, or transcripts into shorter form.',
    signals: [
      'summarize',
      'summary',
      'tl;dr',
      'tldr',
      'brief overview',
      'key points',
      'executive summary',
      'recap',
      'digest',
    ],
  },
  {
    id: 'code-generation',
    label: 'Code Generation',
    description: 'Writing, refactoring, debugging, or explaining source code.',
    signals: [
      'function',
      'class',
      'import',
      'def ',
      'SELECT ',
      '```',
      'typescript',
      'javascript',
      'python',
      'refactor',
      'debug',
      'implement',
      'api endpoint',
    ],
  },
  {
    id: 'creative-writing',
    label: 'Creative Writing',
    description: 'Stories, poems, marketing copy, or other open-ended creative tasks.',
    signals: [
      'story',
      'poem',
      'creative',
      'write a',
      'narrative',
      'character',
      'dialogue',
      'fiction',
      'blog post',
      'tagline',
    ],
  },
  {
    id: 'data-analysis',
    label: 'Data Analysis',
    description: 'Analyzing datasets, spreadsheets, metrics, or structured data.',
    signals: [
      'csv',
      'dataset',
      'chart',
      'analyze data',
      'spreadsheet',
      'pandas',
      'sql query',
      'metrics',
      'statistics',
      'visualization',
      'excel',
    ],
  },
  {
    id: 'reasoning',
    label: 'Reasoning',
    description: 'Multi-step logic, proofs, derivations, or deep analytical reasoning.',
    signals: [
      'prove',
      'theorem',
      'step by step',
      'step-by-step',
      'derive',
      'analyze why',
      'reasoning',
      'logic puzzle',
      'deduce',
      'mathematical proof',
      'formally',
    ],
  },
  {
    id: 'general-qa',
    label: 'General Q&A',
    description: 'Default bucket for factual questions and general assistance.',
    signals: [],
  },
] as const;

/** Maps complexity scores to the minimum model tier that can handle them reliably. */
export const COMPLEXITY_TIER_MAP: Record<ComplexityScore, ModelTier> = {
  simple: 'budget',
  moderate: 'standard',
  complex: 'premium',
};

/** Task types that always bump minimum tier regardless of length heuristics. */
export const TASK_TYPE_MIN_TIER: Partial<Record<TaskType, ModelTier>> = {
  reasoning: 'reasoning',
  'code-generation': 'standard',
};

/** Maximum prompt length processed in full before truncation (characters). */
export const MAX_PROMPT_CHARS = 50_000;

/** Length thresholds (characters) for complexity heuristics. */
export const COMPLEXITY_LENGTH_THRESHOLDS = {
  moderate: 800,
  complex: 4000,
} as const;
