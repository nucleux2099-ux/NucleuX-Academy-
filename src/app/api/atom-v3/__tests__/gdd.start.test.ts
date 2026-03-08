import test from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '@/app/api/atom-v3/gdd/start/route';

test('payload contract: start returns runtime session shape', async () => {
  process.env.ATOM_V3_GDD_ENABLED = 'true';
  const request = new Request('http://localhost/api/atom-v3/gdd/start', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ topic: 'AKI', level: 'resident', goal: 'Master AKI' }),
  });

  const response = await POST(request as never);
  assert.equal(response.status, 200);
  const json = (await response.json()) as { session: { currentStep: string; telemetrySessionId: string }; telemetry: unknown[] };
  assert.equal(json.session.currentStep, 'diagnose-gap');
  assert.ok(Boolean(json.session.telemetrySessionId));
  assert.equal(json.telemetry.length, 1);
});

test('fallback when GDD disabled', async () => {
  process.env.ATOM_V3_GDD_ENABLED = 'false';
  const request = new Request('http://localhost/api/atom-v3/gdd/start', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ topic: 'AKI', level: 'resident', goal: 'Master AKI' }),
  });

  const response = await POST(request as never);
  assert.equal(response.status, 403);
});
