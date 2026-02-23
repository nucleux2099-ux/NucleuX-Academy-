import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const d7 = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

    const [streakRes, dailyRes] = await Promise.all([
      supabase.from('streaks').select('current_streak,longest_streak').eq('user_id', user.id).single(),
      supabase
        .from('daily_stats')
        .select('date,study_minutes,mcqs_attempted,mcqs_correct,atoms_completed')
        .eq('user_id', user.id)
        .gte('date', d7)
        .order('date', { ascending: false }),
    ]);

    const streak = streakRes.data || { current_streak: 0, longest_streak: 0 };
    const daily = dailyRes.data || [];

    const studyMinutes = daily.reduce((a, d) => a + (d.study_minutes || 0), 0);
    const mcqs = daily.reduce((a, d) => a + (d.mcqs_attempted || 0), 0);
    const corr = daily.reduce((a, d) => a + (d.mcqs_correct || 0), 0);
    const topics = daily.reduce((a, d) => a + (d.atoms_completed || 0), 0);
    const acc = mcqs ? Math.round((corr / mcqs) * 100) : 0;

    const reportMarkdown = [
      '# Weekly Backstage Report',
      '',
      `- Study: ${(studyMinutes / 60).toFixed(1)}h`,
      `- MCQs: ${mcqs} attempted, ${acc}% accuracy`,
      `- Topics completed: ${topics}`,
      `- Streak: ${streak.current_streak} days (best ${streak.longest_streak})`,
      '',
      '## Suggested focus',
      mcqs < 50 ? '- Increase MCQ volume to 50/week' : '- Maintain MCQ volume',
      acc < 70 ? '- Improve accuracy with targeted revision on weak topics' : '- Keep accuracy momentum',
      streak.current_streak < 3 ? '- Rebuild consistency with a daily 25-minute block' : '- Protect streak with one session/day',
    ].join('\n');

    return NextResponse.json({ generatedAt: new Date().toISOString(), reportMarkdown });
  } catch (error) {
    console.error('Backstage report API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
