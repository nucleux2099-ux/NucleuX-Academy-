"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MEDICINE_SUBSPECIALTIES,
  MEDICINE_UG_MODULES,
  MEDICINE_PG_TOPICS,
  MEDICINE_SS_SPECIALTIES,
  getTotalUGCompetencies,
  type MedicineLevel,
  type NMCDomain,
} from "@/lib/data/cbme-medicine";

function domainBadge(domain: NMCDomain) {
  const map: Record<NMCDomain, { bg: string; label: string }> = {
    K: { bg: "bg-green-600/20 text-green-400 border-green-500/30", label: "K — Knows" },
    KH: { bg: "bg-blue-600/20 text-blue-400 border-blue-500/30", label: "KH — Knows How" },
    SH: { bg: "bg-amber-600/20 text-amber-400 border-amber-500/30", label: "SH — Shows How" },
    P: { bg: "bg-red-600/20 text-red-400 border-red-500/30", label: "P — Performs" },
  };
  return map[domain];
}

function levelBadge(level: MedicineLevel) {
  const map: Record<MedicineLevel, string> = {
    UG: "bg-green-600/20 text-green-400 border-green-500/30",
    PG: "bg-blue-600/20 text-blue-400 border-blue-500/30",
    SS: "bg-red-600/20 text-red-400 border-red-500/30",
  };
  return map[level];
}

function matches(text: string, query: string) {
  return text.toLowerCase().includes(query.toLowerCase());
}

type ViewTab = "overview" | "ug" | "pg" | "ss";

