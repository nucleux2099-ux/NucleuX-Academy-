import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ALL_CURRICULA,
  getCurriculumBySlug,
  getBooksForSpecialty,
  type NMCCurriculum,
  type NMCBook,
} from "@/lib/data/nmc-vault";
import { resolveCanonicalCurriculumId } from "@/lib/data/cbme-aliases";
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
  const canonicalSpecialty = resolveCanonicalCurriculumId(specialty);
  const curriculum = getCurriculumBySlug(canonicalSpecialty);
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
  const canonicalSpecialty = resolveCanonicalCurriculumId(specialty);

  // Surgery has its own dedicated page
  if (canonicalSpecialty === "ms-surgery") {
    redirect("/cbme/surgery");
  }

  if (specialty !== canonicalSpecialty) {
    redirect(`/cbme/${canonicalSpecialty}`);
  }

  const curriculum = getCurriculumBySlug(canonicalSpecialty);
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
        <Link href="/cbme" className="hover:text-[#8FD5D5] transition-colors">
          ← CBME Curriculum
        </Link>
      </nav>

      {/* Header */}
      <header className="space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <DegreeBadge level={curriculum.level} />
          <span className="text-xs text-[#6B7A88] bg-[#364A5E] px-2 py-1 rounded border border-[rgba(91,179,179,0.1)]">
            {curriculum.category}
          </span>
          <span className="text-xs text-[#6B7A88]">
            {curriculum.wordCount.toLocaleString()} words
          </span>
        </div>
        <h1 className="text-3xl font-bold text-[#E8E0D5]">{curriculum.title}</h1>

        {/* Stats bar */}
        <div className="flex gap-4 flex-wrap text-sm">
          <Stat label="Total" value={totalComp} color="text-[#8FD5D5]" />
          <Stat label="Cognitive" value={cogCount} color="text-[#8FD5D5]" />
          <Stat label="Psychomotor" value={psyCount} color="text-[#7BA69E]" />
          <Stat label="Affective" value={affCount} color="text-[#C9A86C]" />
          <Stat label="Books" value={books.length} color="text-[#D8BE90]" />
        </div>
      </header>

      {/* Client-side interactive content */}
      <SpecialtyClient curriculum={curriculum} books={books} />
    </div>
  );
}

function DegreeBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    MD: "bg-[#5BB3B3]/16 text-[#8FD5D5] border-[#5BB3B3]/30",
    MS: "bg-[#5BB3B3]/16 text-[#8FD5D5] border-[#5BB3B3]/30",
    DM: "bg-[#C9A86C]/16 text-[#D8BE90] border-[#C9A86C]/30",
    MCh: "bg-[#E57373]/16 text-[#E8A5A5] border-[#E57373]/30",
    Diploma: "bg-[#C9A86C]/16 text-[#D8BE90] border-[#C9A86C]/30",
  };
  return (
    <span
      className={`px-3 py-1 text-sm font-semibold rounded border ${
        styles[level] ?? "bg-[rgba(232,224,213,0.12)] text-[#A0B0BC] border-[rgba(232,224,213,0.25)]"
      }`}
    >
      {level}
    </span>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-[#364A5E] border border-[rgba(91,179,179,0.1)] rounded px-3 py-1.5">
      <span className={`font-bold ${color}`}>{value}</span>{" "}
      <span className="text-[#6B7A88] text-xs">{label}</span>
    </div>
  );
}
