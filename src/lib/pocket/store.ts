"use client";

import type { PocketNote, PocketState } from "./types";

const STORAGE_KEY = "nucleux.pocket.v1";

function safeParse(json: string | null): PocketState | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as PocketState;
  } catch {
    return null;
  }
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function loadPocketState(): PocketState {
  if (typeof window === "undefined") return { version: 1, notes: [] };
  const parsed = safeParse(window.localStorage.getItem(STORAGE_KEY));
  if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.notes)) {
    return { version: 1, notes: [] };
  }
  return parsed;
}

export function savePocketState(state: PocketState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function addPocketNote(input: {
  topicId: string;
  title: string;
  body: string;
  tags?: string[];
  references?: PocketNote["references"];
}) {
  const state = loadPocketState();
  const now = new Date().toISOString();

  const note: PocketNote = {
    id: uid(),
    createdAt: now,
    updatedAt: now,
    topicId: input.topicId,
    title: input.title,
    body: input.body,
    tags: input.tags,
    references: input.references,
  };

  state.notes.unshift(note);
  // keep last 500 notes for now
  state.notes = state.notes.slice(0, 500);
  savePocketState(state);
  return note;
}

export function getNotesForTopic(topicId: string, limit = 50) {
  const state = loadPocketState();
  return state.notes.filter((n) => n.topicId === topicId).slice(0, limit);
}
