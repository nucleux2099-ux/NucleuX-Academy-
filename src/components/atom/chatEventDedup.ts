export type ChatTimelineEvent = {
  id: string;
  label: string;
  detail?: string;
  ts: string;
};

const DEFAULT_WINDOW_MS = 2500;

export function appendDedupedUserEvent<T extends ChatTimelineEvent>(
  events: T[],
  incoming: T,
  windowMs: number = DEFAULT_WINDOW_MS,
): T[] {
  const incomingText = incoming.detail?.trim();
  const incomingTs = Date.parse(incoming.ts);

  const duplicate = events.some((event) => {
    if (event.id === incoming.id) return true;
    if (event.label !== "You" || incoming.label !== "You") return false;
    if (!incomingText || event.detail?.trim() !== incomingText) return false;

    const eventTs = Date.parse(event.ts);
    if (Number.isNaN(eventTs) || Number.isNaN(incomingTs)) return false;

    return Math.abs(incomingTs - eventTs) <= windowMs;
  });

  if (duplicate) return events;
  return [...events, incoming];
}
