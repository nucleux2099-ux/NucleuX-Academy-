"use client";

import type { Template } from "./types";

const LS_KEY = "nucleux.templates.v1";

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

export function loadTemplates(): Template[] {
  if (typeof window === "undefined") return [];
  return safeParse<Template[]>(localStorage.getItem(LS_KEY), []);
}

export function saveTemplates(templates: Template[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(templates));
}

export function upsertTemplate(t: Template) {
  const templates = loadTemplates();
  const idx = templates.findIndex((x) => x.templateId === t.templateId);
  const next = { ...t, updatedAt: nowISO() };
  if (idx >= 0) templates[idx] = next;
  else templates.unshift(next);
  saveTemplates(templates);
}

export function deleteTemplate(templateId: string) {
  const templates = loadTemplates().filter((t) => t.templateId !== templateId);
  saveTemplates(templates);
}

export function createSlideTemplate(input: { title: string; heading: string; bullets: string[]; speakerNotes?: string }): Template {
  const templateId = `tpl_${Math.random().toString(36).slice(2, 10)}`;
  const createdAt = nowISO();
  const t: Template = {
    templateId,
    title: input.title.trim() || "Untitled template",
    kind: "slide",
    payload: {
      heading: input.heading,
      bullets: input.bullets,
      speakerNotes: input.speakerNotes,
    },
    createdAt,
    updatedAt: createdAt,
  };
  upsertTemplate(t);
  return t;
}
