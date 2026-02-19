"use client";

import { useState } from "react";
import { Brain, Timer, Flame, Target, CheckCircle2, Clock, Zap, BookOpen, Filter } from "lucide-react";
import { useTrackEvent } from "@/lib/api/hooks";

const subjects = ["All", "Surgery", "Medicine", "Anatomy", "Pathology", "Pharmacology", "OBG"];
const difficulties = ["Easy", "Medium", "Hard"];

const quizHistory = [
  { subject: "Surgery", score: "8/10", date: "Today, 1:30 PM", pct: 80 },
  { subject: "Anatomy", score: "14/20", date: "Yesterday, 9:15 PM", pct: 70 },
  { subject: "Pathology", score: "9/10", date: "Feb 13, 4:00 PM", pct: 90 },
  { subject: "Medicine", score: "38/50", date: "Feb 12, 11:00 AM", pct: 76 },
];

const options = [
  { label: "A", text: "Whipple procedure (Pancreaticoduodenectomy)" },
  { label: "B", text: "Distal pancreatectomy with splenectomy" },
  { label: "C", text: "Total pancreatectomy" },
  { label: "D", text: "Frey procedure" },
];

export default function MCQsPage() {
  const [activeSubject, setActiveSubject] = useState("All");
  const [difficulty, setDifficulty] = useState("Medium");
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const { trackEvent } = useTrackEvent();

  const handleQuickStart = () => {
    void trackEvent("task_started", {
      source: "mcq_page_quick_10",
      mode: "quick_10",
      subject: activeSubject,
      difficulty,
    });
  };

  const handleFullTestStart = () => {
    void trackEvent("task_started", {
      source: "mcq_page_full_test",
      mode: "full_50",
      subject: activeSubject,
      difficulty,
    });
  };

  const handleSubmitAnswer = () => {
    if (!selected) return;
    const isCorrect = selected === "A";
    void trackEvent("mcq_submitted", {
      source: "mcq_page_submit",
      subject: activeSubject,
      difficulty,
      selected_option: selected,
      is_correct: isCorrect,
      question_index: 7,
    });
    setFeedback(isCorrect ? "Correct answer submitted." : "Answer submitted. Review explanation next.");
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#E8E0D5] flex items-center gap-2">
            <Brain className="w-7 h-7 text-[#6366F1]" /> MCQ Practice
          </h1>
          <p className="text-[#A0B0BC] text-sm mt-1">Sharpen your knowledge, one question at a time</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleQuickStart} className="px-4 py-2 rounded-xl bg-[#6366F1] text-white font-medium flex items-center gap-2 hover:bg-[#5558E6] transition">
            <Zap className="w-4 h-4" /> Quick 10
          </button>
          <button onClick={handleFullTestStart} className="px-4 py-2 rounded-xl bg-[#253545] border border-[rgba(232,224,213,0.06)] text-[#E8E0D5] font-medium flex items-center gap-2 hover:bg-[#2a3f52] transition">
            <BookOpen className="w-4 h-4" /> Full Test (50 Qs)
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: "Questions", value: "2,450", color: "#6366F1" },
          { icon: CheckCircle2, label: "Attempted", value: "876", color: "#22C55E" },
          { icon: Target, label: "Accuracy", value: "72%", color: "#F59E0B" },
          { icon: Flame, label: "Day Streak", value: "15 🔥", color: "#EF4444" },
        ].map((s) => (
          <div key={s.label} className="bg-[#253545] rounded-xl border border-[rgba(232,224,213,0.06)] p-4">
            <div className="flex items-center gap-2 text-[#A0B0BC] text-sm mb-1">
              <s.icon className="w-4 h-4" style={{ color: s.color }} /> {s.label}
            </div>
            <div className="text-xl font-bold text-[#E8E0D5]">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Filter className="w-4 h-4 text-[#A0B0BC]" />
        <div className="flex gap-2 flex-wrap">
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSubject(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                activeSubject === s
                  ? "bg-[#6366F1] text-white"
                  : "bg-[#253545] text-[#A0B0BC] border border-[rgba(232,224,213,0.06)] hover:text-[#E8E0D5]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                difficulty === d
                  ? "bg-[rgba(99,102,241,0.15)] text-[#6366F1] border border-[#6366F1]"
                  : "bg-[#253545] text-[#A0B0BC] border border-[rgba(232,224,213,0.06)]"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Active Quiz Card */}
      <div className="bg-[#253545] rounded-xl border border-[rgba(232,224,213,0.06)] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="bg-[rgba(99,102,241,0.15)] text-[#6366F1] px-3 py-1 rounded-lg text-sm font-medium">
              Surgery
            </span>
            <span className="text-[#A0B0BC] text-sm">Question 7 of 10</span>
          </div>
          <div className="flex items-center gap-2 text-[#F59E0B]">
            <Timer className="w-4 h-4" />
            <span className="font-mono font-medium">02:34</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-[#2D3E50] rounded-full mb-6">
          <div className="h-full bg-[#6366F1] rounded-full" style={{ width: "70%" }} />
        </div>

        <h3 className="text-[#E8E0D5] text-lg font-medium mb-6">
          A 55-year-old male presents with painless progressive jaundice, palpable gallbladder, and weight loss. CT shows a 3cm mass in the head of pancreas. What is the most appropriate surgical procedure?
        </h3>

        <div className="grid gap-3">
          {options.map((o) => (
            <button
              key={o.label}
              onClick={() => setSelected(o.label)}
              className={`flex items-center gap-4 p-4 rounded-xl border text-left transition ${
                selected === o.label
                  ? "bg-[rgba(99,102,241,0.15)] border-[#6366F1] text-[#E8E0D5]"
                  : "bg-[#2D3E50] border-[rgba(232,224,213,0.06)] text-[#A0B0BC] hover:border-[#6366F1]/50 hover:text-[#E8E0D5]"
              }`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                selected === o.label ? "bg-[#6366F1] text-white" : "bg-[#253545] text-[#A0B0BC]"
              }`}>
                {o.label}
              </span>
              <span className="text-sm">{o.text}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button className="px-4 py-2 rounded-xl bg-[#2D3E50] text-[#A0B0BC] text-sm hover:text-[#E8E0D5] transition">
            ← Previous
          </button>
          <button
            onClick={handleSubmitAnswer}
            disabled={!selected}
            className="px-6 py-2 rounded-xl bg-[#6366F1] text-white font-medium text-sm hover:bg-[#5558E6] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer →
          </button>
        </div>
        {feedback && <p className="mt-3 text-xs text-[#A0B0BC]">{feedback}</p>}
      </div>

      {/* Recent Quiz History */}
      <div>
        <h2 className="text-lg font-semibold text-[#E8E0D5] mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#6366F1]" /> Recent Attempts
        </h2>
        <div className="grid gap-3">
          {quizHistory.map((q, i) => (
            <div key={i} className="bg-[#253545] rounded-xl border border-[rgba(232,224,213,0.06)] p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                  q.pct >= 80 ? "bg-[rgba(34,197,94,0.15)] text-[#22C55E]" : "bg-[rgba(245,158,11,0.15)] text-[#F59E0B]"
                }`}>
                  {q.pct}%
                </div>
                <div>
                  <p className="text-[#E8E0D5] font-medium text-sm">{q.subject} — {q.score}</p>
                  <p className="text-[#A0B0BC] text-xs">{q.date}</p>
                </div>
              </div>
              <div className="w-24 h-2 bg-[#2D3E50] rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${q.pct}%`,
                    backgroundColor: q.pct >= 80 ? "#22C55E" : "#F59E0B",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
