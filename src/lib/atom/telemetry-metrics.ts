import type { AtomTelemetryEvent } from '@/lib/atom/telemetry';

type MetricsWindow = '1h' | '24h' | '7d';

export type TelemetrySummary = {
  window: MetricsWindow;
  range: { from: string; to: string };
  scopeKey: string;
  overall: {
    events: number;
    p95LatencyMs: number;
    failureRate: number;
    fallbackHitRate: number;
  };
  quality: {
    continuityScore: number;
    groundingScore: number;
    isolationScore: number;
    personalizationScore: number;
  };
  routes: Array<{
    route: string;
    events: number;
    p95LatencyMs: number;
    failureRate: number;
  }>;
};

function percentile95(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.95) - 1);
  return sorted[idx] ?? 0;
}

function ratio(n: number, d: number): number {
  if (d <= 0) return 0;
  return Number((n / d).toFixed(4));
}

export function deriveTelemetrySummary(input: {
  window: MetricsWindow;
  scopeKey: string;
  from: string;
  to: string;
  events: AtomTelemetryEvent[];
}): TelemetrySummary {
  const { events } = input;
  const latencies = events.map((e) => e.latencyMs);
  const failures = events.filter((e) => e.status === 'error' || e.status === 'blocked').length;
  const fallbacks = events.filter((e) => Boolean((e.metadata as Record<string, unknown>).fallbackHit)).length;

  const retrievalEvents = events.filter((e) => e.eventName === 'retrieval.outcome');
  const retrievalHits = retrievalEvents.filter((e) => Number((e.metadata as Record<string, unknown>).snippetCount ?? 0) > 0).length;

  const continueEvents = events.filter((e) => e.route.includes('/continue') || (e.mode ?? '').includes('continue'));
  const continueOk = continueEvents.filter((e) => e.status === 'ok').length;

  const isolationViolations = events.filter((e) => e.reasonCode === 'scope_guard_violation').length;

  const profileEvents = events.filter((e) => e.eventName === 'profile.decision' || e.eventName === 'policy.decision');
  const personalized = profileEvents.filter((e) => Boolean((e.metadata as Record<string, unknown>).personalizationAllowed)).length;

  const byRoute = new Map<string, AtomTelemetryEvent[]>();
  for (const event of events) {
    const arr = byRoute.get(event.route) ?? [];
    arr.push(event);
    byRoute.set(event.route, arr);
  }

  const routes = [...byRoute.entries()].map(([route, list]) => ({
    route,
    events: list.length,
    p95LatencyMs: percentile95(list.map((e) => e.latencyMs)),
    failureRate: ratio(list.filter((e) => e.status === 'error' || e.status === 'blocked').length, list.length),
  }));

  return {
    window: input.window,
    range: { from: input.from, to: input.to },
    scopeKey: input.scopeKey,
    overall: {
      events: events.length,
      p95LatencyMs: percentile95(latencies),
      failureRate: ratio(failures, events.length),
      fallbackHitRate: ratio(fallbacks, events.length),
    },
    quality: {
      continuityScore: ratio(continueOk, continueEvents.length),
      groundingScore: ratio(retrievalHits, retrievalEvents.length),
      isolationScore: 1 - ratio(isolationViolations, events.length),
      personalizationScore: ratio(personalized, profileEvents.length),
    },
    routes,
  };
}
