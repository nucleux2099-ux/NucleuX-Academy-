export type AimQuestionType =
  | "why_important"
  | "how_related"
  | "management_change"
  | "common_confusion"
  | "viva_mcq";

export type AimQuestion = {
  id: string;
  chunkId: string;
  type: AimQuestionType;
  text: string;
};

export type AimChunkPlan = {
  chunkId: string;
  whyImportant: string;
  questions: AimQuestion[];
};

export type Aim = {
  topicId: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  chunkPlans: AimChunkPlan[];
};
