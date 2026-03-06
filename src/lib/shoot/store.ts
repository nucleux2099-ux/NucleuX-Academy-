"use client";

import type { Shoot, ShootChunkArtifact, VprefreScore } from "./types";
import { scheduleShootSync } from "@/lib/learning/client-sync";

const STORAGE_KEY = "nucleux.shoot.v1";

function safeParse(json: string | null): Record<string, Shoot> | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as Record<string, Shoot>;
  } catch {
    return null;
  }
}

export function loadShootMap(): Record<string, Shoot> {
  if (typeof window === "undefined") return {};
  const parsed = safeParse(window.localStorage.getItem(STORAGE_KEY));
  if (!parsed || typeof parsed !== "object") return {};
  return parsed;
}

export function saveShootMap(map: Record<string, Shoot>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getShoot(topicId: string): Shoot | null {
  const map = loadShootMap();
  return map[topicId] || null;
}

function defaultVprefre(): VprefreScore {
  return {
    visual: false,
    processed: false,
    relational: false,
    freehand: false,
    reflective: false,
    efficient: false,
  };
}

export function initShoot(topicId: string, chunkIds: string[]): Shoot {
  const now = new Date().toISOString();
  const shoot: Shoot = {
    topicId,
    createdAt: now,
    updatedAt: now,
    artifacts: chunkIds.map((chunkId) => ({
      chunkId,
      layered: { logic: "", concepts: "", importantDetails: "", arbitraryDetails: "" },
      vprefre: defaultVprefre(),
      teachBackPrompts: "",
      gapList: "",
    })),
  };
  const map = loadShootMap();
  map[topicId] = shoot;
  saveShootMap(map);
  scheduleShootSync(shoot);
  return shoot;
}

export function upsertShoot(shoot: Shoot) {
  const map = loadShootMap();
  map[shoot.topicId] = { ...shoot, updatedAt: new Date().toISOString() };
  saveShootMap(map);
  scheduleShootSync(map[shoot.topicId]);
}

export function updateChunk(shoot: Shoot, chunkId: string, patch: Partial<ShootChunkArtifact>): Shoot {
  const next: Shoot = {
    ...shoot,
    artifacts: shoot.artifacts.map((a) => (a.chunkId === chunkId ? { ...a, ...patch } : a)),
  };
  upsertShoot(next);
  return next;
}

export function setLayered(shoot: Shoot, chunkId: string, field: keyof ShootChunkArtifact["layered"], value: string): Shoot {
  const art = shoot.artifacts.find((a) => a.chunkId === chunkId);
  if (!art) return shoot;
  return updateChunk(shoot, chunkId, { layered: { ...art.layered, [field]: value } });
}

export function setVprefre(shoot: Shoot, chunkId: string, key: keyof VprefreScore, value: boolean): Shoot {
  const art = shoot.artifacts.find((a) => a.chunkId === chunkId);
  if (!art) return shoot;
  return updateChunk(shoot, chunkId, { vprefre: { ...art.vprefre, [key]: value } });
}

export function markChunkCompleted(shoot: Shoot, chunkId: string): Shoot {
  const now = new Date().toISOString();
  return updateChunk(shoot, chunkId, { completedAt: now });
}

export function validateShootChunk(a: ShootChunkArtifact) {
  const logicOk = a.layered.logic.trim().split(/\n+/).filter(Boolean).length >= 2;
  const conceptsOk = a.layered.concepts.trim().split(/\n+/).filter(Boolean).length >= 3;
  const detailsOk = a.layered.importantDetails.trim().split(/\n+/).filter(Boolean).length >= 3;
  const vpOk = a.vprefre.processed && a.vprefre.efficient;
  const teachOk = a.teachBackPrompts.trim().length > 0;
  return { ok: logicOk && conceptsOk && detailsOk && vpOk && teachOk, logicOk, conceptsOk, detailsOk, vpOk, teachOk };
}

export function validateShoot(shoot: Shoot) {
  const perChunk = shoot.artifacts.map((a) => ({ chunkId: a.chunkId, ...validateShootChunk(a) }));
  const ok = perChunk.every((c) => c.ok);
  return { ok, perChunk };
}

export function markShootCompleted(shoot: Shoot): Shoot {
  const now = new Date().toISOString();
  const next: Shoot = { ...shoot, completedAt: now, updatedAt: now };
  upsertShoot(next);
  return next;
}
