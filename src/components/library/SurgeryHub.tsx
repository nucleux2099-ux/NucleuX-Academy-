"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Search, BookOpen, GraduationCap, Stethoscope } from "lucide-react";
import { getSubspecialtiesBySubject } from "@/lib/data/subspecialties";
import { SURGERY_SUBSPECIALTIES, getTotalUGCompetencies } from "@/lib/data/cbme-surgery";

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
    color: "border-[#7BA69E]/40",
    slugs: ["general-topics", "procedures", "trauma"],
  },
  {
    id: "gi-surgery",
    name: "GI Surgery",
    icon: "🍽️",
    description: "Alimentary tract in anatomical sequence — mouth to anus",
    color: "border-[#C9A86C]/40",
    slugs: ["esophagus", "stomach-duodenum", "hepatobiliary", "pancreas", "small-intestine", "colorectal", "anorectal"],
  },
  {
    id: "specialty-systems",
    name: "Specialty Systems",
    icon: "🦋",
    description: "Organ-specific surgical subspecialties",
    color: "border-[#5BB3B3]/40",
    slugs: ["endocrine", "breast", "head-neck", "vascular", "thoracic", "urology"],
  },
  {
    id: "abdominal-wall",
    name: "Abdominal Wall",
    icon: "🔲",
    description: "Hernia surgery — inguinal to incisional",
    color: "border-[#8EA6B7]/35",
    slugs: ["hernia"],
  },
  {
    id: "msk",
    name: "Musculoskeletal",
    icon: "🦴",
    description: "Orthopedic principles for surgeons",
    color: "border-[#5BB3B3]/30",
    slugs: ["orthopedic-principles"],
  },
];

