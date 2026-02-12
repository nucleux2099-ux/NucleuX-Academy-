"use client";

import type { PreStudy, PreStudyImportance } from "./types";

const STORAGE_KEY = "nucleux.prestudy.v1";

function safeParse(json: string | null): Record<string, PreStudy> | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as Record<string, PreStudy>;
  } catch {
    return null;
  }
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function loadPreStudyMap(): Record<string, PreStudy> {
  if (typeof window === "undefined") return {};
  const parsed = safeParse(window.localStorage.getItem(STORAGE_KEY));
  if (!parsed || typeof parsed !== "object") return {};
  return parsed;
}

export function savePreStudyMap(map: Record<string, PreStudy>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getPreStudy(topicId: string): PreStudy | null {
  const map = loadPreStudyMap();
  return map[topicId] || null;
}

export function initPreStudy(topicId: string): PreStudy {
  const now = new Date().toISOString();
  const ps: PreStudy = {
    topicId,
    createdAt: now,
    updatedAt: now,
    skimNotes: "",
    keywords: [],
    chunks: [
      { id: uid(), title: "Chunk 1", order: 1 },
      { id: uid(), title: "Chunk 2", order: 2 },
      { id: uid(), title: "Chunk 3", order: 3 },
    ],
    assignments: [],
    aimQuestions: [],
  };

  const map = loadPreStudyMap();
  map[topicId] = ps;
  savePreStudyMap(map);
  return ps;
}

export function upsertPreStudy(ps: PreStudy) {
  const map = loadPreStudyMap();
  map[ps.topicId] = { ...ps, updatedAt: new Date().toISOString() };
  savePreStudyMap(map);
}

export function addKeyword(ps: PreStudy, text: string, importance: PreStudyImportance = "B") {
  const kw = { id: uid(), text: text.trim(), importance };
  const next: PreStudy = {
    ...ps,
    keywords: [kw, ...ps.keywords],
  };
  upsertPreStudy(next);
  return next;
}

export function setKeywordImportance(ps: PreStudy, keywordId: string, importance: PreStudyImportance) {
  const next: PreStudy = {
    ...ps,
    keywords: ps.keywords.map((k) => (k.id === keywordId ? { ...k, importance } : k)),
  };
  upsertPreStudy(next);
  return next;
}

export function setKeywordChunk(ps: PreStudy, keywordId: string, chunkId: string) {
  const others = ps.assignments.filter((a) => a.keywordId !== keywordId);
  const next: PreStudy = {
    ...ps,
    assignments: [{ keywordId, chunkId }, ...others],
  };
  upsertPreStudy(next);
  return next;
}

export function setChunkTitle(ps: PreStudy, chunkId: string, title: string) {
  const next: PreStudy = {
    ...ps,
    chunks: ps.chunks.map((c) => (c.id === chunkId ? { ...c, title } : c)),
  };
  upsertPreStudy(next);
  return next;
}

export function addChunk(ps: PreStudy) {
  if (ps.chunks.length >= 4) return ps;
  const order = ps.chunks.length + 1;
  const next: PreStudy = {
    ...ps,
    chunks: [...ps.chunks, { id: uid(), title: `Chunk ${order}`, order }],
  };
  upsertPreStudy(next);
  return next;
}

export function setAimQuestionsText(ps: PreStudy, chunkId: string, text: string) {
  const existing = ps.aimQuestions.filter((q) => q.chunkId !== chunkId);
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const nextQs = lines.map((l) => ({ id: uid(), chunkId, text: l }));
  const next: PreStudy = {
    ...ps,
    aimQuestions: [...existing, ...nextQs],
  };
  upsertPreStudy(next);
  return next;
}

export function validatePreStudy(ps: PreStudy) {
  const keywordCount = ps.keywords.length;
  const aCount = ps.keywords.filter((k) => k.importance === "A").length;
  const chunkCount = ps.chunks.length;

  const assignedByChunk: Record<string, number> = {};
  for (const a of ps.assignments) {
    assignedByChunk[a.chunkId] = (assignedByChunk[a.chunkId] || 0) + 1;
  }

  const chunkMinOk = ps.chunks.every((c) => (assignedByChunk[c.id] || 0) >= 3);
  const aimByChunk: Record<string, number> = {};
  for (const q of ps.aimQuestions) {
    aimByChunk[q.chunkId] = (aimByChunk[q.chunkId] || 0) + 1;
  }
  const aimMinOk = ps.chunks.every((c) => (aimByChunk[c.id] || 0) >= 1);

  const ok = keywordCount >= 10 && aCount >= 3 && (chunkCount === 3 || chunkCount === 4) && chunkMinOk && aimMinOk;

  return {
    ok,
    keywordCount,
    aCount,
    chunkCount,
    chunkMinOk,
    aimMinOk,
  };
}

export function markPreStudyCompleted(ps: PreStudy) {
  const now = new Date().toISOString();
  const next: PreStudy = { ...ps, completedAt: now, updatedAt: now };
  upsertPreStudy(next);
  return next;
}
