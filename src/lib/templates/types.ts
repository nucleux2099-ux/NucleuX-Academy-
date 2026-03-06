export type SlideTemplatePayload = {
  heading: string;
  bullets: string[];
  speakerNotes?: string;
};

export type TemplateKind = "slide" | "note";

export type Template = {
  templateId: string;
  title: string;
  kind: TemplateKind;
  payload: SlideTemplatePayload | Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};
