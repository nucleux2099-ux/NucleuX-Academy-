"use client";

import { useState } from "react";
import { CBME_MBBS_Y1_BLOCKS } from "@/lib/data/cbme-mbbs-y1";
import { CBME_MBBS_Y2_BLOCKS } from "@/lib/data/cbme-mbbs-y2";
import { CBME_MBBS_Y3_BLOCKS } from "@/lib/data/cbme-mbbs-y3";
import { CBME_MBBS_Y4_BLOCKS } from "@/lib/data/cbme-mbbs-y4";
import { PG_CURRICULA, type PGDegree } from "@/lib/data/cbme-pg";
import { SS_CURRICULA, type SSDegree } from "@/lib/data/cbme-ss";
import type { CBMEBlock } from "@/lib/data/cbme-types";
import { ALL_CURRICULA, NMC_STATS, getCurriculumBySlug } from "@/lib/data/nmc-vault";
import Link from "next/link";

/* ─── tab types ─── */
type MainTab = "ug" | "pg" | "ss";

const PHASE_MAP: { label: string; year: 1 | 2 | 3 | 4; blocks: CBMEBlock[] }[] = [
  { label: "Phase 1 (Year 1)", year: 1, blocks: CBME_MBBS_Y1_BLOCKS },
  { label: "Phase 2 (Year 2)", year: 2, blocks: CBME_MBBS_Y2_BLOCKS },
  { label: "Phase 3 Part 1 (Year 3)", year: 3, blocks: CBME_MBBS_Y3_BLOCKS },
  { label: "Phase 3 Part 2 (Year 4)", year: 4, blocks: CBME_MBBS_Y4_BLOCKS },
];

/* ─── degree badge colours ─── */
function degreeBadge(degree: string) {
  const map: Record<string, string> = {
    MD: "bg-blue-600/20 text-blue-400 border-blue-500/30",
    MS: "bg-cyan-600/20 text-cyan-400 border-cyan-500/30",
    DM: "bg-purple-600/20 text-purple-400 border-purple-500/30",
    MCh: "bg-rose-600/20 text-rose-400 border-rose-500/30",
    Diploma: "bg-amber-600/20 text-amber-400 border-amber-500/30",
  };
  return map[degree] ?? "bg-zinc-600/20 text-zinc-400 border-zinc-500/30";
}

/* ─── subject colour hash for UG ─── */
function subjectColor(subject: string) {
  const map: Record<string, string> = {
    anatomy: "border-red-500/40",
    physiology: "border-orange-500/40",
    biochemistry: "border-yellow-500/40",
    pathology: "border-pink-500/40",
    pharmacology: "border-green-500/40",
    microbiology: "border-teal-500/40",
    forensic: "border-slate-400/40",
    psm: "border-lime-500/40",
    medicine: "border-blue-500/40",
    surgery: "border-red-600/40",
    obgyn: "border-fuchsia-500/40",
    pediatrics: "border-sky-500/40",
    orthopedics: "border-amber-500/40",
    ent: "border-indigo-500/40",
    ophthalmology: "border-emerald-500/40",
    bme: "border-violet-500/40",
  };
  return map[subject] ?? "border-zinc-500/40";
}

/* ─── search filter ─── */
function matches(text: string, query: string) {
  return text.toLowerCase().includes(query.toLowerCase());
}

