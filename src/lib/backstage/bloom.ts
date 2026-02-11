import type { BackstageEvent, Bloom } from "./types";

export function countBlooms(events: BackstageEvent[]) {
  const counts: Record<Bloom, number> = {
    remember: 0,
    understand: 0,
    apply: 0,
    analyze: 0,
    evaluate: 0,
    create: 0,
  };

  for (const e of events) {
    if (e.bloom) counts[e.bloom] += 1;
  }

  return counts;
}
