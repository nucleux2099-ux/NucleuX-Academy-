import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { sanitizeScopeKeyForPath } from '@/lib/atom/user-scope';
import type {
  AtomArtifactDownloadDescriptor,
  AtomArtifactV1,
} from '@/lib/atom/artifacts/types';

export type PersistArtifactInput = {
  scopeKey: string;
  sessionId: string;
  messageId?: string;
  taskId?: string;
  artifact: AtomArtifactV1;
};

export type ResolveArtifactDownloadInput = {
  scopeKey: string;
  sessionId: string;
  artifactId: string;
  actorUserId: string;
};

export type ListArtifactsInput = {
  scopeKey: string;
  sessionId: string;
  limit?: number;
};

export type ResolvedArtifactDownload = AtomArtifactDownloadDescriptor & {
  content: string;
};

export interface AtomArtifactService {
  persistArtifact(input: PersistArtifactInput): Promise<AtomArtifactV1>;
  listSessionArtifacts(input: ListArtifactsInput): Promise<AtomArtifactV1[]>;
  resolveDownload(input: ResolveArtifactDownloadInput): Promise<ResolvedArtifactDownload | null>;
}

export class NoopAtomArtifactService implements AtomArtifactService {
  async persistArtifact(input: PersistArtifactInput): Promise<AtomArtifactV1> {
    return {
      ...input.artifact,
      id: input.artifact.id || randomUUID(),
      createdAt: input.artifact.createdAt ?? new Date().toISOString(),
    };
  }

  async listSessionArtifacts(_input: ListArtifactsInput): Promise<AtomArtifactV1[]> {
    return [];
  }

  async resolveDownload(_input: ResolveArtifactDownloadInput): Promise<ResolvedArtifactDownload | null> {
    return null;
  }
}

type DbArtifactRow = {
  id: string;
  session_id: string;
  message_id: string | null;
  task_id: string | null;
  scope_key: string;
  kind: string;
  mime: string;
  title: string;
  content_inline: string | null;
  metadata: Record<string, unknown> | null;
  provenance: Record<string, unknown> | null;
  blob_path: string | null;
  content_sha256: string;
  size_bytes: number;
  created_at: string;
  updated_at: string;
};

function artifactFileExtension(mime: string, kind: string): string {
  if (mime.includes('json')) return 'json';
  if (mime.includes('markdown')) return 'md';
  if (mime.includes('csv')) return 'csv';
  if (mime.includes('html')) return 'html';
  if (mime.includes('xml')) return 'xml';
  if (kind === 'code') return 'txt';
  return 'txt';
}

function normalizeArtifact(input: AtomArtifactV1): AtomArtifactV1 {
  return {
    ...input,
    id: input.id || randomUUID(),
    createdAt: input.createdAt ?? new Date().toISOString(),
    metadata: input.metadata ?? {},
    provenance: input.provenance ?? {},
  };
}

