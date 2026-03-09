import test from 'node:test';
import assert from 'node:assert/strict';
import { pruneRawTelemetry } from '@/lib/atom/telemetry-rollups';

function mockSupabase(count: number) {
  let deleted = false;
  return {
    deleted: () => deleted,
    client: {
      from() {
        return {
          select() {
            return {
              lt: async () => ({ count, error: null }),
            };
          },
          delete() {
            return {
              lt() {
                return Promise.resolve({ error: null }).then((v) => {
                  deleted = true;
                  return v;
                });
              },
            };
          },
        };
      },
    },
  };
}

test('retention dry-run does not delete rows', async () => {
  const mock = mockSupabase(5);
  const out = await pruneRawTelemetry({ supabase: mock.client as never, dryRun: true, retentionDays: 30 });
  assert.equal(out.deleted, 5);
  assert.equal(mock.deleted(), false);
});

test('retention enforce deletes rows when candidates exist', async () => {
  const mock = mockSupabase(3);
  const out = await pruneRawTelemetry({ supabase: mock.client as never, dryRun: false, retentionDays: 30 });
  assert.equal(out.deleted, 3);
  assert.equal(mock.deleted(), true);
});
