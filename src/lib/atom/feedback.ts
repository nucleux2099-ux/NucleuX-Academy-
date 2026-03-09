export const FEEDBACK_TYPES = new Set(['thumbs_up', 'thumbs_down', 'rating', 'correction', 'outcome']);

export function isValidFeedbackType(value: unknown): value is 'thumbs_up' | 'thumbs_down' | 'rating' | 'correction' | 'outcome' {
  return typeof value === 'string' && FEEDBACK_TYPES.has(value);
}
