"use client";

import type { Shoot, ShootChunkArtifact } from "@/lib/shoot/types";
import type { Skin, SkinChunk } from "@/lib/skin/types";

export const SHOOT_VPREFRE_PASS_THRESHOLD = 75;
export const SKIN_GRINDE_PASS_THRESHOLD = 75;

type CriterionResult = {
  key: string;
  label: string;
  passed: boolean;
  pointsEarned: number;
  pointsPossible: number;
};

type ChunkRubricResult = {
  chunkId: string;
  score: number;
  passed: boolean;
  mandatoryPassed: boolean;
  pointsEarned: number;
  pointsPossible: number;
  criteria: CriterionResult[];
};

export type StageRubricResult = {
  rubricCode: string;
  score: number;
  passed: boolean;
  threshold: number;
  chunkCount: number;
  passedChunkCount: number;
  failedChunkCount: number;
  minChunkScore: number;
  chunks: ChunkRubricResult[];
  summary: string;
};

function lineCount(text: string | undefined) {
  return (text || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean).length;
}

function criterion(
  key: string,
  label: string,
  passed: boolean,
  pointsPossible: number
): CriterionResult {
  return {
    key,
    label,
    passed,
    pointsPossible,
    pointsEarned: passed ? pointsPossible : 0,
  };
}

function scoreChunk(criteria: CriterionResult[]) {
  const pointsPossible = criteria.reduce((sum, item) => sum + item.pointsPossible, 0);
  const pointsEarned = criteria.reduce((sum, item) => sum + item.pointsEarned, 0);
  const score = pointsPossible > 0 ? Math.round((pointsEarned / pointsPossible) * 100) : 0;
  return { pointsPossible, pointsEarned, score };
}

function scoreShootChunk(chunk: ShootChunkArtifact): ChunkRubricResult {
  const criteria = [
    criterion("visual", "Visual encoding", chunk.vprefre.visual, 10),
    criterion("processed", "Processed understanding", chunk.vprefre.processed, 10),
    criterion("relational", "Relational links", chunk.vprefre.relational, 10),
    criterion("freehand", "Freehand reconstruction", chunk.vprefre.freehand, 10),
    criterion("reflective", "Reflective annotation", chunk.vprefre.reflective, 10),
    criterion("efficient", "Efficient compression", chunk.vprefre.efficient, 10),
    criterion("layer_logic", "Layered logic (>=2 lines)", lineCount(chunk.layered.logic) >= 2, 15),
    criterion(
      "layer_concepts",
      "Layered concepts (>=3 lines)",
      lineCount(chunk.layered.concepts) >= 3,
      10
    ),
    criterion(
      "layer_details",
      "Important details (>=3 lines)",
      lineCount(chunk.layered.importantDetails) >= 3,
      10
    ),
    criterion(
      "teach_back",
      "Teach-back prompt present",
      chunk.teachBackPrompts.trim().length > 0,
      5
    ),
  ];

  const mandatoryPassed =
    chunk.vprefre.processed &&
    chunk.vprefre.efficient &&
    chunk.teachBackPrompts.trim().length > 0;

  const totals = scoreChunk(criteria);
  const passed = totals.score >= SHOOT_VPREFRE_PASS_THRESHOLD && mandatoryPassed;

  return {
    chunkId: chunk.chunkId,
    score: totals.score,
    passed,
    mandatoryPassed,
    pointsEarned: totals.pointsEarned,
    pointsPossible: totals.pointsPossible,
    criteria,
  };
}

function scoreSkinChunk(chunk: SkinChunk): ChunkRubricResult {
  const criteria = [
    criterion("two_four_rule", "2-4 rule applied", chunk.appliedTwoFourRule, 20),
    criterion("grouped", "Grouped", chunk.grinde.grouped, 15),
    criterion("reflective", "Reflective", chunk.grinde.reflective, 10),
    criterion("interconnected", "Interconnected", chunk.grinde.interconnected, 15),
    criterion("non_verbal", "Non-verbal anchors", chunk.grinde.nonVerbal, 10),
    criterion("directional", "Directional flow", chunk.grinde.directional, 15),
    criterion("emphasised", "Emphasis cues", chunk.grinde.emphasised, 10),
    criterion(
      "teach_back_review",
      "Teach-back gap review logged",
      chunk.teachBackGaps.trim().length > 0,
      5
    ),
  ];

  const mandatoryPassed =
    chunk.appliedTwoFourRule && chunk.grinde.grouped && chunk.grinde.directional;

  const totals = scoreChunk(criteria);
  const passed = totals.score >= SKIN_GRINDE_PASS_THRESHOLD && mandatoryPassed;

  return {
    chunkId: chunk.chunkId,
    score: totals.score,
    passed,
    mandatoryPassed,
    pointsEarned: totals.pointsEarned,
    pointsPossible: totals.pointsPossible,
    criteria,
  };
}

function aggregateStage(
  rubricCode: string,
  threshold: number,
  chunks: ChunkRubricResult[]
): StageRubricResult {
  const chunkCount = chunks.length;
  if (!chunkCount) {
    return {
      rubricCode,
      score: 0,
      passed: false,
      threshold,
      chunkCount: 0,
      passedChunkCount: 0,
      failedChunkCount: 0,
      minChunkScore: 0,
      chunks: [],
      summary: "No chunks available for rubric scoring.",
    };
  }

  const score = Math.round(chunks.reduce((sum, chunk) => sum + chunk.score, 0) / chunkCount);
  const passedChunkCount = chunks.filter((chunk) => chunk.passed).length;
  const failedChunkCount = chunkCount - passedChunkCount;
  const minChunkScore = Math.min(...chunks.map((chunk) => chunk.score));
  const allChunksPass = failedChunkCount === 0;
  const passed = score >= threshold && allChunksPass;

  return {
    rubricCode,
    score,
    passed,
    threshold,
    chunkCount,
    passedChunkCount,
    failedChunkCount,
    minChunkScore,
    chunks,
    summary: `${passedChunkCount}/${chunkCount} chunks passed. Stage score ${score}/${threshold}.`,
  };
}

export function scoreShootRubric(shoot: Shoot): StageRubricResult {
  const chunks = shoot.artifacts.map(scoreShootChunk);
  return aggregateStage("shoot_vprefre_rubric_v1", SHOOT_VPREFRE_PASS_THRESHOLD, chunks);
}

export function scoreSkinRubric(skin: Skin): StageRubricResult {
  const chunks = skin.chunks.map(scoreSkinChunk);
  return aggregateStage("skin_grinde_rubric_v1", SKIN_GRINDE_PASS_THRESHOLD, chunks);
}
