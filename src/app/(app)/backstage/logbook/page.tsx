"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, ClipboardList, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { SubjectKey } from "@/lib/backstage/types";
import { addBackstageEvent } from "@/lib/backstage/store";
import { addCaseLog, getRecentCases, subjectLabel } from "@/lib/backstage/case-store";

const SUBJECTS: Array<{ key: SubjectKey; label: string }> = [
  { key: "medicine", label: "Medicine" },
  { key: "surgery", label: "Surgery" },
  { key: "obgyn", label: "OBGYN" },
  { key: "pediatrics", label: "Pediatrics" },
  { key: "orthopedics", label: "Orthopedics" },
  { key: "anatomy", label: "Anatomy" },
  { key: "physiology", label: "Physiology" },
  { key: "biochemistry", label: "Biochemistry" },
  { key: "pathology", label: "Pathology" },
  { key: "pharmacology", label: "Pharmacology" },
  { key: "microbiology", label: "Microbiology" },
  { key: "psm", label: "PSM" },
  { key: "ent", label: "ENT" },
  { key: "ophthalmology", label: "Ophthalmology" },
  { key: "forensic", label: "Forensic" },
  { key: "unknown", label: "Other" },
];

export default function BackstageLogbookPage() {
  const router = useRouter();
  const [recentCases, setRecentCases] = useState(() => getRecentCases(20));

  const [form, setForm] = useState({
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
    setRecentCases(getRecentCases(20));
  }, []);

  const save = () => {
    if (!form.title.trim()) return;

    const split = (s: string) => s.split(/\s+/).map((x) => x.trim()).filter(Boolean);
    const links = {
      library: split(form.linkLibrary),
      mcq: split(form.linkMcq),
      notes: split(form.linkNotes),
    };

    addCaseLog({
      title: form.title.trim(),
      subject: form.subject,
      experience: form.experience.trim() || undefined,
      reflection: form.reflection.trim() || undefined,
      concept: form.concept.trim() || undefined,
      experiment: form.experiment.trim() || undefined,
      links: {
        library: links.library.length ? links.library : undefined,
        mcq: links.mcq.length ? links.mcq : undefined,
        notes: links.notes.length ? links.notes : undefined,
      },
    });

    addBackstageEvent({
      type: "case",
      subject: form.subject,
      // cases may not map to a CBME topic yet; keep optional until we add topic linking
      topic: form.title.trim(),
      bloom: "analyze",
      note: form.concept.trim() || undefined,
    });

    setForm({
      ...form,
      title: "",
      experience: "",
      reflection: "",
      concept: "",
      experiment: "",
      linkLibrary: "",
      linkMcq: "",
      linkNotes: "",
    });
    setRecentCases(getRecentCases(20));
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ClipboardList className="h-4 w-4" /> Backstage / Logbook
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Logbook</h1>
          <div className="mt-1 text-sm text-muted-foreground">
            Cases + Kolb cycle (experience → reflection → concept → experiment).
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => router.push("/backstage")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Backstage
          </Button>
          <Button variant="secondary" onClick={() => router.push("/library")}
          >
            <BookOpen className="mr-2 h-4 w-4" /> Library
          </Button>
          <Button variant="secondary" onClick={() => router.push("/exam-centre")}
          >
            <Target className="mr-2 h-4 w-4" /> MCQs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <Card className="md:col-span-5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">New case</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs text-muted-foreground">
              Default format: <span className="font-medium text-foreground">M/56 Chest pain</span> (no identifiers).
            </div>

            <Input
              placeholder="M/56 Chest pain"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            />

            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Subject</div>
              <Select
                value={form.subject}
                onValueChange={(v) => setForm((p) => ({ ...p, subject: v as SubjectKey }))}
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
              value={form.experience}
              onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))}
            />
            <Textarea
              placeholder="Reflection: what confused you / what went wrong?"
              value={form.reflection}
              onChange={(e) => setForm((p) => ({ ...p, reflection: e.target.value }))}
            />
            <Textarea
              placeholder="Concept: the principle you learned"
              value={form.concept}
              onChange={(e) => setForm((p) => ({ ...p, concept: e.target.value }))}
            />
            <Textarea
              placeholder="Experiment: what will you do next time?"
              value={form.experiment}
              onChange={(e) => setForm((p) => ({ ...p, experiment: e.target.value }))}
            />

            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Attach links (optional)</div>
              <Input
                placeholder="Library link(s) (space separated)"
                value={form.linkLibrary}
                onChange={(e) => setForm((p) => ({ ...p, linkLibrary: e.target.value }))}
              />
              <Input
                placeholder="MCQ link(s) (space separated)"
                value={form.linkMcq}
                onChange={(e) => setForm((p) => ({ ...p, linkMcq: e.target.value }))}
              />
              <Input
                placeholder="Notes link(s) (space separated)"
                value={form.linkNotes}
                onChange={(e) => setForm((p) => ({ ...p, linkNotes: e.target.value }))}
              />
            </div>

            <Button className="w-full" onClick={save}>Save case</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-7">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent cases</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentCases.length === 0 ? (
              <div className="text-sm text-muted-foreground">No cases yet.</div>
            ) : (
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
            )}

            <Button variant="secondary" size="sm" className="mt-2" onClick={() => setRecentCases(getRecentCases(20))}>
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
