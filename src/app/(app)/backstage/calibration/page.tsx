"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
  BarChart,
  Bar,
  ReferenceLine,
} from "recharts";
import { ApiStateBoundary } from "@/components/api-state-boundary";
import { useBackstageSummary } from "@/lib/api/hooks";

function getStatusColor(gap: number) {
  if (gap >= 15) return "text-red-400 bg-red-500/10 border-red-500/20";
  if (gap >= 8) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  return "text-emerald-300 bg-emerald-500/10 border-emerald-500/20";
}

export default function BackstageCalibrationPage() {
  const { data, isLoading, error } = useBackstageSummary();

  const rows = (data?.subjects || []).map((s) => {
    const conf = data?.calibration.confidence ?? 0;
    const gap = conf - s.accuracy;
    return {
      subject: s.name,
      confidence: conf,
      accuracy: s.accuracy,
      gap,
      gapAbs: Math.max(0, gap),
    };
  });

  const trendData = (data?.trend7d || []).map((d) => ({
    day: new Date(d.date).toLocaleDateString("en-IN", { weekday: "short" }),
    accuracy: d.mcqAccuracy,
    confidence: data?.calibration.confidence ?? d.mcqAccuracy,
  }));

  return (
    <ApiStateBoundary
      isLoading={isLoading}
      error={error}
      data={data}
      loadingText="Loading calibration insights..."
      errorText="Unable to load calibration details right now."
      className="bg-[#2D3E50]"
    >
      <div className="mx-auto w-full max-w-5xl px-3 py-5 sm:px-4 md:px-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <Link href="/backstage" className="mb-3 inline-flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300">
            <ArrowLeft className="h-4 w-4" /> Back to Backstage
          </Link>
          <h1 className="text-2xl font-bold text-[#E8E0D5] md:text-3xl">Confidence Calibration</h1>
          <p className="mt-1 text-sm text-[#A0B0BC]">How well does your confidence match actual performance?</p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="overflow-hidden rounded-xl border border-purple-500/15 bg-[#364A5E] lg:col-span-3">
            <div className="border-b border-purple-500/15 p-4">
              <h2 className="flex items-center gap-2 text-base font-semibold text-[#E8E0D5]">
                <Brain className="h-5 w-5 text-purple-400" /> Subject Calibration Gap
              </h2>
            </div>
            <div className="h-64 p-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rows} layout="vertical" margin={{ left: 12, right: 8, top: 4, bottom: 4 }}>
                  <CartesianGrid stroke="rgba(232,224,213,0.06)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#A0B0BC", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="subject" type="category" width={92} tick={{ fill: "#E8E0D5", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#253545", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 12 }}
                    formatter={(value) => [`${value}%`, "Gap"]}
                  />
                  <Bar dataKey="gapAbs" fill="#F97316" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 lg:col-span-2">
            <div className="mb-2 flex items-center gap-2 text-red-300">
              <AlertTriangle className="h-4 w-4" />
              <p className="text-sm font-semibold">Gap Emphasis</p>
            </div>
            <p className="text-3xl font-bold text-[#E8E0D5]">{Math.max(0, (data?.calibration.gap ?? 0)).toFixed(0)}%</p>
            <p className="mt-1 text-xs text-[#A0B0BC]">Overall confidence minus actual accuracy</p>
            <div className="mt-4 space-y-2 text-xs text-[#A0B0BC]">
              <p>Confidence: <span className="text-purple-300">{data?.calibration.confidence ?? 0}%</span></p>
              <p>Accuracy: <span className="text-cyan-300">{data?.calibration.accuracy ?? 0}%</span></p>
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-2 py-1 text-red-200">
                Priority: Reduce overconfidence on top 2 subjects this week.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-purple-500/15 bg-[#364A5E] p-4">
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-[#E8E0D5]">
            <TrendingUp className="h-5 w-5 text-cyan-300" /> 7-Day Confidence vs Accuracy
          </h2>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid stroke="rgba(232,224,213,0.06)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#A0B0BC", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={{ background: "#253545", border: "1px solid rgba(91,179,179,0.25)", borderRadius: 12 }} />
                <ReferenceLine y={75} stroke="rgba(232,224,213,0.25)" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="confidence" stroke="#C084FC" strokeWidth={2.25} dot={false} />
                <Line type="monotone" dataKey="accuracy" stroke="#5BB3B3" strokeWidth={2.25} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mb-6 overflow-hidden rounded-xl border border-purple-500/15 bg-[#364A5E]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px] text-sm">
              <thead>
                <tr className="border-b border-[rgba(91,179,179,0.1)] text-[#A0B0BC]">
                  <th className="p-3 text-left font-medium">Subject</th>
                  <th className="p-3 text-center font-medium">Confidence</th>
                  <th className="p-3 text-center font-medium">Accuracy</th>
                  <th className="p-3 text-center font-medium">Gap</th>
                  <th className="p-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.subject} className="border-b border-[rgba(91,179,179,0.05)] transition-colors hover:bg-[#3A4D5F]">
                    <td className="p-3 font-medium text-[#E8E0D5]">{row.subject}</td>
                    <td className="p-3 text-center text-purple-300">{row.confidence}%</td>
                    <td className="p-3 text-center text-[#A0B0BC]">{row.accuracy}%</td>
                    <td className="p-3 text-center font-mono text-xs text-[#E8E0D5]">{row.gap > 0 ? `+${row.gap}` : row.gap}%</td>
                    <td className="p-3">
                      <span className={`inline-block rounded-full border px-2 py-0.5 text-xs ${getStatusColor(Math.max(0, row.gap))}`}>
                        {row.gap >= 15 ? "Major gap" : row.gap >= 8 ? "Needs calibration" : "Well calibrated"}
                      </span>
                    </td>
                  </tr>
                ))}
                {!rows.length && (
                  <tr>
                    <td colSpan={5} className="p-4 text-[#A0B0BC]">
                      Not enough data yet — attempt MCQs to unlock calibration tracking.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-purple-500/20 bg-gradient-to-r from-[rgba(139,92,246,0.12)] to-[rgba(245,158,11,0.08)] p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-purple-500/20 p-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-[#E8E0D5]">ATOM Insight</h3>
              <p className="text-sm text-[#A0B0BC]">{data?.insights?.[0] || "Build confidence through retrieval practice and repeated testing."}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-purple-500/15 bg-[#364A5E] p-5">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-[#E8E0D5]">
            <Lightbulb className="h-5 w-5 text-amber-400" /> Calibration Tips
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              "Rate your confidence before each answer.",
              "Revisit questions where confidence was high but answer was wrong.",
              "Track weekly gap trend and target top 3 weak areas.",
            ].map((tip) => (
              <div key={tip} className="rounded-lg border border-purple-500/10 bg-[#2D3E50] p-4">
                <div className="mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-400" />
                  <h3 className="text-sm font-medium text-[#E8E0D5]">Practice Rule</h3>
                </div>
                <p className="text-xs leading-relaxed text-[#A0B0BC]">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ApiStateBoundary>
  );
}
