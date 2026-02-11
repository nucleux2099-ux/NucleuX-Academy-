"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  Flame,
  Target,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { useAuth } from "@/lib/auth-context";
import { useAnalytics, useStreak, useStudyPlan } from "@/lib/api/hooks";
import { CBME_MBBS_Y1_BLOCKS, type CBMEBlock } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Burning the midnight oil";
}

function clampPct(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

function pickTitle(x: Record<string, unknown>) {
  const candidates = [
    x.title,
    x.topic,
    x.name,
    x.atom,
    x.label,
    x.id,
  ] as Array<unknown>;
  const first = candidates.find((v) => typeof v === "string" && v.trim().length > 0);
  return (first as string | undefined) ?? "Untitled";
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: streak } = useStreak();
  const { data: studyPlan, isLoading: planLoading } = useStudyPlan();
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics(7);

  const isLoading = planLoading || analyticsLoading;

  const userName =
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Student";

  const today = studyPlan?.today;
  const goals = studyPlan?.goals;

  const accuracy = useMemo(() => {
    if (!analytics) return 0;
    if (!analytics.totalQuestions) return 0;
    return Math.round((analytics.correctAnswers / analytics.totalQuestions) * 100);
  }, [analytics]);

  const difficultyZone = useMemo(() => {
    if (!analytics || analytics.totalQuestions < 10) {
      return { label: "Not enough data", tone: "neutral" as const, hint: "Do 10 MCQs to calibrate." };
    }
    if (accuracy >= 86) {
      return { label: "Too easy", tone: "warn" as const, hint: "Increase difficulty or switch topic." };
    }
    if (accuracy <= 60) {
      return { label: "Too hard", tone: "warn" as const, hint: "Drop difficulty or review first." };
    }
    return { label: "Learning zone", tone: "good" as const, hint: "Stay here — this is where growth happens." };
  }, [analytics, accuracy]);

  const nextAction = useMemo(() => {
    // Simple, deterministic policy (actions-first):
    // 1) If MCQ goal not met → practice
    // 2) Else if study minutes goal not met → read
    // 3) Else → review analytics
    const mcqProgress = today?.mcq_progress ?? 0;
    const goalProgress = today?.goal_progress ?? 0;

    if (mcqProgress < 1) {
      return {
        label: "Practice MCQs",
        desc: "Best ROI right now: answer a small set and get feedback.",
        icon: Target,
        href: "/exam-centre",
      };
    }

    if (goalProgress < 1) {
      return {
        label: "Read (Library)",
        desc: "Build schema first — then test it.",
        icon: BookOpen,
        href: "/library",
      };
    }

    return {
      label: "Review + fix mistakes",
      desc: "Quick review of weak areas, then a short re-test.",
      icon: BarChart3,
      href: "/analytics",
    };
  }, [today?.goal_progress, today?.mcq_progress]);

  const cbmeY1BySubject = useMemo(() => {
    const by: Record<CBMEBlock["subject"], CBMEBlock[]> = {
      anatomy: [],
      physiology: [],
      biochemistry: [],
      bme: [],
    };
    for (const b of CBME_MBBS_Y1_BLOCKS) by[b.subject].push(b);
    for (const k of Object.keys(by) as Array<CBMEBlock["subject"]>) {
      by[k].sort((a, b) => a.order - b.order);
    }
    return by;
  }, []);

  const weakTopics = useMemo(() => {
    // We currently don’t have topic-level weakness API on the dashboard route.
    // Use StudyPlan recommended/continue lists as a best-effort “what to do next” queue.
    const items = [
      ...(studyPlan?.recommended ?? []),
      ...(studyPlan?.continue_learning ?? []),
    ] as Array<Record<string, unknown>>;

    const unique: Record<string, Record<string, unknown>> = {};
    for (const it of items) {
      const t = pickTitle(it);
      if (!unique[t]) unique[t] = it;
    }

    return Object.keys(unique)
      .slice(0, 5)
      .map((k) => ({ title: k, raw: unique[k] }));
  }, [studyPlan?.recommended, studyPlan?.continue_learning]);

  const streakNow = streak?.current_streak ?? 0;
  const streakBest = streak?.longest_streak ?? 0;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 md:mb-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm text-muted-foreground">
              {getGreeting()}, <span className="text-foreground">{userName}</span>
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Flame className="h-3.5 w-3.5" /> {streakNow}d
            </Badge>
            <Badge variant="outline" className="hidden gap-1 md:flex">
              <CheckCircle2 className="h-3.5 w-3.5" /> Best {streakBest}d
            </Badge>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* Hero: Today’s Plan */}
        <Card className="md:col-span-7">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" /> Today’s Plan
              </span>
              {!isLoading && today ? (
                <Badge variant={today.goal_progress >= 1 ? "default" : "secondary"}>
                  {today.goal_progress >= 1 ? "On track" : "In progress"}
                </Badge>
              ) : null}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Empty state */}
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                <div className="h-10 w-full animate-pulse rounded bg-muted" />
                <div className="h-10 w-full animate-pulse rounded bg-muted" />
              </div>
            ) : !today || !goals ? (
              <div className="rounded-lg border border-dashed p-4">
                <div className="text-sm font-medium">No plan yet</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Set a daily goal and start a short session. The dashboard will become your mission control.
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={() => router.push("/profile")}>
                    Set goals <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="secondary" onClick={() => router.push("/exam-centre")}
                  >
                    Do 10 MCQs
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-lg border p-3">
                    <div className="text-xs text-muted-foreground">Study goal</div>
                    <div className="mt-1 flex items-end justify-between">
                      <div className="text-lg font-semibold">
                        {today.study_minutes}/{goals.study_minutes} <span className="text-sm font-normal text-muted-foreground">min</span>
                      </div>
                      <Badge variant="outline">{clampPct(today.goal_progress * 100)}%</Badge>
                    </div>
                    <Progress className="mt-2" value={clampPct(today.goal_progress * 100)} />
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-xs text-muted-foreground">MCQ goal</div>
                    <div className="mt-1 flex items-end justify-between">
                      <div className="text-lg font-semibold">
                        {today.mcqs_attempted}/{goals.mcqs} <span className="text-sm font-normal text-muted-foreground">Qs</span>
                      </div>
                      <Badge variant="outline">{clampPct(today.mcq_progress * 100)}%</Badge>
                    </div>
                    <Progress className="mt-2" value={clampPct(today.mcq_progress * 100)} />
                    <div className="mt-2 text-xs text-muted-foreground">
                      {today.mcqs_attempted > 0 ? `${today.mcqs_correct} correct today` : "Start with 10 questions."}
                    </div>
                  </div>
                </div>

                {/* 3 action buttons */}
                <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                  <Button variant="secondary" className="justify-start" onClick={() => router.push("/library")}
                  >
                    <BookOpen className="mr-2 h-4 w-4" /> Read
                  </Button>
                  <Button variant="secondary" className="justify-start" onClick={() => router.push("/exam-centre")}
                  >
                    <Target className="mr-2 h-4 w-4" /> MCQ
                  </Button>
                  <Button variant="secondary" className="justify-start" onClick={() => router.push("/analytics")}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" /> Review
                  </Button>
                </div>

                {/* Next best action */}
                <div className="rounded-lg bg-muted/30 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-sm font-medium">Next best action</div>
                      <div className="mt-1 text-sm text-muted-foreground">{nextAction.desc}</div>
                    </div>
                    <Button onClick={() => router.push(nextAction.href)}>
                      {nextAction.label} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Right column: compact premium metrics */}
        <div className="md:col-span-5 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Calibration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-end justify-between">
                <div className="text-2xl font-semibold">{accuracy}%</div>
                <Badge variant="outline">Last 7 days</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Aim for honest confidence: test small → review → re-test.
              </div>
              <Button variant="ghost" className="px-0" onClick={() => router.push("/analytics")}
              >
                Open analytics <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Difficulty zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">{difficultyZone.label}</div>
                <Badge variant={difficultyZone.tone === "good" ? "default" : "secondary"}>
                  Target 70–85%
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">{difficultyZone.hint}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Weak topics (do 10 Qs)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {weakTopics.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  Once you study a bit, we’ll surface your next best topics here.
                </div>
              ) : (
                <div className="space-y-2">
                  {weakTopics.map((t) => (
                    <div key={t.title} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{t.title}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Quick win: 10 questions + immediate feedback
                        </div>
                      </div>
                      <Button size="sm" onClick={() => router.push("/exam-centre")}>
                        Do 10
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">CBME MBBS Year 1 (Blocks)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Canonical curriculum backbone (v1). This will drive your plans, reviews, and practice.
              </div>

              <Tabs defaultValue="anatomy" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="anatomy">Anat</TabsTrigger>
                  <TabsTrigger value="physiology">Physio</TabsTrigger>
                  <TabsTrigger value="biochemistry">Biochem</TabsTrigger>
                  <TabsTrigger value="bme">BME</TabsTrigger>
                </TabsList>

                {(
                  [
                    ["anatomy", cbmeY1BySubject.anatomy],
                    ["physiology", cbmeY1BySubject.physiology],
                    ["biochemistry", cbmeY1BySubject.biochemistry],
                    ["bme", cbmeY1BySubject.bme],
                  ] as const
                ).map(([key, blocks]) => (
                  <TabsContent key={key} value={key} className="mt-3 space-y-2">
                    {blocks.map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center justify-between gap-3 rounded-lg border p-3"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{b.title}</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {b.tags.join(" · ")}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => router.push(b.links?.libraryPath || "/library")}
                        >
                          Open
                        </Button>
                      </div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
