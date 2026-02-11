"use client";

import { useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, Square, Volume2, Wand2 } from 'lucide-react';

const LANGS = [
  { code: 'en-IN', label: 'English (India)' },
  { code: 'te-IN', label: 'Telugu + English (Code-mix)' },
  { code: 'hi-IN', label: 'Hindi + English (Code-mix)' },
] as const;

type LangCode = (typeof LANGS)[number]['code'];

export default function LiveAIClassroomClient() {
  // Teacher / TTS
  const [teacherLang, setTeacherLang] = useState<LangCode>('en-IN');
  const [teacherText, setTeacherText] = useState(
    'Today we will learn Shock. First, definition: shock is inadequate tissue perfusion leading to cellular hypoxia.'
  );
  const [ttsLoading, setTtsLoading] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [audioDataUrl, setAudioDataUrl] = useState<string | null>(null);

  // User / STT
  const [sttLang, setSttLang] = useState<LangCode>('en-IN');
  const [recording, setRecording] = useState(false);
  const [sttLoading, setSttLoading] = useState(false);
  const [sttError, setSttError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const canRecord = useMemo(() => typeof window !== 'undefined' && !!navigator.mediaDevices, []);

  async function generateTts() {
    setTtsLoading(true);
    setTtsError(null);
    setAudioDataUrl(null);
    try {
      const res = await fetch('/api/speech/tts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          text: teacherText,
          target_language_code: teacherLang,
          // keep defaults for now; later we expose speaker/pace/temperature
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);
      if (!json?.audio_base64) throw new Error('No audio returned');
      setAudioDataUrl(`data:audio/wav;base64,${json.audio_base64}`);
    } catch (e: any) {
      setTtsError(e?.message || 'TTS failed');
    } finally {
      setTtsLoading(false);
    }
  }

  async function startRecording() {
    setSttError(null);
    setTranscript('');
    if (!canRecord) {
      setSttError('Recording not supported in this browser');
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunksRef.current = [];

    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    setRecording(true);
  }

  async function stopRecordingAndTranscribe() {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    setRecording(false);
    setSttLoading(true);
    setSttError(null);

    await new Promise<void>((resolve) => {
      recorder.onstop = () => resolve();
      recorder.stop();
    });

    try {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const file = new File([blob], 'user.webm', { type: 'audio/webm' });

      const form = new FormData();
      form.append('file', file);
      form.append('language_code', sttLang);
      form.append('mode', 'codemix');

      const res = await fetch('/api/speech/stt', { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);
      setTranscript(json?.transcript || '');
    } catch (e: any) {
      setSttError(e?.message || 'STT failed');
    } finally {
      setSttLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#E8E0D5]">🎙️ Classroom • Live AI</h1>
          <p className="text-sm text-[#A0B0BC]">Teacher (Sarvam TTS) + User voice (Sarvam STT) • Concept-first, RR at end</p>
        </div>
        <Badge className="bg-[rgba(91,179,179,0.15)] text-[#5BB3B3] border-[rgba(91,179,179,0.3)]">MVP</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teacher */}
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#E8E0D5]">
              <Volume2 className="w-5 h-5 text-[#5BB3B3]" /> Teacher Voice (TTS)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-64">
                <Select value={teacherLang} onValueChange={(v) => setTeacherLang(v as LangCode)}>
                  <SelectTrigger className="bg-[#3A4D5F] border-[rgba(91,179,179,0.15)] text-[#E8E0D5]">
                    <SelectValue placeholder="Teacher language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGS.map((l) => (
                      <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={generateTts} disabled={ttsLoading} className="bg-[#5BB3B3] hover:bg-[#4A9E9E] text-white">
                <Wand2 className="w-4 h-4 mr-2" />
                {ttsLoading ? 'Generating…' : 'Generate Voice'}
              </Button>
            </div>

            <Textarea
              value={teacherText}
              onChange={(e) => setTeacherText(e.target.value)}
              className="min-h-[140px] bg-[#3A4D5F] border-[rgba(91,179,179,0.15)] text-[#E8E0D5]"
              placeholder="Teacher script…"
            />

            {ttsError && <p className="text-sm text-red-300">{ttsError}</p>}

            {audioDataUrl && (
              <audio controls src={audioDataUrl} className="w-full" />
            )}

            <p className="text-xs text-[#A0B0BC]">
              Notes: Sarvam bulbul:v3 returns base64 WAV. We play it via a data URL for MVP.
            </p>
          </CardContent>
        </Card>

        {/* User */}
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#E8E0D5]">
              <Mic className="w-5 h-5 text-[#C9A86C]" /> User Voice (STT)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-64">
                <Select value={sttLang} onValueChange={(v) => setSttLang(v as LangCode)}>
                  <SelectTrigger className="bg-[#3A4D5F] border-[rgba(91,179,179,0.15)] text-[#E8E0D5]">
                    <SelectValue placeholder="User language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGS.map((l) => (
                      <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {!recording ? (
                <Button onClick={startRecording} disabled={sttLoading} variant="outline" className="border-[rgba(201,168,108,0.4)] text-[#C9A86C]">
                  <Mic className="w-4 h-4 mr-2" /> Record
                </Button>
              ) : (
                <Button onClick={stopRecordingAndTranscribe} disabled={sttLoading} className="bg-[#C9A86C] hover:bg-[#B8925A] text-[#2D3E50]">
                  <Square className="w-4 h-4 mr-2" /> Stop & Transcribe
                </Button>
              )}
            </div>

            {sttError && <p className="text-sm text-red-300">{sttError}</p>}

            <div className="p-4 rounded-lg bg-[#3A4D5F] border border-[rgba(91,179,179,0.15)] min-h-[140px]">
              <p className="text-xs text-[#A0B0BC] mb-2">Transcript (saaras:v3 • codemix)</p>
              <p className="text-[#E8E0D5] whitespace-pre-wrap">{sttLoading ? 'Transcribing…' : (transcript || '—')}</p>
            </div>

            <p className="text-xs text-[#A0B0BC]">
              For MVP we record in WebM and send as multipart form to `/api/speech/stt`.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
