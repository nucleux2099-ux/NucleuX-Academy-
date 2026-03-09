export type AtomSessionAuditRow = {
  id: string;
  user_id: string;
  room_id: string;
  thread_id: string;
  updated_at: string;
};

export type RemapConfidenceBucket = 'safe-auto-remap' | 'needs-manual-review';

export type RemapConfidence = {
  score: number;
  reason: string;
  bucket: RemapConfidenceBucket;
};

export type MigrationRemapPlanItem = {
  sessionId: string;
  userId: string;
  roomId: string;
  legacyThreadId: string;
  canonicalThreadId: string;
  updatedAt: string;
  confidence: RemapConfidence;
};

const AUTO_REMAP_THRESHOLD = 0.85;

function normalize(input: string | null | undefined) {
  return String(input ?? '').trim();
}

function looksUuidLike(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function assessRemapConfidence(row: Pick<AtomSessionAuditRow, 'user_id' | 'room_id' | 'thread_id'>): RemapConfidence {
  const userId = normalize(row.user_id);
  const roomId = normalize(row.room_id);
  const legacyThreadId = normalize(row.thread_id);

  if (!userId) {
    return {
      score: 0.05,
      reason: 'Missing user_id; cannot safely infer canonical scope identity from legacy row.',
      bucket: 'needs-manual-review',
    };
  }

  if (!legacyThreadId) {
    return {
      score: 0.1,
      reason: 'Missing legacy thread_id; remap target is derivable but source linkage is ambiguous.',
      bucket: 'needs-manual-review',
    };
  }

  if (roomId && legacyThreadId === roomId) {
    return {
      score: 0.96,
      reason: 'Legacy thread_id matches room_id, indicating deterministic pre-envelope mapping.',
      bucket: 'safe-auto-remap',
    };
  }

  if (legacyThreadId.startsWith(`user:${userId}`) || legacyThreadId === userId) {
    return {
      score: 0.9,
      reason: 'Legacy thread_id embeds the same user identity used for canonical scope derivation.',
      bucket: 'safe-auto-remap',
    };
  }

  if (looksUuidLike(legacyThreadId)) {
    return {
      score: 0.45,
      reason: 'Legacy thread_id is opaque UUID-like value with no envelope metadata to verify identity mapping.',
      bucket: 'needs-manual-review',
    };
  }

  if (!roomId) {
    return {
      score: 0.5,
      reason: 'Missing room_id + non-deterministic legacy thread_id pattern; needs operator confirmation.',
      bucket: 'needs-manual-review',
    };
  }

  const score = 0.72;
  return {
    score,
    reason: 'Fallback remap based on user_id-only scope derivation; insufficient envelope metadata for auto-apply.',
    bucket: score >= AUTO_REMAP_THRESHOLD ? 'safe-auto-remap' : 'needs-manual-review',
  };
}
