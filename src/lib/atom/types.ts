export const ATOM_TASK_STATUSES = [
  'queued',
  'running',
  'needs_input',
  'completed',
  'failed',
  'cancelled',
] as const;

export const ATOM_TASK_MODES = ['quick', 'task'] as const;

export const ATOM_TASK_PHASES = [
  'plan',
  'retrieve',
  'reason',
  'draft',
  'finalize',
] as const;

export const ATOM_CONTROL_ACTIONS = ['stop', 'retry', 'continue', 'branch'] as const;

export type AtomTaskStatus = (typeof ATOM_TASK_STATUSES)[number];
export type AtomTaskMode = (typeof ATOM_TASK_MODES)[number];
export type AtomTaskPhase = (typeof ATOM_TASK_PHASES)[number];
export type AtomControlAction = (typeof ATOM_CONTROL_ACTIONS)[number];

export const ATOM_EVENT_TYPES = [
  'task.created',
  'task.started',
  'phase.started',
  'phase.completed',
  'tool.started',
  'tool.output',
  'tool.completed',
  'tool.failed',
  'assistant.delta',
  'artifact.created',
  'artifact.updated',
  'task.needs_input',
  'task.completed',
  'task.failed',
  'task.cancelled',
] as const;

export type AtomEventType = (typeof ATOM_EVENT_TYPES)[number];

export type AtomSourceSelection = {
  level?: string;
  domain?: string;
  bookIds?: string[];
  books?: Array<{ id: string; title: string }>;
  preset?: string;
  [key: string]: unknown;
};

export type AtomEventPayload = Record<string, unknown>;

export type AtomTaskEventEnvelope = {
  eventId: number;
  taskId: string;
  type: AtomEventType;
  ts: string;
  payload: AtomEventPayload;
};

export type CreateAtomTaskRequest = {
  message: string;
  mode?: AtomTaskMode;
  sourceSelection?: AtomSourceSelection;
  room?: string;
};

export type AtomTaskControlRequest = {
  action: AtomControlAction;
};

export type CitationSourceType = 'textbook' | 'guideline' | 'review' | 'trial' | 'other';

export type DeepResearchCitation = {
  id: string;
  title: string;
  sourceType: CitationSourceType;
  editionOrYear?: string;
  chapterOrSection?: string;
  pageOrLocator?: string;
  quote?: string;
  evidenceLevelHint?: string;
};

export type DraftWithEvidence = {
  answerMarkdown: string;
  citations: DeepResearchCitation[];
};

export type ClaimStatus = 'PASS' | 'WARN' | 'FAIL';

export type ClaimValidationResult = {
  claimId: string;
  claimText: string;
  anchors: string[];
  status: ClaimStatus;
  issues: string[];
  semanticSupport: number;
  linkedCitationIds: string[];
};

export type ClaimValidationSummary = {
  claims: ClaimValidationResult[];
  claimCount: number;
  passCount: number;
  warnCount: number;
  failCount: number;
  coverage: number;
  shouldBlockFinalize: boolean;
};

export type CitationScoreResult = {
  citationId: string;
  score: number;
  breakdown: {
    hierarchy: number;
    recency: number;
    locator: number;
    quote: number;
    consistency: number;
    penalty: number;
  };
};

export type ClaimEvidenceGrade = 'A' | 'B' | 'C' | 'D';

export type ClaimEvidenceScore = {
  claimId: string;
  score: number;
  grade: ClaimEvidenceGrade;
  semanticSupport: number;
  citationIds: string[];
};

export type EvidenceGradeSummary = {
  evidenceScore: number;
  evidenceGrade: ClaimEvidenceGrade;
  coverage: number;
  claimStats: {
    pass: number;
    warn: number;
    fail: number;
  };
  citationScores: CitationScoreResult[];
  claimScores: ClaimEvidenceScore[];
};

export type DeepResearchConfig = {
  workflow: 'nucleux-original-deep-research';
  topic: string;
  level: string;
  goal: string;
  includeReferences: boolean;
  clinicalContext?: string;
  coverageThreshold?: number;
};
