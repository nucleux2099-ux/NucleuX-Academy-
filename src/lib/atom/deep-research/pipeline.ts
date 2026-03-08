export const DEEP_RESEARCH_STAGES = [
  'intake',
  'question-framing',
  'evidence-mapping',
  'synthesis',
  'teaching-output',
] as const;

export type DeepResearchStage = (typeof DEEP_RESEARCH_STAGES)[number];

export type DeepResearchRequest = {
  topic: string;
  learnerLevel: string;
  goal: string;
  context?: string;
};

export type DeepResearchArtifact = {
  id: string;
  title: string;
  kind: 'outline' | 'evidence-table' | 'summary' | 'references';
  notes?: string;
};

export type DeepResearchCheckpoint = {
  stage: DeepResearchStage;
  status: 'pending' | 'running' | 'completed';
  updatedAt: string;
};

export type DeepResearchPipelineResult = {
  request: DeepResearchRequest;
  checkpoints: DeepResearchCheckpoint[];
  artifacts: DeepResearchArtifact[];
  status: 'scaffold';
};

export interface DeepResearchPipeline {
  createRun(request: DeepResearchRequest): Promise<DeepResearchPipelineResult>;
}

export function createDeepResearchPipelineScaffold(): DeepResearchPipeline {
  return {
    async createRun(request) {
      const now = new Date().toISOString();
      return {
        request,
        checkpoints: DEEP_RESEARCH_STAGES.map((stage) => ({
          stage,
          status: stage === 'intake' ? 'running' : 'pending',
          updatedAt: now,
        })),
        artifacts: [
          {
            id: 'scaffold-outline',
            title: 'Deep Research Outline (scaffold)',
            kind: 'outline',
            notes: 'Track A interface scaffold only. No retrieval or generation executed.',
          },
        ],
        status: 'scaffold',
      };
    },
  };
}
