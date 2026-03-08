export const FEATURE_KEYS = {
  atomPhase2Scaffold: 'FEATURE_ATOM_PHASE2_SCAFFOLD',
  atomIntentCard: 'FEATURE_ATOM_INTENT_CARD',
  atomQuickStartSchema: 'FEATURE_ATOM_QUICK_START_SCHEMA',
} as const;

export type FeatureKey = keyof typeof FEATURE_KEYS;

function parseBooleanFlag(value: string | undefined): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
}

export function getFeatureFlagValue(feature: FeatureKey): boolean {
  const envKey = FEATURE_KEYS[feature];
  const serverValue = process.env[envKey];
  const publicValue = process.env[`NEXT_PUBLIC_${envKey}`];

  return parseBooleanFlag(serverValue) || parseBooleanFlag(publicValue);
}

export const featureFlags = {
  atomPhase2Scaffold: getFeatureFlagValue('atomPhase2Scaffold'),
  atomIntentCard: getFeatureFlagValue('atomIntentCard'),
  atomQuickStartSchema: getFeatureFlagValue('atomQuickStartSchema'),
} as const;

export function isFeatureEnabled(feature: FeatureKey): boolean {
  return featureFlags[feature];
}
