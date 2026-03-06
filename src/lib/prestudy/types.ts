export type PreStudyImportance = "A" | "B" | "C";

export type PreStudyKeyword = {
  id: string;
  text: string;
  importance: PreStudyImportance;
};

export type PreStudyChunk = {
  id: string;
  title: string;
  order: number; // 1..4
};

export type PreStudyChunkAssignment = {
  keywordId: string;
  chunkId: string;
};

export type PreStudyAimQuestion = {
  id: string;
  chunkId: string;
  // keep it lightweight v1: just text lines; later split into why/how/confusion types
  text: string;
};

export type PreStudy = {
  topicId: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  skimNotes?: string;
  keywords: PreStudyKeyword[];
  chunks: PreStudyChunk[]; // 3..4
  assignments: PreStudyChunkAssignment[];
  aimQuestions: PreStudyAimQuestion[];
};
