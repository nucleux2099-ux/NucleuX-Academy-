import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ALL_CURRICULA,
  getCurriculumBySlug,
  getBooksForSpecialty,
  type NMCCurriculum,
  type NMCBook,
} from "@/lib/data/nmc-vault";
import { SpecialtyClient } from "./client";

interface Props {
  params: Promise<{ specialty: string }>;
}

export function generateStaticParams() {
  return ALL_CURRICULA.filter((c) => c.id !== "ms-general-surgery").map((c) => ({
    specialty: c.id,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { specialty } = await params;
  const curriculum = getCurriculumBySlug(specialty);
  if (!curriculum) return { title: "Not Found" };
  const total =
    curriculum.competencies.cognitive.length +
    curriculum.competencies.psychomotor.length +
    curriculum.competencies.affective.length;
  return {
    title: `${curriculum.title} — CBME Curriculum | NucleuX Academy`,
    description: `${curriculum.level} ${curriculum.title}: ${total} competencies, teaching methods, assessment & recommended books. NMC CBME curriculum.`,
  };
}

export default async function SpecialtyPage({ params }: Props) {
  const { specialty } = await params;

  // Surgery has its own dedicated page
  if (specialty === "surgery" || specialty === "ms-general-surgery") {
    redirect("/cbme/surgery");
  }

  const curriculum = getCurriculumBySlug(specialty);
  if (!curriculum) notFound();

  const books = getBooksForSpecialty(curriculum.title);
  const cogCount = curriculum.competencies.cognitive.length;
  const psyCount = curriculum.competencies.psychomotor.length;
  const affCount = curriculum.competencies.affective.length;
  const totalComp = cogCount + psyCount + affCount;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400">
        <Link href="/cbme" className="hover:text-cyan-400 transition-colors">
          ← CBME Curriculum
        </Link>
      </nav>

      {/* Header */}
      <header className="space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <DegreeBadge level={curriculum.level} />
          <span className="text-xs text-gray-500 bg-[#142538] px-2 py-1 rounded border border-[rgba(6,182,212,0.1)]">
            {curriculum.category}
          </span>
          <span className="text-xs text-gray-500">
            {curriculum.wordCount.toLocaleString()} words
          </span>
        </div>
        <h1 className="text-3xl font-bold text-[#E5E7EB]">{curriculum.title}</h1>

        {/* Stats bar */}
        <div className="flex gap-4 flex-wrap text-sm">
          <Stat label="Total" value={totalComp} color="text-cyan-400" />
          <Stat label="Cognitive" value={cogCount} color="text-blue-400" />
          <Stat label="Psychomotor" value={psyCount} color="text-green-400" />
          <Stat label="Affective" value={affCount} color="text-purple-400" />
          <Stat label="Books" value={books.length} color="text-amber-400" />
        </div>
      </header>

      {/* Client-side interactive content */}
      <SpecialtyClient curriculum={curriculum} books={books} />
    </div>
  );
}

function DegreeBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    MD: "bg-blue-600/20 text-blue-400 border-blue-500/30",
    MS: "bg-cyan-600/20 text-cyan-400 border-cyan-500/30",
    DM: "bg-purple-600/20 text-purple-400 border-purple-500/30",
    MCh: "bg-rose-600/20 text-rose-400 border-rose-500/30",
    Diploma: "bg-amber-600/20 text-amber-400 border-amber-500/30",
  };
  return (
    <span
      className={`px-3 py-1 text-sm font-semibold rounded border ${
        styles[level] ?? "bg-zinc-600/20 text-zinc-400 border-zinc-500/30"
      }`}
    >
      {level}
    </span>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-[#142538] border border-[rgba(6,182,212,0.1)] rounded px-3 py-1.5">
      <span className={`font-bold ${color}`}>{value}</span>{" "}
      <span className="text-gray-500 text-xs">{label}</span>
    </div>
  );
}
