export type Bloom =
  | "remember"
  | "understand"
  | "apply"
  | "analyze"
  | "evaluate"
  | "create";

export type CompetencyStage =
  | "unconsciously_incompetent"
  | "consciously_incompetent"
  | "consciously_competent"
  | "unconsciously_competent";

export type BackstageEventType =
  | "reading"
  | "mcq"
  | "case"
  | "reflection"
  | "note"
  | "deck_view"
  | "slide_view"
  | "template_insert"
  // Learning OS workflow (v1)
  | "prestudy"
  | "aim"
  | "shoot"
  | "skin"
  | "practice_block"
  | "marginal_gain"
  | "reverse_plan"
  | "mindmap";

export type SubjectKey =
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
  | "orthopedics"
  | "unknown";

export type BackstageEvent = {
  id: string;
  createdAt: string; // ISO
  type: BackstageEventType;

  subject: SubjectKey;
  // Canonical curriculum anchor (primary key everywhere)
  topicId?: string; // subject/subspecialty/topic
  topic?: string;
  cbmeBlockId?: string;

  // Metacognition
  confidence?: number; // 0-100
  bloom?: Bloom;

  // MCQ specifics
  mcq?: {
    correct?: boolean;
    difficulty?: string;
    errorType?: "factual" | "conceptual" | "application";
  };

  // Free text
  note?: string;
};

export type BackstageState = {
  version: 1;
  events: BackstageEvent[];
};
