export const FEATURE_KEYS = {
  atomPhase2Scaffold: 'FEATURE_ATOM_PHASE2_SCAFFOLD',
  atomIntentCard: 'FEATURE_ATOM_INTENT_CARD',
  atomQuickStartSchema: 'FEATURE_ATOM_QUICK_START_SCHEMA',
  trackADeepResearchScaffold: 'FEATURE_TRACK_A_DEEP_RESEARCH_SCAFFOLD',
  trackBGuidedDeepDiveScaffold: 'FEATURE_TRACK_B_GUIDED_DEEP_DIVE_SCAFFOLD',
  learningCycleIntegrationHooks: 'FEATURE_LEARNING_CYCLE_INTEGRATION_HOOKS',
} as const;

export const RUNTIME_FLAG_KEYS = {
  atomV3Enabled: 'ATOM_V3_ENABLED',
  atomV3AdvancedVisible: 'ATOM_V3_ADVANCED_VISIBLE',
  atomV3GddEnabled: 'ATOM_V3_GDD_ENABLED',
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
  trackADeepResearchScaffold: getFeatureFlagValue('trackADeepResearchScaffold'),
  trackBGuidedDeepDiveScaffold: getFeatureFlagValue('trackBGuidedDeepDiveScaffold'),
  learningCycleIntegrationHooks: getFeatureFlagValue('learningCycleIntegrationHooks'),
} as const;

export function isFeatureEnabled(feature: FeatureKey): boolean {
  return featureFlags[feature];
}

function getRuntimeFlagValue(flagKey: (typeof RUNTIME_FLAG_KEYS)[keyof typeof RUNTIME_FLAG_KEYS]): boolean {
  const serverValue = process.env[flagKey];
  const publicValue = process.env[`NEXT_PUBLIC_${flagKey}`];

  return parseBooleanFlag(serverValue) || parseBooleanFlag(publicValue);
}

export function isAtomV3Enabled(): boolean {
  return getRuntimeFlagValue(RUNTIME_FLAG_KEYS.atomV3Enabled);
}

export function isAtomV3AdvancedVisible(): boolean {
  return getRuntimeFlagValue(RUNTIME_FLAG_KEYS.atomV3AdvancedVisible);
}

export function isAtomV3GddEnabled(): boolean {
  return getRuntimeFlagValue(RUNTIME_FLAG_KEYS.atomV3GddEnabled);
}
