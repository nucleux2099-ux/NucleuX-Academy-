"use client";

import type { Aim, AimQuestion, AimQuestionType } from "./types";
import { scheduleAimSync } from "@/lib/learning/client-sync";

const STORAGE_KEY = "nucleux.aim.v1";

function safeParse(json: string | null): Record<string, Aim> | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as Record<string, Aim>;
  } catch {
    return null;
  }
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function loadAimMap(): Record<string, Aim> {
  if (typeof window === "undefined") return {};
  const parsed = safeParse(window.localStorage.getItem(STORAGE_KEY));
  if (!parsed || typeof parsed !== "object") return {};
  return parsed;
}

export function saveAimMap(map: Record<string, Aim>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getAim(topicId: string): Aim | null {
  const map = loadAimMap();
  return map[topicId] || null;
}

export function initAim(topicId: string, chunkIds: string[]): Aim {
  const now = new Date().toISOString();
  const aim: Aim = {
    topicId,
    createdAt: now,
    updatedAt: now,
    chunkPlans: chunkIds.map((chunkId) => ({
      chunkId,
      whyImportant: "",
      questions: [],
    })),
  };
  const map = loadAimMap();
  map[topicId] = aim;
  saveAimMap(map);
  scheduleAimSync(aim);
  return aim;
}

export function upsertAim(aim: Aim) {
  const map = loadAimMap();
  map[aim.topicId] = { ...aim, updatedAt: new Date().toISOString() };
  saveAimMap(map);
  scheduleAimSync(map[aim.topicId]);
}

export function setWhyImportant(aim: Aim, chunkId: string, whyImportant: string) {
  const next: Aim = {
    ...aim,
    chunkPlans: aim.chunkPlans.map((cp) =>
      cp.chunkId === chunkId ? { ...cp, whyImportant } : cp
    ),
  };
  upsertAim(next);
  return next;
}

export function setQuestionsFromText(
  aim: Aim,
  chunkId: string,
  type: AimQuestionType,
  text: string
) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const qs: AimQuestion[] = lines.map((l) => ({
    id: uid(),
    chunkId,
    type,
    text: l,
  }));

  const next: Aim = {
    ...aim,
    chunkPlans: aim.chunkPlans.map((cp) => {
      if (cp.chunkId !== chunkId) return cp;
      const others = cp.questions.filter((q) => q.type !== type);
      return { ...cp, questions: [...others, ...qs] };
    }),
  };

  upsertAim(next);
  return next;
}

export function validateAim(aim: Aim) {
  const perChunk = aim.chunkPlans.map((cp) => {
    const qCount = cp.questions.length;
    const ok = cp.whyImportant.trim().length > 0 && qCount >= 6;
    return { chunkId: cp.chunkId, qCount, ok, whyOk: cp.whyImportant.trim().length > 0 };
  });
  const ok = perChunk.every((c) => c.ok);
  return { ok, perChunk };
}

export function markAimCompleted(aim: Aim) {
  const now = new Date().toISOString();
  const next: Aim = { ...aim, completedAt: now, updatedAt: now };
  upsertAim(next);
  return next;
}
