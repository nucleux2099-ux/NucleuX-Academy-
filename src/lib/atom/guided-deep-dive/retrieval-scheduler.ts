const DAY_MS = 24 * 60 * 60 * 1000;
const MIN_EASE_FACTOR = 1.3;
const MAX_INTERVAL_DAYS = 120;

export type RetrievalCheckpoint = {
  dueAt: string[];
  intervalDays: number[];
  easeFactor: number;
  reviewCount: number;
};

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

function clampInterval(days: number): number {
  return Math.max(1, Math.min(MAX_INTERVAL_DAYS, Math.round(days)));
}

function scoreToQuality(score: number): number {
  if (score < 40) return 1;
  if (score < 60) return 2;
  if (score < 75) return 3;
  if (score < 90) return 4;
  return 5;
}

function nextInterval(reviewCount: number, previousInterval: number, easeFactor: number): number {
  if (reviewCount === 0) return 1;
  if (reviewCount === 1) return 3;
  return clampInterval(previousInterval * easeFactor);
}

export function buildNextDueSeries(baseDate: Date, intervals: number[]): string[] {
  return intervals.map((interval) => addDays(baseDate, interval).toISOString());
}

export function initializeRetrievalCheckpoint(now = new Date()): RetrievalCheckpoint {
  const intervalDays = [1, 3, 7];
  return {
    dueAt: buildNextDueSeries(now, intervalDays),
    intervalDays,
    easeFactor: 2.5,
    reviewCount: 0,
  };
}

export function updateRetrievalCheckpoint(
  checkpoint: RetrievalCheckpoint,
  score: number,
  now = new Date(),
): RetrievalCheckpoint {
  const q = scoreToQuality(score);
  const prevInterval = checkpoint.intervalDays[0] ?? 1;

  let easeFactor = checkpoint.easeFactor;
  let nextIntervalDays = 1;

  if (q < 3) {
    nextIntervalDays = 1;
    easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.2);
  } else {
    easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
    nextIntervalDays = nextInterval(checkpoint.reviewCount, prevInterval, easeFactor);
  }

  const reviewCount = checkpoint.reviewCount + 1;
  const second = nextInterval(reviewCount, nextIntervalDays, easeFactor);
  const third = nextInterval(reviewCount + 1, second, easeFactor);
  const intervalDays = [nextIntervalDays, second, third].map(clampInterval);

  return {
    dueAt: buildNextDueSeries(now, intervalDays),
    intervalDays,
    easeFactor: Number(easeFactor.toFixed(2)),
    reviewCount,
  };
}
