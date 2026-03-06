import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/learning/api';
import { thyroidExaminationOSCE } from '@/lib/data/templates/osce-template';

type CheckpointRow = {
  passed: boolean;
};

const STATIONS = [
  {
    id: 'thyroid-examination',
    title: thyroidExaminationOSCE.title,
    system: thyroidExaminationOSCE.system,
    topic: thyroidExaminationOSCE.topic,
    durationMinutes: thyroidExaminationOSCE.timeLimit,
    totalMarks: thyroidExaminationOSCE.totalMarks,
    difficulty: thyroidExaminationOSCE.difficulty,
    isAvailable: true,
  },
  {
    id: 'abdominal-examination',
    title: 'Abdominal Examination',
    system: 'Gastrointestinal',
    topic: 'Clinical Methods',
    durationMinutes: 8,
    totalMarks: 30,
    difficulty: 'Intermediate',
    isAvailable: false,
  },
  {
    id: 'cardiorespiratory-examination',
    title: 'Cardiorespiratory Examination',
    system: 'Medicine',
    topic: 'Clinical Methods',
    durationMinutes: 10,
    totalMarks: 35,
    difficulty: 'Intermediate',
    isAvailable: false,
  },
  {
    id: 'obstetric-abdominal-examination',
    title: 'Obstetric Abdominal Examination',
    system: 'OBG',
    topic: 'Antenatal Assessment',
    durationMinutes: 8,
    totalMarks: 30,
    difficulty: 'Intermediate',
    isAvailable: false,
  },
] as const;

export async function GET() {
  try {
    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase } = auth;

    const { data, error } = await supabase
      .from('learning_checkpoints')
      .select('passed')
      .eq('stage', 'skin')
      .order('evaluated_at', { ascending: false })
      .limit(1000);

    if (error) {
      console.error('Practical catalog query error:', error);
      return NextResponse.json({ error: 'Failed to load practical catalog' }, { status: 500 });
    }

    const rows = (data || []) as CheckpointRow[];
    const attempted = rows.length;
    const passed = rows.filter((row) => row.passed).length;
    const passRate = attempted > 0 ? Math.round((passed / attempted) * 100) : 0;

    return NextResponse.json({
      summary: {
        totalStations: STATIONS.length,
        attemptedCheckpoints: attempted,
        passedCheckpoints: passed,
        passRate,
      },
      stations: STATIONS,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Practical catalog GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
