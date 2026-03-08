import type { EvidenceGradeSummary } from '@/lib/atom/types';

export type LearningHandoffMetadata = {
  recommendedNext: string[];
  weakClaimCount: number;
  learningCycle: {
    plan: string[];
    encode: string;
    retrieve: string[];
    apply: string[];
    diagnose: string[];
    reinforce: string[];
  };
};

export function buildLearningHandoff(params: {
  topic: string;
  finalAnswer: string;
  evidence: EvidenceGradeSummary;
}): LearningHandoffMetadata {
  const weakClaims = params.evidence.claimScores.filter((claim) => claim.grade === 'C' || claim.grade === 'D');

  return {
    recommendedNext: weakClaims.length > 0 ? ['retrieval_quiz', 'case_apply'] : ['case_apply', 'teach_back'],
    weakClaimCount: weakClaims.length,
    learningCycle: {
      plan: [
        `Prioritize ${params.topic} mechanisms and diagnostic thresholds.`,
        'Tie recommendations to citation-backed evidence.',
        'Focus on decision points likely to be tested in clinic and exams.',
      ],
      encode: `High-yield synthesis: ${params.finalAnswer.slice(0, 240)}${params.finalAnswer.length > 240 ? '…' : ''}`,
      retrieve: [
        `What are the top three decision thresholds in ${params.topic}?`,
        'Which recommendation has the strongest evidence base and why?',
        'What contraindications were highlighted?',
        'How would you explain the approach to a junior resident in 60 seconds?',
        'Which claim needs re-checking based on weaker support?',
      ],
      apply: [
        `Case 1: Apply ${params.topic} logic to a typical ward patient.`,
        'Case 2: Adjust plan when first-line recommendation is contraindicated.',
        'Case 3: Defend your management decision with citation evidence.',
      ],
      diagnose: weakClaims.length
        ? weakClaims.map((claim) => `Reinforce ${claim.claimId}: currently graded ${claim.grade}.`)
        : ['No weak claims detected; continue spaced retrieval to retain mastery.'],
      reinforce: [
        '24h: answer 5 retrieval prompts without notes.',
        '72h: solve 3 case-style questions and compare with evidence map.',
      ],
    },
  };
}

export function renderLearningHandoffMarkdown(handoff: LearningHandoffMetadata): string {
  return [
    '## Learning Handoff',
    '',
    `### Plan\n- ${handoff.learningCycle.plan.join('\n- ')}`,
    '',
    `### Encode\n${handoff.learningCycle.encode}`,
    '',
    `### Retrieve\n- ${handoff.learningCycle.retrieve.join('\n- ')}`,
    '',
    `### Apply\n- ${handoff.learningCycle.apply.join('\n- ')}`,
    '',
    `### Diagnose\n- ${handoff.learningCycle.diagnose.join('\n- ')}`,
    '',
    `### Reinforce\n- ${handoff.learningCycle.reinforce.join('\n- ')}`,
  ].join('\n');
}
