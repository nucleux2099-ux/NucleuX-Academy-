import { deriveDeckTopicStats, pickStaleDeckTopic } from "./deck-derive";
import { deriveDeckMinutes } from "./deck-time";
import type { BackstageEvent } from "./types";

export type BackstageCTA =
  | {
      kind: "deck_review";
      title: string;
      detail: string;
      topicId: string;
    }
  | {
      kind: "none";
      title: string;
      detail: string;
    };

export function pickDeckReviewCTA(events: BackstageEvent[]): BackstageCTA {
  const stats = deriveDeckTopicStats(events);
  const stale = pickStaleDeckTopic(stats);
  const mins = deriveDeckMinutes(events);

  // If no deck activity at all, do nothing.
  if (!stale) {
    return {
      kind: "none",
      title: "Create your first deck",
      detail: "Use Classroom → Slide Decks to start revising with structure.",
    };
  }

  // If user has <10 min deck activity today, nudge a 10-min review.
  const target = 10;
  if (mins.minutesToday < target) {
    return {
      kind: "deck_review",
      title: `Review deck for 10 minutes`,
      detail: `Suggested topic: ${stale.topicId} (you’ve done ${mins.minutesToday} min today)`,
      topicId: stale.topicId,
    };
  }

  return {
    kind: "deck_review",
    title: "Quick deck refresh",
    detail: `Suggested topic: ${stale.topicId}`,
    topicId: stale.topicId,
  };
}