function fromDbRow(row: DbArtifactRow): AtomArtifactV1 {
  return {
    id: row.id,
    kind: row.kind as AtomArtifactV1['kind'],
    mime: row.mime,
    title: row.title,
    content: row.content_inline ?? '',
    metadata: row.metadata ?? {},
    provenance: row.provenance ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class SupabaseAtomArtifactService implements AtomArtifactService {
  constructor(
    private readonly supabase: SupabaseClient,
    private readonly options: {
      inlineMaxBytes?: number;
      writeWorkspaceCopy?: boolean;
      workspaceRoot?: string;
    } = {},
  ) {}

  private get inlineMaxBytes() {
    return this.options.inlineMaxBytes ?? Number(process.env.ATOM_ARTIFACT_INLINE_MAX_BYTES ?? 1024 * 1024);
  }

  private get writeWorkspaceCopy() {
    const env = process.env.ATOM_ARTIFACT_WRITE_WORKSPACE_COPY;
    if (env == null) return true;
    return ['1', 'true', 'yes', 'on'].includes(env.toLowerCase());
  }

  private get workspaceRoot() {
    return this.options.workspaceRoot ?? path.join(process.cwd(), 'artifacts');
  }

  private resolveBlobPath(scopeKey: string, sessionId: string, artifactId: string, mime: string, kind: string): string {
    const safeScope = sanitizeScopeKeyForPath(scopeKey);
    const ext = artifactFileExtension(mime, kind);
    return path.join(safeScope, sessionId, `${artifactId}.${ext}`);
  }

  async persistArtifact(input: PersistArtifactInput): Promise<AtomArtifactV1> {
    const artifact = normalizeArtifact(input.artifact);
    const contentBytes = Buffer.byteLength(artifact.content, 'utf8');
    const contentSha256 = createHash('sha256').update(artifact.content, 'utf8').digest('hex');

    const shouldInline = contentBytes <= this.inlineMaxBytes;
    let blobPath: string | null = null;

    if (!shouldInline || this.writeWorkspaceCopy) {
      blobPath = this.resolveBlobPath(input.scopeKey, input.sessionId, artifact.id, artifact.mime, artifact.kind);
      const absolute = path.join(this.workspaceRoot, blobPath);
      await fs.mkdir(path.dirname(absolute), { recursive: true });
      await fs.writeFile(absolute, artifact.content, 'utf8');
    }

    const { error } = await this.supabase.from('atom_task_artifacts_v1').upsert(
      {
        id: artifact.id,
        session_id: input.sessionId,
        message_id: input.messageId ?? null,
        task_id: input.taskId ?? null,
        scope_key: input.scopeKey,
        kind: artifact.kind,
        mime: artifact.mime,
        title: artifact.title,
        content_inline: shouldInline ? artifact.content : null,
        metadata: artifact.metadata ?? {},
        provenance: artifact.provenance ?? {},
        blob_path: blobPath,
        content_sha256: contentSha256,
        size_bytes: contentBytes,
        created_at: artifact.createdAt,
      },
      { onConflict: 'id' },
    );

    if (error) throw error;
    return artifact;
  }

  async listSessionArtifacts(input: ListArtifactsInput): Promise<AtomArtifactV1[]> {
    const { data, error } = await this.supabase
      .from('atom_task_artifacts_v1')
      .select('*')
      .eq('session_id', input.sessionId)
      .eq('scope_key', input.scopeKey)
      .order('created_at', { ascending: false })
      .limit(input.limit ?? 200);

    if (error) throw error;

    const rows = (data ?? []) as DbArtifactRow[];
    const artifacts = await Promise.all(
      rows.map(async (row) => {
        const materialized = await this.materializeContent(row);
        return { ...fromDbRow(row), content: materialized };
      }),
    );

    return artifacts.sort((a, b) => (a.createdAt ?? '') < (b.createdAt ?? '') ? -1 : 1);
  }

  private async materializeContent(row: DbArtifactRow): Promise<string> {
    if (typeof row.content_inline === 'string') return row.content_inline;
    if (!row.blob_path) return '';

    const absolute = path.join(this.workspaceRoot, row.blob_path);
    return fs.readFile(absolute, 'utf8');
  }

  async resolveDownload(input: ResolveArtifactDownloadInput): Promise<ResolvedArtifactDownload | null> {
    const { data: session, error: sessionError } = await this.supabase
      .from('atom_sessions')
      .select('id, user_id')
      .eq('id', input.sessionId)
      .eq('user_id', input.actorUserId)
      .maybeSingle();

    if (sessionError || !session) return null;

    const { data, error } = await this.supabase
      .from('atom_task_artifacts_v1')
      .select('*')
      .eq('id', input.artifactId)
      .eq('session_id', input.sessionId)
      .eq('scope_key', input.scopeKey)
      .maybeSingle();

    if (error || !data) return null;

    const row = data as DbArtifactRow;
    const content = await this.materializeContent(row);
    const normalizedTitle = row.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'artifact';
    const ext = artifactFileExtension(row.mime, row.kind);

    return {
      artifactId: row.id,
      filename: `${normalizedTitle}.${ext}`,
      mime: row.mime,
      sizeBytes: row.size_bytes,
      scopeKey: row.scope_key,
      content,
    };
  }
}

function isEnabled(value: string | undefined): boolean {
  if (!value) return false;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

export function createAtomArtifactService(supabase: SupabaseClient): AtomArtifactService {
  if (!isEnabled(process.env.ATOM_PHASE_C_ARTIFACTS_ENABLED)) {
    return new NoopAtomArtifactService();
  }

  return new SupabaseAtomArtifactService(supabase);
}
