'use client';

import { useEffect, useMemo, useState } from 'react';

type Session = {
  sessionId: string;
  topic: string;
  level: string;
  goal: string;
  status: string;
  currentStep: string;
  weakConcepts: string[];
  retrievalCheckpoint: { dueAt: string[] };
};

const DEFAULT_INPUT = { accuracyPct: 70, hintCount: 0, avgResponseSec: 25, confidenceSelf: 3, elapsedSec: 0 };

export default function GuidedDeepDiveExperience() {
  const [session, setSession] = useState<Session | null>(null);
  const [topic, setTopic] = useState('Acute pancreatitis management');
  const [level, setLevel] = useState('resident');
  const [goal, setGoal] = useState('Build bedside-ready decision confidence');
  const [input, setInput] = useState(DEFAULT_INPUT);

  const sessionIdFromUrl = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return new URLSearchParams(window.location.search).get('sessionId');
  }, []);

  useEffect(() => {
    if (!sessionIdFromUrl) return;
    fetch(`/api/atom-v3/gdd/${sessionIdFromUrl}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setSession(data?.session ?? null))
      .catch(() => undefined);
  }, [sessionIdFromUrl]);

  async function start() {
    const res = await fetch('/api/atom-v3/gdd/start', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ topic, level, goal }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setSession(data.session);
    window.history.replaceState({}, '', `/atom-v3/gdd?sessionId=${data.session.sessionId}`);
  }

  async function advance(partial?: Partial<typeof DEFAULT_INPUT>) {
    if (!session) return;
    const payload = { ...input, ...partial };
    const res = await fetch(`/api/atom-v3/gdd/${session.sessionId}/advance`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return;
    const data = await res.json();
    setSession(data.session);
    setInput(payload);
  }

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Guided Deep Dive</h1>
      {!session ? (
        <section className="space-y-2 rounded border p-4">
          <p className="text-sm text-muted-foreground">Doctor-first launch setup</p>
          <input className="w-full rounded border p-2" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic" />
          <input className="w-full rounded border p-2" value={level} onChange={(e) => setLevel(e.target.value)} placeholder="Level" />
          <input className="w-full rounded border p-2" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Goal" />
          <button className="rounded bg-black px-3 py-2 text-white" onClick={start}>Launch session</button>
        </section>
      ) : (
        <>
          <section className="rounded border p-4">
            <p><strong>Status:</strong> {session.status}</p>
            <p><strong>Current step:</strong> {session.currentStep}</p>
            <p><strong>Weak concepts:</strong> {session.weakConcepts.join(', ') || '—'}</p>
          </section>

          <section className="grid grid-cols-2 gap-2 rounded border p-4">
            <button className="rounded border px-3 py-2" onClick={() => advance({ accuracyPct: 60, confidenceSelf: 2 })}>Simplify</button>
            <button className="rounded border px-3 py-2" onClick={() => advance({ accuracyPct: 88, confidenceSelf: 4 })}>Challenge me</button>
            <button className="rounded border px-3 py-2" onClick={() => advance({ accuracyPct: 45, hintCount: 2, confidenceSelf: 4 })}>I’m confused</button>
            <button className="rounded border px-3 py-2" onClick={() => advance({ elapsedSec: 0 })}>Pause/End</button>
          </section>

          <section className="rounded border p-4">
            <h2 className="font-medium">Follow-up queue</h2>
            <ul className="list-disc pl-6">
              {(session.retrievalCheckpoint?.dueAt ?? []).map((dueAt) => (
                <li key={dueAt}>{new Date(dueAt).toLocaleString()}</li>
              ))}
            </ul>
          </section>
        </>
      )}
    </main>
  );
}
