"use client";

import { useState } from "react";
import type { NMCCurriculum, NMCBook, NMCCompetency } from "@/lib/data/nmc-vault/types";

interface Props {
  curriculum: NMCCurriculum;
  books: NMCBook[];
}

type CompTab = "cognitive" | "psychomotor" | "affective";

export function SpecialtyClient({ curriculum, books }: Props) {
  const [compTab, setCompTab] = useState<CompTab>("cognitive");
  const [search, setSearch] = useState("");
  const [preambleOpen, setPreambleOpen] = useState(false);

  const compMap: Record<CompTab, { items: NMCCompetency[]; color: string; prefix: string }> = {
    cognitive: { items: curriculum.competencies.cognitive, color: "teal", prefix: "A" },
    psychomotor: { items: curriculum.competencies.psychomotor, color: "sage", prefix: "B" },
    affective: { items: curriculum.competencies.affective, color: "gold", prefix: "C" },
  };

  const current = compMap[compTab];
  const filtered = search
    ? current.items.filter(
        (c) =>
          c.code.toLowerCase().includes(search.toLowerCase()) ||
          c.description.toLowerCase().includes(search.toLowerCase())
      )
    : current.items;

  return (
    <div className="space-y-8">
      {/* Preamble */}
      {curriculum.preamble && (
        <section className="bg-[#364A5E] border border-[rgba(91,179,179,0.1)] rounded-lg overflow-hidden">
          <button
            onClick={() => setPreambleOpen(!preambleOpen)}
            className="w-full px-5 py-3 flex items-center justify-between text-left hover:bg-[#2D3E50] transition-colors"
          >
            <h2 className="text-sm font-semibold text-[#E8E0D5]">📄 Preamble</h2>
            <span className="text-[#6B7A88] text-xs">{preambleOpen ? "▲ Collapse" : "▼ Expand"}</span>
          </button>
          {preambleOpen && (
            <div className="px-5 pb-4 text-sm text-[#A0B0BC] leading-relaxed whitespace-pre-line">
              {curriculum.preamble}
            </div>
          )}
        </section>
      )}

      {/* Objectives */}
      {curriculum.objectives.length > 0 && (
        <section className="bg-[#364A5E] border border-[rgba(91,179,179,0.1)] rounded-lg p-5">
          <h2 className="text-sm font-semibold text-[#E8E0D5] mb-3">🎯 Objectives</h2>
          <ul className="space-y-2">
            {curriculum.objectives.map((obj, i) => (
              <li key={i} className="text-sm text-[#A0B0BC] flex gap-2">
                <span className="text-[#5BB3B3] mt-0.5 shrink-0">•</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Competencies */}
      <section className="bg-[#364A5E] border border-[rgba(91,179,179,0.1)] rounded-lg p-5 space-y-4">
        <h2 className="text-sm font-semibold text-[#E8E0D5]">🧠 Competencies</h2>

        {/* Tabs */}
        <div className="flex gap-2">
          {(["cognitive", "psychomotor", "affective"] as const).map((t) => {
            const count = compMap[t].items.length;
            const isActive = compTab === t;
            const colors: Record<CompTab, string> = {
              cognitive: isActive ? "bg-[#5BB3B3] text-[#E8E0D5]" : "bg-[#5BB3B3]/10 text-[#8FD5D5] hover:bg-[#5BB3B3]/16",
              psychomotor: isActive ? "bg-[#7BA69E] text-[#E8E0D5]" : "bg-[#7BA69E]/14 text-[#7BA69E] hover:bg-[#7BA69E]/16",
              affective: isActive ? "bg-[#C9A86C] text-[#1E2D3D]" : "bg-[#C9A86C]/14 text-[#D8BE90] hover:bg-[#C9A86C]/22",
            };
            return (
              <button
                key={t}
                onClick={() => setCompTab(t)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${colors[t]}`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder={`Search ${compTab} competencies...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-3 py-2 bg-[#2D3E50] border border-[rgba(91,179,179,0.15)] rounded text-sm text-[#E8E0D5] placeholder:text-[#6B7A88] focus:outline-none focus:ring-1 focus:ring-[#5BB3B3]/45"
        />

        {/* List */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {filtered.length === 0 && (
            <p className="text-[#6B7A88] text-sm">No competencies found.</p>
          )}
          {filtered.map((comp) => (
            <div
              key={comp.code}
              className="flex gap-3 items-start px-3 py-2 rounded bg-[#2D3E50]/50 border border-[rgba(91,179,179,0.05)]"
            >
              <span
                className={`shrink-0 px-2 py-0.5 text-xs font-mono font-semibold rounded border ${
                  current.color === "teal"
                    ? "bg-[#5BB3B3]/15 text-[#8FD5D5] border-[#5BB3B3]/30"
                    : current.color === "sage"
                    ? "bg-[#7BA69E]/15 text-[#7BA69E] border-[#7BA69E]/30"
                    : "bg-[#C9A86C]/15 text-[#D8BE90] border-[#C9A86C]/30"
                }`}
              >
                {comp.code}
              </span>
              <span className="text-sm text-[#A0B0BC]">{comp.description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Teaching Methods */}
      {curriculum.teachingMethods.length > 0 && (
        <section className="bg-[#364A5E] border border-[rgba(91,179,179,0.1)] rounded-lg p-5">
          <h2 className="text-sm font-semibold text-[#E8E0D5] mb-3">📚 Teaching Methods</h2>
          <div className="flex flex-wrap gap-2">
            {curriculum.teachingMethods.map((m, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs text-[#A0B0BC] bg-[#2D3E50] border border-[rgba(91,179,179,0.1)] rounded-full"
              >
                {m}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Assessment */}
      {curriculum.assessment && (
        <section className="bg-[#364A5E] border border-[rgba(91,179,179,0.1)] rounded-lg p-5">
          <h2 className="text-sm font-semibold text-[#E8E0D5] mb-3">📝 Assessment</h2>
          <div className="text-sm text-[#A0B0BC] leading-relaxed whitespace-pre-line">
            {curriculum.assessment}
          </div>
        </section>
      )}

      {/* Recommended Books */}
      {(curriculum.recommendedBooks.length > 0 || books.length > 0) && (
        <section className="bg-[#364A5E] border border-[rgba(91,179,179,0.1)] rounded-lg p-5">
          <h2 className="text-sm font-semibold text-[#E8E0D5] mb-3">📖 Recommended Books</h2>
          {books.length > 0 ? (
            <div className="space-y-2">
              {books.map((b, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 px-3 py-2 rounded bg-[#2D3E50]/50 border border-[rgba(91,179,179,0.05)]"
                >
                  <span
                    className={`shrink-0 px-2 py-0.5 text-xs font-semibold rounded border ${
                      b.we_have === "YES"
                        ? "bg-[#7BA69E]/15 text-[#7BA69E] border-[#7BA69E]/30"
                        : "bg-red-600/15 text-[#E57373] border-[#E57373]/30"
                    }`}
                  >
                    {b.we_have === "YES" ? "✓ Have" : "✗ Missing"}
                  </span>
                  <div>
                    <p className="text-sm text-[#E8E0D5]">{b.book_title}</p>
                    {b.authors && <p className="text-xs text-[#6B7A88]">{b.authors}</p>}
                    {b.edition && <p className="text-xs text-gray-600">{b.edition}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-1">
              {curriculum.recommendedBooks.map((b, i) => (
                <li key={i} className="text-sm text-[#A0B0BC] flex gap-2">
                  <span className="text-amber-500 shrink-0">📕</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
