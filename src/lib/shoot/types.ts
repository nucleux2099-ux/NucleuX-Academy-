export type VprefreScore = {
  visual: boolean;
  processed: boolean;
  relational: boolean;
  freehand: boolean;
  reflective: boolean;
  efficient: boolean;
};

export type LayeredContent = {
  logic: string;
  concepts: string;
  importantDetails: string;
  arbitraryDetails?: string;
};

export type ShootChunkArtifact = {
  chunkId: string;
  layered: LayeredContent;
  vprefre: VprefreScore;
  teachBackPrompts: string;
  gapList: string;
  completedAt?: string;
};

export type Shoot = {
  topicId: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  artifacts: ShootChunkArtifact[];
};