/* ─── Level badge helper ─── */
function levelBadge(level: string) {
  const map: Record<string, string> = {
    UG: "bg-[#7BA69E]/14 text-[#A8C9C2] border-[#7BA69E]/30",
    PG: "bg-[#5BB3B3]/14 text-[#8FD5D5] border-[#5BB3B3]/30",
    SS: "bg-[#C9A86C]/14 text-[#D8BE90] border-[#C9A86C]/30",
  };
  return map[level] ?? "bg-[rgba(91,179,179,0.12)] text-[#A0B0BC] border-[rgba(91,179,179,0.25)]";
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

  return (
    <div className="ui-shell">
      <div className="ui-page space-y-5 md:space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link href="/library" className="text-[#A0B0BC] transition-colors hover:text-[#5BB3B3]">
            Library
          </Link>
          <ChevronRight className="h-4 w-4 text-[#6B7280]" />
          <span className="text-[#E8E0D5]">Surgery</span>
        </div>

        {/* Hero */}
        <div className="ui-panel ui-reveal-up p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <span className="text-3xl">🔪</span>
                <h1 className="text-2xl font-semibold text-[#E8E0D5]">Surgery</h1>
              </div>
              <p className="max-w-2xl text-[#A0B0BC]">
                Complete surgical curriculum from basic principles to super-specialty depth.
                Topics organized for progressive learning — UG foundations through MCh mastery.
              </p>
            </div>

            <Link
              href="/cbme/surgery"
              className="ui-pill ui-interactive inline-flex shrink-0 items-center gap-2 px-4 py-2 text-sm font-medium text-[#C9A86C] hover:text-[#D8BE90]"
            >
              <GraduationCap className="h-4 w-4" />
              CBME Curriculum Map
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
            <div className="ui-stat-card p-3">
              <div className="text-xl font-bold text-[#E8E0D5]">{allSubspecs.length}</div>
              <div className="text-xs text-[#6B7280]">Subspecialties</div>
            </div>
            <div className="ui-stat-card p-3">
              <div className="text-xl font-bold text-[#E8E0D5]">175</div>
              <div className="text-xs text-[#6B7280]">Topics</div>
            </div>
            <div className="ui-stat-card p-3">
              <div className="text-xl font-bold text-[#A8C9C2]">{totalUG}</div>
              <div className="text-xs text-[#6B7280]">UG Competencies</div>
            </div>
            <div className="ui-stat-card p-3">
              <div className="text-xl font-bold text-[#8FD5D5]">30</div>
              <div className="text-xs text-[#6B7280]">NMC Modules</div>
            </div>
            <div className="ui-stat-card p-3">
              <div className="text-xl font-bold text-[#D8BE90]">6</div>
              <div className="text-xs text-[#6B7280]">MCh Specialties</div>
            </div>
          </div>
        </div>

        {/* Progression Visual */}
        <div className="ui-panel ui-reveal-up ui-reveal-delay-1 p-4">
          <h3 className="mb-3 text-sm font-semibold text-[#A0B0BC]">Training Progression</h3>
          <div className="flex items-center gap-3 overflow-x-auto pb-1 text-sm">
            <div className="shrink-0 text-center">
              <div className="rounded-lg border border-[#7BA69E]/28 bg-[#7BA69E]/14 px-4 py-2 text-[#A8C9C2]">
                <div className="font-semibold">UG (MBBS)</div>
                <div className="mt-0.5 text-xs opacity-80">SU1–SU30 · {totalUG} codes</div>
                <div className="text-xs opacity-60">K / KH level</div>
              </div>
            </div>
            <div className="shrink-0 text-lg text-[#6B7280]">→</div>
            <div className="shrink-0 text-center">
              <div className="rounded-lg border border-[#5BB3B3]/28 bg-[#5BB3B3]/14 px-4 py-2 text-[#8FD5D5]">
                <div className="font-semibold">PG (MS Surgery)</div>
                <div className="mt-0.5 text-xs opacity-80">3 years · Systemic Surgery</div>
                <div className="text-xs opacity-60">SH level</div>
              </div>
            </div>
            <div className="shrink-0 text-lg text-[#6B7280]">→</div>
            <div className="shrink-0 text-center">
              <div className="rounded-lg border border-[#C9A86C]/28 bg-[#C9A86C]/14 px-4 py-2 text-[#D8BE90]">
                <div className="font-semibold">SS (MCh)</div>
                <div className="mt-0.5 text-xs opacity-80">3 years · 6 Specialties</div>
                <div className="text-xs opacity-60">P level</div>
              </div>
            </div>
          </div>
        </div>

      {/* Search + View Toggle */}
      <div className="ui-reveal-up ui-reveal-delay-1 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search subspecialties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[rgba(91,179,179,0.16)] bg-[rgba(54,74,94,0.7)] py-2 pl-10 pr-4 text-sm text-[#E8E0D5] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[rgba(91,179,179,0.25)]"
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
                  ? "ui-pill-active text-[#E8E0D5]"
                  : "ui-pill text-[#A0B0BC] hover:text-[#E8E0D5]"
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
                        <div className={`ui-panel ui-interactive group h-full rounded-lg border-l-4 ${cluster.color} p-4`}>
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
                              {cbme.ugTopicCount > 0 && <span className="text-[#A8C9C2]/90">{cbme.ugTopicCount} UG</span>}
                              {cbme.pgTopicCount > 0 && <span className="text-[#8FD5D5]/90">{cbme.pgTopicCount} PG</span>}
                              {cbme.ssTopicCount > 0 && <span className="text-[#D8BE90]/90">{cbme.ssTopicCount} SS</span>}
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
              UG: { color: "border-[#7BA69E]/40", bg: "bg-[#7BA69E]/12", text: "text-[#A8C9C2]", label: "UG — MBBS (Know / Know How)", desc: "Foundation topics every graduate must know" },
              PG: { color: "border-[#5BB3B3]/40", bg: "bg-[#5BB3B3]/12", text: "text-[#8FD5D5]", label: "PG — MS Surgery (Show How)", desc: "Deeper surgical knowledge for residents" },
              SS: { color: "border-[#C9A86C]/40", bg: "bg-[#C9A86C]/12", text: "text-[#D8BE90]", label: "SS — MCh (Perform)", desc: "Super-specialty surgical mastery" },
            }[level];

            return (
              <div key={level}>
                <div className={`mb-3 flex items-center gap-2 ${levelInfo.text}`}>
                  <Stethoscope className="h-5 w-5" />
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
                        <div className={`ui-panel ui-interactive group cursor-pointer rounded-lg border-l-4 ${levelInfo.color} p-4`}>
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
                  <div className="ui-panel ui-interactive group h-full cursor-pointer rounded-lg p-4">
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
      <div className="ui-panel ui-reveal-up ui-reveal-delay-2 rounded-lg border-[#7BA69E]/25 bg-gradient-to-r from-[#7BA69E]/10 to-transparent p-4">
        <h3 className="mb-1 text-sm font-semibold text-[#A8C9C2]">🎯 New to Surgery?</h3>
        <p className="text-xs text-[#A0B0BC] mb-3">
          Start with <strong>Foundations</strong> — General Topics covers SU1-SU16 (shock, wounds, burns, nutrition, periop care).
          Then move to Trauma (SU17) before diving into organ systems.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Link href="/library/surgery/general-topics" className="rounded border border-[#7BA69E]/30 bg-[#7BA69E]/16 px-3 py-1.5 text-xs font-medium text-[#A8C9C2] transition-colors hover:bg-[#7BA69E]/24">
            📋 General Topics → Start Here
          </Link>
          <Link href="/library/surgery/trauma" className="rounded border border-[#7BA69E]/24 bg-[#7BA69E]/10 px-3 py-1.5 text-xs text-[#A8C9C2]/80 transition-colors hover:bg-[#7BA69E]/18">
            🚑 Trauma → Next
          </Link>
          <Link href="/cbme/surgery" className="rounded border border-[#C9A86C]/24 bg-[#C9A86C]/10 px-3 py-1.5 text-xs text-[#D8BE90] transition-colors hover:bg-[#C9A86C]/16">
            📋 Full CBME Map
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap gap-4 border-t border-[rgba(91,179,179,0.08)] pt-4 text-xs text-[#6B7280]">
        <span>{allSubspecs.length} subspecialties</span>
        <span>175 topics</span>
        <span>{totalUG} UG competencies</span>
        <span>Source: NMC CBME 2019</span>
      </div>
      </div>
    </div>
  );
}
