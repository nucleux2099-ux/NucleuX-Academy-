/**
 * NMC Vault v2 — Barrel export
 * 87 specialties, 7,288 competencies, recommended books
 */

import type { NMCCurriculum, NMCBook, NMCMasterEntry } from "./types";

// Curricula
import pgMdData from "./pg-md-curricula-v2.json";
import pgMsData from "./pg-ms-curricula-v2.json";
import ssDmData from "./ss-dm-curricula-v2.json";
import ssMchData from "./ss-mch-curricula-v2.json";
import diplomaData from "./diploma-curricula-v2.json";

// Books
import booksPgMd from "./books-pg-md-v2.json";
import booksPgMs from "./books-pg-ms-v2.json";
import booksSsDm from "./books-ss-dm-v2.json";
import booksSsMch from "./books-ss-mch-v2.json";
import booksDiploma from "./books-diploma-v2.json";

// Master index
import masterIndex from "./nmc-master-index-v2.json";

export type { NMCCurriculum, NMCBook, NMCMasterEntry } from "./types";

export const PG_MD_CURRICULA = pgMdData as NMCCurriculum[];
export const PG_MS_CURRICULA = pgMsData as NMCCurriculum[];
export const SS_DM_CURRICULA = ssDmData as NMCCurriculum[];
export const SS_MCH_CURRICULA = ssMchData as NMCCurriculum[];
export const DIPLOMA_CURRICULA = diplomaData as NMCCurriculum[];

export const ALL_CURRICULA: NMCCurriculum[] = [
  ...PG_MD_CURRICULA,
  ...PG_MS_CURRICULA,
  ...SS_DM_CURRICULA,
  ...SS_MCH_CURRICULA,
  ...DIPLOMA_CURRICULA,
];

export const ALL_BOOKS: NMCBook[] = [
  ...(booksPgMd as NMCBook[]),
  ...(booksPgMs as NMCBook[]),
  ...(booksSsDm as NMCBook[]),
  ...(booksSsMch as NMCBook[]),
  ...(booksDiploma as NMCBook[]),
];

export const NMC_MASTER_INDEX = masterIndex as NMCMasterEntry[];

/** Lookup curriculum by slug (id field) */
export function getCurriculumBySlug(slug: string): NMCCurriculum | undefined {
  return ALL_CURRICULA.find((c) => c.id === slug);
}

/** Lookup books for a specialty title */
export function getBooksForSpecialty(specialtyTitle: string): NMCBook[] {
  return ALL_BOOKS.filter((b) => b.specialty === specialtyTitle);
}

/** Stats */
export const NMC_STATS = {
  totalSpecialties: ALL_CURRICULA.length,
  totalCompetencies: ALL_CURRICULA.reduce(
    (sum, c) =>
      sum +
      c.competencies.cognitive.length +
      c.competencies.psychomotor.length +
      c.competencies.affective.length,
    0
  ),
  totalBooks: ALL_BOOKS.length,
  booksWeHave: ALL_BOOKS.filter((b) => b.we_have === "YES").length,
};
