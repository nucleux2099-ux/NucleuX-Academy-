import type { BackstageEvent, CompetencyStage, SubjectKey } from "./types";

export type SubjectStats = {
  subject: SubjectKey;
  events: number;
  mcqAttempts: number;
  mcqCorrect: number;
  accuracyPct: number | null;
  avgConfidence: number | null;
  calibrationGap: number | null; // confidence - accuracy
  lastEventAt?: string;
  stage: CompetencyStage;
};

function round(n: number) {
  return Math.round(n);
}

function computeStage(x: {
  exposure: number;
  mcqAttempts: number;
  accuracyPct: number | null;
  avgConfidence: number | null;
}): CompetencyStage {
  // V1 heuristic rules. (V2 will use spaced success + trend + time.)
  const { exposure, mcqAttempts, accuracyPct, avgConfidence } = x;

  if (exposure < 3) {
    // low exposure: if high confidence, likely UI; else CI.
    if ((avgConfidence ?? 0) >= 70) return "unconsciously_incompetent";
    return "consciously_incompetent";
  }

  if (mcqAttempts >= 5 && accuracyPct !== null) {
    if (accuracyPct < 55) return "consciously_incompetent";
    if (accuracyPct < 80) return "consciously_competent";

    // high accuracy
    if ((avgConfidence ?? 0) >= 75) return "unconsciously_competent";
    return "consciously_competent";
  }

  // enough exposure but not enough test data yet
  return "consciously_incompetent";
}

export function deriveSubjectStats(events: BackstageEvent[]): SubjectStats[] {
  const by: Record<string, BackstageEvent[]> = {};

  for (const e of events) {
    const key = e.subject || "unknown";
    if (!by[key]) by[key] = [];
    by[key].push(e);
  }

  const out: SubjectStats[] = Object.keys(by).map((subject) => {
    const es = by[subject];
    const mcqs = es.filter((e) => e.type === "mcq");

    const mcqAttempts = mcqs.length;
    const mcqCorrect = mcqs.filter((e) => e.mcq?.correct === true).length;
    const accuracyPct = mcqAttempts > 0 ? round((mcqCorrect / mcqAttempts) * 100) : null;

    const confs = es.map((e) => e.confidence).filter((n): n is number => typeof n === "number");
    const avgConfidence = confs.length ? round(confs.reduce((a, b) => a + b, 0) / confs.length) : null;

    const calibrationGap =
      avgConfidence !== null && accuracyPct !== null ? round(avgConfidence - accuracyPct) : null;

    const lastEventAt = es
      .map((e) => e.createdAt)
      .sort((a, b) => (a < b ? 1 : -1))[0];

    const stage = computeStage({
      exposure: es.length,
      mcqAttempts,
      accuracyPct,
      avgConfidence,
    });

    return {
      subject: subject as SubjectKey,
      events: es.length,
      mcqAttempts,
      mcqCorrect,
      accuracyPct,
      avgConfidence,
      calibrationGap,
      lastEventAt,
      stage,
    };
  });

  // Put unknown last
  out.sort((a, b) => {
    if (a.subject === "unknown") return 1;
    if (b.subject === "unknown") return -1;

    const aScore = (a.accuracyPct ?? 0) + (a.mcqAttempts > 0 ? 10 : 0);
    const bScore = (b.accuracyPct ?? 0) + (b.mcqAttempts > 0 ? 10 : 0);
    return bScore - aScore;
  });

  return out;
}
