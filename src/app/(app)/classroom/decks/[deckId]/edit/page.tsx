"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addSlide, getDeck, updateSlide, upsertDeck } from "@/lib/decks/store";

export default function DeckEditPage() {
  const params = useParams<{ deckId: string }>();
  const deckId = params.deckId;
  const initial = useMemo(() => getDeck(deckId), [deckId]);
  const [deck, setDeck] = useState(initial);
  const [selectedId, setSelectedId] = useState(initial?.slides[0]?.slideId);

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
          </CardHeader>
          <CardContent className="space-y-2">
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
