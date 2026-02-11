"use client";

import type { CaseLog, CaseLogState } from "./case-types";
import type { SubjectKey } from "./types";

const STORAGE_KEY = "nucleux.backstage.cases.v1";

function safeParse(json: string | null): CaseLogState | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as CaseLogState;
  } catch {
    return null;
  }
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function loadCaseState(): CaseLogState {
  if (typeof window === "undefined") return { version: 1, cases: [] };
  const parsed = safeParse(window.localStorage.getItem(STORAGE_KEY));
  if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.cases)) {
    return { version: 1, cases: [] };
  }
  return parsed;
}

export function saveCaseState(state: CaseLogState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function addCaseLog(input: {
  title: string;
  subject: SubjectKey;
  cbmeBlockId?: string;
  experience?: string;
  reflection?: string;
  concept?: string;
  experiment?: string;
  links?: {
    library?: string[];
    mcq?: string[];
    notes?: string[];
  };
}) {
  const state = loadCaseState();
  const c: CaseLog = {
    id: uid(),
    createdAt: new Date().toISOString(),
    title: input.title,
    subject: input.subject,
    cbmeBlockId: input.cbmeBlockId,
    experience: input.experience,
    reflection: input.reflection,
    concept: input.concept,
    experiment: input.experiment,
    links: input.links,
  };
  state.cases.unshift(c);
  state.cases = state.cases.slice(0, 200);
  saveCaseState(state);
  return c;
}

export function getRecentCases(limit = 10) {
  const state = loadCaseState();
  return state.cases.slice(0, limit);
}

export function subjectLabel(s: SubjectKey) {
  return s === "obgyn" ? "OBGYN" : s.toUpperCase();
}
