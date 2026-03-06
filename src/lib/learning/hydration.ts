"use client";

import type { Aim, AimQuestionType } from "@/lib/aim/types";
import { loadAimMap, saveAimMap } from "@/lib/aim/store";
import type { MindMap } from "@/lib/mindmap/types";
import { loadMindMapMap, saveMindMapMap } from "@/lib/mindmap/store";
import type { PreStudy, PreStudyAimQuestion, PreStudyChunk, PreStudyChunkAssignment, PreStudyKeyword } from "@/lib/prestudy/types";
import { loadPreStudyMap, savePreStudyMap } from "@/lib/prestudy/store";
import type { Shoot, ShootChunkArtifact } from "@/lib/shoot/types";
import { loadShootMap, saveShootMap } from "@/lib/shoot/store";
import type { Skin, SkinChunk } from "@/lib/skin/types";
import { loadSkinMap, saveSkinMap } from "@/lib/skin/store";

type JsonRecord = Record<string, unknown>;

type TopicRow = {
  id: string;
  subject: string;
  subspecialty: string;
  topic_slug: string;
};

type TopicListResponse = {
  topics?: TopicRow[];
};

type ChunkRow = {
  id: string;
  chunk_order: number;
  title: string;
  why_important: string | null;
};

type ChunksResponse = {
  chunks?: ChunkRow[];
};

type ArtifactRow = {
  id: string;
  chunk_id: string | null;
  artifact_type: string;
  content: JsonRecord;
  created_at: string;
};

type ArtifactsResponse = {
  artifacts?: ArtifactRow[];
};

const hydrationInFlight = new Map<string, Promise<void>>();
const hydratedTopics = new Set<string>();

const AIM_QUESTION_TYPES: AimQuestionType[] = [
  "why_important",
  "how_related",
  "management_change",
  "common_confusion",
  "viva_mcq",
];

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseTopicId(topicId: string) {
  const raw = topicId.trim().replace(/^\/+|\/+$/g, "");
  const parts = raw.split("/").filter(Boolean);
  return {
    subject: normalizeSlug(parts[0] || "general"),
    subspecialty: normalizeSlug(parts[1] || "general"),
    topicSlug: normalizeSlug(parts[2] || raw || "topic"),
  };
}

