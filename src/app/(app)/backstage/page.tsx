"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  ClipboardList,
  Fingerprint,
  Lightbulb,
  Target,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Bloom, CompetencyStage, SubjectKey } from "@/lib/backstage/types";
import { addBackstageEvent, getRecentBackstageEvents, loadBackstageState } from "@/lib/backstage/store";
import { deriveSubjectStats } from "@/lib/backstage/derive";
import { countBlooms } from "@/lib/backstage/bloom";
import { addCaseLog, getRecentCases, subjectLabel } from "@/lib/backstage/case-store";

const SUBJECTS: Array<{ key: SubjectKey; label: string }> = [
  { key: "anatomy", label: "Anatomy" },
  { key: "physiology", label: "Physiology" },
  { key: "biochemistry", label: "Biochemistry" },
  { key: "pathology", label: "Pathology" },
  { key: "pharmacology", label: "Pharmacology" },
  { key: "microbiology", label: "Microbiology" },
  { key: "psm", label: "PSM" },
  { key: "ent", label: "ENT" },
  { key: "ophthalmology", label: "Ophthal" },
  { key: "medicine", label: "Medicine" },
  { key: "surgery", label: "Surgery" },
  { key: "obgyn", label: "OBGYN" },
  { key: "pediatrics", label: "Pediatrics" },
  { key: "orthopedics", label: "Ortho" },
  { key: "forensic", label: "FMT" },
];

function stageLabel(s: CompetencyStage) {
  switch (s) {
    case "unconsciously_incompetent":
      return "Unconsciously incompetent";
    case "consciously_incompetent":
      return "Consciously incompetent";
    case "consciously_competent":
      return "Consciously competent";
    case "unconsciously_competent":
      return "Unconsciously competent";
  }
}

function bloomLabel(b: Bloom) {
  return b.charAt(0).toUpperCase() + b.slice(1);
}

