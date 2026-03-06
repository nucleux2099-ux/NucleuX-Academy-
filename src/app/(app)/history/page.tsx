"use client";

import { useState } from "react";
import { Clock, BookOpen, Brain, MessageCircle, FileText, Video } from "lucide-react";

const filters = ["All", "Reading", "MCQ", "Chat", "Notes", "Lectures"];
const filterIcons: Record<string, React.ElementType> = { All: Clock, Reading: BookOpen, MCQ: Brain, Chat: MessageCircle, Notes: FileText, Lectures: Video };

type Activity = { id: number; type: string; desc: string; time: string; subject: string; section: string; detail?: string };

const activities: Activity[] = [
  { id: 1, type: "Reading", desc: "Read: Acute Pancreatitis", time: "2:30 PM", subject: "Surgery", section: "Today" },
  { id: 2, type: "MCQ", desc: "MCQ: Surgery Set 12", time: "1:45 PM", subject: "Surgery", section: "Today", detail: "8/10" },
  { id: 3, type: "Chat", desc: "Chat with ATOM: Liver anatomy", time: "12:15 PM", subject: "Anatomy", section: "Today" },
  { id: 4, type: "Notes", desc: "Note created: Portal Hypertension", time: "11:30 AM", subject: "Surgery", section: "Today" },
  { id: 5, type: "Lectures", desc: "Lecture: Whipple Procedure", time: "10:00 AM", subject: "Surgery", section: "Today", detail: "32 min" },
  { id: 6, type: "Reading", desc: "Read: Thyroid Carcinoma", time: "9:00 AM", subject: "Surgery", section: "Today" },
  { id: 7, type: "MCQ", desc: "MCQ: Anatomy Set 5", time: "9:15 PM", subject: "Anatomy", section: "Yesterday", detail: "14/20" },
  { id: 8, type: "Chat", desc: "Chat with ATOM: Brachial plexus", time: "7:30 PM", subject: "Anatomy", section: "Yesterday" },
  { id: 9, type: "Reading", desc: "Read: Obstructive Jaundice", time: "5:00 PM", subject: "Surgery", section: "Yesterday" },
  { id: 10, type: "Notes", desc: "Note created: GCS Scale", time: "3:45 PM", subject: "Surgery", section: "Yesterday" },
  { id: 11, type: "Lectures", desc: "Lecture: Cholecystectomy", time: "2:00 PM", subject: "Surgery", section: "Yesterday", detail: "45 min" },
  { id: 12, type: "MCQ", desc: "MCQ: Pathology Set 8", time: "11:00 AM", subject: "Pathology", section: "Yesterday", detail: "9/10" },
  { id: 13, type: "Reading", desc: "Read: Appendicitis", time: "Thu", subject: "Surgery", section: "This Week" },
  { id: 14, type: "Chat", desc: "Chat with ATOM: Pancreatitis mgmt", time: "Wed", subject: "Surgery", section: "This Week" },
  { id: 15, type: "MCQ", desc: "MCQ: Pharmacology Set 3", time: "Wed", subject: "Pharmacology", section: "This Week", detail: "7/10" },
  { id: 16, type: "Lectures", desc: "Lecture: Hernia Repair", time: "Tue", subject: "Surgery", section: "This Week", detail: "28 min" },
  { id: 17, type: "Notes", desc: "Note created: Drug Interactions", time: "Tue", subject: "Pharmacology", section: "This Week" },
  { id: 18, type: "Reading", desc: "Read: Intestinal Obstruction", time: "Mon", subject: "Surgery", section: "This Week" },
];

const typeColors: Record<string, { bg: string; text: string; Icon: React.ElementType }> = {
  Reading: { bg: "rgba(123,166,158,0.15)", text: "#7BA69E", Icon: BookOpen },
  MCQ: { bg: "rgba(91,179,179,0.15)", text: "#5BB3B3", Icon: Brain },
  Chat: { bg: "rgba(168,85,247,0.15)", text: "#A855F7", Icon: MessageCircle },
  Notes: { bg: "rgba(245,158,11,0.15)", text: "#F59E0B", Icon: FileText },
  Lectures: { bg: "rgba(239,68,68,0.15)", text: "#EF4444", Icon: Video },
};

const sections = ["Today", "Yesterday", "This Week"];

export default function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All" ? activities : activities.filter((a) => a.type === activeFilter);

  return (
    <div className="ui-shell ui-page space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#E8E0D5] flex items-center gap-2">
          <Clock className="w-7 h-7 text-[#7BA69E]" /> History
        </h1>
        <p className="text-[#A0B0BC] text-sm mt-1">Your study activity timeline</p>
      </div>

      {/* Study Time Card */}
      <div className="bg-[rgba(123,166,158,0.1)] rounded-xl border border-[#7BA69E]/30 p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[rgba(123,166,158,0.2)] flex items-center justify-center">
          <Clock className="w-6 h-6 text-[#7BA69E]" />
        </div>
        <div>
          <p className="text-[#A0B0BC] text-xs">Study Time Today</p>
          <p className="text-[#E8E0D5] text-2xl font-bold">2h 15m</p>
        </div>
        <div className="ml-auto grid grid-cols-3 gap-4 text-center">
          {[
            { label: "Sessions", value: "6" },
            { label: "Topics", value: "4" },
            { label: "MCQs", value: "10" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-[#E8E0D5] font-bold">{s.value}</p>
              <p className="text-[#A0B0BC] text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => {
          const Icon = filterIcons[f];
          return (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition ${
                activeFilter === f
                  ? "bg-[#7BA69E] text-[#1a1a2e]"
                  : "bg-[#253545] text-[#A0B0BC] border border-[rgba(232,224,213,0.06)]"
              }`}>
              <Icon className="w-3.5 h-3.5" /> {f}
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      {sections.map((section) => {
        const items = filtered.filter((a) => a.section === section);
        if (items.length === 0) return null;
        return (
          <div key={section}>
            <h2 className="text-[#A0B0BC] text-xs font-semibold uppercase tracking-wider mb-3">{section}</h2>
            <div className="space-y-2">
              {items.map((a) => {
                const tc = typeColors[a.type];
                return (
                  <div key={a.id} className="bg-[#253545] rounded-xl border border-[rgba(232,224,213,0.06)] p-3.5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: tc.bg }}>
                      <tc.Icon className="w-4 h-4" style={{ color: tc.text }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#E8E0D5] text-sm font-medium truncate">
                        {a.desc} {a.detail && <span className="text-[#A0B0BC]">({a.detail})</span>}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-xs" style={{ backgroundColor: tc.bg, color: tc.text }}>
                      {a.subject}
                    </span>
                    <span className="text-[#A0B0BC] text-xs whitespace-nowrap">{a.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
