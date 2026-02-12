"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { createSlideTemplate, deleteTemplate, loadTemplates, saveTemplates } from "@/lib/templates/store";
import { defaultTemplates } from "@/lib/templates/seed";
import type { Template } from "@/lib/templates/types";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [title, setTitle] = useState("");
  const [heading, setHeading] = useState("");
  const [bulletsText, setBulletsText] = useState("Bullet 1\nBullet 2\nBullet 3");
  const [speakerNotes, setSpeakerNotes] = useState("");

  useEffect(() => {
    const existing = loadTemplates();
    if (existing.length === 0) {
      saveTemplates(defaultTemplates);
      setTemplates(defaultTemplates);
    } else {
      setTemplates(existing);
    }
  }, []);

  const slideTemplates = useMemo(() => templates.filter((t) => t.kind === "slide"), [templates]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-[#E8E0D5]">🧩 Templates</h1>
          <p className="text-sm text-[#A0B0BC]">Reusable blocks ("common placebo") for decks and notes</p>
        </div>
        <div className="flex gap-2">
          <Link href="/classroom/decks"><Button variant="outline">Back to Decks</Button></Link>
          <Link href="/classroom"><Button variant="outline">Classroom</Button></Link>
        </div>
      </div>

      <Card className="border-[rgba(91,179,179,0.15)] bg-[#364A5E]">
        <CardHeader>
          <CardTitle className="text-[#E8E0D5] text-base">Create Slide Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Template title" />
          <Input value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="Slide heading" />
          <Textarea value={bulletsText} onChange={(e) => setBulletsText(e.target.value)} rows={6} placeholder="One bullet per line" />
          <Textarea value={speakerNotes} onChange={(e) => setSpeakerNotes(e.target.value)} rows={4} placeholder="Speaker notes (optional)" />
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => {
                const bullets = bulletsText.split("\n").map((x) => x.trim()).filter(Boolean);
                const t = createSlideTemplate({
                  title,
                  heading: heading || title || "Slide",
                  bullets,
                  speakerNotes: speakerNotes || undefined,
                });
                setTemplates([t, ...loadTemplates().filter((x) => x.templateId !== t.templateId)]);
                setTitle("");
                setHeading("");
                setSpeakerNotes("");
              }}
            >
              Create
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                saveTemplates(defaultTemplates);
                setTemplates(defaultTemplates);
              }}
            >
              Reset defaults
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slideTemplates.map((t) => (
          <Card key={t.templateId} className="border-[rgba(91,179,179,0.15)] bg-[#364A5E]">
            <CardHeader>
              <CardTitle className="text-[#E8E0D5] text-base">{t.title}</CardTitle>
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-[rgba(14,165,233,0.15)] text-[#6BA8C9] border-none">{t.kind}</Badge>
                <Badge variant="outline" className="text-[#A0B0BC]">{t.templateId}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                onClick={() => {
                  deleteTemplate(t.templateId);
                  setTemplates(loadTemplates());
                }}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