export default function BackstagePage() {
  const router = useRouter();

  // V1: localStorage-backed events + light derived displays.
  // V2: Supabase events + derived aggregates.
  const [selectedSubject, setSelectedSubject] = useState<SubjectKey>("medicine");
  const [recentEvents, setRecentEvents] = useState(() => getRecentBackstageEvents(12));
  const [subjectStats, setSubjectStats] = useState(() => deriveSubjectStats(loadBackstageState().events));
  const [bloomCounts, setBloomCounts] = useState(() => countBlooms(loadBackstageState().events));
  const [recentCases, setRecentCases] = useState(() => getRecentCases(6));

  const [caseForm, setCaseForm] = useState({
    title: "",
    subject: "medicine" as SubjectKey,
    experience: "",
    reflection: "",
    concept: "",
    experiment: "",
    linkLibrary: "",
    linkMcq: "",
    linkNotes: "",
  });

  useEffect(() => {
    // refresh on mount
    setRecentEvents(getRecentBackstageEvents(12));
    const all = loadBackstageState().events;
    setSubjectStats(deriveSubjectStats(all));
    setBloomCounts(countBlooms(all));
    setRecentCases(getRecentCases(6));
  }, []);

  const saveCase = () => {
    if (!caseForm.title.trim()) return;

    const links = {
      library: caseForm.linkLibrary
        .split(/\s+/)
        .map((s) => s.trim())
        .filter(Boolean),
      mcq: caseForm.linkMcq
        .split(/\s+/)
        .map((s) => s.trim())
        .filter(Boolean),
      notes: caseForm.linkNotes
        .split(/\s+/)
        .map((s) => s.trim())
        .filter(Boolean),
    };

    addCaseLog({
      title: caseForm.title.trim(),
      subject: caseForm.subject,
      experience: caseForm.experience.trim() || undefined,
      reflection: caseForm.reflection.trim() || undefined,
      concept: caseForm.concept.trim() || undefined,
      experiment: caseForm.experiment.trim() || undefined,
      links: {
        library: links.library.length ? links.library : undefined,
        mcq: links.mcq.length ? links.mcq : undefined,
        notes: links.notes.length ? links.notes : undefined,
      },
    });

    // Also add a Backstage event so cases influence the cognitive graph.
    addBackstageEvent({
      type: "case",
      subject: caseForm.subject,
      topic: caseForm.title.trim(),
      bloom: "analyze",
      note: caseForm.concept.trim() || undefined,
    });

    setCaseForm({
      title: "",
      subject: caseForm.subject,
      experience: "",
      reflection: "",
      concept: "",
      experiment: "",
      linkLibrary: "",
      linkMcq: "",
      linkNotes: "",
    });
    setRecentCases(getRecentCases(6));
    setRecentEvents(getRecentBackstageEvents(12));
    const all = loadBackstageState().events;
    setSubjectStats(deriveSubjectStats(all));
    setBloomCounts(countBlooms(all));
  };

  const mock = useMemo(() => {
    // deterministic “feels real” placeholders for competence/strength until events are rich.
    const competency: Record<SubjectKey, CompetencyStage> = Object.fromEntries(
      SUBJECTS.map((s, i) => [
        s.key,
        (i % 4 === 0
          ? "consciously_incompetent"
          : i % 4 === 1
          ? "consciously_competent"
          : i % 4 === 2
          ? "unconsciously_incompetent"
          : "unconsciously_competent") as CompetencyStage,
      ])
    ) as Record<SubjectKey, CompetencyStage>;

    const strengthScore: Record<SubjectKey, number> = Object.fromEntries(
      SUBJECTS.map((s, i) => [s.key, 40 + ((i * 7) % 55)])
    ) as Record<SubjectKey, number>;

    const bloomMix: Bloom[] = ["remember", "understand", "apply", "analyze"];

    return { competency, strengthScore, bloomMix };
  }, []);

  const strongSubjects = useMemo(() => {
    return [...SUBJECTS]
      .sort((a, b) => mock.strengthScore[b.key] - mock.strengthScore[a.key])
      .slice(0, 3);
  }, [mock.strengthScore]);

  const weakSubjects = useMemo(() => {
    return [...SUBJECTS]
      .sort((a, b) => mock.strengthScore[a.key] - mock.strengthScore[b.key])
      .slice(0, 3);
  }, [mock.strengthScore]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Fingerprint className="h-4 w-4" /> Cognitive OS
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
            Backstage
          </h1>
          <div className="mt-1 text-sm text-muted-foreground">
            Your private layer: competency, confidence, reflection, and case logbook.
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => router.push("/dashboard")}>
            Back to Desk
          </Button>
          <Button onClick={() => router.push("/notes")}>Open Notes</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* Left: big analysis */}
        <div className="md:col-span-8 space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" /> Self-analysis
                </span>
                <Badge variant="secondary">V1 scaffold</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">Strong vs weak (derived)</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Based on your events (MCQs + confidence). This will get smarter with spacing + trends.
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSubjectStats(deriveSubjectStats(loadBackstageState().events))}
                  >
                    Refresh
                  </Button>
                </div>

                {subjectStats.length === 0 ? (
                  <div className="mt-3 text-sm text-muted-foreground">
                    No data yet. Do a few MCQs — Backstage will start ranking strong/weak subjects.
                  </div>
                ) : (
                  <div className="mt-3 space-y-2">
                    {subjectStats.slice(0, 6).map((s) => (
                      <div key={s.subject} className="flex items-center justify-between gap-3 rounded-md border bg-background/40 p-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="truncate text-sm font-medium">{s.subject}</div>
                            <Badge variant="outline">{stageLabel(s.stage)}</Badge>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {s.mcqAttempts > 0
                              ? `MCQs: ${s.mcqCorrect}/${s.mcqAttempts} • Acc: ${s.accuracyPct}% • Conf: ${s.avgConfidence ?? "—"}% • Gap: ${s.calibrationGap ?? "—"}`
                              : `Events: ${s.events} • Not tested yet`}
                          </div>
                        </div>
                        <Button size="sm" variant="secondary" onClick={() => router.push(`/library/${s.subject}`)}>
                          Open
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Target className="h-4 w-4 text-primary" /> Competency ladder
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-xs text-muted-foreground">Current subject</div>
                    <Tabs
                      value={selectedSubject}
                      onValueChange={(v) => setSelectedSubject(v as SubjectKey)}
                    >
                      <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
                        <TabsTrigger value="medicine">Med</TabsTrigger>
                        <TabsTrigger value="surgery">Surg</TabsTrigger>
                        <TabsTrigger value="obgyn">OBG</TabsTrigger>
                        <TabsTrigger value="pediatrics">Peds</TabsTrigger>
                        <TabsTrigger value="pathology">Path</TabsTrigger>
                      </TabsList>
                    </Tabs>

                    <div className="mt-3 rounded-lg border p-3">
                      <div className="text-sm font-medium">{stageLabel(mock.competency[selectedSubject])}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        V2: derived from events (MCQ accuracy + confidence + repetition + time).
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Lightbulb className="h-4 w-4 text-primary" /> Bloom tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      On demand tags for the learning you just did.
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {mock.bloomMix.map((b) => (
                        <Badge key={b} variant="outline">
                          {bloomLabel(b)}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="mt-2"
                      onClick={() => router.push("/library")}
                    >
                      Tag a topic <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardList className="h-4 w-4 text-primary" /> Kolb cycle + Logbook
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                V1 placeholder. V2 will include:
                <ul className="mt-2 list-disc pl-5">
                  <li>Case seen → Reflection → Concept → Next experiment</li>
                  <li>Links to Notes, Library topics, MCQ sets</li>
                  <li>Competency stage progression over time</li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => router.push("/notes")}>New reflection</Button>
                <Button variant="secondary" onClick={() => router.push("/exam-centre")}>Re-test (MCQ)</Button>
                <Button onClick={() => router.push("/library")}>Read</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: quick entry */}
        <div className="md:col-span-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between gap-3 text-base">
                <span>Calibration</span>
                <Button size="sm" variant="secondary" onClick={() => router.push("/backstage/calibration")}>
                  Open
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Confidence vs accuracy — reduce overconfidence, stabilize competence.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="secondary" onClick={() => router.push("/library")}
              >
                <BookOpen className="mr-2 h-4 w-4" /> Open Library
              </Button>
              <Button className="w-full justify-start" variant="secondary" onClick={() => router.push("/exam-centre")}
              >
                <Target className="mr-2 h-4 w-4" /> Practice MCQs
              </Button>
              <Button className="w-full justify-start" variant="secondary" onClick={() => router.push("/analytics")}
              >
                <BarChart3 className="mr-2 h-4 w-4" /> Analytics
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between gap-3 text-base">
                <span>Logbook</span>
                <Button size="sm" variant="secondary" onClick={() => router.push("/backstage/logbook")}>
                  Open
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-muted-foreground">
                Default format: <span className="font-medium text-foreground">M/56 Chest pain</span> (no identifiers).
              </div>

              <Input
                placeholder="M/56 Chest pain"
                value={caseForm.title}
                onChange={(e) => setCaseForm((p) => ({ ...p, title: e.target.value }))}
              />

              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Subject</div>
                <Select
                  value={caseForm.subject}
                  onValueChange={(v) => setCaseForm((p) => ({ ...p, subject: v as SubjectKey }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s.key} value={s.key}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                placeholder="Concrete Experience: what happened?"
                value={caseForm.experience}
                onChange={(e) => setCaseForm((p) => ({ ...p, experience: e.target.value }))}
              />
              <Textarea
                placeholder="Reflection: what confused you / what went wrong?"
                value={caseForm.reflection}
                onChange={(e) => setCaseForm((p) => ({ ...p, reflection: e.target.value }))}
              />
              <Textarea
                placeholder="Concept: the principle you learned"
                value={caseForm.concept}
                onChange={(e) => setCaseForm((p) => ({ ...p, concept: e.target.value }))}
              />
              <Textarea
                placeholder="Experiment: what will you do next time?"
                value={caseForm.experiment}
                onChange={(e) => setCaseForm((p) => ({ ...p, experiment: e.target.value }))}
              />

              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Attach links (optional)</div>
                <Input
                  placeholder="Library link(s) (space separated)"
                  value={caseForm.linkLibrary}
                  onChange={(e) => setCaseForm((p) => ({ ...p, linkLibrary: e.target.value }))}
                />
                <Input
                  placeholder="MCQ link(s) (space separated)"
                  value={caseForm.linkMcq}
                  onChange={(e) => setCaseForm((p) => ({ ...p, linkMcq: e.target.value }))}
                />
                <Input
                  placeholder="Notes link(s) (space separated)"
                  value={caseForm.linkNotes}
                  onChange={(e) => setCaseForm((p) => ({ ...p, linkNotes: e.target.value }))}
                />
              </div>

              <Button className="w-full" onClick={saveCase}>
                Save case
              </Button>

              {recentCases.length > 0 ? (
                <div className="pt-2">
                  <div className="mb-2 text-xs text-muted-foreground">Recent cases</div>
                  <div className="space-y-2">
                    {recentCases.map((c) => (
                      <div key={c.id} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium">{c.title}</div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {subjectLabel(c.subject)} • {new Date(c.createdAt).toLocaleString()}
                              {c.links?.library?.length || c.links?.mcq?.length || c.links?.notes?.length ? (
                                <span className="ml-2">• links</span>
                              ) : null}
                            </div>
                          </div>
                          <Badge variant="outline">Case</Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    size="sm"
                    variant="secondary"
                    className="mt-2 w-full"
                    onClick={() => setRecentCases(getRecentCases(6))}
                  >
                    Refresh cases
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentEvents.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No events yet. Do an MCQ or read a topic — we’ll start building your cognitive map.
                </div>
              ) : (
                <div className="space-y-2">
                  {recentEvents.map((e) => (
                    <div key={e.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-medium">
                          {e.type.toUpperCase()} • {e.subject}
                        </div>
                        {typeof e.confidence === "number" ? (
                          <Badge variant="outline">{e.confidence}%</Badge>
                        ) : null}
                      </div>
                      {e.topic ? (
                        <div className="mt-1 text-xs text-muted-foreground">{e.topic}</div>
                      ) : null}
                      {typeof e.mcq?.correct === "boolean" ? (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Result: {e.mcq.correct ? "Correct" : "Wrong"}
                          {e.mcq.difficulty ? ` • ${e.mcq.difficulty}` : ""}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}

              <Button
                size="sm"
                variant="secondary"
                className="mt-2"
                onClick={() => setRecentEvents(getRecentBackstageEvents(12))}
              >
                Refresh
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Bloom distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">
                What kind of thinking you’re training (remember → create).
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="mt-2"
                onClick={() => router.push("/backstage/quests")}
              >
                Open Quests
              </Button>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(bloomCounts) as Array<keyof typeof bloomCounts>).map((k) => (
                  <Badge key={k} variant="outline">
                    {k}: {bloomCounts[k]}
                  </Badge>
                ))}
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="mt-2"
                onClick={() => setBloomCounts(countBlooms(loadBackstageState().events))}
              >
                Refresh
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Roadmap</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="rounded-lg border bg-muted/20 p-3">V1: capture events (localStorage)</div>
              <div className="rounded-lg border bg-muted/20 p-3">V2: Supabase events → derived competence/confidence</div>
              <div className="rounded-lg border bg-muted/20 p-3">V3: Case logbook + Kolb loop automation</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
