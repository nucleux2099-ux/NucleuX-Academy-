"use client";

import { useState } from "react";
import { Bookmark, Search, FolderPlus, Folder, X, BookOpen, FileText, Brain, Video, Stethoscope } from "lucide-react";

const tabs = ["Topics", "Notes", "MCQs", "Lectures", "Cases"];
const tabIcons: Record<string, React.ElementType> = { Topics: BookOpen, Notes: FileText, MCQs: Brain, Lectures: Video, Cases: Stethoscope };

const bookmarks = [
  { id: 1, tab: "Topics", title: "Acute Pancreatitis", source: "Surgery Module", date: "Feb 14" },
  { id: 2, tab: "Topics", title: "Portal Hypertension", source: "Surgery Module", date: "Feb 12" },
  { id: 3, tab: "Topics", title: "Thyroid Carcinoma", source: "Surgery Module", date: "Feb 10" },
  { id: 4, tab: "Notes", title: "Whipple Procedure Steps", source: "My Notes", date: "Feb 13" },
  { id: 5, tab: "Notes", title: "Glasgow Coma Scale", source: "My Notes", date: "Feb 11" },
  { id: 6, tab: "MCQs", title: "Surgery Set 12 — Q7", source: "MCQ Bank", date: "Feb 14" },
  { id: 7, tab: "MCQs", title: "Anatomy — Brachial Plexus Q3", source: "MCQ Bank", date: "Feb 9" },
  { id: 8, tab: "Lectures", title: "Whipple Procedure — Dr. Kumar", source: "Video Library", date: "Feb 8" },
  { id: 9, tab: "Cases", title: "Obstructive Jaundice Workup", source: "Case Studies", date: "Feb 7" },
  { id: 10, tab: "Cases", title: "Acute Appendicitis — Atypical", source: "Case Studies", date: "Feb 5" },
];

const collections = [
  { name: "Exam Prep", count: 12, emoji: "📚" },
  { name: "Weak Topics", count: 5, emoji: "⚠️" },
  { name: "Important Cases", count: 8, emoji: "🏥" },
];

export default function BookmarksPage() {
  const [activeTab, setActiveTab] = useState("Topics");
  const [search, setSearch] = useState("");

  const filtered = bookmarks
    .filter((b) => b.tab === activeTab)
    .filter((b) => !search || b.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#E8E0D5] flex items-center gap-2">
            <Bookmark className="w-7 h-7 text-[#C9A86C]" /> Bookmarks
          </h1>
          <p className="text-[#A0B0BC] text-sm mt-1">Your saved content, organized</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main content */}
        <div className="flex-1 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#A0B0BC] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bookmarks..."
              className="w-full bg-[#253545] border border-[rgba(232,224,213,0.06)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#E8E0D5] placeholder:text-[#A0B0BC] focus:outline-none focus:border-[#C9A86C]"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {tabs.map((t) => {
              const Icon = tabIcons[t];
              const count = bookmarks.filter((b) => b.tab === t).length;
              return (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition ${
                    activeTab === t
                      ? "bg-[#C9A86C] text-[#1a1a2e]"
                      : "bg-[#253545] text-[#A0B0BC] border border-[rgba(232,224,213,0.06)]"
                  }`}>
                  <Icon className="w-4 h-4" /> {t} ({count})
                </button>
              );
            })}
          </div>

          {/* Cards */}
          {filtered.length === 0 ? (
            <div className="bg-[#253545] rounded-xl border border-[rgba(232,224,213,0.06)] p-12 text-center">
              <Bookmark className="w-12 h-12 text-[#A0B0BC] mx-auto mb-3 opacity-40" />
              <p className="text-[#A0B0BC] text-sm">No bookmarks in {activeTab} yet</p>
              <p className="text-[#A0B0BC] text-xs mt-1">Save content while studying to find it here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map((b) => (
                <div key={b.id} className="bg-[#253545] rounded-xl border border-[rgba(232,224,213,0.06)] p-4 flex items-start justify-between group">
                  <div>
                    <h3 className="text-[#E8E0D5] font-medium text-sm">{b.title}</h3>
                    <p className="text-[#A0B0BC] text-xs mt-1">{b.source} • {b.date}</p>
                  </div>
                  <button className="text-[#A0B0BC] hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Collections Sidebar */}
        <div className="w-64 hidden lg:block space-y-4">
          <div className="bg-[#253545] rounded-xl border border-[rgba(232,224,213,0.06)] p-4">
            <h3 className="text-[#E8E0D5] font-semibold text-sm mb-3 flex items-center gap-2">
              <Folder className="w-4 h-4 text-[#C9A86C]" /> Collections
            </h3>
            <div className="space-y-2">
              {collections.map((c) => (
                <button key={c.name} className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#2D3E50] hover:bg-[#344a5e] transition text-left">
                  <span className="flex items-center gap-2 text-[#E8E0D5] text-sm">
                    {c.emoji} {c.name}
                  </span>
                  <span className="text-[#A0B0BC] text-xs">{c.count}</span>
                </button>
              ))}
            </div>
            <button className="w-full mt-3 py-2 rounded-lg border border-dashed border-[#C9A86C]/40 text-[#C9A86C] text-sm flex items-center justify-center gap-2 hover:bg-[rgba(201,168,108,0.1)] transition">
              <FolderPlus className="w-4 h-4" /> Create Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
