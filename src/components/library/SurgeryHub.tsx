"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Library, Search, BookOpen, GraduationCap, Stethoscope } from "lucide-react";
import { getSubspecialtiesBySubject } from "@/lib/data/subspecialties";
import { SURGERY_SUBSPECIALTIES, getTotalUGCompetencies, SURGERY_UG_MODULES } from "@/lib/data/cbme-surgery";

/* ─── Logical clusters ─── */
type Cluster = {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;       // tailwind border color
  slugs: string[];     // subspecialty slugs in learning order
};

const CLUSTERS: Cluster[] = [
  {
    id: "foundations",
    name: "Foundations",
    icon: "🏗️",
    description: "Start here — surgical principles, procedures, and trauma management",
    color: "border-green-500/40",
    slugs: ["general-topics", "procedures", "trauma"],
  },
  {
    id: "gi-surgery",
    name: "GI Surgery",
    icon: "🍽️",
    description: "Alimentary tract in anatomical sequence — mouth to anus",
    color: "border-amber-500/40",
    slugs: ["esophagus", "stomach-duodenum", "hepatobiliary", "pancreas", "small-intestine", "colorectal", "anorectal"],
  },
  {
    id: "specialty-systems",
    name: "Specialty Systems",
    icon: "🦋",
    description: "Organ-specific surgical subspecialties",
    color: "border-blue-500/40",
    slugs: ["endocrine", "breast", "head-neck", "vascular", "thoracic", "urology"],
  },
  {
    id: "abdominal-wall",
    name: "Abdominal Wall",
    icon: "🔲",
    description: "Hernia surgery — inguinal to incisional",
    color: "border-purple-500/40",
    slugs: ["hernia"],
  },
  {
    id: "msk",
    name: "Musculoskeletal",
    icon: "🦴",
    description: "Orthopedic principles for surgeons",
    color: "border-orange-500/40",
    slugs: ["orthopedic-principles"],
  },
];

/* ─── Level badge helper ─── */
function levelBadge(level: string) {
  const map: Record<string, string> = {
    UG: "bg-green-600/20 text-green-400 border-green-500/30",
    PG: "bg-blue-600/20 text-blue-400 border-blue-500/30",
    SS: "bg-red-600/20 text-red-400 border-red-500/30",
  };
  return map[level] ?? "bg-zinc-600/20 text-zinc-400 border-zinc-500/30";
}

/* ─── Search helper ─── */
function matches(text: string, query: string) {
  return text.toLowerCase().includes(query.toLowerCase());
}

type ViewMode = "clusters" | "all" | "by-level";

