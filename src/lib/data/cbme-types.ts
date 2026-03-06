/**
 * NMC CBME — Canonical curriculum backbone types.
 *
 * These types are shared across MBBS years so Dashboard/Library/Exam Centre can
 * reference a single source of truth.
 */

export type CBMEYear = 1 | 2 | 3 | 4;
export type CBMEAssessmentTag = "theory" | "practical" | "viva";

export type CBMESubject =
  | "anatomy"
  | "physiology"
  | "biochemistry"
  | "bme"
  | "pathology"
  | "pharmacology"
  | "microbiology"
  | "forensic"
  | "psm"
  | "ent"
  | "ophthalmology"
  | "medicine"
  | "surgery"
  | "obgyn"
  | "pediatrics"
  | "orthopedics";

export type CBMEBlock = {
  id: string; // canonical block id
  year: CBMEYear;
  subject: CBMESubject;
  title: string;
  order: number;
  tags: CBMEAssessmentTag[];
  // These will be wired to real content over time.
  links?: {
    libraryPath?: string; // e.g. /library/anatomy/...
    examCentrePath?: string; // e.g. /exam-centre
    arenaPath?: string; // e.g. /arena
    flashcardsDeckId?: string;
  };
};
