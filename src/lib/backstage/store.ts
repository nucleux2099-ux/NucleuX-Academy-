"use client";

import type { BackstageEvent, BackstageState, SubjectKey } from "./types";

const STORAGE_KEY = "nucleux.backstage.v1";

function safeParse(json: string | null): BackstageState | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as BackstageState;
  } catch {
    return null;
  }
}

export function loadBackstageState(): BackstageState {
  if (typeof window === "undefined") return { version: 1, events: [] };
  const parsed = safeParse(window.localStorage.getItem(STORAGE_KEY));
  if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.events)) {
    return { version: 1, events: [] };
  }
  return parsed;
}

export function saveBackstageState(state: BackstageState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function normalizeSubject(input?: string): SubjectKey {
  const s = (input || "").toLowerCase();
  if (s.includes("anat")) return "anatomy";
  if (s.includes("phys")) return "physiology";
  if (s.includes("biochem")) return "biochemistry";
  if (s.includes("path")) return "pathology";
  if (s.includes("pharm")) return "pharmacology";
  if (s.includes("micro")) return "microbiology";
  if (s.includes("fmt") || s.includes("forensic")) return "forensic";
  if (s.includes("psm") || s.includes("community")) return "psm";
  if (s.includes("ent")) return "ent";
  if (s.includes("oph")) return "ophthalmology";
  if (s.includes("med")) return "medicine";
  if (s.includes("surg")) return "surgery";
  if (s.includes("obg") || s.includes("gyn")) return "obgyn";
  if (s.includes("peds") || s.includes("paed")) return "pediatrics";
  if (s.includes("ortho")) return "orthopedics";
  return "unknown";
}

export function addBackstageEvent(partial: Omit<BackstageEvent, "id" | "createdAt">) {
  const state = loadBackstageState();
  const ev: BackstageEvent = {
    id: uid(),
    createdAt: new Date().toISOString(),
    ...partial,
  };
  state.events.unshift(ev);
  // keep last 500 events for now
  state.events = state.events.slice(0, 500);
  saveBackstageState(state);
  return ev;
}

export function getRecentBackstageEvents(limit = 20) {
  const state = loadBackstageState();
  return state.events.slice(0, limit);
}
