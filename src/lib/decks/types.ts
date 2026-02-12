export type DeckLayout = "title" | "bullets" | "image-left" | "image-right" | "two-column";

export type Slide = {
  slideId: string;
  order: number;
  heading: string;
  bullets: string[];
  imageUrl?: string;
  speakerNotes?: string;
  layout?: DeckLayout;
};

export type Deck = {
  deckId: string;
  title: string;
  description?: string;
  topicId?: string; // canonical: subject/subspecialty/topicSlug
  createdAt: string;
  updatedAt: string;
  slides: Slide[];
};

export type DeckTemplate = {
  templateId: string;
  title: string;
  kind: "slide" | "note";
  payload: unknown;
  createdAt: string;
};
