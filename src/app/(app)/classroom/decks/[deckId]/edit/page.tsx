"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addSlide, getDeck, updateSlide, upsertDeck } from "@/lib/decks/store";
import { loadTemplates, saveTemplates } from "@/lib/templates/store";
import { defaultTemplates } from "@/lib/templates/seed";
import type { SlideTemplatePayload, Template } from "@/lib/templates/types";

export default function DeckEditPage() {
  const params = useParams<{ deckId: string }>();
  const deckId = params.deckId;
  const initial = useMemo(() => getDeck(deckId), [deckId]);
  const [deck, setDeck] = useState(initial);
  const [selectedId, setSelectedId] = useState(initial?.slides[0]?.slideId);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateId, setTemplateId] = useState<string>("");

  if (!deck) {
    return (
      <div className="space-y-4">
        <p className="text-[#A0B0BC]">Deck not found.</p>
        <Link href="/classroom/decks"><Button>Back</Button></Link>
      </div>
    );
  }

  const slides = [...deck.slides].sort((a, b) => a.order - b.order);
  const slide = slides.find((s) => s.slideId === selectedId) ?? slides[0];

  useEffect(() => {
    const existing = loadTemplates();
    if (existing.length === 0) {
      saveTemplates(defaultTemplates);
      setTemplates(defaultTemplates);
    } else {
      setTemplates(existing);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-[#E8E0D5]">Edit: {deck.title}</h1>
          <p className="text-sm text-[#A0B0BC]">{slides.length} slides</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href={`/classroom/decks/${deckId}`}><Button variant="outline">View</Button></Link>
          <Link href={`/classroom/decks/${deckId}/present`}><Button>Present</Button></Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border-[rgba(91,179,179,0.15)] bg-[#364A5E]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[#E8E0D5] text-base">Slides</CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // Quick insert: selected template → new slide
                  const t = templates.find((x) => x.templateId === templateId);
                  if (!t || t.kind !== "slide") return;
                  const payload = t.payload as SlideTemplatePayload;
                  const nextOrder = (deck.slides.at(-1)?.order ?? 0) + 1;
                  const nextSlide = {
                    slideId: `${deck.deckId}_s${nextOrder}`,
                    order: nextOrder,
                    heading: payload.heading,
                    bullets: payload.bullets,
                    speakerNotes: payload.speakerNotes,
                    layout: "bullets" as const,
                  };
                  const updatedDeck = { ...deck, slides: [...deck.slides, nextSlide] };
                  upsertDeck(updatedDeck);
                  setDeck(updatedDeck);
                  setSelectedId(nextSlide.slideId);
                }}
              >
                Insert template
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  const updated = addSlide(deck);
                  setDeck(updated);
                  setSelectedId(updated.slides.at(-1)?.slideId);
                }}
              >
                + Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <div className="text-xs text-[#A0B0BC]">Template</div>
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                className="w-full px-3 py-2 bg-[#3A4D5F] border border-[rgba(91,179,179,0.15)] rounded-lg text-sm text-[#E8E0D5]"
              >
                <option value="">Select…</option>
                {templates.filter((t) => t.kind === "slide").map((t) => (
                  <option key={t.templateId} value={t.templateId}>
                    {t.title}
                  </option>
                ))}
              </select>
              <Link href="/classroom/templates" className="text-xs text-[#6BA8C9] underline">
                Manage templates
              </Link>
            </div>
            {slides.map((s) => (
              <button
                key={s.slideId}
                onClick={() => setSelectedId(s.slideId)}
                className={`w-full text-left rounded-lg px-3 py-2 border ${s.slideId === slide.slideId ? "border-[#6BA8C9] bg-[rgba(14,165,233,0.1)]" : "border-[rgba(91,179,179,0.15)] hover:bg-[#3A4D5F]"}`}
              >
                <div className="text-sm text-[#E8E0D5]">{s.order}. {s.heading}</div>
                <div className="text-xs text-[#A0B0BC]">{s.bullets.filter(Boolean).length} bullets</div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-[rgba(91,179,179,0.15)] bg-[#364A5E]">
          <CardHeader>
            <CardTitle className="text-[#E8E0D5] text-base">Slide editor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={slide.heading}
              onChange={(e) => {
                const updated = updateSlide(deck, { ...slide, heading: e.target.value });
                setDeck(updated);
              }}
              placeholder="Heading"
            />
            <Textarea
              value={slide.bullets.join("\n")}
              onChange={(e) => {
                const bullets = e.target.value.split("\n");
                const updated = updateSlide(deck, { ...slide, bullets });
                setDeck(updated);
              }}
              placeholder="One bullet per line"
              rows={10}
            />
            <Textarea
              value={slide.speakerNotes ?? ""}
              onChange={(e) => {
                const updated = updateSlide(deck, { ...slide, speakerNotes: e.target.value });
                setDeck(updated);
              }}
              placeholder="Speaker notes (optional)"
              rows={5}
            />
            <div className="flex gap-2">
              <Link href={`/classroom/decks/${deckId}`}><Button variant="outline">Done</Button></Link>
              <Button
                variant="outline"
                onClick={() => {
                  upsertDeck({ ...deck, title: deck.title });
                }}
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
