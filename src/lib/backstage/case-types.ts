import type { Bloom, SubjectKey } from "./types";

export type KolbStage = "experience" | "reflection" | "concept" | "experiment";

export type CaseLog = {
  id: string;
  createdAt: string; // ISO

  // Default format: "M/56 Chest pain"
  title: string;

  subject: SubjectKey;
  cbmeBlockId?: string;

  // Kolb cycle
  experience?: string;
  reflection?: string;
  concept?: string;
  experiment?: string;

  // Optional learning tags
  bloom?: Bloom;

  // Links (strings for now; later can become structured)
  links?: {
    library?: string[];
    mcq?: string[];
    notes?: string[];
  };
};

export type CaseLogState = {
  version: 1;
  cases: CaseLog[];
};
