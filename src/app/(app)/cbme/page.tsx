"use client";

import { useState } from "react";
import { CBME_MBBS_Y1_BLOCKS } from "@/lib/data/cbme-mbbs-y1";
import { CBME_MBBS_Y2_BLOCKS } from "@/lib/data/cbme-mbbs-y2";
import { CBME_MBBS_Y3_BLOCKS } from "@/lib/data/cbme-mbbs-y3";
import { CBME_MBBS_Y4_BLOCKS } from "@/lib/data/cbme-mbbs-y4";
import { PG_CURRICULA, type PGDegree } from "@/lib/data/cbme-pg";
import { SS_CURRICULA, type SSDegree } from "@/lib/data/cbme-ss";
import type { CBMEBlock } from "@/lib/data/cbme-types";
import { NMC_STATS, getCurriculumBySlug } from "@/lib/data/nmc-vault";
import { getCurriculumRoute } from "@/lib/data/cbme-aliases";
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
    MD: "border border-[#5BB3B3]/30 bg-[#5BB3B3]/16 text-[#8FD5D5]",
    MS: "bg-[#5BB3B3]/16 text-[#8FD5D5] border-[#5BB3B3]/30",
    DM: "bg-[#C9A86C]/18 text-[#C9A86C] border-[#C9A86C]/30",
    MCh: "border border-[#C9A86C]/30 bg-[#C9A86C]/16 text-[#D8BE90]",
    Diploma: "bg-[#C9A86C]/16 text-[#D8BE90] border-[#C9A86C]/30",
  };
  return map[degree] ?? "border border-[rgba(232,224,213,0.22)] bg-[#3A4D5F]/60 text-[#A0B0BC]";
}

/* ─── subject colour hash for UG ─── */
function subjectColor(subject: string) {
  const map: Record<string, string> = {
    anatomy: "border-[#C9A86C]/35",
    physiology: "border-[#7BA69E]/35",
    biochemistry: "border-[#5BB3B3]/35",
    pathology: "border-[#E57373]/35",
    pharmacology: "border-[#5BB3B3]/30",
    microbiology: "border-[#7BA69E]/30",
    forensic: "border-[rgba(232,224,213,0.28)]",
    psm: "border-[#7BA69E]/35",
    medicine: "border-[#5BB3B3]/35",
    surgery: "border-[#C9A86C]/35",
    obgyn: "border-[#E57373]/35",
    pediatrics: "border-[#7BA69E]/35",
    orthopedics: "border-[#C9A86C]/35",
    ent: "border-[#5BB3B3]/30",
    ophthalmology: "border-[#7BA69E]/35",
    bme: "border-[#C9A86C]/30",
  };
  return map[subject] ?? "border-[rgba(232,224,213,0.22)]";
}

