export const ATOM_ARTIFACT_KINDS = [
  'markdown',
  'json',
  'text',
  'table',
  'code',
  'citation-pack',
  'other',
] as const;

export type AtomArtifactKind = (typeof ATOM_ARTIFACT_KINDS)[number];

export type AtomArtifactProvenance = {
  taskId?: string;
  sessionId?: string;
  eventId?: number;
  createdBy?: 'assistant' | 'system' | 'user';
  sourceRefs?: string[];
};

export type AtomArtifactV1 = {
  id: string;
  kind: AtomArtifactKind;
  mime: string;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
  provenance?: AtomArtifactProvenance;
  createdAt?: string;
  updatedAt?: string;
};

export type AtomArtifactDownloadDescriptor = {
  artifactId: string;
  filename: string;
  mime: string;
  sizeBytes?: number;
  scopeKey: string;
};
