import type { AdaptiveLearnerProfile } from '@/lib/atom/adaptive-profile';

export type PolicyInput = {
  profile: AdaptiveLearnerProfile;
  explicitUserInstruction?: string;
  strictGrounded?: boolean;
  safetyMode?: boolean;
};

export type PolicyDecision = {
  advisoryProfile: AdaptiveLearnerProfile;
  personalizationAllowed: boolean;
  reasonCodes: string[];
  instructionOverride: string | null;
};

export function applyPolicyGuardrails(input: PolicyInput): PolicyDecision {
  const reasonCodes: string[] = [];
  let personalizationAllowed = true;
  let instructionOverride: string | null = null;

  if (input.explicitUserInstruction?.trim()) {
    instructionOverride = input.explicitUserInstruction.trim();
    reasonCodes.push('EXPLICIT_USER_OVERRIDE');
  }

  if (input.strictGrounded) {
    personalizationAllowed = false;
    reasonCodes.push('STRICT_GROUNDED_PRIORITY');
  }

  if (input.safetyMode) {
    personalizationAllowed = false;
    reasonCodes.push('SAFETY_MODE_PRIORITY');
  }

  return {
    advisoryProfile: input.profile,
    personalizationAllowed,
    reasonCodes: reasonCodes.length > 0 ? reasonCodes : ['PERSONALIZATION_ADVISORY'],
    instructionOverride,
  };
}
