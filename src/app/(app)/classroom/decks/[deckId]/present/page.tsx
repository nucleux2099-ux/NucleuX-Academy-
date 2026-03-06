"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDeck } from "@/lib/decks/store";
import { logDeckView, logSlideView } from "@/lib/backstage/decks";

export default function DeckPresentPage() {
  const params = useParams<{ deckId: string }>();
  const deckId = params.deckId;
  const deck = useMemo(() => getDeck(deckId), [deckId]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!deck) return;
    logDeckView({ deckId: deck.deckId, deckTitle: deck.title, topicId: deck.topicId });
  }, [deck]);

  useEffect(() => {
    if (!deck) return;
    const slides = [...deck.slides].sort((a, b) => a.order - b.order);
    const current = slides[Math.max(0, Math.min(idx, slides.length - 1))];
    if (!current) return;
    logSlideView({
      deckId: deck.deckId,
      deckTitle: deck.title,
      slideOrder: current.order,
      slideHeading: current.heading,
      topicId: deck.topicId,
    });
  }, [deck, idx]);

  if (!deck) {
    return (
      <div className="space-y-4">
        <p className="text-[#A0B0BC]">Deck not found.</p>
        <Link href="/classroom/decks"><Button>Back</Button></Link>
      </div>
    );
  }

  const slides = [...deck.slides].sort((a, b) => a.order - b.order);
  const slide = slides[Math.max(0, Math.min(idx, slides.length - 1))];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-bold text-[#E8E0D5]">Present: {deck.title}</h1>
            <p className="text-sm text-[#A0B0BC]">Slide {idx + 1} / {slides.length}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/classroom/decks/${deckId}`}><Button variant="outline">Exit</Button></Link>
          </div>
        </div>

        <Card className="border-[rgba(91,179,179,0.15)] bg-[#364A5E] min-h-[420px]">
          <CardHeader>
            <CardTitle className="text-[#E8E0D5] text-xl">{slide.heading}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-3 text-[#A0B0BC] text-lg">
              {slide.bullets.filter(Boolean).map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setIdx((v) => Math.max(0, v - 1))}>Prev</Button>
          <Button onClick={() => setIdx((v) => Math.min(slides.length - 1, v + 1))}>Next</Button>
        </div>
      </div>

      <Card className="border-[rgba(91,179,179,0.15)] bg-[#364A5E]">
        <CardHeader>
          <CardTitle className="text-[#E8E0D5] text-base">Speaker notes</CardTitle>
        </CardHeader>
        <CardContent className="text-[#A0B0BC] whitespace-pre-wrap">
          {slide.speakerNotes?.trim() ? slide.speakerNotes : "(none)"}
        </CardContent>
      </Card>
    </div>
  );
}
