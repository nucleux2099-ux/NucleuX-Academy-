import type { Deck } from "./types";

export const demoDecks: Deck[] = [
  {
    deckId: "deck_demo_pancreatitis",
    title: "Acute Pancreatitis — 10-slide primer",
    description: "Demo deck (v1) to prove slide UX end-to-end.",
    topicId: "surgery/pancreas/acute-pancreatitis",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slides: [
      {
        slideId: "deck_demo_pancreatitis_s1",
        order: 1,
        heading: "Acute Pancreatitis",
        bullets: ["Definition", "Why it matters", "What we must not miss"],
        layout: "title",
      },
      {
        slideId: "deck_demo_pancreatitis_s2",
        order: 2,
        heading: "Definition",
        bullets: ["Acute inflammation of pancreas", "Diagnose with 2/3 criteria (pain, enzymes, imaging)"] ,
        layout: "bullets",
      },
      {
        slideId: "deck_demo_pancreatitis_s3",
        order: 3,
        heading: "First 6 hours: priorities",
        bullets: ["Assess severity", "Fluids", "Analgesia", "Identify cause (gallstones/alcohol)"] ,
        layout: "bullets",
      },
    ],
  },
];
