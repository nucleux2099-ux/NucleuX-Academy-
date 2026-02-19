import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sarvamSpeechToText, type SarvamLanguageCode, type SarvamSttMode } from '@/lib/speech/sarvam';

export const runtime = 'nodejs';

// POST /api/speech/stt
// multipart/form-data: file=<audio>, language_code?, mode?
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing audio file' }, { status: 400 });
    }

    const rawLanguage = (form.get('language_code') as string | null) ?? 'unknown';
    const rawMode = (form.get('mode') as string | null) ?? 'codemix';
    const language_code: SarvamLanguageCode = ['en-IN', 'te-IN', 'hi-IN', 'unknown'].includes(rawLanguage)
      ? (rawLanguage as SarvamLanguageCode)
      : 'unknown';
    const mode: SarvamSttMode = ['transcribe', 'translate', 'verbatim', 'translit', 'codemix'].includes(rawMode)
      ? (rawMode as SarvamSttMode)
      : 'codemix';

    const result = await sarvamSpeechToText(file, {
      model: 'saaras:v3',
      mode,
      language_code,
    });

    return NextResponse.json({
      transcript: result.transcript,
      language_code: result.language_code ?? null,
      language_probability: result.language_probability ?? null,
      request_id: result.request_id ?? null,
      timestamps: result.timestamps ?? null,
    });
  } catch (e: unknown) {
    console.error('STT error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'STT failed' },
      { status: 500 }
    );
  }
}
