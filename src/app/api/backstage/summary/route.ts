import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type SubjectAgg = {
  name: string;
  mcqs: number;
  correct: number;
  topicsTouched: Set<string>;
};

function normSubject(input?: string | null) {
  const s = (input || '').toLowerCase();
  if (!s) return 'General';
  if (s.includes('surg')) return 'Surgery';
  if (s.includes('med')) return 'Medicine';
  if (s.includes('anat')) return 'Anatomy';
  if (s.includes('path')) return 'Pathology';
  if (s.includes('pharm')) return 'Pharmacology';
  if (s.includes('pedia') || s.includes('peds')) return 'Pediatrics';
  if (s.includes('obg') || s.includes('gyn')) return 'OBG';
  return input || 'General';
}

function dateKey(daysAgo: number) {
  const d = new Date(Date.now() - daysAgo * 86400000);
  return d.toISOString().split('T')[0];
}

function overconfidentTopicsLiveCount(items: Array<{ name: string; confidence: number; accuracy: number }>) {
  return items.filter((t) => t.confidence - t.accuracy >= 8).length;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = Date.now();
    const d7 = new Date(now - 7 * 86400000).toISOString();
    const d28 = new Date(now - 28 * 86400000).toISOString();
    const d30 = new Date(now - 30 * 86400000).toISOString();

    const [streakRes, sessionsRes, dailyRes, progressRes, mcqRes] = await Promise.all([
      supabase.from('streaks').select('current_streak,longest_streak,last_study_date').eq('user_id', user.id).single(),
      supabase
        .from('study_sessions')
        .select('id,started_at,duration_minutes,mcqs_attempted,mcqs_correct')
        .eq('user_id', user.id)
        .gte('started_at', d30)
        .order('started_at', { ascending: false }),
      supabase
        .from('daily_stats')
        .select('date,study_minutes,mcqs_attempted,mcqs_correct,atoms_completed')
        .eq('user_id', user.id)
        .gte('date', d28.split('T')[0])
        .order('date', { ascending: false }),
      supabase
        .from('user_atom_progress')
        .select('status,atom:atoms(topic,specialty)')
        .eq('user_id', user.id),
      supabase
        .from('mcq_attempts')
        .select('is_correct,confidence,created_at,mcq:mcqs(topic,specialty)')
        .eq('user_id', user.id)
        .gte('created_at', d30),
    ]);

    const streak = streakRes.data || { current_streak: 0, longest_streak: 0, last_study_date: null };
    const sessions = sessionsRes.data || [];
    const daily = dailyRes.data || [];
    const progress = progressRes.data || [];
    const mcqs = mcqRes.data || [];

    const weeklySessions = sessions.filter((s) => s.started_at && s.started_at >= d7);
    const weeklyStudyMinutes = weeklySessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0);

    const avgSessionLength = sessions.length
      ? Math.round(sessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) / sessions.length)
      : 0;

    const topicsMastered = progress.filter((p) => p.status === 'completed').length;

    const monthMcqs = mcqs.length;

    const totalMcqCorrect = mcqs.filter((m) => m.is_correct).length;
    const accuracy = monthMcqs ? Math.round((totalMcqCorrect / monthMcqs) * 100) : 0;

    const confVals = mcqs
      .map((m) => (typeof m.confidence === 'number' ? m.confidence : null))
      .filter((v): v is number => v !== null);
    const confidence = confVals.length ? Math.round(confVals.reduce((a, b) => a + b, 0) / confVals.length) : 0;
    const gap = confidence - accuracy;

    const topicAgg = new Map<string, { attempts: number; correct: number; conf: number; confN: number }>();
    for (const m of mcqs) {
      const topic = (m.mcq as { topic?: string | null } | null)?.topic || 'General Topic';
      const item = topicAgg.get(topic) || { attempts: 0, correct: 0, conf: 0, confN: 0 };
      item.attempts += 1;
      if (m.is_correct) item.correct += 1;
      if (typeof m.confidence === 'number') {
        item.conf += m.confidence;
        item.confN += 1;
      }
      topicAgg.set(topic, item);
    }

    const topicStats = [...topicAgg.entries()].map(([name, v]) => {
      const tAcc = v.attempts ? Math.round((v.correct / v.attempts) * 100) : 0;
      const tConf = v.confN ? Math.round(v.conf / v.confN) : 0;
      const mastery = Math.max(0, Math.min(100, Math.round(tAcc * 0.75 + Math.min(v.attempts, 20) * 1.25)));
      return { name, confidence: tConf, accuracy: tAcc, gap: tConf - tAcc, attempts: v.attempts, mastery };
    });

    const overconfidentTopics = topicStats
      .filter((t) => t.attempts >= 3 && t.gap >= 8)
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 5)
      .map(({ name, confidence: c, accuracy: a }) => ({ name, confidence: c, accuracy: a }));

    const topicMastery = topicStats
      .filter((t) => t.attempts >= 2)
      .sort((a, b) => b.mastery - a.mastery)
      .slice(0, 8)
      .map(({ name, mastery, accuracy: a, attempts }) => ({ name, mastery, accuracy: a, attempts }));

    const weakTopics = topicStats
      .filter((t) => t.attempts >= 2)
      .sort((a, b) => a.mastery - b.mastery)
      .slice(0, 5)
      .map(({ name, mastery, accuracy: a, attempts }) => ({ name, mastery, accuracy: a, attempts }));

    const subjectMap = new Map<string, SubjectAgg>();

    for (const p of progress) {
      const atom = p.atom as { topic?: string | null; specialty?: string | null } | null;
      const subject = normSubject(atom?.specialty || atom?.topic || undefined);
      if (!subjectMap.has(subject)) {
        subjectMap.set(subject, { name: subject, mcqs: 0, correct: 0, topicsTouched: new Set<string>() });
      }
      const agg = subjectMap.get(subject)!;
      if (atom?.topic) agg.topicsTouched.add(atom.topic);
    }

    for (const m of mcqs) {
      const q = m.mcq as { topic?: string | null; specialty?: string | null } | null;
      const subject = normSubject(q?.specialty || q?.topic || undefined);
      if (!subjectMap.has(subject)) {
        subjectMap.set(subject, { name: subject, mcqs: 0, correct: 0, topicsTouched: new Set<string>() });
      }
      const agg = subjectMap.get(subject)!;
      agg.mcqs += 1;
      if (m.is_correct) agg.correct += 1;
      if (q?.topic) agg.topicsTouched.add(q.topic);
    }

    const subjects = [...subjectMap.values()]
      .map((s) => ({
        name: s.name,
        accuracy: s.mcqs ? Math.round((s.correct / s.mcqs) * 100) : 0,
        mcqs: s.mcqs,
        topics: s.topicsTouched.size,
      }))
      .sort((a, b) => b.mcqs - a.mcqs)
      .slice(0, 6);

    const dayMap = new Map(daily.map((d) => [d.date, d]));
    const heatmapDays = [] as number[];
    for (let i = 27; i >= 0; i -= 1) {
      const key = dateKey(i);
      const m = dayMap.get(key)?.study_minutes || 0;
      if (m <= 0) heatmapDays.push(0);
      else if (m < 45) heatmapDays.push(1);
      else heatmapDays.push(2);
    }

    const weeks = [heatmapDays.slice(0, 7), heatmapDays.slice(7, 14), heatmapDays.slice(14, 21), heatmapDays.slice(21, 28)];

    const insights: string[] = [];
    if (gap >= 10) insights.push(`Your confidence (${confidence}%) is ahead of measured accuracy (${accuracy}%). Focus retrieval practice on blind spots.`);
    if (streak.current_streak >= 5) insights.push(`Great consistency — current streak is ${streak.current_streak} days.`);
    if (subjects[0]) insights.push(`Strongest active subject: ${subjects[0].name} with ${subjects[0].accuracy}% MCQ accuracy.`);
    if (!insights.length) insights.push('Start a focused 25-minute session and 10 MCQs to unlock personalized insights.');

    const weeklyMcqAttempts = daily
      .filter((d) => d.date >= d7.split('T')[0])
      .reduce((acc, d) => acc + (d.mcqs_attempted || 0), 0);

    const trend7d = [] as Array<{ date: string; studyMinutes: number; mcqAccuracy: number; mcqAttempts: number }>;
    for (let i = 6; i >= 0; i -= 1) {
      const key = dateKey(i);
      const row = dayMap.get(key);
      const attempts = row?.mcqs_attempted || 0;
      const corr = row?.mcqs_correct || 0;
      trend7d.push({
        date: key,
        studyMinutes: row?.study_minutes || 0,
        mcqAttempts: attempts,
        mcqAccuracy: attempts ? Math.round((corr / attempts) * 100) : 0,
      });
    }

    const nextActions: Array<{ title: string; reason: string; priority: 'high' | 'medium' | 'low'; href: string }> = [];
    if (gap >= 10) {
      nextActions.push({
        title: 'Run calibration drill (20 MCQs)',
        reason: `Confidence-accuracy gap is ${gap}%`,
        priority: 'high',
        href: '/backstage/calibration',
      });
    }
    if ((streak.current_streak || 0) < 3) {
      nextActions.push({
        title: 'Streak recovery session (25 min)',
        reason: 'Consistency dropped below 3-day streak',
        priority: 'high',
        href: '/desk',
      });
    }
    if (weeklyStudyMinutes < 10 * 60) {
      nextActions.push({
        title: 'Add one 45-min focused block today',
        reason: 'Weekly study volume is below target trajectory',
        priority: 'medium',
        href: '/backstage/logbook',
      });
    }
    if (!nextActions.length) {
      nextActions.push({
        title: 'Maintain momentum with spaced revision',
        reason: 'Current metrics are stable',
        priority: 'low',
        href: '/desk',
      });
    }

    const weeklyGoalStudyMinutes = 20 * 60;
    const weeklyGoalTopics = 15;
    const weeklyGoalAccuracy = 80;

    const q1Done = weeklyMcqAttempts >= 50;
    const weakTopicsCount = overconfidentTopicsLiveCount(overconfidentTopics);
    const q2Done = weakTopicsCount === 0;
    const q3Done = (streak.current_streak || 0) >= 7;

    const response = {
      lastUpdatedAt: new Date().toISOString(),
      stats: {
        weeklyStudyHours: Number((weeklyStudyMinutes / 60).toFixed(1)),
        topicsMastered,
        mcqsAttemptedMonth: monthMcqs,
        avgSessionLength,
      },
      calibration: {
        confidence,
        accuracy,
        gap,
        status: gap > 15 ? 'Overconfident' : gap >= 5 ? 'Moderate' : 'Well-Calibrated',
        overconfidentTopics,
      },
      streak: {
        current: streak.current_streak || 0,
        longest: streak.longest_streak || 0,
        activeDaysIn28: daily.filter((d) => (d.study_minutes || 0) > 0).length,
        heatmap: weeks,
      },
      subjects,
      insights,
      trend7d,
      topicMastery,
      weakTopics,
      nextActions,
      weeklyReport: {
        headline: `Week snapshot: ${Number((weeklyStudyMinutes / 60).toFixed(1))}h study, ${weeklyMcqAttempts} MCQs, ${accuracy}% accuracy`,
        wins: [
          subjects[0] ? `Top subject: ${subjects[0].name} (${subjects[0].accuracy}% accuracy)` : 'Start attempts to reveal top subject',
          (streak.current_streak || 0) > 0 ? `Current streak: ${streak.current_streak} days` : 'Build a streak with one session today',
        ],
        focus: weakTopics.slice(0, 3).map((t) => `${t.name} (mastery ${t.mastery}%)`),
      },
      quests: {
        active: [
          {
            title: 'Complete 50 MCQs this week',
            progress: Math.min(weeklyMcqAttempts, 50),
            total: 50,
            done: q1Done,
            reward: 'Sharpshooter Badge',
          },
          {
            title: 'Resolve overconfidence gaps',
            progress: q2Done ? 3 : Math.max(0, 3 - weakTopicsCount),
            total: 3,
            done: q2Done,
            reward: 'Calibration Badge',
          },
          {
            title: 'Maintain 7-day streak',
            progress: Math.min(streak.current_streak || 0, 7),
            total: 7,
            done: q3Done,
            reward: 'Streak Master Badge',
          },
        ],
        weeklyGoals: [
          {
            title: 'Study 20 hours',
            current: Number((weeklyStudyMinutes / 60).toFixed(1)),
            target: 20,
            unit: 'h',
            ok: weeklyStudyMinutes >= weeklyGoalStudyMinutes,
          },
          {
            title: 'Cover 15 topics',
            current: topicsMastered,
            target: weeklyGoalTopics,
            unit: '',
            ok: topicsMastered >= weeklyGoalTopics,
          },
          {
            title: '80% MCQ accuracy',
            current: accuracy,
            target: weeklyGoalAccuracy,
            unit: '%',
            ok: accuracy >= weeklyGoalAccuracy,
          },
        ],
      },
      raw: {
        sessions30: sessions.length,
        dailyRows: daily.length,
        progressRows: progress.length,
        mcqRows: mcqs.length,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Backstage summary API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