export default function MedicineCBMEPage() {
  const [tab, setTab] = useState<ViewTab>("overview");
  const [search, setSearch] = useState("");
  const [selectedSubspec, setSelectedSubspec] = useState<string | null>(null);

  const totalUG = getTotalUGCompetencies();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link href="/cbme" className="text-zinc-500 hover:text-zinc-300 text-sm">
            ← CBME Curriculum
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-white">
          🩺 Medicine — CBME Curriculum Map
        </h1>
        <p className="text-zinc-400 mt-1">
          Complete UG → PG → SS progression across {MEDICINE_SUBSPECIALTIES.length} subspecialties
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#142538] border border-zinc-700 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-400">{totalUG}</div>
          <div className="text-xs text-zinc-500">UG Competencies (IM1–IM26)</div>
        </div>
        <div className="bg-[#142538] border border-zinc-700 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-400">{MEDICINE_PG_TOPICS.length}</div>
          <div className="text-xs text-zinc-500">PG Syllabus Topics (MD General Medicine)</div>
        </div>
        <div className="bg-[#142538] border border-zinc-700 rounded-lg p-3">
          <div className="text-2xl font-bold text-red-400">{MEDICINE_SS_SPECIALTIES.length}</div>
          <div className="text-xs text-zinc-500">SS Specialties (DM)</div>
        </div>
        <div className="bg-[#142538] border border-zinc-700 rounded-lg p-3">
          <div className="text-2xl font-bold text-white">{MEDICINE_SUBSPECIALTIES.length}</div>
          <div className="text-xs text-zinc-500">Library Subspecialties</div>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search modules, topics, competencies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2 bg-[#142538] border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
      />

      <div className="flex gap-2 border-b border-zinc-700 pb-2">
        {(
          [
            { key: "overview" as ViewTab, label: "📊 Overview" },
            { key: "ug" as ViewTab, label: `🟢 UG (${totalUG} codes)` },
            { key: "pg" as ViewTab, label: `🔵 PG (${MEDICINE_PG_TOPICS.length} topics)` },
            { key: "ss" as ViewTab, label: `🔴 SS (${MEDICINE_SS_SPECIALTIES.length} DM)` },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setSelectedSubspec(null); }}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-[#142538] text-white border border-zinc-700 border-b-transparent"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Subspecialty Progression Map</h2>
          <p className="text-zinc-500 text-sm">
            Each subspecialty shows how topics <span className="text-green-400 font-medium">expand</span> from UG → PG → SS.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-2 px-3 text-zinc-400 font-medium">Subspecialty</th>
                  <th className="text-center py-2 px-3 text-green-400 font-medium">UG Topics</th>
                  <th className="text-center py-2 px-3 text-blue-400 font-medium">PG Topics</th>
                  <th className="text-center py-2 px-3 text-red-400 font-medium">SS Topics</th>
                  <th className="text-center py-2 px-3 text-zinc-400 font-medium">Levels</th>
                  <th className="text-right py-2 px-3 text-zinc-400 font-medium">Library</th>
                </tr>
              </thead>
              <tbody>
                {MEDICINE_SUBSPECIALTIES.filter(
                  (s) => search === "" || matches(s.name, search) || matches(s.slug, search)
                ).map((s) => (
                  <tr
                    key={s.slug}
                    className="border-b border-zinc-800 hover:bg-[#142538]/50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedSubspec(s.slug);
                      setTab("ug");
                    }}
                  >
                    <td className="py-2 px-3 text-white">
                      <span className="mr-2">{s.icon}</span>
                      {s.name}
                    </td>
                    <td className="text-center py-2 px-3">
                      {s.ugTopicCount > 0 ? (
                        <span className="text-green-400 font-medium">{s.ugTopicCount}</span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="text-center py-2 px-3">
                      {s.pgTopicCount > 0 ? (
                        <span className="text-blue-400 font-medium">{s.pgTopicCount}</span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="text-center py-2 px-3">
                      {s.ssTopicCount > 0 ? (
                        <span className="text-red-400 font-medium">{s.ssTopicCount}</span>
                      ) : (
                        <span className="text-zinc-600">—</span>
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
                        href={`/library/medicine/${s.slug}`}
                        className="text-xs text-cyan-400 hover:text-cyan-300"
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

          <div className="bg-[#142538] border border-zinc-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-zinc-300 mb-2">NMC Competency Domains</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(["K", "KH", "SH", "P"] as NMCDomain[]).map((d) => {
                const badge = domainBadge(d);
                return (
                  <div key={d} className={`px-3 py-2 rounded border ${badge.bg} text-xs`}>
                    <div className="font-medium">{badge.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === "ug" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedSubspec(null)}
              className={`px-3 py-1 rounded text-sm ${
                !selectedSubspec ? "bg-green-600 text-white" : "bg-[#142538] text-zinc-400 hover:text-white"
              }`}
            >
              All ({MEDICINE_UG_MODULES.length} modules)
            </button>
            {MEDICINE_SUBSPECIALTIES.filter((s) => s.ugTopicCount > 0).map((s) => (
              <button
                key={s.slug}
                onClick={() => setSelectedSubspec(s.slug)}
                className={`px-3 py-1 rounded text-sm ${
                  selectedSubspec === s.slug
                    ? "bg-green-600 text-white"
                    : "bg-[#142538] text-zinc-400 hover:text-white"
                }`}
              >
                {s.icon} {s.name}
              </button>
            ))}
          </div>

          {MEDICINE_UG_MODULES.filter((m) => {
            if (selectedSubspec && m.subspecialty !== selectedSubspec) return false;
            if (search && !matches(m.title, search) && !matches(m.module, search) &&
                !m.competencies.some((c) => matches(c.code, search) || matches(c.text, search))) {
              return false;
            }
            return true;
          }).map((mod) => (
            <div key={mod.id} className="bg-[#142538] border border-zinc-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 text-xs rounded border bg-green-600/20 text-green-400 border-green-500/30 font-mono">
                  {mod.module}
                </span>
                <h3 className="text-white font-medium">{mod.title}</h3>
                <span className="text-zinc-600 text-xs ml-auto">
                  → {MEDICINE_SUBSPECIALTIES.find((s) => s.slug === mod.subspecialty)?.name}
                </span>
              </div>

              <div className="space-y-1.5 mt-3">
                {mod.competencies.map((c) => (
                  <div key={c.code} className="flex items-start gap-2 text-sm">
                    <span className={`px-1.5 py-0.5 text-xs rounded border shrink-0 font-mono ${domainBadge(c.domain).bg}`}>
                      {c.code}
                    </span>
                    <span className={`px-1 py-0 text-xs rounded border shrink-0 ${domainBadge(c.domain).bg}`}>
                      {c.domain}
                    </span>
                    <span className="text-zinc-400">{c.text}</span>
                  </div>
                ))}
              </div>

              {mod.topicSlugs.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {mod.topicSlugs.map((slug) => (
                    <Link
                      key={slug}
                      href={`/library/medicine/${mod.subspecialty}/${slug}`}
                      className="text-xs px-2 py-1 rounded bg-zinc-700/50 text-cyan-400 hover:text-cyan-300 hover:bg-zinc-700"
                    >
                      📚 {slug.replace(/-/g, " ")}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "pg" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedSubspec(null)}
              className={`px-3 py-1 rounded text-sm ${
                !selectedSubspec ? "bg-blue-600 text-white" : "bg-[#142538] text-zinc-400 hover:text-white"
              }`}
            >
              All ({MEDICINE_PG_TOPICS.length} topics)
            </button>
            {MEDICINE_SUBSPECIALTIES.filter((s) => s.pgTopicCount > 0).map((s) => (
              <button
                key={s.slug}
                onClick={() => setSelectedSubspec(s.slug)}
                className={`px-3 py-1 rounded text-sm ${
                  selectedSubspec === s.slug
                    ? "bg-blue-600 text-white"
                    : "bg-[#142538] text-zinc-400 hover:text-white"
                }`}
              >
                {s.icon} {s.name}
              </button>
            ))}
          </div>

          <div className="bg-[#0D1B2A] border border-zinc-700/50 rounded p-3 text-sm text-zinc-500">
            <span className="text-blue-400 font-medium">MD General Medicine</span> — PG syllabus topics grouped by subspecialty.
            Each topic shows which UG modules it builds upon (🟢 → 🔵 progression).
          </div>

          {["General Topics", "Systemic Medicine", "Emergency Medicine"].map((section) => {
            const topics = MEDICINE_PG_TOPICS.filter((t) => {
              if (t.section !== section) return false;
              if (selectedSubspec && t.subspecialty !== selectedSubspec) return false;
              if (search && !matches(t.title, search) && !t.topicSlugs.some((s) => matches(s, search))) return false;
              return true;
            });
            if (topics.length === 0) return null;
            return (
              <div key={section}>
                <h3 className="text-lg font-semibold text-white mb-3">{section}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {topics.map((t) => {
                    const subspec = MEDICINE_SUBSPECIALTIES.find((s) => s.slug === t.subspecialty);
                    return (
                      <div key={t.id} className="bg-[#142538] border border-zinc-700 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 text-xs rounded border bg-blue-600/20 text-blue-400 border-blue-500/30">
                            PG
                          </span>
                          <span className="text-zinc-500 text-xs">{subspec?.icon} {subspec?.name}</span>
                        </div>
                        <h4 className="text-white font-medium text-sm">{t.title}</h4>

                        {t.ugModuleRefs.length > 0 && (
                          <div className="mt-2 flex gap-1 flex-wrap">
                            <span className="text-xs text-zinc-600">Builds on:</span>
                            {t.ugModuleRefs.map((ref) => (
                              <span key={ref} className="px-1.5 py-0.5 text-xs rounded bg-green-600/10 text-green-500 border border-green-500/20 font-mono">
                                {ref}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-2 flex gap-1 flex-wrap">
                          {t.topicSlugs.map((slug) => (
                            <Link
                              key={slug}
                              href={`/library/medicine/${t.subspecialty}/${slug}`}
                              className="text-xs px-2 py-0.5 rounded bg-zinc-700/50 text-cyan-400 hover:text-cyan-300"
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

      {tab === "ss" && (
        <div className="space-y-6">
          <div className="bg-[#0D1B2A] border border-zinc-700/50 rounded p-3 text-sm text-zinc-500">
            <span className="text-red-400 font-medium">DM Super Specialties</span> — Each requires MD General Medicine as prerequisite.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MEDICINE_SS_SPECIALTIES.map((ss) => (
              <div
                key={ss.id}
                className="bg-[#142538] border border-zinc-700 rounded-lg p-4 hover:border-cyan-500/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-xs rounded border bg-red-600/20 text-red-400 border-red-500/30">
                    {ss.degree}
                  </span>
                </div>
                <h3 className="text-white font-medium">{ss.title}</h3>
                <p className="text-zinc-500 text-xs mt-1">{ss.description}</p>

                <div className="mt-2 text-xs text-zinc-600">
                  Prerequisite: <span className="text-blue-400">{ss.pgPrerequisite}</span>
                </div>

                {ss.subspecialties.length > 0 && (
                  <div className="mt-3 border-t border-zinc-700/50 pt-2">
                    <p className="text-xs text-zinc-500 mb-1">Covers subspecialties:</p>
                    <div className="flex gap-1 flex-wrap">
                      {ss.subspecialties.map((slug) => {
                        const sub = MEDICINE_SUBSPECIALTIES.find((s) => s.slug === slug);
                        return (
                          <Link
                            key={slug}
                            href={`/library/medicine/${slug}`}
                            className="text-xs px-2 py-1 rounded bg-red-600/10 text-red-400 border border-red-500/20 hover:bg-red-600/20"
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

          <div className="bg-[#142538] border border-zinc-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">Medicine Training Progression</h3>
            <div className="flex items-center gap-4 text-sm overflow-x-auto">
              <div className="text-center shrink-0">
                <div className="px-4 py-2 rounded border bg-green-600/20 text-green-400 border-green-500/30">
                  <div className="font-medium">UG (MBBS)</div>
                  <div className="text-xs opacity-70">IM1–IM26</div>
                  <div className="text-xs opacity-70">{totalUG} codes</div>
                </div>
              </div>
              <div className="text-zinc-600 text-lg shrink-0">→</div>
              <div className="text-center shrink-0">
                <div className="px-4 py-2 rounded border bg-blue-600/20 text-blue-400 border-blue-500/30">
                  <div className="font-medium">PG (MD General Medicine)</div>
                  <div className="text-xs opacity-70">3 years</div>
                  <div className="text-xs opacity-70">{MEDICINE_PG_TOPICS.length} topics</div>
                </div>
              </div>
              <div className="text-zinc-600 text-lg shrink-0">→</div>
              <div className="text-center shrink-0">
                <div className="px-4 py-2 rounded border bg-red-600/20 text-red-400 border-red-500/30">
                  <div className="font-medium">SS (DM)</div>
                  <div className="text-xs opacity-70">3 years</div>
                  <div className="text-xs opacity-70">{MEDICINE_SS_SPECIALTIES.length} specialties</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-zinc-800 pt-4 text-xs text-zinc-600 flex gap-4 flex-wrap">
        <span>{totalUG} UG Competencies</span>
        <span>{MEDICINE_PG_TOPICS.length} PG Topics</span>
        <span>{MEDICINE_SS_SPECIALTIES.length} SS Specialties</span>
        <span>{MEDICINE_SUBSPECIALTIES.length} Subspecialties</span>
        <span className="text-zinc-500">Source: NMC India CBME 2019</span>
      </div>
    </div>
  );
}
