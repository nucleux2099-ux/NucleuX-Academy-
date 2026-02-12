export type GrindeScore = {
  grouped: boolean;
  reflective: boolean;
  interconnected: boolean;
  nonVerbal: boolean;
  directional: boolean;
  emphasised: boolean;
};

export type SkinChunk = {
  chunkId: string;
  appliedTwoFourRule: boolean;
  grinde: GrindeScore;
  teachBackGaps: string;
  completedAt?: string;
};

export type Skin = {
  topicId: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  chunks: SkinChunk[];
};