export default function SurgeryHub({ mode }: { mode?: string | null }) {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("clusters");

  const allSubspecs = getSubspecialtiesBySubject("surgery");
  const cbmeMap = new Map(SURGERY_SUBSPECIALTIES.map((s) => [s.slug, s]));
  const totalUG = getTotalUGCompetencies();

  // Filter subspecialties by search
  const filtered = allSubspecs.filter(
    (s) => !search || matches(s.name, search) || matches(s.description, search) || matches(s.slug, search)
  );
  const filteredSlugs = new Set(filtered.map((s) => s.slug));

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/library" className="text-[#A0B0BC] hover:text-[#5BB3B3] transition-colors">
          Library
        </Link>
        <ChevronRight className="w-4 h-4 text-[#6B7280]" />
        <span className="text-[#E8E0D5]">Surgery</span>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#3A4D5F] to-[#2D3B47] border border-[rgba(91,179,179,0.15)] rounded-xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🔪</span>
              <h1 className="text-2xl font-bold text-[#E8E0D5]">Surgery</h1>
            </div>
            <p className="text-[#A0B0BC] max-w-2xl">
              Complete surgical curriculum from basic principles to super-specialty depth.
              Topics organized for progressive learning — UG foundations through MCh mastery.
            </p>
          </div>

          {/* CBME link */}
          <Link
            href="/cbme/surgery"
            className="px-4 py-2 rounded-lg bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 text-sm font-medium transition-colors flex items-center gap-2 shrink-0"
          >
            <GraduationCap className="w-4 h-4" />
            CBME Curriculum Map
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">
          <div className="bg-[#2D3B47]/80 rounded-lg p-3 border border-[rgba(91,179,179,0.08)]">
            <div className="text-xl font-bold text-[#E8E0D5]">{allSubspecs.length}</div>
            <div className="text-xs text-[#6B7280]">Subspecialties</div>
          </div>
          <div className="bg-[#2D3B47]/80 rounded-lg p-3 border border-[rgba(91,179,179,0.08)]">
            <div className="text-xl font-bold text-[#E8E0D5]">175</div>
            <div className="text-xs text-[#6B7280]">Topics</div>
          </div>
          <div className="bg-[#2D3B47]/80 rounded-lg p-3 border border-[rgba(91,179,179,0.08)]">
            <div className="text-xl font-bold text-green-400">{totalUG}</div>
            <div className="text-xs text-[#6B7280]">UG Competencies</div>
          </div>
          <div className="bg-[#2D3B47]/80 rounded-lg p-3 border border-[rgba(91,179,179,0.08)]">
            <div className="text-xl font-bold text-blue-400">30</div>
            <div className="text-xs text-[#6B7280]">NMC Modules</div>
          </div>
          <div className="bg-[#2D3B47]/80 rounded-lg p-3 border border-[rgba(91,179,179,0.08)]">
            <div className="text-xl font-bold text-red-400">6</div>
            <div className="text-xs text-[#6B7280]">MCh Specialties</div>
          </div>
        </div>
      </div>

      {/* Progression Visual */}
      <div className="bg-[#3A4D5F]/50 border border-[rgba(91,179,179,0.1)] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#A0B0BC] mb-3">Training Progression</h3>
        <div className="flex items-center gap-3 text-sm overflow-x-auto pb-1">
          <div className="text-center shrink-0">
            <div className="px-4 py-2 rounded-lg border bg-green-600/15 text-green-400 border-green-500/25">
              <div className="font-semibold">🟢 UG (MBBS)</div>
              <div className="text-xs opacity-70 mt-0.5">SU1–SU30 · {totalUG} codes</div>
              <div className="text-xs opacity-50">K / KH level</div>
            </div>
          </div>
          <div className="text-[#6B7280] text-lg shrink-0">→</div>
          <div className="text-center shrink-0">
            <div className="px-4 py-2 rounded-lg border bg-blue-600/15 text-blue-400 border-blue-500/25">
              <div className="font-semibold">🔵 PG (MS Surgery)</div>
              <div className="text-xs opacity-70 mt-0.5">3 years · Systemic Surgery</div>
              <div className="text-xs opacity-50">SH level</div>
            </div>
          </div>
          <div className="text-[#6B7280] text-lg shrink-0">→</div>
          <div className="text-center shrink-0">
            <div className="px-4 py-2 rounded-lg border bg-red-600/15 text-red-400 border-red-500/25">
              <div className="font-semibold">🔴 SS (MCh)</div>
              <div className="text-xs opacity-70 mt-0.5">3 years · 6 Specialties</div>
              <div className="text-xs opacity-50">P level</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search + View Toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search subspecialties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#3A4D5F] border border-[rgba(91,179,179,0.15)] rounded-lg text-[#E8E0D5] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[rgba(91,179,179,0.3)] text-sm"
          />
        </div>
        <div className="flex gap-1">
          {([
            { key: "clusters" as ViewMode, label: "By System" },
            { key: "by-level" as ViewMode, label: "By Level" },
            { key: "all" as ViewMode, label: "A–Z" },
          ]).map((v) => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                view === v.key
                  ? "bg-[#5BB3B3] text-white"
                  : "bg-[#3A4D5F] text-[#A0B0BC] hover:text-[#E8E0D5]"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ CLUSTERS VIEW ═══ */}
      {view === "clusters" && (
        <div className="space-y-8">
          {CLUSTERS.map((cluster) => {
            const clusterSubspecs = cluster.slugs
              .map((slug) => filtered.find((s) => s.slug === slug))
              .filter(Boolean) as typeof filtered;
            if (clusterSubspecs.length === 0) return null;

            return (
              <div key={cluster.id}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{cluster.icon}</span>
                  <div>
                    <h2 className="text-lg font-semibold text-[#E8E0D5]">{cluster.name}</h2>
                    <p className="text-xs text-[#6B7280]">{cluster.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {clusterSubspecs.map((sub, idx) => {
                    const cbme = cbmeMap.get(sub.slug);
                    const href = mode
                      ? `/library/surgery/${sub.slug}?mode=${mode}`
                      : `/library/surgery/${sub.slug}`;

                    return (
                      <Link key={sub.id} href={href}>
                        <div className={`group bg-[#3A4D5F] border-l-4 ${cluster.color} rounded-lg p-4 hover:bg-[#435B6D] transition-all cursor-pointer h-full`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{sub.icon}</span>
                              <h3 className="font-semibold text-[#E8E0D5] group-hover:text-[#5BB3B3] transition-colors text-sm">
                                {sub.name}
                              </h3>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#5BB3B3] group-hover:translate-x-1 transition-all shrink-0" />
                          </div>

                          <p className="text-xs text-[#A0B0BC] mb-3 line-clamp-2">{sub.description}</p>

                          {/* Level badges + topic count */}
                          <div className="flex items-center justify-between pt-2 border-t border-[rgba(91,179,179,0.08)]">
                            <div className="flex gap-1">
                              {cbme?.levels.map((l) => (
                                <span
                                  key={l}
                                  className={`px-1.5 py-0.5 text-[10px] rounded border font-medium ${levelBadge(l)}`}
                                >
                                  {l}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                              <BookOpen className="w-3 h-3" />
                              <span>{sub.topicCount}</span>
                            </div>
                          </div>

                          {/* UG/PG/SS counts */}
                          {cbme && (
                            <div className="flex gap-3 mt-2 text-[10px] text-[#6B7280]">
                              {cbme.ugTopicCount > 0 && <span className="text-green-500/70">{cbme.ugTopicCount} UG</span>}
                              {cbme.pgTopicCount > 0 && <span className="text-blue-500/70">{cbme.pgTopicCount} PG</span>}
                              {cbme.ssTopicCount > 0 && <span className="text-red-500/70">{cbme.ssTopicCount} SS</span>}
                            </div>
                          )}

                          {/* Sequence indicator for GI */}
                          {cluster.id === "gi-surgery" && idx < clusterSubspecs.length - 1 && (
                            <div className="text-[10px] text-[#5BB3B3]/40 mt-1 text-right">↓ continues below</div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ BY LEVEL VIEW ═══ */}
      {view === "by-level" && (
        <div className="space-y-8">
          {(["UG", "PG", "SS"] as const).map((level) => {
            const levelSubspecs = filtered.filter((s) => {
              const cbme = cbmeMap.get(s.slug);
              return cbme?.levels.includes(level);
            });
            if (levelSubspecs.length === 0) return null;

            const levelInfo = {
              UG: { color: "border-green-500/40", bg: "bg-green-600/10", text: "text-green-400", label: "UG — MBBS (Know / Know How)", desc: "Foundation topics every graduate must know" },
              PG: { color: "border-blue-500/40", bg: "bg-blue-600/10", text: "text-blue-400", label: "PG — MS Surgery (Show How)", desc: "Deeper surgical knowledge for residents" },
              SS: { color: "border-red-500/40", bg: "bg-red-600/10", text: "text-red-400", label: "SS — MCh (Perform)", desc: "Super-specialty surgical mastery" },
            }[level];

            return (
              <div key={level}>
                <div className={`flex items-center gap-2 mb-3 ${levelInfo.text}`}>
                  <Stethoscope className="w-5 h-5" />
                  <div>
                    <h2 className="text-lg font-semibold">{levelInfo.label}</h2>
                    <p className="text-xs text-[#6B7280]">{levelInfo.desc}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {levelSubspecs.map((sub) => {
                    const href = mode
                      ? `/library/surgery/${sub.slug}?mode=${mode}`
                      : `/library/surgery/${sub.slug}`;
                    const cbme = cbmeMap.get(sub.slug);
                    const count = level === "UG" ? cbme?.ugTopicCount : level === "PG" ? cbme?.pgTopicCount : cbme?.ssTopicCount;

                    return (
                      <Link key={sub.id} href={href}>
                        <div className={`group bg-[#3A4D5F] border-l-4 ${levelInfo.color} rounded-lg p-4 hover:bg-[#435B6D] transition-all cursor-pointer`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span>{sub.icon}</span>
                            <h3 className="font-semibold text-[#E8E0D5] group-hover:text-[#5BB3B3] text-sm">{sub.name}</h3>
                            <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#5BB3B3] ml-auto" />
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                            <span className={levelInfo.text}>{count} topics at {level} depth</span>
                            <span>· {sub.topicCount} total</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ A-Z VIEW ═══ */}
      {view === "all" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((sub) => {
              const cbme = cbmeMap.get(sub.slug);
              const href = mode
                ? `/library/surgery/${sub.slug}?mode=${mode}`
                : `/library/surgery/${sub.slug}`;

              return (
                <Link key={sub.id} href={href}>
                  <div className="group bg-[#3A4D5F] border border-[rgba(91,179,179,0.1)] hover:border-[rgba(91,179,179,0.3)] rounded-lg p-4 transition-all cursor-pointer h-full">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{sub.icon}</span>
                        <h3 className="font-semibold text-[#E8E0D5] group-hover:text-[#5BB3B3] text-sm">{sub.name}</h3>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#5BB3B3] shrink-0" />
                    </div>
                    <p className="text-xs text-[#A0B0BC] mb-3">{sub.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-[rgba(91,179,179,0.08)]">
                      <div className="flex gap-1">
                        {cbme?.levels.map((l) => (
                          <span key={l} className={`px-1.5 py-0.5 text-[10px] rounded border font-medium ${levelBadge(l)}`}>{l}</span>
                        ))}
                      </div>
                      <span className="text-xs text-[#6B7280]">{sub.topicCount} topics</span>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      )}

      {/* Start Here callout for UG students */}
      <div className="bg-gradient-to-r from-green-600/10 to-transparent border border-green-500/20 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-green-400 mb-1">🎯 New to Surgery?</h3>
        <p className="text-xs text-[#A0B0BC] mb-3">
          Start with <strong>Foundations</strong> — General Topics covers SU1-SU16 (shock, wounds, burns, nutrition, periop care).
          Then move to Trauma (SU17) before diving into organ systems.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Link href="/library/surgery/general-topics" className="px-3 py-1.5 rounded bg-green-600/20 text-green-400 border border-green-500/30 text-xs font-medium hover:bg-green-600/30 transition-colors">
            📋 General Topics → Start Here
          </Link>
          <Link href="/library/surgery/trauma" className="px-3 py-1.5 rounded bg-green-600/10 text-green-400/70 border border-green-500/20 text-xs hover:bg-green-600/20 transition-colors">
            🚑 Trauma → Next
          </Link>
          <Link href="/cbme/surgery" className="px-3 py-1.5 rounded bg-zinc-700/50 text-[#A0B0BC] border border-zinc-600/30 text-xs hover:text-white transition-colors">
            📋 Full CBME Map
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[rgba(91,179,179,0.08)] pt-4 text-xs text-[#6B7280] flex gap-4 flex-wrap">
        <span>{allSubspecs.length} subspecialties</span>
        <span>175 topics</span>
        <span>{totalUG} UG competencies</span>
        <span>Source: NMC CBME 2019</span>
      </div>
    </div>
  );
}
