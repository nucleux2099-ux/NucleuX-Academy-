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

    // Update session
    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    
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

    // Update daily stats if session ended
    if (ended_at && duration_minutes) {
      const today = new Date().toISOString().split('T')[0];
      
      await supabase
        .from('daily_stats')
        .upsert({
          user_id: user.id,
          date: today,
          study_minutes: duration_minutes,
          mcqs_attempted: mcqs_attempted || 0,
          mcqs_correct: mcqs_correct || 0,
        }, {
          onConflict: 'user_id,date'
        });
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
