import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/streaks - Get user's streak data
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

    // Get streak data
    const { data: streak, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Streak fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch streak' },
        { status: 500 }
      );
    }

    // If no streak record exists, return defaults
    if (!streak) {
      return NextResponse.json({
        current_streak: 0,
        longest_streak: 0,
        last_study_date: null,
        streak_started_at: null,
      });
    }

    return NextResponse.json(streak);
  } catch (error) {
    console.error('Streak API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/streaks - Update streak (called when user studies)
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

    // Get current streak
    const { data: currentStreak } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let newStreak = 1;
    let longestStreak = currentStreak?.longest_streak || 0;
    let streakStartedAt = today;

    if (currentStreak) {
      const lastStudyDate = currentStreak.last_study_date;

      if (lastStudyDate === today) {
        // Already studied today, no change
        return NextResponse.json(currentStreak);
      } else if (lastStudyDate === yesterday) {
        // Continuing streak
        newStreak = (currentStreak.current_streak || 0) + 1;
        streakStartedAt = currentStreak.streak_started_at || today;
      } else {
        // Streak broken, reset
        newStreak = 1;
        streakStartedAt = today;
      }

      // Update longest streak if needed
      if (newStreak > longestStreak) {
        longestStreak = newStreak;
      }
    }

    // Upsert streak record
    const { data: updatedStreak, error } = await supabase
      .from('streaks')
      .upsert({
        user_id: user.id,
        current_streak: newStreak,
        longest_streak: longestStreak,
        last_study_date: today,
        streak_started_at: streakStartedAt,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Streak update error:', error);
      return NextResponse.json(
        { error: 'Failed to update streak' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedStreak);
  } catch (error) {
    console.error('Streak API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
