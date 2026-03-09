export const QUICK_START_REQUIRED_FIELDS = [
  'mode',
  'topic',
  'level',
  'timeAvailable',
  'goal',
] as const;

export type QuickStartRequiredField = (typeof QUICK_START_REQUIRED_FIELDS)[number];

export const QUICK_START_MODES = [
  'ppt',
  'nucleux-original',
  'mcq',
  'flashcards',
  'excel-analysis',
  'guided-deep-dive',
] as const;

export const QUICK_START_LEVELS = ['intern', 'resident', 'pg', 'consultant'] as const;

export type QuickStartMode = (typeof QUICK_START_MODES)[number];
export type QuickStartLevel = (typeof QUICK_START_LEVELS)[number];

export type QuickStartAdvancedInput = {
  preferredFormat?: string;
  includeReferences?: boolean;
  clinicalContext?: string;
};

export type QuickStartFormInput = {
  mode: QuickStartMode;
  topic: string;
  level: QuickStartLevel;
  timeAvailable: number;
  goal: string;
  advanced?: QuickStartAdvancedInput;
};

export type QuickStartValidationResult =
  | { ok: true; data: QuickStartFormInput }
  | { ok: false; errors: Partial<Record<QuickStartRequiredField, string>> };

export const QUICK_START_MAX_REQUIRED_FIELDS = 5;

const QUICK_START_DEFAULTS: QuickStartFormInput = {
  mode: 'mcq',
  topic: 'General Surgery high-yield revision',
  level: 'resident',
  timeAvailable: 25,
  goal: 'Build exam-ready recall with a concise plan',
};

if (QUICK_START_REQUIRED_FIELDS.length > QUICK_START_MAX_REQUIRED_FIELDS) {
  throw new Error(`Quick-start schema exceeds required field limit (${QUICK_START_MAX_REQUIRED_FIELDS}).`);
}

export function normalizeQuickStartFormInput(input: unknown): QuickStartFormInput {
  const payload = (input ?? {}) as Partial<Record<keyof QuickStartFormInput, unknown>>;

  const mode = QUICK_START_MODES.includes(payload.mode as QuickStartMode)
    ? (payload.mode as QuickStartMode)
    : QUICK_START_DEFAULTS.mode;

  const topic = typeof payload.topic === 'string' && payload.topic.trim() ? payload.topic.trim() : QUICK_START_DEFAULTS.topic;

  const level = QUICK_START_LEVELS.includes(payload.level as QuickStartLevel)
    ? (payload.level as QuickStartLevel)
    : QUICK_START_DEFAULTS.level;

  const timeRaw = typeof payload.timeAvailable === 'number' ? payload.timeAvailable : Number(payload.timeAvailable);
  const timeAvailable = Number.isFinite(timeRaw) && timeRaw > 0 ? Math.round(timeRaw) : QUICK_START_DEFAULTS.timeAvailable;

  const goal = typeof payload.goal === 'string' && payload.goal.trim() ? payload.goal.trim() : QUICK_START_DEFAULTS.goal;

  const advanced = typeof payload.advanced === 'object' && payload.advanced !== null ? (payload.advanced as QuickStartAdvancedInput) : undefined;

  return {
    mode,
    topic,
    level,
    timeAvailable,
    goal,
    advanced,
  };
}

export function validateQuickStartFormInput(input: unknown): QuickStartValidationResult {
  const normalized = normalizeQuickStartFormInput(input);

  const errors: Partial<Record<QuickStartRequiredField, string>> = {};

  if (!normalized.mode) errors.mode = 'Mode is required';
  if (!normalized.topic.trim()) errors.topic = 'Topic is required';
  if (!normalized.level) errors.level = 'Level is required';
  if (!Number.isFinite(normalized.timeAvailable) || normalized.timeAvailable <= 0) {
    errors.timeAvailable = 'Time available must be a positive number of minutes';
  }
  if (!normalized.goal.trim()) errors.goal = 'Goal is required';

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data: normalized };
}
