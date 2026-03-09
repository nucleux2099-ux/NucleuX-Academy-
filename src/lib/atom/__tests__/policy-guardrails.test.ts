import test from 'node:test';
import assert from 'node:assert/strict';
import { applyPolicyGuardrails } from '@/lib/atom/policy-guardrails';

const profile = {
  scopeKey: 'chan:web:peer:u1',
  response_style: 'balanced' as const,
  difficulty_preference: 'adaptive' as const,
  weak_topics: [],
  pace: 'normal' as const,
  format_preference: 'mixed' as const,
  updatedAt: new Date().toISOString(),
  version: 1,
};

test('explicit instruction override is recorded', () => {
  const decision = applyPolicyGuardrails({ profile, explicitUserInstruction: 'Use bullet points' });
  assert.equal(decision.instructionOverride, 'Use bullet points');
  assert.equal(decision.reasonCodes.includes('EXPLICIT_USER_OVERRIDE'), true);
});

test('strict grounded and safety mode override personalization', () => {
  const strict = applyPolicyGuardrails({ profile, strictGrounded: true });
  assert.equal(strict.personalizationAllowed, false);
  assert.equal(strict.reasonCodes.includes('STRICT_GROUNDED_PRIORITY'), true);

  const safety = applyPolicyGuardrails({ profile, safetyMode: true });
  assert.equal(safety.personalizationAllowed, false);
  assert.equal(safety.reasonCodes.includes('SAFETY_MODE_PRIORITY'), true);
});
