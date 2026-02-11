import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface SyncedMcqAttempt {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  confidence: string;
  timestamp: string;
}

interface SyncedDailyStat {
  date: string;
  studyMinutes: number;
  questionsAttempted: number;
  questionsCorrect: number;
  topicsReviewed?: string[];
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { mcqAttempts, readingSessions, videoSessions, dailyStats, topicMemories } = body

    // Sync MCQ attempts
    if (mcqAttempts?.length > 0) {
      const mcqData = (mcqAttempts as SyncedMcqAttempt[]).map((attempt) => ({
        user_id: user.id,
        mcq_id: attempt.questionId, // Note: This might need mapping to actual mcq_id
        selected_options: [attempt.selectedAnswer],
        is_correct: attempt.isCorrect,
        time_taken_seconds: attempt.timeSpent,
        confidence: getConfidenceLevel(attempt.confidence),
        created_at: attempt.timestamp,
      }))

      // Upsert to avoid duplicates (based on user_id + created_at)
      const { error: mcqError } = await supabase
        .from('mcq_attempts')
        .upsert(mcqData, { 
          onConflict: 'id',
          ignoreDuplicates: true 
        })

      if (mcqError) {
        console.error('MCQ sync error:', mcqError)
      }
    }

    // Sync daily stats
    if (dailyStats?.length > 0) {
      const statsData = (dailyStats as SyncedDailyStat[]).map((stat) => ({
        user_id: user.id,
        date: stat.date,
        study_minutes: stat.studyMinutes,
        mcqs_attempted: stat.questionsAttempted,
        mcqs_correct: stat.questionsCorrect,
        atoms_completed: stat.topicsReviewed?.length || 0,
      }))

      const { error: statsError } = await supabase
        .from('daily_stats')
        .upsert(statsData, { 
          onConflict: 'user_id,date' 
        })

      if (statsError) {
        console.error('Daily stats sync error:', statsError)
      }
    }

    // Update streak
    const { data: streak } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (streak && body.currentStreak !== undefined) {
      await supabase
        .from('streaks')
        .update({
          current_streak: body.currentStreak,
          longest_streak: Math.max(streak.longest_streak || 0, body.longestStreak || 0),
          last_study_date: new Date().toISOString().split('T')[0],
        })
        .eq('user_id', user.id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics sync error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Map confidence string to number
function getConfidenceLevel(confidence: string): number {
  const levels: Record<string, number> = {
    'guessing': 1,
    'unsure': 2,
    'sure': 3,
    'very-sure': 4,
  }
  return levels[confidence] || 2
}
