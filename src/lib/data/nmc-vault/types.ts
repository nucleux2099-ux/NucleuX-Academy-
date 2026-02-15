/** NMC Vault v2 — Type definitions */

export interface NMCCompetency {
  code: string;
  description: string;
}

export interface NMCCurriculum {
  id: string;
  title: string;
  level: string;
  category: string;
  preamble: string;
  objectives: string[];
  competencies: {
    cognitive: NMCCompetency[];
    psychomotor: NMCCompetency[];
    affective: NMCCompetency[];
  };
  teachingMethods: string[];
  assessment: string;
  recommendedBooks: string[];
  wordCount: number;
}

export interface NMCBook {
  specialty: string;
  book_title: string;
  authors: string;
  edition: string;
  we_have: "YES" | "NO";
  format: string;
  location: string;
  notes: string;
}

export interface NMCMasterEntry {
  level: string;
  degree: string;
  subject: string;
  word_count: number;
  num_competencies_cognitive: number;
  num_competencies_psychomotor: number;
  num_competencies_affective: number;
  num_total_competencies: number;
  has_objectives: boolean;
  has_teaching_methods: boolean;
  has_assessment: boolean;
  has_books: boolean;
  file_path: string;
}
