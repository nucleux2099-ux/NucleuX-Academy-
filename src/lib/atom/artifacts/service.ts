import type { AtomArtifactDownloadDescriptor, AtomArtifactV1 } from '@/lib/atom/artifacts/types';

export type PersistArtifactInput = {
  scopeKey: string;
  taskId: string;
  artifact: AtomArtifactV1;
};

export type ResolveArtifactDownloadInput = {
  scopeKey: string;
  sessionId: string;
  artifactId: string;
  actorUserId: string;
};

export interface AtomArtifactService {
  persistArtifact(input: PersistArtifactInput): Promise<AtomArtifactV1>;
  resolveDownload(input: ResolveArtifactDownloadInput): Promise<AtomArtifactDownloadDescriptor | null>;
}

export class NoopAtomArtifactService implements AtomArtifactService {
  async persistArtifact(input: PersistArtifactInput): Promise<AtomArtifactV1> {
    return input.artifact;
  }

  async resolveDownload(_input: ResolveArtifactDownloadInput): Promise<AtomArtifactDownloadDescriptor | null> {
    return null;
  }
}
