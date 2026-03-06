"use client";

import { useState } from "react";
import Link from "next/link";
import topicNmcCodes from "@/lib/data/topic-nmc-codes.json";
import {
  SURGERY_SUBSPECIALTIES,
  SURGERY_UG_MODULES,
  SURGERY_PG_TOPICS,
  SURGERY_SS_SPECIALTIES,
  SU28_SUBSPECIALTY_MAP,
  getTotalUGCompetencies,
  type SurgeryLevel,
  type NMCDomain,
  type SurgerySubspecialtyMap,
} from "@/lib/data/cbme-surgery";

/* ─── Domain badge colours ─── */
function domainBadge(domain: NMCDomain) {
  const map: Record<NMCDomain, { bg: string; label: string }> = {
    K: { bg: "bg-[#7BA69E]/16 text-[#7BA69E] border-[#7BA69E]/30", label: "K — Knows" },
    KH: { bg: "bg-[#5BB3B3]/16 text-[#8FD5D5] border-[#5BB3B3]/30", label: "KH — Knows How" },
    SH: { bg: "bg-[#C9A86C]/16 text-[#D8BE90] border-[#C9A86C]/30", label: "SH — Shows How" },
    P: { bg: "bg-[#E57373]/16 text-[#E57373] border-[#E57373]/30", label: "P — Performs" },
  };
  return map[domain];
}

/* ─── Level badge ─── */
function levelBadge(level: SurgeryLevel) {
  const map: Record<SurgeryLevel, string> = {
    UG: "bg-[#7BA69E]/16 text-[#7BA69E] border-[#7BA69E]/30",
    PG: "bg-[#5BB3B3]/16 text-[#8FD5D5] border-[#5BB3B3]/30",
    SS: "bg-[#E57373]/16 text-[#E57373] border-[#E57373]/30",
  };
  return map[level];
}

/* ─── Search helper ─── */
function matches(text: string, query: string) {
  return text.toLowerCase().includes(query.toLowerCase());
}

/* ─── Reverse map: code → first library path ─── */
const codeToPath: Record<string, string> = {};
for (const [topicPath, codes] of Object.entries(topicNmcCodes as Record<string, string[]>)) {
  for (const code of codes) {
    if (!codeToPath[code]) codeToPath[code] = `/library/${topicPath}`;
  }
}

type ViewTab = "overview" | "ug" | "pg" | "ss";

