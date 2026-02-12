"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDeck } from "@/lib/decks/store";
import { logDeckView, logSlideView } from "@/lib/backstage/decks";

export default function DeckViewPage() {
  const params = useParams<{ deckId: string }>();
  const deckId = params.deckId;
  const deck = useMemo(() => getDeck(deckId), [deckId]);
  const [idx, setIdx] = useState(0);

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

  useEffect(() => {
    logDeckView({ deckId: deck.deckId, deckTitle: deck.title, topicId: deck.topicId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck.deckId]);

  useEffect(() => {
    const current = slides[Math.max(0, Math.min(idx, slides.length - 1))];
    if (!current) return;
    logSlideView({
      deckId: deck.deckId,
      deckTitle: deck.title,
      slideOrder: current.order,
      slideHeading: current.heading,
      topicId: deck.topicId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-[#E8E0D5]">{deck.title}</h1>
          <p className="text-sm text-[#A0B0BC]">Slide {idx + 1} / {slides.length}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href="/classroom/decks"><Button variant="outline">All decks</Button></Link>
          <Link href={`/classroom/decks/${deckId}/edit`}><Button variant="outline">Edit</Button></Link>
          <Link href={`/classroom/decks/${deckId}/present`}><Button>Present</Button></Link>
        </div>
      </div>

      <Card className="border-[rgba(91,179,179,0.15)] bg-[#364A5E]">
        <CardHeader>
          <CardTitle className="text-[#E8E0D5]">{slide.heading}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-[#A0B0BC]">
            {slide.bullets.filter(Boolean).map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setIdx((v) => Math.max(0, v - 1))}>
          Prev
        </Button>
        <Button onClick={() => setIdx((v) => Math.min(slides.length - 1, v + 1))}>
          Next
        </Button>
      </div>
    </div>
  );
}
