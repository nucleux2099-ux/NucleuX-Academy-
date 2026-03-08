export const QUICK_START_REQUIRED_FIELDS = [
  'intent',
  'subject',
  'proficiencyLevel',
  'timeboxMinutes',
  'outputPreference',
] as const;

export type QuickStartRequiredField = (typeof QUICK_START_REQUIRED_FIELDS)[number];

export type QuickStartFormInput = {
  intent: string;
  subject: string;
  proficiencyLevel: 'ug' | 'pg' | 'resident' | 'consultant';
  timeboxMinutes: number;
  outputPreference: 'summary' | 'checklist' | 'flashcards' | 'casewalk';
  notes?: string;
};

export type QuickStartValidationResult =
  | { ok: true; data: QuickStartFormInput }
  | { ok: false; errors: Partial<Record<QuickStartRequiredField, string>> };

export const QUICK_START_MAX_REQUIRED_FIELDS = 5;

if (QUICK_START_REQUIRED_FIELDS.length > QUICK_START_MAX_REQUIRED_FIELDS) {
  throw new Error(`Quick-start schema exceeds required field limit (${QUICK_START_MAX_REQUIRED_FIELDS}).`);
}

export function validateQuickStartFormInput(input: unknown): QuickStartValidationResult {
  const payload = (input ?? {}) as Partial<Record<keyof QuickStartFormInput, unknown>>;
  const errors: Partial<Record<QuickStartRequiredField, string>> = {};

  const intent = typeof payload.intent === 'string' ? payload.intent.trim() : '';
  if (!intent) errors.intent = 'Intent is required';

  const subject = typeof payload.subject === 'string' ? payload.subject.trim() : '';
  if (!subject) errors.subject = 'Subject is required';

  let proficiencyLevel: QuickStartFormInput['proficiencyLevel'] | undefined;
  if (
    payload.proficiencyLevel === 'ug' ||
    payload.proficiencyLevel === 'pg' ||
    payload.proficiencyLevel === 'resident' ||
    payload.proficiencyLevel === 'consultant'
  ) {
    proficiencyLevel = payload.proficiencyLevel;
  } else {
    errors.proficiencyLevel = 'Select a valid proficiency level';
  }

  const timeboxRaw = typeof payload.timeboxMinutes === 'number' ? payload.timeboxMinutes : Number(payload.timeboxMinutes);
  const timeboxMinutes = Number.isFinite(timeboxRaw) ? Math.round(timeboxRaw) : NaN;
  if (!Number.isFinite(timeboxMinutes) || timeboxMinutes <= 0) {
    errors.timeboxMinutes = 'Timebox must be a positive number of minutes';
  }

  let outputPreference: QuickStartFormInput['outputPreference'] | undefined;
  if (
    payload.outputPreference === 'summary' ||
    payload.outputPreference === 'checklist' ||
    payload.outputPreference === 'flashcards' ||
    payload.outputPreference === 'casewalk'
  ) {
    outputPreference = payload.outputPreference;
  } else {
    errors.outputPreference = 'Select a valid output preference';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      intent,
      subject,
      proficiencyLevel: proficiencyLevel!,
      timeboxMinutes,
      outputPreference: outputPreference!,
      notes: typeof payload.notes === 'string' && payload.notes.trim() ? payload.notes.trim() : undefined,
    },
  };
}
