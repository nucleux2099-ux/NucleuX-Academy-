import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sarvamTextToSpeech } from '@/lib/speech/sarvam';

export const runtime = 'nodejs';

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
    if (!target_language_code || typeof target_language_code !== 'string') {
      return NextResponse.json({ error: 'Missing target_language_code' }, { status: 400 });
    }

    const result = await sarvamTextToSpeech(text, {
      model: 'bulbul:v3',
      target_language_code: target_language_code as any,
      speaker: body?.speaker,
      pace: body?.pace,
      temperature: body?.temperature,
      speech_sample_rate: body?.speech_sample_rate,
    });

    return NextResponse.json({
      request_id: result.request_id ?? null,
      audio_base64: result.audios?.[0] ?? null,
      audios: result.audios ?? [],
    });
  } catch (e: any) {
    console.error('TTS error:', e);
    return NextResponse.json({ error: e.message ?? 'TTS failed' }, { status: 500 });
  }
}
