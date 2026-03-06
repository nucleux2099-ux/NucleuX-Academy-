import type { BackstageEvent } from "./types";

export type DeckTimeStats = {
  minutesToday: number;
  minutes7d: number;
};

function dayKey(d: Date) {
  // YYYY-MM-DD local
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function minutesBetween(aISO: string, bISO: string) {
  const a = new Date(aISO).getTime();
  const b = new Date(bISO).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 0;
  return Math.max(0, (b - a) / 60000);
}

export function deriveDeckMinutes(events: BackstageEvent[]): DeckTimeStats {
  // Heuristic: sum time between consecutive slide_view events within same deck-view session.
  // We only have text notes; so we bound gaps to avoid inflating when user walks away.
  const today = dayKey(new Date());
  const cutoff7d = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const slideEvents = events
    .filter((e) => e.type === "slide_view")
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

  let minutesToday = 0;
  let minutes7d = 0;

  for (let i = 1; i < slideEvents.length; i++) {
    const prev = slideEvents[i - 1];
    const cur = slideEvents[i];

    const gap = minutesBetween(prev.createdAt, cur.createdAt);

    // Bound session gap to 2 minutes to avoid idle inflation
    const bounded = Math.min(gap, 2);

    const curTime = new Date(cur.createdAt).getTime();
    if (curTime >= cutoff7d) minutes7d += bounded;
    if (dayKey(new Date(curTime)) === today) minutesToday += bounded;
  }

  return {
    minutesToday: Math.round(minutesToday),
    minutes7d: Math.round(minutes7d),
  };
}
