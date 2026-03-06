"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Scale,
  Target,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CalibrationRow = {
  subject: string;
  confidence: number;
  accuracy: number;
};

const calibrationRows: CalibrationRow[] = [
  { subject: "Surgery", confidence: 82, accuracy: 71 },
  { subject: "Medicine", confidence: 75, accuracy: 68 },
  { subject: "Anatomy", confidence: 70, accuracy: 78 },
  { subject: "Pathology", confidence: 80, accuracy: 55 },
  { subject: "Pharmacology", confidence: 65, accuracy: 48 },
  { subject: "OBG", confidence: 72, accuracy: 70 },
  { subject: "Microbiology", confidence: 68, accuracy: 62 },
  { subject: "Physiology", confidence: 77, accuracy: 74 },
];

const coachingTips = [
  {
    title: "Pre-answer confidence",
    body: "Before each question, rate confidence quickly. Compare prediction vs result at review.",
  },
  {
    title: "Target high-gap misses",
    body: "Prioritize questions where confidence was high but answers were wrong.",
  },
  {
    title: "Say unsure sooner",
    body: "Mark uncertainty early and trigger retrieval drills instead of rereading passively.",
  },
];

function gap(value: CalibrationRow) {
  return value.confidence - value.accuracy;
}

function statusLabel(delta: number) {
  if (delta >= 15) return "Major overconfidence";
  if (delta >= 7) return "Mild overconfidence";
  if (delta <= -7) return "Underconfident";
  return "Well calibrated";
}

function statusClass(delta: number) {
  if (delta >= 15) return "text-red-400 border-red-400/25 bg-red-400/10";
  if (delta >= 7) return "text-[#C9A86C] border-[#C9A86C]/25 bg-[#C9A86C]/10";
  if (delta <= -7) return "text-[#5BB3B3] border-[#5BB3B3]/25 bg-[#5BB3B3]/10";
  return "text-emerald-300 border-emerald-300/25 bg-emerald-300/10";
}

export default function BackstageCalibrationPage() {
  const avgConfidence = Math.round(
    calibrationRows.reduce((total, row) => total + row.confidence, 0) / calibrationRows.length
  );
  const avgAccuracy = Math.round(
    calibrationRows.reduce((total, row) => total + row.accuracy, 0) / calibrationRows.length
  );
  const avgGap = avgConfidence - avgAccuracy;

  const highestGap = calibrationRows
    .slice()
    .sort((a, b) => gap(b) - gap(a))
    .slice(0, 3);

  return (
    <div className="ui-shell py-2 md:py-3">
      <div className="mx-auto max-w-5xl space-y-5">
        <header className="ui-reveal-up">
          <Link
            href="/backstage"
            className="ui-pill ui-interactive inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#5BB3B3]" /> Back to command center
          </Link>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#E8E0D5] md:text-3xl">
            Confidence Calibration
          </h1>
          <p className="mt-1 text-sm text-[#A0B0BC]">
            Align confidence with actual performance and close blind spots.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 ui-reveal-up ui-reveal-delay-1">
          <Card className="ui-panel p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A88]">Avg Confidence</p>
            <p className="mt-1 text-2xl font-semibold text-[#E8E0D5]">{avgConfidence}%</p>
          </Card>
          <Card className="ui-panel p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A88]">Avg Accuracy</p>
            <p className="mt-1 text-2xl font-semibold text-[#E8E0D5]">{avgAccuracy}%</p>
          </Card>
          <Card className="ui-panel p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A88]">Avg Gap</p>
            <p className={cn("mt-1 text-2xl font-semibold", avgGap >= 10 ? "text-[#C9A86C]" : "text-[#5BB3B3]")}>{avgGap}%</p>
          </Card>
        </section>

        <Card className="ui-panel ui-reveal-up ui-reveal-delay-2 gap-4 p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-[#E8E0D5]">
                <Scale className="h-4 w-4 text-[#5BB3B3]" /> Subject Calibration Map
              </h2>
              <p className="mt-1 text-sm text-[#A0B0BC]">Confidence vs performance per domain.</p>
            </div>
            <Link
              href="/mcqs?mode=quiz&type=retrieval"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#5BB3B3] transition-colors hover:text-[#78c7c7]"
            >
              Open retrieval check <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {calibrationRows.map((row) => {
              const delta = gap(row);
              return (
                <div
                  key={row.subject}
                  className="ui-interactive rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/60 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#E8E0D5]">{row.subject}</p>
                    <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-semibold", statusClass(delta))}>
                      {statusLabel(delta)}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-[#A0B0BC]">Confidence</span>
                        <span className="text-[#E8E0D5]">{row.confidence}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#253545]">
                        <div className="h-full rounded-full bg-[#C9A86C] transition-all duration-300" style={{ width: `${row.confidence}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-[#A0B0BC]">Accuracy</span>
                        <span className="text-[#E8E0D5]">{row.accuracy}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#253545]">
                        <div className="h-full rounded-full bg-[#5BB3B3] transition-all duration-300" style={{ width: `${row.accuracy}%` }} />
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-[#6B7A88]">Gap: {delta >= 0 ? `+${delta}` : delta}%</p>
                </div>
              );
            })}
          </div>
        </Card>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="ui-panel ui-reveal-up ui-reveal-delay-2 gap-4 p-5">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-[#E8E0D5]">
              <AlertTriangle className="h-4 w-4 text-[#C9A86C]" /> Highest Gap Topics
            </h3>
            <div className="space-y-2.5">
              {highestGap.map((row) => (
                <div key={row.subject} className="rounded-xl border border-[#C9A86C]/20 bg-[#C9A86C]/10 p-3">
                  <p className="text-sm font-semibold text-[#E8E0D5]">{row.subject}</p>
                  <p className="mt-1 text-xs text-[#A0B0BC]">
                    confidence {row.confidence}% · accuracy {row.accuracy}% · gap {gap(row)}%
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="ui-panel ui-reveal-up ui-reveal-delay-3 gap-4 p-5">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-[#E8E0D5]">
              <Lightbulb className="h-4 w-4 text-[#5BB3B3]" /> Coaching Protocol
            </h3>
            <div className="space-y-2.5">
              {coachingTips.map((tip) => (
                <div key={tip.title} className="rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/55 p-3">
                  <p className="text-sm font-semibold text-[#E8E0D5]">{tip.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#A0B0BC]">{tip.body}</p>
                </div>
              ))}
            </div>
            <Link
              href="/backstage"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#5BB3B3] transition-colors hover:text-[#78c7c7]"
            >
              <CheckCircle2 className="h-4 w-4" /> Back to command center
            </Link>
          </Card>
        </section>

        <footer className="ui-reveal-up ui-reveal-delay-3 flex items-center gap-2 text-xs text-[#6B7A88]">
          <Target className="h-3.5 w-3.5 text-[#5BB3B3]" />
          Prioritize high-gap topics first, then verify improvements through retrieval mode.
        </footer>
      </div>
    </div>
  );
}
