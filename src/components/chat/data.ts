export const theme = {
  background: "#2D3E50",
  cardBg: "#1B2838",
  primary: "#5BB3B3",
  accent: "#5EEAD4",
  text: "#FFFFFF",
  textMuted: "#94A3B8",
  border: "#1E3A5F",
  glow: "rgba(6, 182, 212, 0.3)",
  inputBg: "#162535",
};

export interface Source {
  id: string;
  title: string;
  type: "textbook" | "notes" | "upload";
  enabled: boolean;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  sources?: string[];
}

export interface OutputCard {
  id: string;
  title: string;
  type: "summary" | "flashcards" | "ppt" | "audio";
  preview: string;
  createdAt: Date;
}

export const initialSources: Source[] = [
  { id: "1", title: "Shackelford Ch. 35 - Esophageal Replacement", type: "textbook", enabled: true },
  { id: "2", title: "Harrison's Ch. 12 - Portal Hypertension", type: "textbook", enabled: true },
  { id: "3", title: "My Surgery Notes - Upper GI", type: "notes", enabled: false },
  { id: "4", title: "Robbins Ch. 17 - GI Pathology", type: "textbook", enabled: true },
];

export const mockOutputs: OutputCard[] = [
  { id: "o1", title: "Portal Hypertension Summary", type: "summary", preview: "Key points on portal HTN pathophysiology, classification, and management...", createdAt: new Date(Date.now() - 3600000) },
  { id: "o2", title: "Esophageal Surgery Flashcards", type: "flashcards", preview: "15 flashcards covering Ivor Lewis, McKeown, transhiatal approaches...", createdAt: new Date(Date.now() - 7200000) },
];

export const welcomeMessage: Message = {
  id: "welcome",
  role: "assistant",
  content: `Welcome to your **Desk** ⚛️

I'm ATOM, grounded in the sources you've selected on the left. Toggle sources on/off to control what I can reference.

Ask me anything, or use the action buttons on the right to generate study materials!`,
  timestamp: new Date(),
};
