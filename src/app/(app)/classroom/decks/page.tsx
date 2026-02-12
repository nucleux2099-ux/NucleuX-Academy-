"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { createDeck, loadDecks, saveDecks } from "@/lib/decks/store";
import { demoDecks } from "@/lib/decks/seed";
import type { Deck } from "@/lib/decks/types";

export default function DecksIndexPage() {
  const [title, setTitle] = useState("");
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    const existing = loadDecks();
    if (existing.length === 0) {
      saveDecks(demoDecks);
      setDecks(demoDecks);
    } else {
      setDecks(existing);
    }
  }, []);

  const sorted = useMemo(() => {
    return [...decks].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }, [decks]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#E8E0D5]">🗂️ Slide Decks</h1>
          <p className="text-sm text-[#A0B0BC]">PowerPoint-like decks inside Classroom</p>
        </div>
        <Link href="/classroom">
          <Button variant="outline">Back to Classroom</Button>
        </Link>
      </div>

      <Card className="border-[rgba(91,179,179,0.15)] bg-[#364A5E]">
        <CardHeader>
          <CardTitle className="text-[#E8E0D5] text-base">Create a new deck</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Deck title (e.g., Acute Pancreatitis)"
            className="max-w-md"
          />
          <Button
            onClick={() => {
              const d = createDeck({ title });
              setDecks([d, ...loadDecks().filter((x) => x.deckId !== d.deckId)]);
              setTitle("");
            }}
          >
            Create
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              saveDecks(demoDecks);
              setDecks(demoDecks);
            }}
          >
            Reset demo
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map((deck) => (
          <Card key={deck.deckId} className="border-[rgba(91,179,179,0.15)] bg-[#364A5E]">
            <CardHeader>
              <CardTitle className="text-[#E8E0D5] text-base">{deck.title}</CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                {deck.topicId ? (
                  <Badge variant="outline" className="text-[#A0B0BC]">topicId: {deck.topicId}</Badge>
                ) : (
                  <Badge variant="outline" className="text-[#A0B0BC]">no topic linked</Badge>
                )}
                <Badge className="bg-[rgba(14,165,233,0.15)] text-[#6BA8C9] border-none">
                  {deck.slides.length} slides
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Link href={`/classroom/decks/${deck.deckId}`}>
                <Button>Open</Button>
              </Link>
              <Link href={`/classroom/decks/${deck.deckId}/edit`}>
                <Button variant="outline">Edit</Button>
              </Link>
              <Link href={`/classroom/decks/${deck.deckId}/present`}>
                <Button variant="outline">Present</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
