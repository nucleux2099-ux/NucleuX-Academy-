import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sarvamSpeechToText } from '@/lib/speech/sarvam';

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

    const language_code = (form.get('language_code') as string | null) ?? 'unknown';
    const mode = (form.get('mode') as string | null) ?? 'codemix';

    const result = await sarvamSpeechToText(file, {
      model: 'saaras:v3',
      mode: mode as any,
      language_code: language_code as any,
    });

    return NextResponse.json({
      transcript: result.transcript,
      language_code: result.language_code ?? null,
      language_probability: result.language_probability ?? null,
      request_id: result.request_id ?? null,
      timestamps: result.timestamps ?? null,
    });
  } catch (e: any) {
    console.error('STT error:', e);
    return NextResponse.json({ error: e.message ?? 'STT failed' }, { status: 500 });
  }
}
