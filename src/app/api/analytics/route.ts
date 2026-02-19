import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/analytics - Get user's learning analytics
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get date range from query params (default: last 7 days)
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    const startDate = new Date(Date.now() - days * 86400000).toISOString();

    // Parallel fetch all analytics data
    const [
      streakResult,
      sessionsResult,
      progressResult,
      mcqsResult,
      dailyStatsResult
    ] = await Promise.all([
      // Streak data
      supabase
        .from('streaks')
        .select('current_streak, longest_streak, last_study_date')
        .eq('user_id', user.id)
        .single(),
      
      // Recent study sessions
      supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('started_at', startDate)
        .order('started_at', { ascending: false }),
      
      // Topic progress
      supabase
        .from('user_atom_progress')
        .select('status, time_spent_seconds, completed_at')
        .eq('user_id', user.id),
      
      // MCQ attempts
      supabase
        .from('mcq_attempts')
        .select('is_correct, time_taken_seconds, created_at')
        .eq('user_id', user.id)
        .gte('created_at', startDate),
      
      // Daily stats
      supabase
        .from('daily_stats')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate.split('T')[0])
        .order('date', { ascending: false })
    ]);

    // Calculate aggregated analytics
    const streak = streakResult.data || { current_streak: 0, longest_streak: 0, last_study_date: null };
    const sessions = sessionsResult.data || [];
    const progress = progressResult.data || [];
    const mcqs = mcqsResult.data || [];
    const dailyStats = dailyStatsResult.data || [];

    // Calculate totals
    const totalStudyMinutes = sessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0);
    const topicsCompleted = progress.filter(p => p.status === 'completed').length;
    const totalQuestions = mcqs.length;
    const correctAnswers = mcqs.filter(m => m.is_correct).length;
    const avgAccuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Weekly study data (for chart)
    const weeklyStudyMinutes: number[] = [];
    const weeklyMcqs: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      const dayStats = dailyStats.find(d => d.date === date);
      weeklyStudyMinutes.push(dayStats?.study_minutes || 0);
      weeklyMcqs.push(dayStats?.mcqs_attempted || 0);
    }

    const analytics = {
      // Current status
      currentStreak: streak.current_streak,
      longestStreak: streak.longest_streak,
      lastStudyDate: streak.last_study_date,
      
      // Totals
      totalStudyMinutes,
      topicsCompleted,
      totalQuestions,
      correctAnswers,
      avgAccuracy,
      
      // Recent activity
      recentSessions: sessions.slice(0, 5),
      
      // Weekly data (for charts)
      weeklyStudyMinutes,
      weeklyMcqs,
      
      // Daily breakdown
      dailyStats: dailyStats.slice(0, 7),
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/analytics - Log analytics event
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { event, data } = body;
    const eventPayload = data && typeof data === 'object' ? data : {};

    const today = new Date().toISOString().split('T')[0];

    switch (event) {
      case 'study_time':
        // Update daily stats with study time
        await supabase.rpc('increment_study_time', {
          p_user_id: user.id,
          p_date: today,
          p_minutes: (eventPayload as { minutes?: number }).minutes
        });
        break;

      case 'mcq_attempt':
        // Update daily MCQ stats
        await supabase.rpc('increment_mcq_stats', {
          p_user_id: user.id,
          p_date: today,
          p_attempted: 1,
          p_correct: (eventPayload as { correct?: boolean }).correct ? 1 : 0
        });
        break;

      case 'topic_completed':
        // Update daily topics completed
        await supabase.rpc('increment_topics_completed', {
          p_user_id: user.id,
          p_date: today
        });
        break;

      default:
        // Generic product telemetry event
        const { error: eventInsertError } = await supabase
          .from('analytics_events')
          .insert({
            user_id: user.id,
            event_name: event,
            event_data: eventPayload,
          });
        if (eventInsertError) {
          console.warn('Analytics event insert failed:', eventInsertError.message);
          return NextResponse.json({ success: true, event, stored: false }, { status: 202 });
        }
        break;
    }

    return NextResponse.json({ success: true, event, stored: true });
  } catch (error) {
    console.error('Analytics POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
