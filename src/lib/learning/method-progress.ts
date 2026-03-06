"use client";

import { getAim, validateAim } from "@/lib/aim/store";
import { getMindMap } from "@/lib/mindmap/store";
import { getPreStudy, validatePreStudy } from "@/lib/prestudy/store";
import { getShoot } from "@/lib/shoot/store";
import { getSkin } from "@/lib/skin/store";
import { scoreShootRubric, scoreSkinRubric } from "@/lib/learning/rubrics";

export type LearningMethodStageId = "prestudy" | "aim" | "shoot" | "skin" | "mindmap";
export type LearningMethodStageState = "locked" | "not_started" | "in_progress" | "completed";

export type LearningMethodStage = {
  id: LearningMethodStageId;
  label: string;
  state: LearningMethodStageState;
  completion: number;
  summary: string;
};

export type LearningMethodProgress = {
  stages: LearningMethodStage[];
  completedCount: number;
  overallCompletion: number;
  nextStage: LearningMethodStageId | null;
};

function clamp01(value: number) {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function ratioFromStage(stage: LearningMethodStage) {
  if (stage.state === "completed") return 1;
  if (stage.state === "in_progress") return clamp01(stage.completion);
  return 0;
}

export function deriveLearningMethodProgress(topicId: string): LearningMethodProgress {
  const preStudy = getPreStudy(topicId);
  const preValidation = preStudy ? validatePreStudy(preStudy) : null;
  const preCompleted = Boolean(preStudy?.completedAt) || Boolean(preValidation?.ok);
  const preCompletion = !preStudy
    ? 0
    : clamp01(
        [
          (preValidation?.keywordCount || 0) >= 10,
          (preValidation?.aCount || 0) >= 3,
          preValidation?.chunkMinOk || false,
          preValidation?.aimMinOk || false,
        ].filter(Boolean).length / 4
      );

  const aim = getAim(topicId);
  const aimValidation = aim ? validateAim(aim) : null;
  const aimCompleted = Boolean(aim?.completedAt) || Boolean(aimValidation?.ok);
  const aimChunkCount = aim?.chunkPlans.length || 0;
  const aimWhyCount = aim?.chunkPlans.filter((chunk) => chunk.whyImportant.trim().length > 0).length || 0;
  const aimQCount = aim?.chunkPlans.filter((chunk) => chunk.questions.length >= 6).length || 0;
  const aimCompletion =
    aimChunkCount === 0 ? 0 : clamp01((aimWhyCount + aimQCount) / (aimChunkCount * 2));

  const shoot = getShoot(topicId);
  const shootRubric = shoot ? scoreShootRubric(shoot) : null;
  const shootCompleted = Boolean(shoot?.completedAt) || Boolean(shootRubric?.passed);
  const shootChunkCount = shootRubric?.chunkCount || 0;
  const shootCompletion = shootRubric ? clamp01(shootRubric.score / 100) : 0;

  const skin = getSkin(topicId);
  const skinRubric = skin ? scoreSkinRubric(skin) : null;
  const skinCompleted = Boolean(skin?.completedAt) || Boolean(skinRubric?.passed);
  const skinChunkCount = skinRubric?.chunkCount || 0;
  const skinCompletion = skinRubric ? clamp01(skinRubric.score / 100) : 0;

  const mindMap = getMindMap(topicId);
  const mindmapCompleted = mindMap?.status === "final";
  const mindmapStarted = Boolean(mindMap);
  const mindmapCompletion = !mindMap
    ? 0
    : mindMap.status === "final"
      ? 1
      : clamp01((mindMap.userEditsCount || 0) / Math.max(mindMap.requiredEdits || 1, 1));

  const stages: LearningMethodStage[] = [
    {
      id: "prestudy",
      label: "Prestudy",
      state: preCompleted ? "completed" : preStudy ? "in_progress" : "not_started",
      completion: preCompletion,
      summary: preStudy
        ? `${preValidation?.keywordCount || 0} keywords, ${preStudy.chunks.length} chunks`
        : "Start with keyword harvest + chunk scaffold",
    },
    {
      id: "aim",
      label: "Aim",
      state: aimCompleted ? "completed" : aim ? "in_progress" : preCompleted ? "not_started" : "locked",
      completion: aimCompletion,
      summary: aim
        ? `${aimWhyCount}/${aimChunkCount} why-rationales, ${aimQCount}/${aimChunkCount} chunk question-sets`
        : "Importance questions + chunk intent",
    },
    {
      id: "shoot",
      label: "Shoot",
      state: shootCompleted ? "completed" : shoot ? "in_progress" : aimCompleted ? "not_started" : "locked",
      completion: shootCompletion,
      summary: shoot
        ? `${shootRubric?.passedChunkCount || 0}/${shootChunkCount} chunks pass VPReFRE rubric`
        : "Build layered VPReFRE artifacts",
    },
    {
      id: "skin",
      label: "Skin",
      state: skinCompleted ? "completed" : skin ? "in_progress" : shootCompleted ? "not_started" : "locked",
      completion: skinCompletion,
      summary: skin
        ? `${skinRubric?.passedChunkCount || 0}/${skinChunkCount} chunks pass GRINDE rubric`
        : "Refine with 2-4 rule + GRINDE",
    },
    {
      id: "mindmap",
      label: "Mindmap",
      state: mindmapCompleted
        ? "completed"
        : mindmapStarted
          ? "in_progress"
          : skinCompleted
            ? "not_started"
            : "locked",
      completion: mindmapCompletion,
      summary: mindMap
        ? `${mindMap.nodes.length} nodes, ${mindMap.edges.length} edges`
        : "Synthesize final map and finalize",
    },
  ];

  const completedCount = stages.filter((stage) => stage.state === "completed").length;
  const overallCompletion = Math.round(
    (stages.reduce((sum, stage) => sum + ratioFromStage(stage), 0) / stages.length) * 100
  );
  const nextStage = stages.find((stage) => stage.state === "not_started")?.id || null;

  return {
    stages,
    completedCount,
    overallCompletion,
    nextStage,
  };
}
