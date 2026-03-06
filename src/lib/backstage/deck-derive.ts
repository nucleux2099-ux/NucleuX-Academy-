import type { BackstageEvent, SubjectKey } from "./types";

export type DeckTopicStats = {
  topicId: string;
  subject: SubjectKey;
  deckViews: number;
  slideViews: number;
  templateInserts: number;
  activityScore: number;
  lastAt?: string;
};

export function deriveDeckTopicStats(events: BackstageEvent[]): DeckTopicStats[] {
  const map = new Map<string, DeckTopicStats>();

  for (const e of events) {
    if (e.type !== "deck_view" && e.type !== "slide_view" && e.type !== "template_insert") continue;
    if (!e.topicId) continue;

    const existing = map.get(e.topicId) ?? {
      topicId: e.topicId,
      subject: e.subject || "unknown",
      deckViews: 0,
      slideViews: 0,
      templateInserts: 0,
      activityScore: 0,
      lastAt: undefined,
    };

    if (e.type === "deck_view") existing.deckViews += 1;
    if (e.type === "slide_view") existing.slideViews += 1;
    if (e.type === "template_insert") existing.templateInserts += 1;

    // Weighted: slide views show time-in-deck more than deck opens.
    existing.activityScore = existing.deckViews * 2 + existing.slideViews * 1 + existing.templateInserts * 4;

    if (!existing.lastAt || e.createdAt > existing.lastAt) existing.lastAt = e.createdAt;

    map.set(e.topicId, existing);
  }

  return Array.from(map.values()).sort((a, b) => b.activityScore - a.activityScore);
}

export function pickStaleDeckTopic(stats: DeckTopicStats[]): DeckTopicStats | null {
  if (stats.length === 0) return null;
  // Recommend the topic with the oldest lastAt (stale revision)
  const withDates = stats.filter((s) => s.lastAt);
  if (withDates.length === 0) return stats[0];
  return [...withDates].sort((a, b) => (a.lastAt! < b.lastAt! ? -1 : 1))[0];
}
