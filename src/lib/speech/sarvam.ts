/**
 * Sarvam AI Speech API wrappers (server-side).
 *
 * Docs:
 * - STT: https://api.sarvam.ai/speech-to-text
 * - TTS: https://api.sarvam.ai/text-to-speech
 */

export type SarvamLanguageCode = 'en-IN' | 'te-IN' | 'hi-IN' | 'unknown';

export type SarvamSttMode = 'transcribe' | 'translate' | 'verbatim' | 'translit' | 'codemix';

export interface SarvamSttOptions {
  model?: 'saarika:v2.5' | 'saaras:v3';
  mode?: SarvamSttMode; // only for saaras:v3
  language_code?: SarvamLanguageCode;
  with_timestamps?: boolean;
  input_audio_codec?: string;
}

export interface SarvamSttResponse {
  request_id?: string | null;
  transcript: string;
  language_code?: string | null;
  language_probability?: number | null;
  timestamps?: unknown;
  diarized_transcript?: unknown;
}

export interface SarvamTtsOptions {
  model?: 'bulbul:v3' | 'bulbul:v2';
  target_language_code: Exclude<SarvamLanguageCode, 'unknown'>;
  speaker?: string;
  pace?: number;
  temperature?: number;
  speech_sample_rate?: number;
  output_audio_codec?: string;
}

export interface SarvamTtsResponse {
  request_id?: string | null;
  audios: string[]; // base64 WAV
}

function getApiKey(): string {
  const key = process.env.SARVAM_API_KEY;
  if (!key) {
    throw new Error('SARVAM_API_KEY is not set');
  }
  return key;
}

export async function sarvamSpeechToText(file: File, opts: SarvamSttOptions = {}): Promise<SarvamSttResponse> {
  const apiKey = getApiKey();

  const form = new FormData();
  form.append('file', file, file.name || 'audio.wav');

  const model = opts.model ?? 'saaras:v3';
  form.append('model', model);

  if (model === 'saaras:v3') {
    form.append('mode', opts.mode ?? 'codemix');
  }

  if (opts.language_code) form.append('language_code', opts.language_code);
  if (opts.with_timestamps !== undefined) form.append('with_timestamps', String(opts.with_timestamps));
  if (opts.input_audio_codec) form.append('input_audio_codec', opts.input_audio_codec);

  const res = await fetch('https://api.sarvam.ai/speech-to-text', {
    method: 'POST',
    headers: {
      'api-subscription-key': apiKey,
    },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Sarvam STT failed: HTTP ${res.status} ${text}`);
  }

  return (await res.json()) as SarvamSttResponse;
}

export async function sarvamTextToSpeech(text: string, opts: SarvamTtsOptions): Promise<SarvamTtsResponse> {
  const apiKey = getApiKey();

  const payload: Record<string, string | number> = {
    text,
    target_language_code: opts.target_language_code,
    model: opts.model ?? 'bulbul:v3',
  };

  if (opts.speaker) payload.speaker = opts.speaker;
  if (opts.pace !== undefined) payload.pace = opts.pace;
  if (opts.temperature !== undefined) payload.temperature = opts.temperature;
  if (opts.speech_sample_rate) payload.speech_sample_rate = opts.speech_sample_rate;
  if (opts.output_audio_codec) payload.output_audio_codec = opts.output_audio_codec;

  const res = await fetch('https://api.sarvam.ai/text-to-speech', {
    method: 'POST',
    headers: {
      'api-subscription-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Sarvam TTS failed: HTTP ${res.status} ${text}`);
  }

  return (await res.json()) as SarvamTtsResponse;
}
