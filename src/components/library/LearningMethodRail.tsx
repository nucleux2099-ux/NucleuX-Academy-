"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  LearningMethodProgress,
  LearningMethodStage,
  LearningMethodStageId,
} from "@/lib/learning/method-progress";
import type { LearningStage, LearningTopicStatus } from "@/lib/learning/contracts";
import type {
  CheckpointHistoryByStage,
  LatestCheckpointByStage,
} from "@/lib/learning/topic-lifecycle";
import {
  ArrowRight,
  Brain,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  Eye,
  Layers,
  PauseCircle,
  PlayCircle,
  Route,
  ShieldAlert,
  Sparkles,
  Target,
} from "lucide-react";
import { useState, type ComponentType } from "react";

const STAGE_ICON: Record<LearningMethodStageId, ComponentType<{ className?: string }>> = {
  prestudy: Eye,
  aim: Target,
  shoot: Layers,
  skin: Route,
  mindmap: Brain,
};

const STATE_LABEL: Record<LearningMethodStage["state"], string> = {
  locked: "Locked",
  not_started: "Ready",
  in_progress: "In Progress",
  completed: "Done",
};

type LearningMethodDetailTab = "ican" | "blueprint" | "execution";

const DETAIL_TAB_LABEL: Record<LearningMethodDetailTab, string> = {
  ican: "ICAN Principles",
  blueprint: "Achalasia Blueprint",
  execution: "Execution",
};

export type LearningMethodStageDetail = {
  focusLabel?: string;
  principles: string[];
  blueprint: string[];
  execution: string[];
  metrics?: Array<{ label: string; value: string }>;
  links?: Array<{ label: string; href: string }>;
};

export type LearningMethodStageDetails = Partial<
  Record<LearningMethodStageId, LearningMethodStageDetail>
>;

function stateClass(state: LearningMethodStage["state"]) {
  if (state === "completed") return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  if (state === "in_progress") return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
  if (state === "not_started") return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  return "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";
}

function stageProgressText(stage: LearningMethodStage) {
  if (stage.state === "locked") return "Blocked by previous stage";
  if (stage.state === "completed") return "100%";
  return `${Math.round(stage.completion * 100)}%`;
}

interface LearningMethodRailProps {
  progress: LearningMethodProgress;
  onOpenStage: (stageId: LearningMethodStageId) => void;
  onRefresh?: () => void;
  onRunMockLifecycle?: () => void;
  mockRunLoading?: boolean;
  mockRunStatus?: { ok: boolean; message: string } | null;
  currentStage?: LearningMethodStageId | null;
  topicStatus?: LearningTopicStatus | null;
  stageDetails?: LearningMethodStageDetails;
  checkpoints?: LatestCheckpointByStage;
  checkpointHistory?: CheckpointHistoryByStage;
  actionLoadingStage?: LearningMethodStageId | null;
  stageActionError?: string | null;
  onStageAction?: (
    stageId: LearningMethodStageId,
    action: "start" | "pause" | "complete"
  ) => void;
}

function stageToLearningStage(stageId: LearningMethodStageId): LearningStage | null {
  if (stageId === "mindmap") return null;
  return stageId;
}

function checkpointBadgeClass(passed: boolean) {
  return passed
    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
    : "bg-red-500/15 text-red-400 border-red-500/30";
}

function summarizeCheckpointDetails(details: Record<string, unknown>) {
  const pairs = Object.entries(details).slice(0, 4);
  if (!pairs.length) return null;

  return pairs
    .map(([key, value]) => {
      if (value === null || value === undefined) return `${key}: n/a`;
      if (Array.isArray(value)) return `${key}: [${value.length}]`;
      if (typeof value === "object") return `${key}: {..}`;
      return `${key}: ${String(value)}`;
    })
    .join(" | ");
}

function formatCheckpointTime(evaluatedAt: string) {
  const value = new Date(evaluatedAt);
  if (Number.isNaN(value.getTime())) return evaluatedAt;
  return value.toLocaleString();
}

