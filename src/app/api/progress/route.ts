import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/progress - Get user's topic/atom progress
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
    const atomId = searchParams.get('atom_id');
    const specialty = searchParams.get('specialty');
    const topic = searchParams.get('topic');
    const status = searchParams.get('status');

    // Build query
    let query = supabase
      .from('user_atom_progress')
      .select(`
        *,
        atom:atoms(id, title, slug, specialty, topic, subtopic, difficulty)
      `)
      .eq('user_id', user.id);

    // Apply filters
    if (atomId) {
      query = query.eq('atom_id', atomId);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data: progress, error } = await query.order('updated_at', { ascending: false });

    if (error) {
      console.error('Progress fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch progress' },
        { status: 500 }
      );
    }

    // Filter by specialty/topic if needed (done in JS since it's on joined table)
    let filteredProgress = progress || [];
    if (specialty) {
      filteredProgress = filteredProgress.filter(p => p.atom?.specialty === specialty);
    }
    if (topic) {
      filteredProgress = filteredProgress.filter(p => p.atom?.topic === topic);
    }

    // Calculate summary stats
    const summary = {
      total: filteredProgress.length,
      completed: filteredProgress.filter(p => p.status === 'completed').length,
      in_progress: filteredProgress.filter(p => p.status === 'in_progress').length,
      not_started: filteredProgress.filter(p => p.status === 'not_started').length,
      total_time_seconds: filteredProgress.reduce((acc, p) => acc + (p.time_spent_seconds || 0), 0),
    };

    return NextResponse.json({
      progress: filteredProgress,
      summary
    });
  } catch (error) {
    console.error('Progress API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/progress - Update progress on an atom
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
    const { 
      atom_id, 
      status, 
      progress_percent, 
      time_spent_seconds,
      rating,
      is_saved,
      notes
    } = body;

    if (!atom_id) {
      return NextResponse.json(
        { error: 'atom_id required' },
        { status: 400 }
      );
    }

    // Get existing progress
    const { data: existing } = await supabase
      .from('user_atom_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('atom_id', atom_id)
      .single();

    // Build update data
    const updateData: Record<string, any> = {
      user_id: user.id,
      atom_id,
      updated_at: new Date().toISOString(),
      last_accessed_at: new Date().toISOString(),
    };

    if (status) updateData.status = status;
    if (progress_percent !== undefined) updateData.progress_percent = progress_percent;
    if (rating !== undefined) updateData.rating = rating;
    if (is_saved !== undefined) updateData.is_saved = is_saved;
    if (notes !== undefined) updateData.notes = notes;

    // Handle time spent (accumulate)
    if (time_spent_seconds) {
      updateData.time_spent_seconds = (existing?.time_spent_seconds || 0) + time_spent_seconds;
    }

    // Set completed_at if marking as completed
    if (status === 'completed' && existing?.status !== 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    // Upsert progress
    const { data: progress, error } = await supabase
      .from('user_atom_progress')
      .upsert(updateData, {
        onConflict: 'user_id,atom_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Progress update error:', error);
      return NextResponse.json(
        { error: 'Failed to update progress' },
        { status: 500 }
      );
    }

    // Update streak if this is a new study activity
    await fetch(new URL('/api/streaks', request.url), {
      method: 'POST',
      headers: { cookie: request.headers.get('cookie') || '' }
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Progress API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
