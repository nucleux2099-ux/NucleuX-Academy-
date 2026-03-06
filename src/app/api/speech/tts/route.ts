import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sarvamTextToSpeech, type SarvamTtsOptions } from '@/lib/speech/sarvam';

export const runtime = 'nodejs';
const ALLOWED_LANGUAGE_CODES = ['en-IN', 'te-IN', 'hi-IN'] as const;

function isAllowedLanguageCode(value: unknown): value is SarvamTtsOptions['target_language_code'] {
  return typeof value === 'string' && ALLOWED_LANGUAGE_CODES.includes(value as (typeof ALLOWED_LANGUAGE_CODES)[number]);
}

// POST /api/speech/tts
// body: { text, target_language_code, speaker?, pace?, temperature? }
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const text = body?.text;
    const target_language_code = body?.target_language_code;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 });
    }
    if (!target_language_code) {
      return NextResponse.json({ error: 'Missing target_language_code' }, { status: 400 });
    }
    if (!isAllowedLanguageCode(target_language_code)) {
      return NextResponse.json({ error: 'Invalid target_language_code' }, { status: 400 });
    }

    const options: SarvamTtsOptions = {
      model: 'bulbul:v3',
      target_language_code,
      speaker: body?.speaker,
      pace: body?.pace,
      temperature: body?.temperature,
      speech_sample_rate: body?.speech_sample_rate,
    };
    const result = await sarvamTextToSpeech(text, options);

    return NextResponse.json({
      request_id: result.request_id ?? null,
      audio_base64: result.audios?.[0] ?? null,
      audios: result.audios ?? [],
    });
  } catch (e: unknown) {
    console.error('TTS error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'TTS failed' },
      { status: 500 }
    );
  }
}
