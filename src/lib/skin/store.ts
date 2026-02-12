"use client";

import type { Skin, SkinChunk, GrindeScore } from "./types";

const STORAGE_KEY = "nucleux.skin.v1";

function safeParse(json: string | null): Record<string, Skin> | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as Record<string, Skin>;
  } catch {
    return null;
  }
}

export function loadSkinMap(): Record<string, Skin> {
  if (typeof window === "undefined") return {};
  const parsed = safeParse(window.localStorage.getItem(STORAGE_KEY));
  if (!parsed || typeof parsed !== "object") return {};
  return parsed;
}

export function saveSkinMap(map: Record<string, Skin>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getSkin(topicId: string): Skin | null {
  const map = loadSkinMap();
  return map[topicId] || null;
}

function defaultGrinde(): GrindeScore {
  return {
    grouped: false,
    reflective: false,
    interconnected: false,
    nonVerbal: false,
    directional: false,
    emphasised: false,
  };
}

export function initSkin(topicId: string, chunkIds: string[]): Skin {
  const now = new Date().toISOString();
  const skin: Skin = {
    topicId,
    createdAt: now,
    updatedAt: now,
    chunks: chunkIds.map((chunkId) => ({
      chunkId,
      appliedTwoFourRule: false,
      grinde: defaultGrinde(),
      teachBackGaps: "",
    })),
  };
  const map = loadSkinMap();
  map[topicId] = skin;
  saveSkinMap(map);
  return skin;
}

export function upsertSkin(skin: Skin) {
  const map = loadSkinMap();
  map[skin.topicId] = { ...skin, updatedAt: new Date().toISOString() };
  saveSkinMap(map);
}

export function updateSkinChunk(skin: Skin, chunkId: string, patch: Partial<SkinChunk>): Skin {
  const next: Skin = {
    ...skin,
    chunks: skin.chunks.map((c) => (c.chunkId === chunkId ? { ...c, ...patch } : c)),
  };
  upsertSkin(next);
  return next;
}

export function setTwoFourRule(skin: Skin, chunkId: string, value: boolean): Skin {
  return updateSkinChunk(skin, chunkId, { appliedTwoFourRule: value });
}

export function setGrinde(skin: Skin, chunkId: string, key: keyof GrindeScore, value: boolean): Skin {
  const c = skin.chunks.find((x) => x.chunkId === chunkId);
  if (!c) return skin;
  return updateSkinChunk(skin, chunkId, { grinde: { ...c.grinde, [key]: value } });
}

export function setTeachBackGaps(skin: Skin, chunkId: string, text: string): Skin {
  return updateSkinChunk(skin, chunkId, { teachBackGaps: text });
}

export function validateSkinChunk(c: SkinChunk) {
  const ok = c.appliedTwoFourRule && c.grinde.grouped && c.grinde.directional;
  return { ok };
}

export function validateSkin(skin: Skin) {
  const perChunk = skin.chunks.map((c) => ({ chunkId: c.chunkId, ...validateSkinChunk(c) }));
  const ok = perChunk.every((c) => c.ok);
  return { ok, perChunk };
}

export function markSkinCompleted(skin: Skin): Skin {
  const now = new Date().toISOString();
  const next: Skin = { ...skin, completedAt: now, updatedAt: now };
  upsertSkin(next);
  return next;
}
