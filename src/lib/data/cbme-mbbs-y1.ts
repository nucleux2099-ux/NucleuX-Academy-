/**
 * NMC CBME — MBBS Year 1 (Block-wise) master map.
 *
 * This file is the canonical curriculum backbone that links:
 * Dashboard ↔ Library ↔ Exam Centre ↔ Arena(BME/practicals) ↔ Flashcards
 *
 * v1 scope: Year 1 only, classic block order.
 */

export type CBMEYear = 1;
export type CBMEAssessmentTag = "theory" | "practical" | "viva";

export type CBMEBlock = {
  id: string; // canonical block id
  year: CBMEYear;
  subject: "anatomy" | "physiology" | "biochemistry" | "bme";
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

export const CBME_MBBS_Y1_BLOCKS: CBMEBlock[] = [
  // =====================
  // ANATOMY (classic order)
  // =====================
  {
    id: "cbme-y1-anat-01-general",
    year: 1,
    subject: "anatomy",
    title: "General Anatomy + Embryology + Histology (Basics)",
    order: 1,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/anatomy" },
  },
  {
    id: "cbme-y1-anat-02-upper-limb",
    year: 1,
    subject: "anatomy",
    title: "Upper Limb",
    order: 2,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/anatomy" },
  },
  {
    id: "cbme-y1-anat-03-lower-limb",
    year: 1,
    subject: "anatomy",
    title: "Lower Limb",
    order: 3,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/anatomy" },
  },
  {
    id: "cbme-y1-anat-04-thorax",
    year: 1,
    subject: "anatomy",
    title: "Thorax",
    order: 4,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/anatomy" },
  },
  {
    id: "cbme-y1-anat-05-abdomen",
    year: 1,
    subject: "anatomy",
    title: "Abdomen",
    order: 5,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/anatomy" },
  },
  {
    id: "cbme-y1-anat-06-head-neck",
    year: 1,
    subject: "anatomy",
    title: "Head & Neck",
    order: 6,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/anatomy" },
  },
  {
    id: "cbme-y1-anat-07-neuroanatomy",
    year: 1,
    subject: "anatomy",
    title: "Neuroanatomy",
    order: 7,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/anatomy" },
  },

  // =====================
  // PHYSIOLOGY (block-wise)
  // =====================
  {
    id: "cbme-y1-phys-01-general",
    year: 1,
    subject: "physiology",
    title: "General Physiology (Cell, membranes, transport, homeostasis)",
    order: 101,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/physiology" },
  },
  {
    id: "cbme-y1-phys-02-blood",
    year: 1,
    subject: "physiology",
    title: "Blood & Immunity (basics)",
    order: 102,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/physiology" },
  },
  {
    id: "cbme-y1-phys-03-cvs",
    year: 1,
    subject: "physiology",
    title: "Cardiovascular System",
    order: 103,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/physiology" },
  },
  {
    id: "cbme-y1-phys-04-resp",
    year: 1,
    subject: "physiology",
    title: "Respiratory System",
    order: 104,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/physiology" },
  },
  {
    id: "cbme-y1-phys-05-renal",
    year: 1,
    subject: "physiology",
    title: "Renal Physiology",
    order: 105,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/physiology" },
  },
  {
    id: "cbme-y1-phys-06-git",
    year: 1,
    subject: "physiology",
    title: "Gastrointestinal Physiology",
    order: 106,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/physiology" },
  },
  {
    id: "cbme-y1-phys-07-endocrine",
    year: 1,
    subject: "physiology",
    title: "Endocrine Physiology",
    order: 107,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/physiology" },
  },
  {
    id: "cbme-y1-phys-08-repro",
    year: 1,
    subject: "physiology",
    title: "Reproductive Physiology (basics)",
    order: 108,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/physiology" },
  },
  {
    id: "cbme-y1-phys-09-neuro",
    year: 1,
    subject: "physiology",
    title: "Neurophysiology",
    order: 109,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/physiology" },
  },

  // =====================
  // BIOCHEMISTRY (block-wise)
  // =====================
  {
    id: "cbme-y1-bioch-01-biomolecules",
    year: 1,
    subject: "biochemistry",
    title: "Biomolecules & Enzymes",
    order: 201,
    tags: ["theory", "practical", "viva"],
    links: { libraryPath: "/library/biochemistry" },
  },
  {
    id: "cbme-y1-bioch-02-carb-metabolism",
    year: 1,
    subject: "biochemistry",
    title: "Carbohydrate Metabolism",
    order: 202,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/biochemistry" },
  },
  {
    id: "cbme-y1-bioch-03-lipid-metabolism",
    year: 1,
    subject: "biochemistry",
    title: "Lipid Metabolism",
    order: 203,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/biochemistry" },
  },
  {
    id: "cbme-y1-bioch-04-protein-metabolism",
    year: 1,
    subject: "biochemistry",
    title: "Protein & Amino Acid Metabolism",
    order: 204,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/biochemistry" },
  },
  {
    id: "cbme-y1-bioch-05-vitamins-minerals",
    year: 1,
    subject: "biochemistry",
    title: "Vitamins & Minerals",
    order: 205,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/biochemistry" },
  },
  {
    id: "cbme-y1-bioch-06-molecular-bio",
    year: 1,
    subject: "biochemistry",
    title: "Molecular Biology (DNA/RNA, genetics basics)",
    order: 206,
    tags: ["theory", "viva"],
    links: { libraryPath: "/library/biochemistry" },
  },

  // =====================
  // BME (Arena) — v1 placeholders (block-wise)
  // =====================
  {
    id: "cbme-y1-bme-01-professionalism",
    year: 1,
    subject: "bme",
    title: "BME: Professionalism & Ethics (basics)",
    order: 301,
    tags: ["theory", "viva"],
    links: { arenaPath: "/arena" },
  },
  {
    id: "cbme-y1-bme-02-communication",
    year: 1,
    subject: "bme",
    title: "BME: Communication Skills (basics)",
    order: 302,
    tags: ["theory", "practical", "viva"],
    links: { arenaPath: "/arena" },
  },
];

export function getCBMEY1BlocksBySubject(subject: CBMEBlock["subject"]) {
  return CBME_MBBS_Y1_BLOCKS.filter((b) => b.subject === subject).sort(
    (a, b) => a.order - b.order
  );
}