export function LearningMethodRail({
  progress,
  onOpenStage,
  onRefresh,
  onRunMockLifecycle,
  mockRunLoading = false,
  mockRunStatus,
  currentStage,
  topicStatus,
  stageDetails,
  checkpoints,
  checkpointHistory,
  actionLoadingStage,
  stageActionError,
  onStageAction,
}: LearningMethodRailProps) {
  const [expandedStage, setExpandedStage] = useState<LearningMethodStageId | null>(() =>
    progress.nextStage ||
    progress.stages.find((stage) => stage.state === "in_progress")?.id ||
    progress.stages.find((stage) => stage.state === "not_started")?.id ||
    null
  );
  const [activeDetailTab, setActiveDetailTab] = useState<
    Partial<Record<LearningMethodStageId, LearningMethodDetailTab>>
  >({});

  return (
    <Card className="bg-[#142538] border-[rgba(6,182,212,0.12)]">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="text-[#E5E7EB] font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#06B6D4]" />
              Learning Method Journey
            </div>
            <div className="text-xs text-[#6B7280] mt-1">
              Bear Hunter progression: Prestudy -&gt; Aim -&gt; Shoot -&gt; Skin -&gt; Mindmap
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 flex-wrap">
            {onRunMockLifecycle && (
              <Button
                size="sm"
                onClick={onRunMockLifecycle}
                disabled={mockRunLoading}
                className="h-7 text-xs bg-[#06B6D4]/20 text-[#7DD3FC] border border-[#06B6D4]/35 hover:bg-[#06B6D4]/30"
              >
                {mockRunLoading ? "Generating..." : "Mock Run"}
              </Button>
            )}
            <Badge className="bg-[rgba(6,182,212,0.12)] text-[#06B6D4] border-[rgba(6,182,212,0.28)]">
              {progress.completedCount}/5 complete
            </Badge>
            <Badge className="bg-[#0D1B2A] text-[#9CA3AF] border-[rgba(6,182,212,0.18)]">
              Overall {progress.overallCompletion}%
            </Badge>
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="h-7 text-xs border-[rgba(6,182,212,0.2)] text-[#9CA3AF]"
              >
                Refresh
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {mockRunStatus && (
          <div
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              mockRunStatus.ok
                ? "border-[#5BB3B3]/35 bg-[#5BB3B3]/10 text-[#9FC3BC]"
                : "border-[#E57373]/35 bg-[#E57373]/10 text-[#EAB7B7]"
            )}
          >
            {mockRunStatus.message}
          </div>
        )}
        {stageActionError && (
          <div className="rounded-lg border border-red-500/35 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {stageActionError}
          </div>
        )}
        {progress.stages.map((stage, index) => {
          const Icon = STAGE_ICON[stage.id];
          const isLocked = stage.state === "locked";
          const isNext = progress.nextStage === stage.id;
          const isCurrent = currentStage === stage.id;
          const checkpoint = (() => {
            const serverStage = stageToLearningStage(stage.id);
            if (!serverStage) return null;
            return checkpoints?.[serverStage] || null;
          })();
          const stageHistory = (() => {
            const serverStage = stageToLearningStage(stage.id);
            if (!serverStage) return [];
            return checkpointHistory?.[serverStage] || [];
          })();
          const detail = stageDetails?.[stage.id];
          const hasDetails = Boolean(detail) || stageHistory.length > 0;
          const detailsOpen = expandedStage === stage.id && hasDetails;
          const detailsTab = activeDetailTab[stage.id] || "ican";
          const detailLines =
            detailsTab === "ican"
              ? detail?.principles || []
              : detailsTab === "blueprint"
                ? detail?.blueprint || []
                : detail?.execution || [];
          const isLoadingAction = actionLoadingStage === stage.id;

          const canStart =
            !isLocked &&
            stage.id !== "mindmap" &&
            (topicStatus === "paused" ? isCurrent : !isCurrent || topicStatus !== "active");
          const canPause =
            !isLocked &&
            stage.id !== "mindmap" &&
            isCurrent &&
            topicStatus === "active" &&
            stage.state !== "completed";
          const canComplete =
            !isLocked && stage.id !== "mindmap" && stage.state !== "completed";

          return (
            <div
              key={stage.id}
              className={cn(
                "rounded-xl border p-3",
                isLocked
                  ? "bg-[#0D1B2A] border-[rgba(107,114,128,0.25)]"
                  : "bg-[#0D1B2A] border-[rgba(6,182,212,0.16)]"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center border",
                      isLocked
                        ? "bg-zinc-500/10 text-zinc-400 border-zinc-500/25"
                        : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#E5E7EB] flex items-center gap-2">
                      <span>{index + 1}. {stage.label}</span>
                      {isCurrent && (
                        <Badge className="h-5 text-[10px] bg-cyan-500/15 text-cyan-400 border-cyan-500/30">
                          Active
                        </Badge>
                      )}
                      {isNext && (
                        <Badge className="h-5 text-[10px] bg-[#C9A86C]/15 text-[#C9A86C] border-[#C9A86C]/30">
                          Next
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-[#9CA3AF] truncate">{stage.summary}</div>
                    {checkpoint && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <Badge
                          className={cn(
                            "h-5 text-[10px] border",
                            checkpointBadgeClass(checkpoint.passed)
                          )}
                        >
                          {checkpoint.passed ? "Checkpoint Passed" : "Checkpoint Failed"}
                        </Badge>
                        <span className="text-[10px] text-[#6B7280] truncate">
                          {checkpoint.checkpointCode}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <Badge className={cn("h-6 text-[10px] border", stateClass(stage.state))}>
                      {STATE_LABEL[stage.state]}
                    </Badge>
                    <Badge className="h-6 text-[10px] bg-[#111827] text-[#9CA3AF] border-[rgba(107,114,128,0.25)]">
                      {stageProgressText(stage)}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => onOpenStage(stage.id)}
                      disabled={isLocked}
                      className={cn(
                        "h-7 text-xs",
                        isLocked
                          ? "bg-zinc-600/30 text-zinc-400"
                          : "bg-[#06B6D4] hover:bg-[#0891B2] text-[#0D1B2A]"
                      )}
                    >
                      Open
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                    {onStageAction && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!canStart || isLoadingAction}
                          onClick={() => onStageAction(stage.id, "start")}
                          className="h-7 text-xs border-[rgba(6,182,212,0.25)] text-[#A0B0BC]"
                        >
                          <PlayCircle className="w-3 h-3 mr-1" />
                          {topicStatus === "paused" && isCurrent ? "Resume" : "Start"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!canPause || isLoadingAction}
                          onClick={() => onStageAction(stage.id, "pause")}
                          className="h-7 text-xs border-[rgba(245,158,11,0.25)] text-[#C9A86C]"
                        >
                          <PauseCircle className="w-3 h-3 mr-1" />
                          Pause
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!canComplete || isLoadingAction}
                          onClick={() => onStageAction(stage.id, "complete")}
                          className={cn(
                            "h-7 text-xs",
                            checkpoint?.passed
                              ? "border-emerald-500/30 text-emerald-400"
                              : "border-[rgba(34,197,94,0.25)] text-[#22C55E]"
                          )}
                        >
                          {checkpoint?.passed ? (
                            <CircleCheck className="w-3 h-3 mr-1" />
                          ) : (
                            <ShieldAlert className="w-3 h-3 mr-1" />
                          )}
                          Complete
                        </Button>
                      </>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={!hasDetails}
                    onClick={() => {
                      if (detailsOpen) {
                        setExpandedStage(null);
                        return;
                      }
                      setExpandedStage(stage.id);
                      setActiveDetailTab((prev) => ({
                        ...prev,
                        [stage.id]: prev[stage.id] || "ican",
                      }));
                    }}
                    className="h-7 px-2 text-xs text-[#9CA3AF] hover:text-[#E5E7EB]"
                  >
                    {detailsOpen ? (
                      <ChevronUp className="w-3 h-3 mr-1" />
                    ) : (
                      <ChevronDown className="w-3 h-3 mr-1" />
                    )}
                    Details
                  </Button>
                </div>
              </div>

              {detailsOpen && (
                <div className="mt-3 rounded-lg border border-[rgba(6,182,212,0.2)] bg-[#101F31] p-3 space-y-2">
                  {detail && (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[11px] uppercase tracking-wide text-[#6B7280]">
                          Stage blueprint
                        </div>
                        {detail.focusLabel && (
                          <Badge className="h-5 text-[10px] bg-[#C9A86C]/15 text-[#C9A86C] border-[#C9A86C]/30">
                            {detail.focusLabel}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {(["ican", "blueprint", "execution"] as LearningMethodDetailTab[]).map((tabId) => (
                          <Button
                            key={`${stage.id}-${tabId}`}
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setActiveDetailTab((prev) => ({
                                ...prev,
                                [stage.id]: tabId,
                              }))
                            }
                            className={cn(
                              "h-6 px-2 text-[10px]",
                              detailsTab === tabId
                                ? "bg-[#06B6D4]/18 border-[#06B6D4]/35 text-[#7DD3FC]"
                                : "border-[rgba(6,182,212,0.18)] text-[#8EA0AD]"
                            )}
                          >
                            {DETAIL_TAB_LABEL[tabId]}
                          </Button>
                        ))}
                      </div>

                      <div className="rounded-md border border-[rgba(6,182,212,0.16)] bg-[#0D1B2A] p-3">
                        {detailLines.length > 0 ? (
                          <ul className="space-y-1.5 text-xs text-[#A0B0BC]">
                            {detailLines.map((line, lineIndex) => (
                              <li key={`${stage.id}-${detailsTab}-${lineIndex}`} className="flex items-start gap-2">
                                <span className="mt-[6px] h-1 w-1 rounded-full bg-[#5BB3B3]" />
                                <span>{line}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-xs text-[#7D8C98]">
                            No {DETAIL_TAB_LABEL[detailsTab].toLowerCase()} data available.
                          </div>
                        )}
                      </div>

                      {detail.metrics && detail.metrics.length > 0 && (
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                          {detail.metrics.map((metric) => (
                            <div
                              key={`${stage.id}-${metric.label}`}
                              className="rounded-md border border-[rgba(6,182,212,0.14)] bg-[#0D1B2A] p-2"
                            >
                              <div className="text-[10px] uppercase tracking-wide text-[#6B7280]">
                                {metric.label}
                              </div>
                              <div className="mt-0.5 text-sm text-[#E5E7EB]">{metric.value}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {detail.links && detail.links.length > 0 && (
                        <div className="rounded-md border border-[rgba(6,182,212,0.14)] bg-[#0D1B2A] p-2.5">
                          <div className="text-[11px] uppercase tracking-wide text-[#6B7280]">
                            Linked topics
                          </div>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {detail.links.map((link) => (
                              <Link
                                key={`${stage.id}-${link.href}`}
                                href={link.href}
                                className="inline-flex items-center rounded-md border border-[rgba(6,182,212,0.24)] bg-[#06B6D4]/8 px-2 py-1 text-[11px] text-[#7DD3FC] hover:bg-[#06B6D4]/16"
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {stageHistory.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-[11px] uppercase tracking-wide text-[#6B7280]">
                        Recent checkpoint history
                      </div>
                      {stageHistory.map((entry) => {
                        const summary = summarizeCheckpointDetails(entry.details || {});
                        return (
                          <div
                            key={entry.id}
                            className="rounded-md border border-[rgba(6,182,212,0.14)] bg-[#0D1B2A] p-2.5"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={cn(
                                    "h-5 text-[10px] border",
                                    checkpointBadgeClass(entry.passed)
                                  )}
                                >
                                  {entry.passed ? "Pass" : "Fail"}
                                </Badge>
                                <span className="text-xs text-[#9CA3AF]">{entry.checkpoint_code}</span>
                              </div>
                              <span className="text-[11px] text-[#6B7280]">
                                {formatCheckpointTime(entry.evaluated_at)}
                              </span>
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-[#7D8C98]">
                              <span>
                                Score: {typeof entry.score === "number" ? entry.score : "n/a"}
                              </span>
                            </div>
                            {summary && <div className="mt-1 text-[11px] text-[#8EA0AD]">{summary}</div>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
