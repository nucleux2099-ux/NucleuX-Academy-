"use client";

import { useState } from "react";
import { Award, Lock, Star, Sparkles, Trophy, Zap } from "lucide-react";

const categories = ["All", "Learning", "Practice", "Community", "Milestones"];

const achievements = [
  { id: 1, emoji: "🩸", title: "First Blood", desc: "Answer your first MCQ", cat: "Practice", unlocked: "Jan 15, 2025", progress: 100, rarity: "Common" },
  { id: 2, emoji: "💯", title: "Century", desc: "Complete 100 MCQs", cat: "Practice", unlocked: "Feb 1, 2025", progress: 100, rarity: "Common" },
  { id: 3, emoji: "🌙", title: "Night Owl", desc: "Study after midnight", cat: "Learning", unlocked: "Jan 22, 2025", progress: 100, rarity: "Rare" },
  { id: 4, emoji: "⚛️", title: "ATOM Whisperer", desc: "50 AI chat sessions", cat: "Community", unlocked: "Feb 10, 2025", progress: 100, rarity: "Rare" },
  { id: 5, emoji: "🔥", title: "Streak Master", desc: "Maintain 30-day streak", cat: "Milestones", unlocked: null, progress: 50, rarity: "Legendary" },
  { id: 6, emoji: "🦴", title: "Anatomy Atlas", desc: "Complete all anatomy topics", cat: "Learning", unlocked: null, progress: 72, rarity: "Rare" },
  { id: 7, emoji: "📖", title: "Bookworm", desc: "Read 50 topics", cat: "Learning", unlocked: "Jan 28, 2025", progress: 100, rarity: "Common" },
  { id: 8, emoji: "⚡", title: "Speed Demon", desc: "Answer 10 MCQs under 30 sec each", cat: "Practice", unlocked: "Feb 5, 2025", progress: 100, rarity: "Common" },
  { id: 9, emoji: "🏆", title: "Top 10", desc: "Reach Top 10 on leaderboard", cat: "Milestones", unlocked: null, progress: 0, rarity: "Legendary" },
  { id: 10, emoji: "🤝", title: "Team Player", desc: "Join 5 study groups", cat: "Community", unlocked: null, progress: 60, rarity: "Common" },
  { id: 11, emoji: "🎯", title: "Sharpshooter", desc: "Score 100% on a 50-Q test", cat: "Practice", unlocked: null, progress: 0, rarity: "Rare" },
  { id: 12, emoji: "📝", title: "Note Taker", desc: "Create 25 notes", cat: "Learning", unlocked: "Feb 8, 2025", progress: 100, rarity: "Common" },
  { id: 13, emoji: "🎬", title: "Lecture Buff", desc: "Watch 20 lectures", cat: "Learning", unlocked: null, progress: 85, rarity: "Common" },
  { id: 14, emoji: "💊", title: "Pharma Pro", desc: "Complete all pharmacology topics", cat: "Learning", unlocked: null, progress: 40, rarity: "Rare" },
  { id: 15, emoji: "🌟", title: "Rising Star", desc: "Earn 5,000 XP", cat: "Milestones", unlocked: "Feb 12, 2025", progress: 100, rarity: "Common" },
  { id: 16, emoji: "🧠", title: "Knowledge Seeker", desc: "Study 100 hours total", cat: "Milestones", unlocked: null, progress: 65, rarity: "Rare" },
];

const rarityColors: Record<string, string> = {
  Common: "#A0B0BC",
  Rare: "#6366F1",
  Legendary: "#F59E0B",
};

export default function AchievementsPage() {
  const [activeCat, setActiveCat] = useState("All");

  const filtered = activeCat === "All" ? achievements : achievements.filter((a) => a.cat === activeCat);
  const unlocked = achievements.filter((a) => a.unlocked).length;
  const rare = achievements.filter((a) => a.rarity === "Rare" && a.unlocked).length;
  const legendary = achievements.filter((a) => a.rarity === "Legendary" && a.unlocked).length;

  // Most recent unlock
  const recentUnlock = achievements.filter((a) => a.unlocked).sort().at(-1);

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#E8E0D5] flex items-center gap-2">
          <Award className="w-7 h-7 text-[#F59E0B]" /> Achievements
        </h1>
        <p className="text-[#A0B0BC] text-sm mt-1">Collect badges, unlock glory</p>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4">
        {[
          { label: `${unlocked}/${achievements.length} Unlocked`, icon: Trophy, color: "#F59E0B" },
          { label: `${rare} Rare`, icon: Star, color: "#6366F1" },
          { label: `${legendary} Legendary`, icon: Sparkles, color: "#F59E0B" },
        ].map((s) => (
          <div key={s.label} className="bg-[#253545] rounded-xl border border-[rgba(232,224,213,0.06)] px-4 py-3 flex items-center gap-2">
            <s.icon className="w-4 h-4" style={{ color: s.color }} />
            <span className="text-[#E8E0D5] text-sm font-medium">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Recent Unlock */}
      {recentUnlock && (
        <div className="bg-[rgba(245,158,11,0.1)] rounded-xl border border-[#F59E0B]/30 p-4 flex items-center gap-4">
          <div className="text-3xl">{recentUnlock.emoji}</div>
          <div>
            <p className="text-[#F59E0B] text-xs font-medium flex items-center gap-1"><Zap className="w-3 h-3" /> Latest Unlock</p>
            <p className="text-[#E8E0D5] font-semibold">{recentUnlock.title}</p>
            <p className="text-[#A0B0BC] text-xs">{recentUnlock.desc} • {recentUnlock.unlocked}</p>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((c) => (
          <button key={c} onClick={() => setActiveCat(c)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeCat === c ? "bg-[#F59E0B] text-[#1a1a2e]" : "bg-[#253545] text-[#A0B0BC] border border-[rgba(232,224,213,0.06)]"
            }`}>{c}</button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((a) => (
          <div key={a.id}
            className={`bg-[#253545] rounded-xl border border-[rgba(232,224,213,0.06)] p-4 relative ${
              !a.unlocked ? "opacity-70" : ""
            }`}>
            {!a.unlocked && a.progress === 0 && (
              <Lock className="w-4 h-4 text-[#A0B0BC] absolute top-3 right-3" />
            )}
            <div className="text-3xl mb-3">{a.emoji}</div>
            <h3 className="text-[#E8E0D5] font-semibold text-sm">{a.title}</h3>
            <p className="text-[#A0B0BC] text-xs mt-1">{a.desc}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{
                backgroundColor: `${rarityColors[a.rarity]}20`,
                color: rarityColors[a.rarity],
              }}>{a.rarity}</span>
            </div>
            {a.unlocked ? (
              <p className="text-xs text-[#22C55E] mt-3">✓ {a.unlocked}</p>
            ) : a.progress > 0 ? (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-[#A0B0BC] mb-1">
                  <span>Progress</span><span>{a.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#2D3E50] rounded-full">
                  <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: `${a.progress}%` }} />
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#A0B0BC] mt-3">🔒 Locked</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
