import test from 'node:test';
import assert from 'node:assert/strict';
import { extractLegacyArtifactsFromMessages } from '@/app/api/atom/session/[sessionId]/route';

test('legacy artifact extraction preserves parser fallback compatibility', () => {
  const artifacts = extractLegacyArtifactsFromMessages('sess-1', [
    {
      role: 'assistant',
      created_at: '2026-03-09T00:00:00.000Z',
      meta: {
        artifacts: [
          { id: 'legacy-1', title: 'JSON output', kind: 'json', content: '{"ok":true}' },
        ],
      },
    },
  ]);

  assert.equal(artifacts.length, 1);
  assert.equal(artifacts[0].id, 'legacy-1');
  assert.equal(artifacts[0].kind, 'json');
  assert.equal(artifacts[0].mime, 'text/plain');
});