function getMappingConfidence(curriculum: { librarySubject?: string; libraryPath?: string }) {
  if (curriculum.libraryPath) {
    return {
      label: "High link confidence",
      className: "bg-[#7BA69E]/16 text-[#7BA69E] border border-[#7BA69E]/24",
    };
  }

  if (curriculum.librarySubject) {
    return {
      label: "Subject-level mapping",
      className: "bg-[#C9A86C]/16 text-[#D8BE90] border border-[#C9A86C]/24",
    };
  }

  return {
    label: "No library mapping",
    className: "bg-[#3A4D5F]/45 text-[#A0B0BC] border border-[rgba(232,224,213,0.2)]",
  };
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
    <div className="ui-shell ui-page space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#E8E0D5]">
          📋 CBME Curriculum
        </h1>
        <p className="text-[#A0B0BC] mt-1">
          National Medical Commission — Competency Based Medical Education
        </p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search curricula..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md rounded-lg border border-[rgba(232,224,213,0.1)] bg-[#2D3E50] px-4 py-2 text-[#E8E0D5] placeholder:text-[#6B7A88] focus:outline-none focus:ring-2 focus:ring-[#5BB3B3]/45"
      />

      {/* Main Tabs */}
      <div className="flex gap-2 border-b border-[rgba(232,224,213,0.1)] pb-2">
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
                ? "bg-[#2D3E50] text-[#E8E0D5] border border-[rgba(232,224,213,0.1)] border-b-transparent"
                : "text-[#A0B0BC] hover:text-[#D3DCE3]"
            }`}
          >
            {t.label}{" "}
            <span className="text-xs text-[#6B7A88]">({t.count})</span>
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
                <h2 className="text-xl font-semibold text-[#E8E0D5] mb-4 flex items-center gap-2">
                  <span className="rounded border border-[#7BA69E]/30 bg-[#7BA69E]/16 px-2 py-0.5 text-xs text-[#7BA69E]">
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
                        className={`bg-[#364A5E]/90 rounded-lg border-l-4 ${subjectColor(subj)} p-4`}
                      >
                        <h3 className="text-sm font-semibold text-[#C8D2DA] uppercase tracking-wide mb-2">
                          {subj.replace(/-/g, " ")}
                        </h3>
                        <ul className="space-y-1">
                          {blocks.map((b) => (
                            <li key={b.id} className="text-sm text-[#A0B0BC] flex items-start gap-2">
                              <span className="text-[#556270] mt-0.5">•</span>
                              {b.links?.libraryPath ? (
                                <Link
                                  href={b.links.libraryPath}
                                  className="hover:text-[#E8E0D5] transition-colors"
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
                    ? "bg-[#5BB3B3] text-[#1E2D3D]"
                    : "bg-[#2D3E50] text-[#A0B0BC] hover:text-[#E8E0D5]"
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
              const mapping = getMappingConfidence(c);
              return (
                <Link
                  key={c.id}
                  href={getCurriculumRoute(c.id)}
                  className="bg-[#364A5E]/90 border border-[rgba(232,224,213,0.1)] rounded-lg p-4 hover:border-[#5BB3B3]/30 transition-colors block"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-xs rounded border ${degreeBadge(c.degree)}`}>
                      {c.degree}
                    </span>
                    {totalComp > 0 && (
                      <span className="rounded border border-[#5BB3B3]/24 bg-[#5BB3B3]/16 px-1.5 py-0.5 text-xs text-[#8FD5D5]">
                        {totalComp} competencies
                      </span>
                    )}
                    {c.hasRevised && (
                      <span className="rounded border border-[#7BA69E]/24 bg-[#7BA69E]/14 px-1.5 py-0.5 text-xs text-[#7BA69E]">
                        Revised
                      </span>
                    )}
                  </div>
                  <h3 className="text-[#E8E0D5] font-medium text-sm">{c.title}</h3>
                  <p className="text-[#6B7A88] text-xs mt-1">{c.description}</p>
                  {(c.librarySubject || c.libraryPath) && (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="inline-block text-xs text-[#8FD5D5]">
                        📚 {c.libraryPath ? "Deep link ready" : "Library mapped"}
                      </span>
                      <span className={`px-1.5 py-0.5 text-[10px] rounded ${mapping.className}`}>
                        {mapping.label}
                      </span>
                    </div>
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
                    ? "bg-[#C9A86C] text-[#E8E0D5]"
                    : "bg-[#2D3E50] text-[#A0B0BC] hover:text-[#E8E0D5]"
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
              const mapping = getMappingConfidence(c);
              return (
                <Link
                  key={c.id}
                  href={`/cbme/${c.id}`}
                  className="bg-[#364A5E]/90 border border-[rgba(232,224,213,0.1)] rounded-lg p-4 hover:border-[#5BB3B3]/30 transition-colors block"
                >
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`px-2 py-0.5 text-xs rounded border ${degreeBadge(c.degree)}`}>
                      {c.degree}
                    </span>
                    {totalComp > 0 && (
                      <span className="rounded border border-[#5BB3B3]/24 bg-[#5BB3B3]/16 px-1.5 py-0.5 text-xs text-[#8FD5D5]">
                        {totalComp} competencies
                      </span>
                    )}
                    {c.hasRevised && (
                      <span className="rounded border border-[#7BA69E]/24 bg-[#7BA69E]/14 px-1.5 py-0.5 text-xs text-[#7BA69E]">
                        Revised
                      </span>
                    )}
                  </div>
                  <h3 className="text-[#E8E0D5] font-medium text-sm">{c.title}</h3>
                  <p className="text-[#6B7A88] text-xs mt-1">{c.description}</p>
                  {c.parentDegree && (
                    <p className="text-[#556270] text-xs mt-1">← {c.parentDegree}</p>
                  )}
                  {(c.librarySubject || c.libraryPath) && (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="inline-block text-xs text-[#C9A86C]">
                        📚 {c.libraryPath ? "Deep link ready" : "Library mapped"}
                      </span>
                      <span className={`px-1.5 py-0.5 text-[10px] rounded ${mapping.className}`}>
                        {mapping.label}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Subject-Specific CBME Pages */}
      <div className="bg-[#364A5E]/90 border border-[rgba(232,224,213,0.1)] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#C8D2DA] mb-2">🔬 Subject-Specific CBME Maps</h3>
        <p className="text-[#6B7A88] text-xs mb-3">Detailed UG → PG → SS progression with competency codes mapped to library topics</p>
        <div className="flex gap-2 flex-wrap">
          <Link href="/cbme/surgery" className="px-4 py-2 rounded-lg border border-[rgba(232,224,213,0.12)] bg-[#2D3E50] text-[#A0B0BC] hover:bg-[#364A5E] hover:border-[#5BB3B3]/35 hover:text-[#E8E0D5] text-sm font-medium transition-colors">
            🔪 Surgery — 132 UG codes, 18 subspecialties
          </Link>
          <Link href="/cbme/ophthalmology" className="px-4 py-2 rounded-lg border border-[rgba(232,224,213,0.12)] bg-[#2D3E50] text-[#A0B0BC] hover:bg-[#364A5E] hover:border-[#5BB3B3]/35 hover:text-[#E8E0D5] text-sm font-medium transition-colors">
            👁️ Ophthalmology — OP1–OP9, 5 subspecialties
          </Link>
          <Link href="/cbme/medicine" className="px-4 py-2 rounded-lg border border-[rgba(232,224,213,0.12)] bg-[#2D3E50] text-[#A0B0BC] hover:bg-[#364A5E] hover:border-[#5BB3B3]/35 hover:text-[#E8E0D5] text-sm font-medium transition-colors">
            🩺 Medicine — IM1–IM26, 17 subspecialties
          </Link>
          <Link href="/cbme/obgyn" className="px-4 py-2 rounded-lg border border-[rgba(232,224,213,0.12)] bg-[#2D3E50] text-[#A0B0BC] hover:bg-[#364A5E] hover:border-[#5BB3B3]/35 hover:text-[#E8E0D5] text-sm font-medium transition-colors">
            🤰 OBG — OG1–OG39, 13 subspecialties
          </Link>
          <Link href="/cbme/pediatrics" className="px-4 py-2 rounded-lg border border-[rgba(232,224,213,0.12)] bg-[#2D3E50] text-[#A0B0BC] hover:bg-[#364A5E] hover:border-[#5BB3B3]/35 hover:text-[#E8E0D5] text-sm font-medium transition-colors">
            🧒 Pediatrics — PE1–PE34, 10 subspecialties
          </Link>
          <Link href="/cbme/orthopedics" className="px-4 py-2 rounded-lg border border-[rgba(232,224,213,0.12)] bg-[#2D3E50] text-[#A0B0BC] hover:bg-[#364A5E] hover:border-[#5BB3B3]/35 hover:text-[#E8E0D5] text-sm font-medium transition-colors">
            🦴 Orthopedics — OR1–OR14, 8 subspecialties
          </Link>
          <Link href="/cbme/ent" className="px-4 py-2 rounded-lg border border-[rgba(232,224,213,0.12)] bg-[#2D3E50] text-[#A0B0BC] hover:bg-[#364A5E] hover:border-[#5BB3B3]/35 hover:text-[#E8E0D5] text-sm font-medium transition-colors">
            👂 ENT — EN1–EN4, 4 subspecialties
          </Link>
          <Link href="/cbme/psychiatry" className="px-4 py-2 rounded-lg border border-[rgba(232,224,213,0.12)] bg-[#2D3E50] text-[#A0B0BC] hover:bg-[#364A5E] hover:border-[#5BB3B3]/35 hover:text-[#E8E0D5] text-sm font-medium transition-colors">
            🧠 Psychiatry — PS1–PS19, 5 subspecialties
          </Link>
          <Link href="/cbme/dermatology" className="px-4 py-2 rounded-lg border border-[rgba(232,224,213,0.12)] bg-[#2D3E50] text-[#A0B0BC] hover:bg-[#364A5E] hover:border-[#5BB3B3]/35 hover:text-[#E8E0D5] text-sm font-medium transition-colors">
            🧴 Dermatology — DR1–DR16, 4 subspecialties
          </Link>
          <Link href="/cbme/anesthesia" className="px-4 py-2 rounded-lg border border-[rgba(232,224,213,0.12)] bg-[#2D3E50] text-[#A0B0BC] hover:bg-[#364A5E] hover:border-[#5BB3B3]/35 hover:text-[#E8E0D5] text-sm font-medium transition-colors">
            💉 Anesthesia — AS1–AS10, 4 subspecialties
          </Link>
          <Link href="/cbme/community-medicine" className="px-4 py-2 rounded-lg border border-[rgba(232,224,213,0.12)] bg-[#2D3E50] text-[#A0B0BC] hover:bg-[#364A5E] hover:border-[#5BB3B3]/35 hover:text-[#E8E0D5] text-sm font-medium transition-colors">
            🏥 Community Medicine — CM1–CM19, 6 subspecialties
          </Link>
          <Link href="/cbme/radiology" className="px-4 py-2 rounded-lg border border-[rgba(232,224,213,0.12)] bg-[#2D3E50] text-[#A0B0BC] hover:bg-[#364A5E] hover:border-[#5BB3B3]/35 hover:text-[#E8E0D5] text-sm font-medium transition-colors">
            🔬 Radiology — RD1–RD3, 3 subspecialties
          </Link>
          <Link href="/cbme/biochemistry" className="px-4 py-2 rounded-lg border border-[rgba(232,224,213,0.12)] bg-[#2D3E50] text-[#A0B0BC] hover:bg-[#364A5E] hover:border-[#5BB3B3]/35 hover:text-[#E8E0D5] text-sm font-medium transition-colors">
            🧬 Biochemistry — BI1–BI11, 9 subspecialties
          </Link>
          <Link href="/cbme/anatomy" className="px-4 py-2 rounded-lg border border-[rgba(232,224,213,0.12)] bg-[#2D3E50] text-[#A0B0BC] hover:bg-[#364A5E] hover:border-[#5BB3B3]/35 hover:text-[#E8E0D5] text-sm font-medium transition-colors">
            🧬 Anatomy — AN1–AN80, 7 regions
          </Link>
          <Link href="/cbme/pathology" className="px-4 py-2 rounded-lg border border-[rgba(232,224,213,0.12)] bg-[#2D3E50] text-[#A0B0BC] hover:bg-[#364A5E] hover:border-[#5BB3B3]/35 hover:text-[#E8E0D5] text-sm font-medium transition-colors">
            🔬 Pathology — PA1–PA35, 10 subspecialties
          </Link>
          <Link href="/cbme/pharmacology" className="px-4 py-2 rounded-lg border border-[rgba(232,224,213,0.12)] bg-[#2D3E50] text-[#A0B0BC] hover:bg-[#364A5E] hover:border-[#5BB3B3]/35 hover:text-[#E8E0D5] text-sm font-medium transition-colors">
            💊 Pharmacology — PH1–PH5, 10 domains
          </Link>
          <Link href="/cbme/physiology" className="px-4 py-2 rounded-lg border border-[rgba(232,224,213,0.12)] bg-[#2D3E50] text-[#A0B0BC] hover:bg-[#364A5E] hover:border-[#5BB3B3]/35 hover:text-[#E8E0D5] text-sm font-medium transition-colors">
            ⚡ Physiology — PY1–PY11, 10 systems
          </Link>
          <Link href="/cbme/microbiology" className="px-4 py-2 rounded-lg border border-[rgba(232,224,213,0.12)] bg-[#2D3E50] text-[#A0B0BC] hover:bg-[#364A5E] hover:border-[#5BB3B3]/35 hover:text-[#E8E0D5] text-sm font-medium transition-colors">
            🦠 Microbiology — MI1–MI8, 10 domains
          </Link>
          <Link href="/cbme/forensic" className="px-4 py-2 rounded-lg border border-[rgba(232,224,213,0.12)] bg-[#2D3E50] text-[#A0B0BC] hover:bg-[#364A5E] hover:border-[#5BB3B3]/35 hover:text-[#E8E0D5] text-sm font-medium transition-colors">
            ⚖️ Forensic Medicine — FM1–FM14, 8 domains
          </Link>
        </div>
      </div>

      {/* NMC Vault Stats */}
      <div className="bg-[#364A5E]/90 border border-[rgba(232,224,213,0.1)] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#C8D2DA] mb-2">📊 NMC Vault — Full Curriculum Data</h3>
        <div className="flex gap-4 flex-wrap text-sm">
          <span className="text-[#E8E0D5] font-medium">{NMC_STATS.totalSpecialties} <span className="text-[#6B7A88] font-normal">specialties</span></span>
          <span className="text-[#8FD5D5] font-medium">{NMC_STATS.totalCompetencies.toLocaleString()} <span className="text-[#6B7A88] font-normal">competencies</span></span>
          <span className="text-[#D8BE90] font-medium">{NMC_STATS.totalBooks.toLocaleString()} <span className="text-[#6B7A88] font-normal">books</span></span>
          <span className="font-medium text-[#7BA69E]">{NMC_STATS.booksWeHave} <span className="text-[#6B7A88] font-normal">in library</span></span>
        </div>
        <p className="text-[#556270] text-xs mt-2">Click any PG/SS card above to view full curriculum with competencies, teaching methods, assessment & books.</p>
      </div>

      {/* UG Library Coverage */}
      <div className="bg-[#364A5E]/90 border border-[rgba(232,224,213,0.1)] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#C8D2DA] mb-1">📊 UG Library Coverage</h3>
        <p className="text-[#A0B0BC] text-sm">
          <span className="text-[#E8E0D5] font-medium">1,020</span> of <span className="text-[#E8E0D5] font-medium">2,947</span> UG competencies mapped to Library topics
        </p>
        <p className="text-[#556270] text-xs mt-1">34.6% coverage — competency codes are actively being added to topics across all 21 subjects.</p>
      </div>

      {/* Footer stats */}
      <div className="border-t border-[rgba(232,224,213,0.08)] pt-4 text-xs text-[#556270] flex gap-4 flex-wrap">
        <span>UG: 4 Phases</span>
        <span>MD: {PG_CURRICULA.filter((c) => c.degree === "MD").length}</span>
        <span>MS: {PG_CURRICULA.filter((c) => c.degree === "MS").length}</span>
        <span>DM: {SS_CURRICULA.filter((c) => c.degree === "DM").length}</span>
        <span>MCh: {SS_CURRICULA.filter((c) => c.degree === "MCh").length}</span>
        <span>Diploma: {SS_CURRICULA.filter((c) => c.degree === "Diploma").length}</span>
        <span className="text-[#6B7A88]">Source: NMC India</span>
      </div>
    </div>
  );
}
