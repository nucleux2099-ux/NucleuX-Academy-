import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/profile - Get current user's profile
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

    // Get profile with preferences
    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        *,
        preferences:user_preferences(*),
        streak:streaks(current_streak, longest_streak, last_study_date)
      `)
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Profile fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    // Flatten response
    const response = {
      id: profile.id,
      email: user.email,
      username: profile.username,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      specialty: profile.specialty,
      level: profile.level,
      institution: profile.institution,
      target_exam: profile.target_exam,
      target_date: profile.target_date,
      timezone: profile.timezone,
      plan: profile.plan,
      onboarding_completed: profile.onboarding_completed,
      created_at: profile.created_at,
      
      // Preferences
      preferences: profile.preferences || {
        daily_goal_minutes: 60,
        mcq_daily_target: 20,
        preferred_study_time: 'evening',
        notification_email: true,
        notification_telegram: true,
        theme: 'dark',
        atom_proactive: true,
      },
      
      // Streak
      streak: profile.streak?.[0] || {
        current_streak: 0,
        longest_streak: 0,
        last_study_date: null,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/profile - Update current user's profile
export async function PATCH(request: NextRequest) {
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
    
    // Separate profile and preference fields
    const profileFields = [
      'username', 'full_name', 'avatar_url', 'specialty',
      'level', 'institution', 'target_exam', 'target_date',
      'timezone', 'onboarding_completed'
    ];
    const preferenceFields = [
      'daily_goal_minutes', 'mcq_daily_target', 'preferred_study_time',
      'notification_email', 'notification_telegram', 'telegram_chat_id',
      'theme', 'atom_proactive'
    ];

    const profileUpdate: Record<string, unknown> = { updated_at: new Date().toISOString() };
    const prefUpdate: Record<string, unknown> = { updated_at: new Date().toISOString() };

    // Split updates
    for (const [key, value] of Object.entries(body)) {
      if (profileFields.includes(key)) {
        profileUpdate[key] = value;
      } else if (preferenceFields.includes(key)) {
        prefUpdate[key] = value;
      }
    }

    // Update profile if needed
    if (Object.keys(profileUpdate).length > 1) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        return NextResponse.json(
          { error: 'Failed to update profile' },
          { status: 500 }
        );
      }
    }

    // Update preferences if needed
    if (Object.keys(prefUpdate).length > 1) {
      const { error: prefError } = await supabase
        .from('user_preferences')
        .update(prefUpdate)
        .eq('user_id', user.id);

      if (prefError) {
        console.error('Preferences update error:', prefError);
        return NextResponse.json(
          { error: 'Failed to update preferences' },
          { status: 500 }
        );
      }
    }

    // Return updated profile
    const { data: updatedProfile } = await supabase
      .from('profiles')
      .select(`
        *,
        preferences:user_preferences(*),
        streak:streaks(current_streak, longest_streak, last_study_date)
      `)
      .eq('id', user.id)
      .single();

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
