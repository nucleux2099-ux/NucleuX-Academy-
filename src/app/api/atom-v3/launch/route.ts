import { NextRequest, NextResponse } from 'next/server';
import {
  normalizeQuickStartFormInput,
  validateQuickStartFormInput,
  type QuickStartFormInput,
  type QuickStartMode,
} from '@/lib/atom/quick-start-schema';

type LaunchResponse = {
  workflow: string;
  launchPath: string;
  message: string;
};

function toQuery(payload: QuickStartFormInput): string {
  const params = new URLSearchParams({
    mode: payload.mode,
    topic: payload.topic,
    level: payload.level,
    timeAvailable: String(payload.timeAvailable),
    goal: payload.goal,
  });

  if (payload.advanced?.preferredFormat) params.set('preferredFormat', payload.advanced.preferredFormat);
  if (typeof payload.advanced?.includeReferences === 'boolean') params.set('includeReferences', String(payload.advanced.includeReferences));
  if (payload.advanced?.clinicalContext) params.set('clinicalContext', payload.advanced.clinicalContext);

  return params.toString();
}

const MODE_HANDLERS: Record<QuickStartMode, (payload: QuickStartFormInput) => Promise<LaunchResponse>> = {
  ppt: async (payload) => ({
    workflow: 'ppt',
    launchPath: `/chat?${toQuery(payload)}`,
    message: 'PPT workflow prepared. Open chat to generate your deck outline.',
  }),
  'nucleux-original': async (payload) => ({
    workflow: 'nucleux-original',
    launchPath: `/chat?${toQuery(payload)}`,
    message: 'NucleuX Original workflow launched.',
  }),
  mcq: async (payload) => ({
    workflow: 'mcq',
    launchPath: `/mcqs?${toQuery(payload)}`,
    message: 'MCQ workflow launched.',
  }),
  flashcards: async (payload) => ({
    workflow: 'flashcards',
    launchPath: `/chat?${toQuery(payload)}`,
    message: 'Flashcards workflow launched.',
  }),
  'excel-analysis': async (payload) => ({
    workflow: 'excel-analysis',
    launchPath: `/chat?${toQuery(payload)}`,
    message: 'Excel analysis workflow launched.',
  }),
  'guided-deep-dive': async (payload) => ({
    workflow: 'guided-deep-dive',
    launchPath: `/chat?${toQuery(payload)}`,
    message: 'Guided deep dive workflow launched.',
  }),
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const normalized = normalizeQuickStartFormInput(body);
    const validated = validateQuickStartFormInput(normalized);

    if (!validated.ok) {
      return NextResponse.json({ error: 'Invalid quick start input', details: validated.errors }, { status: 400 });
    }

    const response = await MODE_HANDLERS[validated.data.mode](validated.data);
    return NextResponse.json({
      payload: validated.data,
      ...response,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to launch ATOM v3 workflow',
      },
      { status: 500 },
    );
  }
}
