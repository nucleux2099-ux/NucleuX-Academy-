"use client";

import type { MindMap, MindMapEdge, MindMapNode, MapEdgeRelation } from "./types";
import type { PreStudy } from "@/lib/prestudy/types";

const STORAGE_KEY = "nucleux.mindmap.v1";

function safeParse(json: string | null): Record<string, MindMap> | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as Record<string, MindMap>;
  } catch {
    return null;
  }
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function loadMindMapMap(): Record<string, MindMap> {
  if (typeof window === "undefined") return {};
  const parsed = safeParse(window.localStorage.getItem(STORAGE_KEY));
  if (!parsed || typeof parsed !== "object") return {};
  return parsed;
}

export function saveMindMapMap(map: Record<string, MindMap>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getMindMap(topicId: string): MindMap | null {
  const map = loadMindMapMap();
  return map[topicId] || null;
}

export function upsertMindMap(mm: MindMap) {
  const map = loadMindMapMap();
  map[mm.topicId] = { ...mm, updatedAt: new Date().toISOString() };
  saveMindMapMap(map);
}

export function generateMindMapDraft(topicId: string, preStudy: PreStudy | null): MindMap {
  const now = new Date().toISOString();

  const nodes: MindMapNode[] = [];
  if (preStudy) {
    for (const k of preStudy.keywords) {
      const assigned = preStudy.assignments.find((a) => a.keywordId === k.id);
      nodes.push({
        id: uid(),
        chunkId: assigned?.chunkId,
        label: k.text,
        importance: k.importance,
        emphasis: k.importance === "A" ? 3 : k.importance === "B" ? 2 : 1,
      });
    }
  }

  const mm: MindMap = {
    topicId,
    createdAt: now,
    updatedAt: now,
    version: 1,
    status: "draft",
    nodes,
    edges: [],
    generatedFrom: {
      prestudy: !!preStudy,
      aim: false,
      shoot: false,
      skin: false,
    },
    requiredEdits: 3,
    userEditsCount: 0,
  };

  upsertMindMap(mm);
  return mm;
}

export function renameNode(mm: MindMap, nodeId: string, label: string): MindMap {
  const next: MindMap = {
    ...mm,
    nodes: mm.nodes.map((n) => (n.id === nodeId ? { ...n, label } : n)),
    userEditsCount: mm.userEditsCount + 1,
  };
  upsertMindMap(next);
  return next;
}

export function addEdge(mm: MindMap, from: string, to: string, relation: MapEdgeRelation, label?: string): MindMap {
  const e: MindMapEdge = { id: uid(), from, to, relation, label };
  const next: MindMap = {
    ...mm,
    edges: [e, ...mm.edges],
    userEditsCount: mm.userEditsCount + 1,
  };
  upsertMindMap(next);
  return next;
}

export function finalizeMindMap(mm: MindMap): MindMap {
  const next: MindMap = {
    ...mm,
    status: "final",
    updatedAt: new Date().toISOString(),
  };
  upsertMindMap(next);
  return next;
}

export function canFinalize(mm: MindMap) {
  return mm.status === "draft" && mm.userEditsCount >= mm.requiredEdits;
}
