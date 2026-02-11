"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BarChart3, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { loadBackstageState } from "@/lib/backstage/store";

export default function BackstageCalibrationPage() {
  const router = useRouter();
  const [eventsCount, setEventsCount] = useState(0);

  const stats = useMemo(() => {
    const events = loadBackstageState().events;
    const mcqs = events.filter((e) => e.type === "mcq" && typeof e.confidence === "number" && typeof e.mcq?.correct === "boolean");

    const attempts = mcqs.length;
    const correct = mcqs.filter((e) => e.mcq?.correct).length;
    const accuracy = attempts ? Math.round((correct / attempts) * 100) : null;

    const avgConf = attempts
      ? Math.round(mcqs.reduce((a, e) => a + (e.confidence ?? 0), 0) / attempts)
      : null;

    const gap = accuracy !== null && avgConf !== null ? avgConf - accuracy : null;

    return { attempts, correct, accuracy, avgConf, gap };
  }, [eventsCount]);

  useEffect(() => {
    setEventsCount(loadBackstageState().events.length);
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="h-4 w-4" /> Backstage / Calibration
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Calibration</h1>
          <div className="mt-1 text-sm text-muted-foreground">
            Confidence vs accuracy. The goal is honest self-knowledge.
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => router.push("/backstage")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Backstage
          </Button>
          <Button variant="secondary" onClick={() => router.push("/exam-centre/mcq")}
          >
            <Target className="mr-2 h-4 w-4" /> Do MCQ
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <Card className="md:col-span-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">MCQ attempts</div>
              <Badge variant="outline">{stats.attempts}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Accuracy</div>
              <Badge variant="outline">{stats.accuracy ?? "—"}%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Avg confidence</div>
              <Badge variant="outline">{stats.avgConf ?? "—"}%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Gap (conf − acc)</div>
              <Badge variant={stats.gap !== null && stats.gap > 10 ? "secondary" : "outline"}>
                {stats.gap ?? "—"}
              </Badge>
            </div>

            <Button className="mt-2" onClick={() => setEventsCount(loadBackstageState().events.length)}>
              Refresh
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Next</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            V1 is summary only. V2 will add:
            <ul className="mt-2 list-disc pl-5">
              <li>Subject-wise calibration</li>
              <li>Overconfidence wrongs / underconfidence rights</li>
              <li>Calibration drift over time</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
