"use client";

import type { Deck, Slide } from "./types";

const LS_KEY = "nucleux.decks.v1";

function nowISO() {
  return new Date().toISOString();
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadDecks(): Deck[] {
  if (typeof window === "undefined") return [];
  return safeParse<Deck[]>(localStorage.getItem(LS_KEY), []);
}

export function saveDecks(decks: Deck[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(decks));
}

export function getDeck(deckId: string): Deck | undefined {
  return loadDecks().find((d) => d.deckId === deckId);
}

export function findDecksByTopicId(topicId?: string): Deck[] {
  if (!topicId) return [];
  return loadDecks().filter((d) => d.topicId === topicId);
}

export function upsertDeck(deck: Deck) {
  const decks = loadDecks();
  const idx = decks.findIndex((d) => d.deckId === deck.deckId);
  if (idx >= 0) decks[idx] = { ...deck, updatedAt: nowISO() };
  else decks.unshift(deck);
  saveDecks(decks);
}

export function createDeck(input: { title: string; description?: string; topicId?: string }): Deck {
  const deckId = `deck_${Math.random().toString(36).slice(2, 10)}`;
  const createdAt = nowISO();
  const deck: Deck = {
    deckId,
    title: input.title.trim() || "Untitled deck",
    description: input.description,
    topicId: input.topicId,
    createdAt,
    updatedAt: createdAt,
    slides: [
      {
        slideId: `${deckId}_s1`,
        order: 1,
        heading: input.title.trim() || "Title",
        bullets: ["Key point 1", "Key point 2", "Key point 3"],
        layout: "bullets",
      },
    ],
  };
  upsertDeck(deck);
  return deck;
}

export function updateSlide(deck: Deck, slide: Slide): Deck {
  const slides = [...deck.slides];
  const idx = slides.findIndex((s) => s.slideId === slide.slideId);
  if (idx >= 0) slides[idx] = slide;
  const updated: Deck = { ...deck, slides, updatedAt: nowISO() };
  upsertDeck(updated);
  return updated;
}

export function addSlide(deck: Deck): Deck {
  const nextOrder = (deck.slides.at(-1)?.order ?? 0) + 1;
  const slide: Slide = {
    slideId: `${deck.deckId}_s${nextOrder}`,
    order: nextOrder,
    heading: `Slide ${nextOrder}`,
    bullets: [""],
    layout: "bullets",
  };
  const updated: Deck = { ...deck, slides: [...deck.slides, slide], updatedAt: nowISO() };
  upsertDeck(updated);
  return updated;
}

export function reorderSlides(deck: Deck, slideIdsInOrder: string[]): Deck {
  const byId = new Map(deck.slides.map((s) => [s.slideId, s] as const));
  const slides = slideIdsInOrder
    .map((id, i) => {
      const s = byId.get(id);
      return s ? { ...s, order: i + 1 } : null;
    })
    .filter(Boolean) as Slide[];
  const updated: Deck = { ...deck, slides, updatedAt: nowISO() };
  upsertDeck(updated);
  return updated;
}