export default function CBMEPage() {
  const [tab, setTab] = useState<MainTab>("ug");
  const [search, setSearch] = useState("");
  const [pgFilter, setPgFilter] = useState<PGDegree | "all">("all");
  const [ssFilter, setSsFilter] = useState<SSDegree | "all">("all");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          📋 CBME Curriculum
        </h1>
        <p className="text-zinc-400 mt-1">
          National Medical Commission — Competency Based Medical Education
        </p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search curricula..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      />

      {/* Main Tabs */}
      <div className="flex gap-2 border-b border-zinc-700 pb-2">
        {(
          [
            { key: "ug" as MainTab, label: "UG (MBBS)", count: PHASE_MAP.reduce((s, p) => s + p.blocks.length, 0) },
            { key: "pg" as MainTab, label: "PG (MD / MS)", count: PG_CURRICULA.length },
            { key: "ss" as MainTab, label: "SS (DM / MCh / Diploma)", count: SS_CURRICULA.length },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-zinc-800 text-white border border-zinc-700 border-b-transparent"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t.label}{" "}
            <span className="text-xs text-zinc-500">({t.count})</span>
          </button>
        ))}
      </div>

      {/* ═══ UG TAB ═══ */}
      {tab === "ug" && (
        <div className="space-y-8">
          {PHASE_MAP.map((phase) => {
            const subjects = [...new Set(phase.blocks.map((b) => b.subject))];
            return (
              <div key={phase.year}>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs rounded bg-green-600/20 text-green-400 border border-green-500/30">
                    UG
                  </span>
                  {phase.label}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {subjects.map((subj) => {
                    const blocks = phase.blocks.filter(
                      (b) =>
                        b.subject === subj &&
                        (search === "" || matches(b.title, search) || matches(subj, search))
                    );
                    if (blocks.length === 0) return null;
                    return (
                      <div
                        key={subj}
                        className={`bg-zinc-800/50 rounded-lg border-l-4 ${subjectColor(subj)} p-4`}
                      >
                        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-2">
                          {subj.replace(/-/g, " ")}
                        </h3>
                        <ul className="space-y-1">
                          {blocks.map((b) => (
                            <li key={b.id} className="text-sm text-zinc-400 flex items-start gap-2">
                              <span className="text-zinc-600 mt-0.5">•</span>
                              {b.links?.libraryPath ? (
                                <Link
                                  href={b.links.libraryPath}
                                  className="hover:text-white transition-colors"
                                >
                                  {b.title}
                                </Link>
                              ) : (
                                <span>{b.title}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ PG TAB ═══ */}
      {tab === "pg" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {(["all", "MD", "MS"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setPgFilter(f)}
                className={`px-3 py-1 rounded text-sm ${
                  pgFilter === f
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {f === "all" ? "All" : f} {f !== "all" && `(${PG_CURRICULA.filter((c) => c.degree === f).length})`}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {PG_CURRICULA.filter(
              (c) =>
                (pgFilter === "all" || c.degree === pgFilter) &&
                (search === "" || matches(c.title, search) || matches(c.subject, search) || matches(c.description, search))
            ).map((c) => {
              const nmc = getCurriculumBySlug(c.id);
              const totalComp = nmc
                ? nmc.competencies.cognitive.length + nmc.competencies.psychomotor.length + nmc.competencies.affective.length
                : 0;
              return (
                <Link
                  key={c.id}
                  href={c.id === "ms-general-surgery" ? "/cbme/surgery" : c.id === "md-general-medicine" ? "/cbme/medicine" : c.id === "ms-obgy" ? "/cbme/obgyn" : c.id === "md-pediatrics" ? "/cbme/pediatrics" : c.id === "ms-orthopedics" ? "/cbme/orthopedics" : `/cbme/${c.id}`}
                  className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 hover:border-cyan-500/30 transition-colors block"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-xs rounded border ${degreeBadge(c.degree)}`}>
                      {c.degree}
                    </span>
                    {totalComp > 0 && (
                      <span className="px-1.5 py-0.5 text-xs rounded bg-cyan-600/10 text-cyan-400 border border-cyan-500/20">
                        {totalComp} competencies
                      </span>
                    )}
                    {c.hasRevised && (
                      <span className="px-1.5 py-0.5 text-xs rounded bg-green-600/10 text-green-500 border border-green-500/20">
                        Revised
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-medium text-sm">{c.title}</h3>
                  <p className="text-zinc-500 text-xs mt-1">{c.description}</p>
                  {c.librarySubject && (
                    <span className="inline-block mt-2 text-xs text-blue-400">
                      📚 Library →
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ SS TAB ═══ */}
      {tab === "ss" && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {(["all", "DM", "MCh", "Diploma"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setSsFilter(f)}
                className={`px-3 py-1 rounded text-sm ${
                  ssFilter === f
                    ? "bg-purple-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {f === "all" ? "All" : f} {f !== "all" && `(${SS_CURRICULA.filter((c) => c.degree === f).length})`}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {SS_CURRICULA.filter(
              (c) =>
                (ssFilter === "all" || c.degree === ssFilter) &&
                (search === "" || matches(c.title, search) || matches(c.subject, search) || matches(c.description, search))
            ).map((c) => {
              const nmc = getCurriculumBySlug(c.id);
              const totalComp = nmc
                ? nmc.competencies.cognitive.length + nmc.competencies.psychomotor.length + nmc.competencies.affective.length
                : 0;
              return (
                <Link
                  key={c.id}
                  href={`/cbme/${c.id}`}
                  className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 hover:border-cyan-500/30 transition-colors block"
                >
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`px-2 py-0.5 text-xs rounded border ${degreeBadge(c.degree)}`}>
                      {c.degree}
                    </span>
                    {totalComp > 0 && (
                      <span className="px-1.5 py-0.5 text-xs rounded bg-cyan-600/10 text-cyan-400 border border-cyan-500/20">
                        {totalComp} competencies
                      </span>
                    )}
                    {c.hasRevised && (
                      <span className="px-1.5 py-0.5 text-xs rounded bg-green-600/10 text-green-500 border border-green-500/20">
                        Revised
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-medium text-sm">{c.title}</h3>
                  <p className="text-zinc-500 text-xs mt-1">{c.description}</p>
                  {c.parentDegree && (
                    <p className="text-zinc-600 text-xs mt-1">← {c.parentDegree}</p>
                  )}
                  {c.librarySubject && (
                    <span className="inline-block mt-2 text-xs text-purple-400">
                      📚 Library →
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Subject-Specific CBME Pages */}
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-zinc-300 mb-2">🔬 Subject-Specific CBME Maps</h3>
        <p className="text-zinc-500 text-xs mb-3">Detailed UG → PG → SS progression with competency codes mapped to library topics</p>
        <div className="flex gap-2 flex-wrap">
          <Link href="/cbme/surgery" className="px-4 py-2 rounded-lg bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 text-sm font-medium transition-colors">
            🔪 Surgery — 132 UG codes, 18 subspecialties
          </Link>
          <Link href="/cbme/ophthalmology" className="px-4 py-2 rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-600/20 text-sm font-medium transition-colors">
            👁️ Ophthalmology — OP1–OP9, 5 subspecialties
          </Link>
          <Link href="/cbme/medicine" className="px-4 py-2 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600/20 text-sm font-medium transition-colors">
            🩺 Medicine — IM1–IM26, 17 subspecialties
          </Link>
          <Link href="/cbme/obgyn" className="px-4 py-2 rounded-lg bg-fuchsia-600/10 border border-fuchsia-500/20 text-fuchsia-400 hover:bg-fuchsia-600/20 text-sm font-medium transition-colors">
            🤰 OBG — OG1–OG39, 13 subspecialties
          </Link>
          <Link href="/cbme/pediatrics" className="px-4 py-2 rounded-lg bg-sky-600/10 border border-sky-500/20 text-sky-400 hover:bg-sky-600/20 text-sm font-medium transition-colors">
            🧒 Pediatrics — PE1–PE34, 10 subspecialties
          </Link>
          <Link href="/cbme/orthopedics" className="px-4 py-2 rounded-lg bg-orange-600/10 border border-orange-500/20 text-orange-400 hover:bg-orange-600/20 text-sm font-medium transition-colors">
            🦴 Orthopedics — OR1–OR14, 8 subspecialties
          </Link>
          <Link href="/cbme/ent" className="px-4 py-2 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600/20 text-sm font-medium transition-colors">
            👂 ENT — EN1–EN4, 4 subspecialties
          </Link>
          <Link href="/cbme/psychiatry" className="px-4 py-2 rounded-lg bg-purple-600/10 border border-purple-500/20 text-purple-400 hover:bg-purple-600/20 text-sm font-medium transition-colors">
            🧠 Psychiatry — PS1–PS19, 5 subspecialties
          </Link>
          <Link href="/cbme/dermatology" className="px-4 py-2 rounded-lg bg-pink-600/10 border border-pink-500/20 text-pink-400 hover:bg-pink-600/20 text-sm font-medium transition-colors">
            🧴 Dermatology — DR1–DR16, 4 subspecialties
          </Link>
          <Link href="/cbme/anesthesia" className="px-4 py-2 rounded-lg bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-600/20 text-sm font-medium transition-colors">
            💉 Anesthesia — AS1–AS10, 4 subspecialties
          </Link>
          <Link href="/cbme/community-medicine" className="px-4 py-2 rounded-lg bg-lime-600/10 border border-lime-500/20 text-lime-400 hover:bg-lime-600/20 text-sm font-medium transition-colors">
            🏥 Community Medicine — CM1–CM19, 6 subspecialties
          </Link>
          <Link href="/cbme/radiology" className="px-4 py-2 rounded-lg bg-amber-600/10 border border-amber-500/20 text-amber-400 hover:bg-amber-600/20 text-sm font-medium transition-colors">
            🔬 Radiology — RD1–RD3, 3 subspecialties
          </Link>
          <Link href="/cbme/biochemistry" className="px-4 py-2 rounded-lg bg-yellow-600/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-600/20 text-sm font-medium transition-colors">
            🧬 Biochemistry — BI1–BI11, 9 subspecialties
          </Link>
        </div>
      </div>

      {/* NMC Vault Stats */}
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-zinc-300 mb-2">📊 NMC Vault — Full Curriculum Data</h3>
        <div className="flex gap-4 flex-wrap text-sm">
          <span className="text-white font-medium">{NMC_STATS.totalSpecialties} <span className="text-zinc-500 font-normal">specialties</span></span>
          <span className="text-cyan-400 font-medium">{NMC_STATS.totalCompetencies.toLocaleString()} <span className="text-zinc-500 font-normal">competencies</span></span>
          <span className="text-amber-400 font-medium">{NMC_STATS.totalBooks.toLocaleString()} <span className="text-zinc-500 font-normal">books</span></span>
          <span className="text-green-400 font-medium">{NMC_STATS.booksWeHave} <span className="text-zinc-500 font-normal">in library</span></span>
        </div>
        <p className="text-zinc-600 text-xs mt-2">Click any PG/SS card above to view full curriculum with competencies, teaching methods, assessment & books.</p>
      </div>

      {/* UG Library Coverage */}
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-zinc-300 mb-1">📊 UG Library Coverage</h3>
        <p className="text-zinc-400 text-sm">
          <span className="text-white font-medium">1,020</span> of <span className="text-white font-medium">2,947</span> UG competencies mapped to Library topics
        </p>
        <p className="text-zinc-600 text-xs mt-1">34.6% coverage — competency codes are actively being added to topics across all 21 subjects.</p>
      </div>

      {/* Footer stats */}
      <div className="border-t border-zinc-800 pt-4 text-xs text-zinc-600 flex gap-4 flex-wrap">
        <span>UG: 4 Phases</span>
        <span>MD: {PG_CURRICULA.filter((c) => c.degree === "MD").length}</span>
        <span>MS: {PG_CURRICULA.filter((c) => c.degree === "MS").length}</span>
        <span>DM: {SS_CURRICULA.filter((c) => c.degree === "DM").length}</span>
        <span>MCh: {SS_CURRICULA.filter((c) => c.degree === "MCh").length}</span>
        <span>Diploma: {SS_CURRICULA.filter((c) => c.degree === "Diploma").length}</span>
        <span className="text-zinc-500">Source: NMC India</span>
      </div>
    </div>
  );
}
