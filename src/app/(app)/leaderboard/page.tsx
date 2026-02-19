"use client";

import { useState } from "react";
import { Trophy, Medal, Crown, TrendingUp, User } from "lucide-react";

const periods = ["This Week", "This Month", "All Time"];
const subjectTabs = ["Overall", "Surgery", "Medicine"];

const users = [
  { rank: 1, name: "Priya Sharma", xp: 12450, accuracy: 94, streak: 45, level: 28 },
  { rank: 2, name: "Arjun Mehta", xp: 11890, accuracy: 91, streak: 38, level: 26 },
  { rank: 3, name: "Kavitha Nair", xp: 11200, accuracy: 89, streak: 42, level: 25 },
  { rank: 4, name: "Rohit Gupta", xp: 10750, accuracy: 87, streak: 30, level: 24 },
  { rank: 5, name: "Sneha Reddy", xp: 10200, accuracy: 86, streak: 28, level: 23 },
  { rank: 6, name: "Vikram Singh", xp: 9800, accuracy: 85, streak: 25, level: 22 },
  { rank: 7, name: "Anjali Desai", xp: 9350, accuracy: 83, streak: 22, level: 21 },
  { rank: 8, name: "Karthik Iyer", xp: 8900, accuracy: 82, streak: 20, level: 20 },
  { rank: 9, name: "Divya Patel", xp: 8500, accuracy: 80, streak: 18, level: 19 },
  { rank: 10, name: "Arun Kumar", xp: 8100, accuracy: 79, streak: 15, level: 18 },
  { rank: 11, name: "Meera Joshi", xp: 7800, accuracy: 78, streak: 14, level: 17 },
  { rank: 12, name: "Aditya C.", xp: 7500, accuracy: 76, streak: 15, level: 16 },
  { rank: 13, name: "Rashi Verma", xp: 7200, accuracy: 75, streak: 12, level: 15 },
  { rank: 14, name: "Suresh Menon", xp: 6900, accuracy: 74, streak: 10, level: 14 },
  { rank: 15, name: "Neha Kapoor", xp: 6600, accuracy: 73, streak: 8, level: 13 },
];

const podiumColors = ["#D4AF37", "#C0C0C0", "#CD7F32"];
const podiumIcons = [Crown, Medal, Medal];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState("This Week");
  const [subject, setSubject] = useState("Overall");

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#E8E0D5] flex items-center gap-2">
            <Trophy className="w-7 h-7 text-[#D4AF37]" /> Leaderboard
          </h1>
          <p className="text-[#A0B0BC] text-sm mt-1">Compete, climb, conquer</p>
        </div>
      </div>

      {/* Your Rank Card */}
      <div className="bg-[rgba(212,175,55,0.1)] rounded-xl border border-[#D4AF37]/30 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
            <User className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-[#E8E0D5] font-semibold">Your Rank: <span className="text-[#D4AF37]">#12</span> out of 234</p>
            <p className="text-[#A0B0BC] text-sm">7,500 XP • 76% Accuracy • Level 16</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[#22C55E] text-sm font-medium">
          <TrendingUp className="w-4 h-4" /> +3 this week
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {periods.map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                period === p ? "bg-[#D4AF37] text-[#1a1a2e]" : "bg-[#253545] text-[#A0B0BC] border border-[rgba(232,224,213,0.06)]"
              }`}>{p}</button>
          ))}
        </div>
        <div className="flex gap-2">
          {subjectTabs.map((s) => (
            <button key={s} onClick={() => setSubject(s)}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                subject === s ? "bg-[rgba(212,175,55,0.15)] text-[#D4AF37] border border-[#D4AF37]" : "bg-[#253545] text-[#A0B0BC] border border-[rgba(232,224,213,0.06)]"
              }`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-4 py-6">
        {[1, 0, 2].map((idx) => {
          const u = users[idx];
          const Icon = podiumIcons[idx];
          const isFirst = idx === 0;
          return (
            <div key={u.rank} className={`flex flex-col items-center ${isFirst ? "mb-4" : ""}`}>
              <Icon className="w-6 h-6 mb-2" style={{ color: podiumColors[idx] }} />
              <div className={`${isFirst ? "w-20 h-20" : "w-16 h-16"} rounded-full bg-[#253545] border-2 flex items-center justify-center text-xl font-bold text-[#E8E0D5]`}
                style={{ borderColor: podiumColors[idx] }}>
                {u.name.charAt(0)}
              </div>
              <p className="text-[#E8E0D5] font-semibold text-sm mt-2">{u.name}</p>
              <p className="text-sm font-bold mt-1" style={{ color: podiumColors[idx] }}>{u.xp.toLocaleString()} XP</p>
              <div className={`${isFirst ? "h-24" : idx === 1 ? "h-16" : "h-12"} w-20 rounded-t-xl mt-2 flex items-center justify-center text-2xl font-bold text-[#1a1a2e]`}
                style={{ backgroundColor: podiumColors[idx] }}>
                #{u.rank}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rankings Table */}
      <div className="bg-[#253545] rounded-xl border border-[rgba(232,224,213,0.06)] overflow-hidden">
        <div className="grid grid-cols-[60px_1fr_80px_80px_70px_60px] gap-2 px-4 py-3 text-xs text-[#A0B0BC] font-medium border-b border-[rgba(232,224,213,0.06)]">
          <span>Rank</span><span>Name</span><span>XP</span><span>Accuracy</span><span>Streak</span><span>Level</span>
        </div>
        {users.map((u) => (
          <div key={u.rank}
            className={`grid grid-cols-[60px_1fr_80px_80px_70px_60px] gap-2 px-4 py-3 items-center text-sm border-b border-[rgba(232,224,213,0.06)] last:border-0 ${
              u.rank === 12 ? "bg-[rgba(212,175,55,0.08)]" : ""
            }`}>
            <span className={`font-bold ${u.rank <= 3 ? "text-[#D4AF37]" : "text-[#A0B0BC]"}`}>#{u.rank}</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#2D3E50] flex items-center justify-center text-xs font-bold text-[#E8E0D5]">
                {u.name.charAt(0)}
              </div>
              <span className={`${u.rank === 12 ? "text-[#D4AF37] font-semibold" : "text-[#E8E0D5]"}`}>{u.name}</span>
            </div>
            <span className="text-[#E8E0D5] font-medium">{u.xp.toLocaleString()}</span>
            <span className="text-[#E8E0D5]">{u.accuracy}%</span>
            <span className="text-[#E8E0D5]">{u.streak}🔥</span>
            <span className="text-[#A0B0BC]">Lv.{u.level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
