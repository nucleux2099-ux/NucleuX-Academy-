import test from 'node:test';
import assert from 'node:assert/strict';
import { SupabaseAtomArtifactService } from '@/lib/atom/artifacts/service';

function makeSupabaseStub(options: { sessionOwned: boolean }) {
  return {
    from(table: string) {
      if (table === 'atom_sessions') {
        return {
          select() { return this; },
          eq() { return this; },
          maybeSingle: async () => ({ data: options.sessionOwned ? { id: 's1', user_id: 'u1' } : null, error: null }),
        };
      }

      return {
        select() { return this; },
        eq() { return this; },
        maybeSingle: async () => ({ data: null, error: null }),
      };
    },
  } as never;
}

test('resolveDownload denies cross-user/cross-scope by returning null when session ownership fails', async () => {
  const service = new SupabaseAtomArtifactService(makeSupabaseStub({ sessionOwned: false }));
  const result = await service.resolveDownload({
    scopeKey: 'scope:a',
    sessionId: 's1',
    artifactId: 'a1',
    actorUserId: 'u1',
  });

  assert.equal(result, null);
});