export default function SurgeryCBMEPage() {
  const [tab, setTab] = useState<ViewTab>("overview");
  const [search, setSearch] = useState("");
  const [selectedSubspec, setSelectedSubspec] = useState<string | null>(null);

  const totalUG = getTotalUGCompetencies();

  return (
    <div className="ui-shell ui-page space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link href="/cbme" className="text-[#6B7A88] hover:text-[#C8D2DA] text-sm">
            ← CBME Curriculum
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-[#E8E0D5]">
          🔪 Surgery — CBME Curriculum Map
        </h1>
        <p className="text-[#A0B0BC] mt-1">
          Complete UG → PG → SS progression across {SURGERY_SUBSPECIALTIES.length} subspecialties
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#364A5E]/90 border border-[rgba(232,224,213,0.1)] rounded-lg p-3">
          <div className="text-2xl font-bold text-[#7BA69E]">{totalUG}</div>
          <div className="text-xs text-[#6B7A88]">UG Competencies (SU1–SU30)</div>
        </div>
        <div className="bg-[#364A5E]/90 border border-[rgba(232,224,213,0.1)] rounded-lg p-3">
          <div className="text-2xl font-bold text-[#8FD5D5]">{SURGERY_PG_TOPICS.length}</div>
          <div className="text-xs text-[#6B7A88]">PG Syllabus Topics (MS Surgery)</div>
        </div>
        <div className="bg-[#364A5E]/90 border border-[rgba(232,224,213,0.1)] rounded-lg p-3">
          <div className="text-2xl font-bold text-[#E57373]">{SURGERY_SS_SPECIALTIES.length}</div>
          <div className="text-xs text-[#6B7A88]">SS Specialties (MCh)</div>
        </div>
        <div className="bg-[#364A5E]/90 border border-[rgba(232,224,213,0.1)] rounded-lg p-3">
          <div className="text-2xl font-bold text-[#E8E0D5]">{SURGERY_SUBSPECIALTIES.length}</div>
          <div className="text-xs text-[#6B7A88]">Library Subspecialties</div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search modules, topics, competencies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2 bg-[#2D3E50] border border-[rgba(232,224,213,0.1)] rounded-lg text-[#E8E0D5] placeholder:text-[#6B7A88] focus:outline-none focus:ring-2 focus:ring-[#5BB3B3]/45"
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[rgba(232,224,213,0.1)] pb-2">
        {(
          [
            { key: "overview" as ViewTab, label: "📊 Overview" },
            { key: "ug" as ViewTab, label: `🟢 UG (${totalUG} codes)` },
            { key: "pg" as ViewTab, label: `🔵 PG (${SURGERY_PG_TOPICS.length} topics)` },
            { key: "ss" as ViewTab, label: `🔴 SS (${SURGERY_SS_SPECIALTIES.length} MCh)` },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setSelectedSubspec(null); }}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-[#2D3E50] text-[#E8E0D5] border border-[rgba(232,224,213,0.1)] border-b-transparent"
                : "text-[#A0B0BC] hover:text-[#D3DCE3]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══ OVERVIEW TAB ═══ */}
      {tab === "overview" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#E8E0D5]">Subspecialty Progression Map</h2>
          <p className="text-[#6B7A88] text-sm">
            Each subspecialty shows how topics <span className="text-[#7BA69E] font-medium">expand</span> from UG → PG → SS.
            Click any row to explore.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(232,224,213,0.1)]">
                  <th className="text-left py-2 px-3 text-[#A0B0BC] font-medium">Subspecialty</th>
                  <th className="text-center py-2 px-3 text-[#7BA69E] font-medium">UG Topics</th>
                  <th className="text-center py-2 px-3 text-[#8FD5D5] font-medium">PG Topics</th>
                  <th className="text-center py-2 px-3 text-[#E57373] font-medium">SS Topics</th>
                  <th className="text-center py-2 px-3 text-[#A0B0BC] font-medium">Levels</th>
                  <th className="text-right py-2 px-3 text-[#A0B0BC] font-medium">Library</th>
                </tr>
              </thead>
              <tbody>
                {SURGERY_SUBSPECIALTIES.filter(
                  (s) => search === "" || matches(s.name, search) || matches(s.slug, search)
                ).map((s) => (
                  <tr
                    key={s.slug}
                    className="border-b border-[rgba(232,224,213,0.08)] hover:bg-[#364A5E]/90 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedSubspec(s.slug);
                      setTab("ug");
                    }}
                  >
                    <td className="py-2 px-3 text-[#E8E0D5]">
                      <span className="mr-2">{s.icon}</span>
                      {s.name}
                    </td>
                    <td className="text-center py-2 px-3">
                      {s.ugTopicCount > 0 ? (
                        <span className="text-[#7BA69E] font-medium">{s.ugTopicCount}</span>
                      ) : (
                        <span className="text-[#556270]">—</span>
                      )}
                    </td>
                    <td className="text-center py-2 px-3">
                      {s.pgTopicCount > 0 ? (
                        <span className="text-[#8FD5D5] font-medium">{s.pgTopicCount}</span>
                      ) : (
                        <span className="text-[#556270]">—</span>
                      )}
                    </td>
                    <td className="text-center py-2 px-3">
                      {s.ssTopicCount > 0 ? (
                        <span className="text-[#E57373] font-medium">{s.ssTopicCount}</span>
                      ) : (
                        <span className="text-[#556270]">—</span>
                      )}
                    </td>
                    <td className="text-center py-2 px-3">
                      <div className="flex gap-1 justify-center">
                        {s.levels.map((l) => (
                          <span
                            key={l}
                            className={`px-1.5 py-0.5 text-xs rounded border ${levelBadge(l)}`}
                          >
                            {l}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="text-right py-2 px-3">
                      <Link
                        href={`/library/surgery/${s.slug}`}
                        className="text-xs text-[#8FD5D5] hover:text-[#A5E1E1]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        📚 Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* NMC Domain Legend */}
          <div className="bg-[#364A5E]/90 border border-[rgba(232,224,213,0.1)] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#C8D2DA] mb-2">NMC Competency Domains → NucleuX Depth Levels</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(["K", "KH", "SH", "P"] as NMCDomain[]).map((d) => {
                const badge = domainBadge(d);
                return (
                  <div key={d} className={`px-3 py-2 rounded border ${badge.bg} text-xs`}>
                    <div className="font-medium">{badge.label}</div>
                    <div className="text-[#6B7A88] mt-0.5">
                      {d === "K" && "→ UG depth"}
                      {d === "KH" && "→ UG depth"}
                      {d === "SH" && "→ PG depth"}
                      {d === "P" && "→ SS depth"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══ UG TAB ═══ */}
      {tab === "ug" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedSubspec(null)}
              className={`px-3 py-1 rounded text-sm ${
                !selectedSubspec ? "bg-[#7BA69E] text-[#E8E0D5]" : "bg-[#2D3E50] text-[#A0B0BC] hover:text-[#E8E0D5]"
              }`}
            >
              All ({SURGERY_UG_MODULES.length} modules)
            </button>
            {SURGERY_SUBSPECIALTIES.filter((s) => s.ugTopicCount > 0).map((s) => (
              <button
                key={s.slug}
                onClick={() => setSelectedSubspec(s.slug)}
                className={`px-3 py-1 rounded text-sm ${
                  selectedSubspec === s.slug
                    ? "bg-[#7BA69E] text-[#E8E0D5]"
                    : "bg-[#2D3E50] text-[#A0B0BC] hover:text-[#E8E0D5]"
                }`}
              >
                {s.icon} {s.name}
              </button>
            ))}
          </div>

          {SURGERY_UG_MODULES.filter((m) => {
            if (selectedSubspec && m.subspecialty !== selectedSubspec) {
              // Also check SU28 sub-mapping
              if (m.module !== "SU28") return false;
              const hasSub = SU28_SUBSPECIALTY_MAP.some((s) => s.subspecialty === selectedSubspec);
              if (!hasSub) return false;
            }
            if (search && !matches(m.title, search) && !matches(m.module, search) &&
                !m.competencies.some((c) => matches(c.code, search) || matches(c.text, search))) {
              return false;
            }
            return true;
          }).map((mod) => (
            <div key={mod.id} className="bg-[#364A5E]/90 border border-[rgba(232,224,213,0.1)] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 text-xs rounded border bg-[#7BA69E]/16 text-[#7BA69E] border-[#7BA69E]/30 font-mono">
                  {mod.module}
                </span>
                <h3 className="text-[#E8E0D5] font-medium">{mod.title}</h3>
                <span className="text-[#556270] text-xs ml-auto">
                  → {SURGERY_SUBSPECIALTIES.find((s) => s.slug === mod.subspecialty)?.name}
                </span>
              </div>

              {/* Competencies */}
              <div className="space-y-1.5 mt-3">
                {mod.competencies.map((c) => (
                  <div key={c.code} className="flex items-start gap-2 text-sm">
                    {codeToPath[c.code] ? (
                      <Link
                        href={codeToPath[c.code]}
                        className={`px-1.5 py-0.5 text-xs rounded border shrink-0 font-mono ${domainBadge(c.domain).bg} hover:ring-1 hover:ring-teal-400/50 transition-all`}
                        title="View in Library"
                      >
                        {c.code}
                      </Link>
                    ) : (
                      <span className={`px-1.5 py-0.5 text-xs rounded border shrink-0 font-mono ${domainBadge(c.domain).bg}`}>
                        {c.code}
                      </span>
                    )}
                    <span className={`px-1 py-0 text-xs rounded border shrink-0 ${domainBadge(c.domain).bg}`}>
                      {c.domain}
                    </span>
                    <span className="text-[#A0B0BC]">{c.text}</span>
                  </div>
                ))}
              </div>

              {/* Topic links */}
              {mod.topicSlugs.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {mod.topicSlugs.map((slug) => (
                    <Link
                      key={slug}
                      href={`/library/surgery/${mod.subspecialty}/${slug}`}
                      className="text-xs px-2 py-1 rounded bg-[#3A4D5F]/65 text-[#8FD5D5] hover:text-[#A5E1E1] hover:bg-[#3A4D5F]"
                    >
                      📚 {slug.replace(/-/g, " ")}
                    </Link>
                  ))}
                </div>
              )}

              {/* SU28 special: show sub-mapping */}
              {mod.module === "SU28" && (
                <div className="mt-3 border-t border-[rgba(232,224,213,0.1)] pt-3">
                  <p className="text-xs text-[#6B7A88] mb-2">This module maps across multiple subspecialties:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {SU28_SUBSPECIALTY_MAP.filter(
                      (s) => !selectedSubspec || s.subspecialty === selectedSubspec
                    ).map((mapping) => (
                      <Link
                        key={mapping.code}
                        href={`/library/surgery/${mapping.subspecialty}/${mapping.topicSlug}`}
                        className="flex items-center gap-2 text-xs px-2 py-1 rounded bg-[#3A4D5F]/30 hover:bg-[#3A4D5F]/65"
                      >
                        <span className="font-mono text-[#7BA69E]">{mapping.code}</span>
                        <span className="text-[#6B7A88]">→</span>
                        <span className="text-[#A0B0BC]">{mapping.subspecialty}</span>
                        <span className="text-[#556270]">/</span>
                        <span className="text-[#8FD5D5]">{mapping.topicSlug.replace(/-/g, " ")}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ═══ PG TAB ═══ */}
      {tab === "pg" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedSubspec(null)}
              className={`px-3 py-1 rounded text-sm ${
                !selectedSubspec ? "bg-[#5BB3B3] text-[#E8E0D5]" : "bg-[#2D3E50] text-[#A0B0BC] hover:text-[#E8E0D5]"
              }`}
            >
              All ({SURGERY_PG_TOPICS.length} topics)
            </button>
            {SURGERY_SUBSPECIALTIES.filter((s) => s.pgTopicCount > 0).map((s) => (
              <button
                key={s.slug}
                onClick={() => setSelectedSubspec(s.slug)}
                className={`px-3 py-1 rounded text-sm ${
                  selectedSubspec === s.slug
                    ? "bg-[#5BB3B3] text-[#E8E0D5]"
                    : "bg-[#2D3E50] text-[#A0B0BC] hover:text-[#E8E0D5]"
                }`}
              >
                {s.icon} {s.name}
              </button>
            ))}
          </div>

          <div className="bg-[#364A5E]/70 border border-[rgba(232,224,213,0.08)] rounded p-3 text-sm text-[#6B7A88]">
            <span className="text-[#8FD5D5] font-medium">MS General Surgery</span> — PG syllabus topics grouped by subspecialty.
            Each topic shows which UG modules it builds upon (🟢 → 🔵 progression).
          </div>

          {/* Group by section */}
          {["General Topics", "Systemic Surgery", "Clinical Cases"].map((section) => {
            const topics = SURGERY_PG_TOPICS.filter((t) => {
              if (t.section !== section) return false;
              if (selectedSubspec && t.subspecialty !== selectedSubspec) return false;
              if (search && !matches(t.title, search) && !t.topicSlugs.some((s) => matches(s, search))) return false;
              return true;
            });
            if (topics.length === 0) return null;
            return (
              <div key={section}>
                <h3 className="text-lg font-semibold text-[#E8E0D5] mb-3">{section}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {topics.map((t) => {
                    const subspec = SURGERY_SUBSPECIALTIES.find((s) => s.slug === t.subspecialty);
                    return (
                      <div key={t.id} className="bg-[#364A5E]/90 border border-[rgba(232,224,213,0.1)] rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 text-xs rounded border bg-[#5BB3B3]/16 text-[#8FD5D5] border-[#5BB3B3]/30">
                            PG
                          </span>
                          <span className="text-[#6B7A88] text-xs">{subspec?.icon} {subspec?.name}</span>
                        </div>
                        <h4 className="text-[#E8E0D5] font-medium text-sm">{t.title}</h4>

                        {/* UG prerequisite modules */}
                        {t.ugModuleRefs.length > 0 && (
                          <div className="mt-2 flex gap-1 flex-wrap">
                            <span className="text-xs text-[#556270]">Builds on:</span>
                            {t.ugModuleRefs.map((ref) => (
                              <span key={ref} className="px-1.5 py-0.5 text-xs rounded bg-[#7BA69E]/14 text-[#7BA69E] border border-[#7BA69E]/24 font-mono">
                                {ref}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Topic links */}
                        <div className="mt-2 flex gap-1 flex-wrap">
                          {t.topicSlugs.map((slug) => (
                            <Link
                              key={slug}
                              href={`/library/surgery/${t.subspecialty}/${slug}`}
                              className="text-xs px-2 py-0.5 rounded bg-[#3A4D5F]/65 text-[#8FD5D5] hover:text-[#A5E1E1]"
                            >
                              {slug.replace(/-/g, " ")}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ SS TAB ═══ */}
      {tab === "ss" && (
        <div className="space-y-6">
          <div className="bg-[#364A5E]/70 border border-[rgba(232,224,213,0.08)] rounded p-3 text-sm text-[#6B7A88]">
            <span className="text-[#E57373] font-medium">MCh Super Specialties</span> — Each requires MS General Surgery as prerequisite.
            Shows which library subspecialties each MCh covers (🔵 → 🔴 progression).
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SURGERY_SS_SPECIALTIES.map((ss) => (
              <div
                key={ss.id}
                className="bg-[#364A5E]/90 border border-[rgba(232,224,213,0.1)] rounded-lg p-4 hover:border-[rgba(232,224,213,0.24)] transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-xs rounded border bg-[#E57373]/16 text-[#E57373] border-[#E57373]/30">
                    MCh
                  </span>
                </div>
                <h3 className="text-[#E8E0D5] font-medium">{ss.title}</h3>
                <p className="text-[#6B7A88] text-xs mt-1">{ss.description}</p>

                <div className="mt-2 text-xs text-[#556270]">
                  Prerequisite: <span className="text-[#8FD5D5]">{ss.pgPrerequisite}</span>
                </div>

                {/* Subspecialty coverage */}
                {ss.subspecialties.length > 0 && (
                  <div className="mt-3 border-t border-[rgba(232,224,213,0.08)] pt-2">
                    <p className="text-xs text-[#6B7A88] mb-1">Covers subspecialties:</p>
                    <div className="flex gap-1 flex-wrap">
                      {ss.subspecialties.map((slug) => {
                        const sub = SURGERY_SUBSPECIALTIES.find((s) => s.slug === slug);
                        return (
                          <Link
                            key={slug}
                            href={`/library/surgery/${slug}`}
                            className="text-xs px-2 py-1 rounded bg-red-600/10 text-[#E57373] border border-red-500/20 hover:bg-[#E57373]/16"
                          >
                            {sub?.icon} {sub?.name ?? slug}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Progression diagram */}
          <div className="bg-[#364A5E]/90 border border-[rgba(232,224,213,0.1)] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#C8D2DA] mb-3">Surgery Training Progression</h3>
            <div className="flex items-center gap-4 text-sm overflow-x-auto">
              <div className="text-center shrink-0">
                <div className="px-4 py-2 rounded border bg-[#7BA69E]/16 text-[#7BA69E] border-[#7BA69E]/30">
                  <div className="font-medium">UG (MBBS)</div>
                  <div className="text-xs opacity-70">SU1–SU30</div>
                  <div className="text-xs opacity-70">{totalUG} codes</div>
                </div>
              </div>
              <div className="text-[#556270] text-lg shrink-0">→</div>
              <div className="text-center shrink-0">
                <div className="px-4 py-2 rounded border bg-[#5BB3B3]/16 text-[#8FD5D5] border-[#5BB3B3]/30">
                  <div className="font-medium">PG (MS Surgery)</div>
                  <div className="text-xs opacity-70">3 years</div>
                  <div className="text-xs opacity-70">{SURGERY_PG_TOPICS.length} topics</div>
                </div>
              </div>
              <div className="text-[#556270] text-lg shrink-0">→</div>
              <div className="text-center shrink-0">
                <div className="px-4 py-2 rounded border bg-[#E57373]/16 text-[#E57373] border-[#E57373]/30">
                  <div className="font-medium">SS (MCh)</div>
                  <div className="text-xs opacity-70">3 years</div>
                  <div className="text-xs opacity-70">{SURGERY_SS_SPECIALTIES.length} specialties</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-[rgba(232,224,213,0.08)] pt-4 text-xs text-[#556270] flex gap-4 flex-wrap">
        <span>30 UG Modules</span>
        <span>{totalUG} UG Competencies</span>
        <span>{SURGERY_PG_TOPICS.length} PG Topics</span>
        <span>{SURGERY_SS_SPECIALTIES.length} MCh Specialties</span>
        <span>{SURGERY_SUBSPECIALTIES.length} Subspecialties</span>
        <span className="text-[#6B7A88]">Source: NMC India CBME 2019</span>
      </div>
    </div>
  );
}
