import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - Fetch user analytics from Supabase
export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all analytics data in parallel
    const [
      profileResult,
      streakResult,
      dailyStatsResult,
      mcqAttemptsResult,
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('streaks').select('*').eq('user_id', user.id).single(),
      supabase.from('daily_stats').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(30),
      supabase.from('mcq_attempts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(100),
    ])

    // Calculate totals from daily stats
    const dailyStats = dailyStatsResult.data || []
    const totalQuestions = dailyStats.reduce((sum, d) => sum + (d.mcqs_attempted || 0), 0)
    const correctAnswers = dailyStats.reduce((sum, d) => sum + (d.mcqs_correct || 0), 0)
    const totalStudyMinutes = dailyStats.reduce((sum, d) => sum + (d.study_minutes || 0), 0)

    const analytics = {
      profile: profileResult.data,
      streak: streakResult.data,
      totalQuestions,
      correctAnswers,
      totalStudyMinutes,
      currentStreak: streakResult.data?.current_streak || 0,
      longestStreak: streakResult.data?.longest_streak || 0,
      dailyStats: dailyStats.map(d => ({
        date: d.date,
        questionsAttempted: d.mcqs_attempted,
        questionsCorrect: d.mcqs_correct,
        studyMinutes: d.study_minutes,
        topicsReviewed: [],
        streak: d.study_minutes > 0 || d.mcqs_attempted > 0,
      })),
      mcqAttempts: (mcqAttemptsResult.data || []).map(a => ({
        id: a.id,
        questionId: a.mcq_id,
        isCorrect: a.is_correct,
        confidence: getConfidenceString(a.confidence),
        timeSpent: a.time_taken_seconds,
        timestamp: new Date(a.created_at),
      })),
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getConfidenceString(level: number): string {
  const strings: Record<number, string> = {
    1: 'guessing',
    2: 'unsure',
    3: 'sure',
    4: 'very-sure',
  }
  return strings[level] || 'unsure'
}
