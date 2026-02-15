"use client";

import Link from "next/link";
import { ArrowLeft, Brain, Lightbulb, AlertTriangle, CheckCircle2 } from "lucide-react";

const calibrationData = [
  { subject: "Surgery", confidence: 82, accuracy: 71, gap: -11, status: "Overconfident", type: "warn" },
  { subject: "Medicine", confidence: 75, accuracy: 68, gap: -7, status: "Slightly Over", type: "mild" },
  { subject: "Anatomy", confidence: 70, accuracy: 78, gap: 8, status: "Underconfident (good!)", type: "good" },
  { subject: "Pathology", confidence: 80, accuracy: 55, gap: -25, status: "⚠️ Major Gap", type: "danger" },
  { subject: "Pharmacology", confidence: 65, accuracy: 48, gap: -17, status: "⚠️ Needs Work", type: "danger" },
  { subject: "OBG", confidence: 72, accuracy: 70, gap: -2, status: "Well Calibrated ✅", type: "perfect" },
  { subject: "Micro", confidence: 68, accuracy: 62, gap: -6, status: "Slightly Over", type: "mild" },
  { subject: "Physiology", confidence: 77, accuracy: 74, gap: -3, status: "Well Calibrated ✅", type: "perfect" },
];

const tips = [
  { title: "Pre-test Predict", desc: "Before answering, rate your confidence 1-5. Track if your 5s are actually correct." },
  { title: "Review Your Wrongs", desc: "Focus on questions where you were confident but wrong — these are your blind spots." },
  { title: "Embrace Uncertainty", desc: "It's better to say 'I'm not sure' and be right than to feel certain and be wrong." },
];

function getStatusColor(type: string) {
  switch (type) {
    case "danger": return "text-red-400 bg-red-500/10 border-red-500/20";
    case "warn": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    case "mild": return "text-amber-300 bg-amber-500/5 border-amber-500/15";
    case "good": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    case "perfect": return "text-emerald-300 bg-emerald-500/10 border-emerald-500/20";
    default: return "text-slate-400 bg-slate-500/10 border-slate-500/20";
  }
}

function getBarColor(type: string) {
  switch (type) {
    case "danger": return "bg-red-500";
    case "warn": return "bg-amber-500";
    case "mild": return "bg-amber-400";
    case "good": return "bg-emerald-400";
    case "perfect": return "bg-emerald-500";
    default: return "bg-slate-500";
  }
}

export default function BackstageCalibrationPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6 md:py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/backstage" className="inline-flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 mb-3">
          <ArrowLeft className="h-4 w-4" /> Back to Backstage
        </Link>
        <h1 className="text-2xl font-bold text-[#E8E0D5] md:text-3xl">Confidence Calibration</h1>
        <p className="mt-1 text-sm text-[#6B7280]">How well does your confidence match reality?</p>
      </div>

      {/* Calibration Table */}
      <div className="rounded-xl border border-purple-500/15 bg-[#364A5E] overflow-hidden mb-6">
        <div className="p-4 border-b border-purple-500/15">
          <h2 className="text-base font-semibold text-[#E8E0D5] flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" /> Per-Subject Calibration
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(91,179,179,0.1)] text-[#6B7280]">
                <th className="text-left p-3 font-medium">Subject</th>
                <th className="text-center p-3 font-medium">Confidence</th>
                <th className="text-center p-3 font-medium">Accuracy</th>
                <th className="text-center p-3 font-medium">Gap</th>
                <th className="text-left p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {calibrationData.map((row) => (
                <tr key={row.subject} className="border-b border-[rgba(91,179,179,0.05)] hover:bg-[#3A4D5F] transition-colors">
                  <td className="p-3 font-medium text-[#E8E0D5]">{row.subject}</td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-[#2D3E50] overflow-hidden">
                        <div className="h-full rounded-full bg-purple-400" style={{ width: `${row.confidence}%` }} />
                      </div>
                      <span className="text-purple-300 text-xs w-8">{row.confidence}%</span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-[#2D3E50] overflow-hidden">
                        <div className={`h-full rounded-full ${getBarColor(row.type)}`} style={{ width: `${row.accuracy}%` }} />
                      </div>
                      <span className="text-[#A0B0BC] text-xs w-8">{row.accuracy}%</span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`font-mono text-xs ${row.gap > 0 ? 'text-emerald-400' : row.gap < -10 ? 'text-red-400' : 'text-amber-300'}`}>
                      {row.gap > 0 ? '+' : ''}{row.gap}%
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs border ${getStatusColor(row.type)}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ATOM Insight Card */}
      <div className="rounded-xl border border-purple-500/20 bg-gradient-to-r from-[rgba(139,92,246,0.12)] to-[rgba(245,158,11,0.08)] p-5 mb-6">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-purple-500/20 p-2 mt-0.5">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-[#E8E0D5] mb-1">ATOM Insight</h3>
            <p className="text-sm text-[#A0B0BC]">
              Your biggest blind spot is <span className="text-amber-400 font-medium">Pathology</span> — you feel 80% confident but score 55%. 
              Focus retrieval practice here. Also watch <span className="text-amber-300 font-medium">Pharmacology</span> (65% conf → 48% acc).
            </p>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="rounded-xl border border-purple-500/15 bg-[#364A5E] p-5">
        <h2 className="text-base font-semibold text-[#E8E0D5] flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-amber-400" /> Tips for Better Calibration
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {tips.map((tip, i) => (
            <div key={i} className="rounded-lg bg-[#2D3E50] p-4 border border-purple-500/10">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-purple-400" />
                <h3 className="text-sm font-medium text-[#E8E0D5]">{tip.title}</h3>
              </div>
              <p className="text-xs text-[#6B7280] leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
