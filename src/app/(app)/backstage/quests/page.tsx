"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Swords } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { loadBackstageState } from "@/lib/backstage/store";

type QuestRow = {
  topicId: string;
  attempts: number;
  accuracy: number; // 0-100
  avgConfidence: number; // 0-100
  gap: number; // conf - acc
  mastered: boolean;
};

export default function BackstageQuestsPage() {
  const router = useRouter();
  const [nonce, setNonce] = useState(0);

  const rows = useMemo(() => {
    const events = loadBackstageState().events;
    const mcqs = events.filter(
      (e) => e.type === "mcq" && e.topicId && typeof e.confidence === "number" && typeof e.mcq?.correct === "boolean"
    );

    const byTopic = new Map<string, typeof mcqs>();
    for (const e of mcqs) {
      const id = e.topicId as string;
      const arr = byTopic.get(id) ?? [];
      arr.push(e);
      byTopic.set(id, arr);
    }

    const out: QuestRow[] = [];
    for (const [topicId, es] of byTopic.entries()) {
      const attempts = es.length;
      const correct = es.filter((e) => e.mcq?.correct).length;
      const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0;
      const avgConfidence = attempts
        ? Math.round(es.reduce((a, e) => a + (e.confidence ?? 0), 0) / attempts)
        : 0;
      const gap = avgConfidence - accuracy;
      const mastered = attempts >= 20 && accuracy >= 70 && gap < 10;

      out.push({ topicId, attempts, accuracy, avgConfidence, gap, mastered });
    }

    // show weakest first (not mastered, then low accuracy)
    out.sort((a, b) => {
      if (a.mastered !== b.mastered) return a.mastered ? 1 : -1;
      return a.accuracy - b.accuracy;
    });

    return out;
  }, [nonce]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Swords className="h-4 w-4" /> Backstage / Quests
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Quests (Topics)</h1>
          <div className="mt-1 text-sm text-muted-foreground">
            Topic dungeons. Mastery rule: 20+ MCQs, ≥70% accuracy, gap &lt; 10.
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => router.push("/backstage")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Backstage
          </Button>
          <Button variant="secondary" onClick={() => setNonce((n) => n + 1)}>Refresh</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quest list</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {rows.length === 0 ? (
            <div className="text-sm text-muted-foreground">No topic-linked MCQ events yet.</div>
          ) : (
            rows.map((r) => (
              <div key={r.topicId} className="rounded-lg border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{r.topicId}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Attempts: {r.attempts} • Acc: {r.accuracy}% • Conf: {r.avgConfidence}% • Gap: {r.gap}
                    </div>
                  </div>
                  {r.mastered ? (
                    <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30">Mastered</Badge>
                  ) : (
                    <Badge variant="outline">In progress</Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