function asObject(value: unknown): JsonRecord | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as JsonRecord;
  }
  return null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asBool(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function safeDateMs(value: string | undefined) {
  if (!value) return 0;
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? 0 : ms;
}

function shouldApplyRemote(localUpdatedAt: string | undefined, remoteUpdatedAt: string) {
  if (!localUpdatedAt) return true;
  return safeDateMs(remoteUpdatedAt) > safeDateMs(localUpdatedAt);
}

async function fetchJson<T>(url: string): Promise<T | null> {
  if (typeof window === "undefined" || typeof fetch === "undefined") return null;
  try {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function pickLatestByType(artifacts: ArtifactRow[], type: string): ArtifactRow | null {
  const filtered = artifacts.filter((artifact) => artifact.artifact_type === type);
  if (!filtered.length) return null;
  filtered.sort((a, b) => safeDateMs(b.created_at) - safeDateMs(a.created_at));
  return filtered[0] || null;
}

function remoteChunkLookup(chunks: ChunkRow[]) {
  const byRemoteId = new Map<string, { localId: string; order: number; title: string }>();
  chunks.forEach((chunk, index) => {
    const localId = `remote-${chunk.id}`;
    byRemoteId.set(chunk.id, {
      localId,
      order: chunk.chunk_order || index + 1,
      title: chunk.title || `Chunk ${index + 1}`,
    });
  });
  return byRemoteId;
}

function hydratePreStudy(
  topicId: string,
  chunks: ChunkRow[],
  artifacts: ArtifactRow[]
): { chunkIdMap: Map<string, string>; updatedAt: string | null } {
  const keywordArtifact = pickLatestByType(artifacts, "prestudy_keyword");
  const assignmentArtifact = pickLatestByType(artifacts, "prestudy_assignment");
  if (!keywordArtifact && !assignmentArtifact) {
    return { chunkIdMap: new Map(), updatedAt: null };
  }

  const keywordContent = asObject(keywordArtifact?.content) || {};
  const assignmentContent = asObject(assignmentArtifact?.content) || {};

  const rawChunks = asArray<JsonRecord>(assignmentContent.chunks);
  const chunkRows = rawChunks.length
    ? rawChunks.map((chunk, index) => {
        const order = asNumber(chunk.order) || index + 1;
        const title = asString(chunk.title) || `Chunk ${order}`;
        const localId = asString(chunk.id) || `chunk-${order}`;
        const remoteChunkId = asString(chunk.remoteChunkId) || null;
        return { localId, order, title, remoteChunkId };
      })
    : chunks.map((chunk, index) => ({
        localId: `remote-${chunk.id}`,
        order: chunk.chunk_order || index + 1,
        title: chunk.title || `Chunk ${index + 1}`,
        remoteChunkId: chunk.id,
      }));

  const chunkIdMap = new Map<string, string>();
  chunkRows.forEach((chunk) => {
    if (chunk.remoteChunkId) chunkIdMap.set(chunk.remoteChunkId, chunk.localId);
  });

  const keywords = asArray<JsonRecord>(keywordContent.keywords)
    .map((keyword) => {
      const id = asString(keyword.id);
      const text = asString(keyword.text);
      const importance = asString(keyword.importance);
      if (!id || !text || !importance) return null;
      if (importance !== "A" && importance !== "B" && importance !== "C") return null;
      return { id, text, importance } as PreStudyKeyword;
    })
    .filter((keyword): keyword is PreStudyKeyword => Boolean(keyword));

  const assignments = asArray<JsonRecord>(assignmentContent.assignments)
    .map((assignment) => {
      const keywordId = asString(assignment.keywordId);
      const localChunkId = asString(assignment.chunkId);
      const remoteChunkId = asString(assignment.remoteChunkId);
      const resolvedChunkId =
        localChunkId || (remoteChunkId ? chunkIdMap.get(remoteChunkId) || null : null);
      if (!keywordId || !resolvedChunkId) return null;
      return { keywordId, chunkId: resolvedChunkId } as PreStudyChunkAssignment;
    })
    .filter((assignment): assignment is PreStudyChunkAssignment => Boolean(assignment));

  const aimQuestions = asArray<JsonRecord>(assignmentContent.aimQuestions)
    .map((question) => {
      const id = asString(question.id);
      const chunkId = asString(question.chunkId);
      const text = asString(question.text);
      if (!id || !chunkId || !text) return null;
      return { id, chunkId, text } as PreStudyAimQuestion;
    })
    .filter((question): question is PreStudyAimQuestion => Boolean(question));

  const preStudy: PreStudy = {
    topicId,
    createdAt: asString(keywordContent.createdAt) || new Date().toISOString(),
    updatedAt:
      asString(keywordContent.updatedAt) ||
      asString(assignmentContent.updatedAt) ||
      keywordArtifact?.created_at ||
      assignmentArtifact?.created_at ||
      new Date().toISOString(),
    completedAt: asString(keywordContent.completedAt) || undefined,
    skimNotes: asString(keywordContent.skimNotes) || "",
    keywords,
    chunks: chunkRows
      .sort((a, b) => a.order - b.order)
      .map((chunk) => ({ id: chunk.localId, title: chunk.title, order: chunk.order })) as PreStudyChunk[],
    assignments,
    aimQuestions,
  };

  const map = loadPreStudyMap();
  if (shouldApplyRemote(map[topicId]?.updatedAt, preStudy.updatedAt)) {
    map[topicId] = preStudy;
    savePreStudyMap(map);
  }

  return { chunkIdMap, updatedAt: preStudy.updatedAt };
}

function hydrateAim(
  topicId: string,
  chunkIdMap: Map<string, string>,
  artifacts: ArtifactRow[]
) {
  const rationaleArtifacts = artifacts.filter((artifact) => artifact.artifact_type === "aim_rationale");
  const questionArtifacts = artifacts.filter((artifact) => artifact.artifact_type === "aim_question");
  if (!rationaleArtifacts.length && !questionArtifacts.length) return;

  type AimChunkState = {
    chunkId: string;
    whyImportant: string;
    questions: Aim["chunkPlans"][number]["questions"];
  };

  const chunkState = new Map<string, AimChunkState>();

  const ensureChunk = (localChunkId: string) => {
    const existing = chunkState.get(localChunkId);
    if (existing) return existing;
    const next: AimChunkState = {
      chunkId: localChunkId,
      whyImportant: "",
      questions: [],
    };
    chunkState.set(localChunkId, next);
    return next;
  };

  rationaleArtifacts.forEach((artifact) => {
    const content = asObject(artifact.content) || {};
    const localChunkId =
      asString(content.chunkId) ||
      (artifact.chunk_id ? chunkIdMap.get(artifact.chunk_id) || null : null);
    if (!localChunkId) return;
    const state = ensureChunk(localChunkId);
    state.whyImportant = asString(content.whyImportant) || state.whyImportant;
  });

  questionArtifacts.forEach((artifact) => {
    const content = asObject(artifact.content) || {};
    const localChunkId =
      asString(content.chunkId) ||
      (artifact.chunk_id ? chunkIdMap.get(artifact.chunk_id) || null : null);
    if (!localChunkId) return;

    const questions = asArray<JsonRecord>(content.questions)
      .map((question) => {
        const id = asString(question.id);
        const chunkId = asString(question.chunkId) || localChunkId;
        const type = asString(question.type);
        const text = asString(question.text);
        if (!id || !type || !text) return null;
        if (!AIM_QUESTION_TYPES.includes(type as AimQuestionType)) return null;
        return { id, chunkId, type: type as AimQuestionType, text };
      })
      .filter((question): question is NonNullable<typeof question> => Boolean(question));

    if (!questions.length) return;

    const state = ensureChunk(localChunkId);
    state.questions = questions;
  });

  if (!chunkState.size) return;

  const allArtifacts = [...rationaleArtifacts, ...questionArtifacts];
  const updatedAt =
    asString(asObject(allArtifacts[0]?.content)?.updatedAt) ||
    allArtifacts[0]?.created_at ||
    new Date().toISOString();

  const aim: Aim = {
    topicId,
    createdAt: new Date().toISOString(),
    updatedAt,
    completedAt: undefined,
    chunkPlans: Array.from(chunkState.values()),
  };

  const map = loadAimMap();
  if (shouldApplyRemote(map[topicId]?.updatedAt, aim.updatedAt)) {
    map[topicId] = aim;
    saveAimMap(map);
  }
}

function hydrateShoot(
  topicId: string,
  chunkIdMap: Map<string, string>,
  artifacts: ArtifactRow[]
) {
  const layerArtifacts = artifacts.filter((artifact) => artifact.artifact_type === "shoot_layer");
  const vprefreArtifacts = artifacts.filter((artifact) => artifact.artifact_type === "shoot_vprefre");
  const gapArtifacts = artifacts.filter((artifact) => artifact.artifact_type === "shoot_gap");
  if (!layerArtifacts.length && !vprefreArtifacts.length && !gapArtifacts.length) return;

  type ShootChunkState = ShootChunkArtifact;
  const byChunk = new Map<string, ShootChunkState>();

  const ensureChunk = (localChunkId: string): ShootChunkState => {
    const existing = byChunk.get(localChunkId);
    if (existing) return existing;
    const next: ShootChunkState = {
      chunkId: localChunkId,
      layered: { logic: "", concepts: "", importantDetails: "", arbitraryDetails: "" },
      vprefre: {
        visual: false,
        processed: false,
        relational: false,
        freehand: false,
        reflective: false,
        efficient: false,
      },
      teachBackPrompts: "",
      gapList: "",
      completedAt: undefined,
    };
    byChunk.set(localChunkId, next);
    return next;
  };

  const resolveChunkId = (artifact: ArtifactRow, content: JsonRecord) =>
    asString(content.chunkId) ||
    (artifact.chunk_id ? chunkIdMap.get(artifact.chunk_id) || null : null);

  layerArtifacts.forEach((artifact) => {
    const content = asObject(artifact.content) || {};
    const localChunkId = resolveChunkId(artifact, content);
    if (!localChunkId) return;
    const state = ensureChunk(localChunkId);
    const layered = asObject(content.layered) || {};
    state.layered = {
      logic: asString(layered.logic) || "",
      concepts: asString(layered.concepts) || "",
      importantDetails: asString(layered.importantDetails) || "",
      arbitraryDetails: asString(layered.arbitraryDetails) || "",
    };
    state.teachBackPrompts = asString(content.teachBackPrompts) || "";
  });

  vprefreArtifacts.forEach((artifact) => {
    const content = asObject(artifact.content) || {};
    const localChunkId = resolveChunkId(artifact, content);
    if (!localChunkId) return;
    const state = ensureChunk(localChunkId);
    const vprefre = asObject(content.vprefre) || {};
    state.vprefre = {
      visual: asBool(vprefre.visual) || false,
      processed: asBool(vprefre.processed) || false,
      relational: asBool(vprefre.relational) || false,
      freehand: asBool(vprefre.freehand) || false,
      reflective: asBool(vprefre.reflective) || false,
      efficient: asBool(vprefre.efficient) || false,
    };
  });

  gapArtifacts.forEach((artifact) => {
    const content = asObject(artifact.content) || {};
    const localChunkId = resolveChunkId(artifact, content);
    if (!localChunkId) return;
    const state = ensureChunk(localChunkId);
    state.gapList = asString(content.gapList) || "";
    state.completedAt = asString(content.completedAt) || undefined;
  });

  const allArtifacts = [...layerArtifacts, ...vprefreArtifacts, ...gapArtifacts];
  allArtifacts.sort((a, b) => safeDateMs(b.created_at) - safeDateMs(a.created_at));
  const updatedAt =
    asString(asObject(allArtifacts[0]?.content)?.updatedAt) ||
    allArtifacts[0]?.created_at ||
    new Date().toISOString();

  const shoot: Shoot = {
    topicId,
    createdAt: new Date().toISOString(),
    updatedAt,
    completedAt: undefined,
    artifacts: Array.from(byChunk.values()),
  };

  const map = loadShootMap();
  if (shouldApplyRemote(map[topicId]?.updatedAt, shoot.updatedAt)) {
    map[topicId] = shoot;
    saveShootMap(map);
  }
}

function hydrateSkin(
  topicId: string,
  chunkIdMap: Map<string, string>,
  artifacts: ArtifactRow[]
) {
  const grindeArtifacts = artifacts.filter((artifact) => artifact.artifact_type === "skin_grinde");
  const gapArtifacts = artifacts.filter((artifact) => artifact.artifact_type === "skin_gap");
  if (!grindeArtifacts.length && !gapArtifacts.length) return;

  const byChunk = new Map<string, SkinChunk>();

  const ensureChunk = (localChunkId: string): SkinChunk => {
    const existing = byChunk.get(localChunkId);
    if (existing) return existing;
    const next: SkinChunk = {
      chunkId: localChunkId,
      appliedTwoFourRule: false,
      grinde: {
        grouped: false,
        reflective: false,
        interconnected: false,
        nonVerbal: false,
        directional: false,
        emphasised: false,
      },
      teachBackGaps: "",
      completedAt: undefined,
    };
    byChunk.set(localChunkId, next);
    return next;
  };

  const resolveChunkId = (artifact: ArtifactRow, content: JsonRecord) =>
    asString(content.chunkId) ||
    (artifact.chunk_id ? chunkIdMap.get(artifact.chunk_id) || null : null);

  grindeArtifacts.forEach((artifact) => {
    const content = asObject(artifact.content) || {};
    const localChunkId = resolveChunkId(artifact, content);
    if (!localChunkId) return;
    const state = ensureChunk(localChunkId);
    state.appliedTwoFourRule = asBool(content.appliedTwoFourRule) || false;
    const grinde = asObject(content.grinde) || {};
    state.grinde = {
      grouped: asBool(grinde.grouped) || false,
      reflective: asBool(grinde.reflective) || false,
      interconnected: asBool(grinde.interconnected) || false,
      nonVerbal: asBool(grinde.nonVerbal) || false,
      directional: asBool(grinde.directional) || false,
      emphasised: asBool(grinde.emphasised) || false,
    };
    state.completedAt = asString(content.completedAt) || undefined;
  });

  gapArtifacts.forEach((artifact) => {
    const content = asObject(artifact.content) || {};
    const localChunkId = resolveChunkId(artifact, content);
    if (!localChunkId) return;
    const state = ensureChunk(localChunkId);
    state.teachBackGaps = asString(content.teachBackGaps) || "";
    state.completedAt = asString(content.completedAt) || state.completedAt;
  });

  const allArtifacts = [...grindeArtifacts, ...gapArtifacts];
  allArtifacts.sort((a, b) => safeDateMs(b.created_at) - safeDateMs(a.created_at));
  const updatedAt =
    asString(asObject(allArtifacts[0]?.content)?.updatedAt) ||
    allArtifacts[0]?.created_at ||
    new Date().toISOString();

  const skin: Skin = {
    topicId,
    createdAt: new Date().toISOString(),
    updatedAt,
    completedAt: undefined,
    chunks: Array.from(byChunk.values()),
  };

  const map = loadSkinMap();
  if (shouldApplyRemote(map[topicId]?.updatedAt, skin.updatedAt)) {
    map[topicId] = skin;
    saveSkinMap(map);
  }
}

function hydrateMindMap(topicId: string, artifacts: ArtifactRow[]) {
  const nodeArtifact = pickLatestByType(artifacts, "mindmap_node");
  const edgeArtifact = pickLatestByType(artifacts, "mindmap_edge");
  if (!nodeArtifact && !edgeArtifact) return;

  const nodeContent = asObject(nodeArtifact?.content) || {};
  const edgeContent = asObject(edgeArtifact?.content) || {};

  const mindMap: MindMap = {
    topicId,
    createdAt: asString(nodeContent.createdAt) || new Date().toISOString(),
    updatedAt:
      asString(nodeContent.updatedAt) ||
      asString(edgeContent.updatedAt) ||
      nodeArtifact?.created_at ||
      edgeArtifact?.created_at ||
      new Date().toISOString(),
    version: (asNumber(nodeContent.version) as 1 | null) || 1,
    status: asString(nodeContent.status) === "final" ? "final" : "draft",
    nodes: asArray(nodeContent.nodes) as MindMap["nodes"],
    edges: asArray(edgeContent.edges) as MindMap["edges"],
    generatedFrom: {
      prestudy: asBool(asObject(nodeContent.generatedFrom)?.prestudy) || false,
      aim: asBool(asObject(nodeContent.generatedFrom)?.aim) || false,
      shoot: asBool(asObject(nodeContent.generatedFrom)?.shoot) || false,
      skin: asBool(asObject(nodeContent.generatedFrom)?.skin) || false,
    },
    requiredEdits: asNumber(nodeContent.requiredEdits) || 3,
    userEditsCount: asNumber(nodeContent.userEditsCount) || 0,
  };

  const map = loadMindMapMap();
  if (shouldApplyRemote(map[topicId]?.updatedAt, mindMap.updatedAt)) {
    map[topicId] = mindMap;
    saveMindMapMap(map);
  }
}

async function hydrateTopicInternal(topicId: string) {
  const { subject, subspecialty, topicSlug } = parseTopicId(topicId);
  const topicSearch = new URLSearchParams({
    subject,
    topic_slug: topicSlug,
    limit: "20",
  });
  const topics = await fetchJson<TopicListResponse>(`/api/learning/topics?${topicSearch.toString()}`);
  const topic = (topics?.topics || []).find(
    (item) =>
      normalizeSlug(item.subject || "") === subject &&
      normalizeSlug(item.subspecialty || "") === subspecialty &&
      normalizeSlug(item.topic_slug || "") === topicSlug
  );

  if (!topic?.id) {
    hydratedTopics.add(topicId);
    return;
  }

  const [chunkResponse, artifactResponse] = await Promise.all([
    fetchJson<ChunksResponse>(`/api/learning/topics/${topic.id}/chunks?limit=200`),
    fetchJson<ArtifactsResponse>(
      `/api/learning/artifacts?learning_topic_id=${topic.id}&limit=500`
    ),
  ]);

  const chunks = chunkResponse?.chunks || [];
  const artifacts = artifactResponse?.artifacts || [];

  const baseChunkMap = remoteChunkLookup(chunks);
  const { chunkIdMap } = hydratePreStudy(topicId, chunks, artifacts);
  baseChunkMap.forEach((entry, remoteChunkId) => {
    if (!chunkIdMap.has(remoteChunkId)) {
      chunkIdMap.set(remoteChunkId, entry.localId);
    }
  });

  hydrateAim(topicId, chunkIdMap, artifacts);
  hydrateShoot(topicId, chunkIdMap, artifacts);
  hydrateSkin(topicId, chunkIdMap, artifacts);
  hydrateMindMap(topicId, artifacts);

  hydratedTopics.add(topicId);
}

export async function hydrateTopicLearningState(topicId: string) {
  if (typeof window === "undefined") return;
  if (!topicId) return;
  if (hydratedTopics.has(topicId)) return;

  const existing = hydrationInFlight.get(topicId);
  if (existing) return existing;

  const task = hydrateTopicInternal(topicId).finally(() => {
    hydrationInFlight.delete(topicId);
  });

  hydrationInFlight.set(topicId, task);
  return task;
}
