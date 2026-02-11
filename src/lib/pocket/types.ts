export type PocketReference = {
  url: string;
  label?: string;
  kind?: "guideline" | "paper" | "video" | "other";
};

export type PocketNote = {
  id: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO

  // Canonical anchor
  topicId: string; // subject/subspecialty/topic

  // Display
  title: string;
  body: string;

  tags?: string[];
  references?: PocketReference[];
};

export type PocketState = {
  version: 1;
  notes: PocketNote[];
};
