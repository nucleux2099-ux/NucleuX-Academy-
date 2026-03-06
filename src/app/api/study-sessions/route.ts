import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/study-sessions - Get user's recent study sessions
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

    // Get query params
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch sessions
    const { data: sessions, error, count } = await supabase
      .from('study_sessions')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Sessions fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sessions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sessions: sessions || [],
      total: count || 0,
      hasMore: (count || 0) > offset + limit
    });
  } catch (error) {
    console.error('Study sessions API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/study-sessions - Start a new study session
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
    const { atoms_studied, source = 'web' } = body;

    // Create new session
    const { data: session, error } = await supabase
      .from('study_sessions')
      .insert({
        user_id: user.id,
        started_at: new Date().toISOString(),
        atoms_studied: atoms_studied || [],
        source,
      })
      .select()
      .single();

    if (error) {
      console.error('Session create error:', error);
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }

    // Update streak
    await fetch(new URL('/api/streaks', request.url), {
      method: 'POST',
      headers: { cookie: request.headers.get('cookie') || '' }
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('Study sessions API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/study-sessions - End/update a study session
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
    const { 
      session_id, 
      ended_at, 
      duration_minutes,
      atoms_studied,
      mcqs_attempted,
      mcqs_correct,
      notes_created
    } = body;

    if (!session_id) {
      return NextResponse.json(
        { error: 'session_id required' },
        { status: 400 }
      );
    }

    // Read current state first so we only aggregate daily stats once
    const { data: existingSession, error: existingSessionError } = await supabase
      .from('study_sessions')
      .select('ended_at')
      .eq('id', session_id)
      .eq('user_id', user.id)
      .single();

    if (existingSessionError) {
      console.error('Session fetch error:', existingSessionError);
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Update session
    const updateData: {
      updated_at: string;
      ended_at?: string;
      duration_minutes?: number;
      atoms_studied?: string[];
      mcqs_attempted?: number;
      mcqs_correct?: number;
      notes_created?: number;
    } = { updated_at: new Date().toISOString() };
    
    if (ended_at) updateData.ended_at = ended_at;
    if (duration_minutes !== undefined) updateData.duration_minutes = duration_minutes;
    if (atoms_studied) updateData.atoms_studied = atoms_studied;
    if (mcqs_attempted !== undefined) updateData.mcqs_attempted = mcqs_attempted;
    if (mcqs_correct !== undefined) updateData.mcqs_correct = mcqs_correct;
    if (notes_created !== undefined) updateData.notes_created = notes_created;

    const { data: session, error } = await supabase
      .from('study_sessions')
      .update(updateData)
      .eq('id', session_id)
      .eq('user_id', user.id) // Ensure user owns session
      .select()
      .single();

    if (error) {
      console.error('Session update error:', error);
      return NextResponse.json(
        { error: 'Failed to update session' },
        { status: 500 }
      );
    }

    // Update daily stats if session is being ended for the first time
    if (ended_at && duration_minutes && !existingSession?.ended_at) {
      const today = new Date().toISOString().split('T')[0];

      await supabase.rpc('increment_study_time', {
        p_user_id: user.id,
        p_date: today,
        p_minutes: duration_minutes,
      });

      if ((mcqs_attempted || 0) > 0 || (mcqs_correct || 0) > 0) {
        await supabase.rpc('increment_mcq_stats', {
          p_user_id: user.id,
          p_date: today,
          p_attempted: mcqs_attempted || 0,
          p_correct: mcqs_correct || 0,
        });
      }
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Study sessions API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
