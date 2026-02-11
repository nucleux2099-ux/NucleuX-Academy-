import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type AtomLite = {
  id?: string;
  title?: string;
  slug?: string;
  type?: string;
  specialty?: string;
  topic?: string;
  read_time_minutes?: number;
  difficulty?: number;
};

type ProgressAtom = {
  atom?: AtomLite;
  progress_percent?: number;
  time_spent_seconds?: number;
};

// GET /api/study-plan - Get user's study plan for today
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

    const today = new Date().toISOString().split('T')[0];

    // Get user preferences for daily goals
    const { data: prefs } = await supabase
      .from('user_preferences')
      .select('daily_goal_minutes, mcq_daily_target')
      .eq('user_id', user.id)
      .single();

    // Get today's stats
    const { data: todayStats } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    // Get active pathways
    const { data: pathways } = await supabase
      .from('user_pathways')
      .select(`
        *,
        pathway:pathways(id, title, atoms, total_atoms)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('last_accessed_at', { ascending: false })
      .limit(1);

    // Get recent incomplete atoms
    const { data: recentProgress } = await supabase
      .from('user_atom_progress')
      .select(`
        *,
        atom:atoms(id, title, slug, type, specialty, topic, read_time_minutes)
      `)
      .eq('user_id', user.id)
      .eq('status', 'in_progress')
      .order('last_accessed_at', { ascending: false })
      .limit(5);

    // Get recommended atoms (based on specialty and incomplete topics)
    const { data: profile } = await supabase
      .from('profiles')
      .select('specialty, target_exam')
      .eq('id', user.id)
      .single();

    let recommendedAtoms: AtomLite[] = [];
    if (profile?.specialty) {
      const { data: atoms } = await supabase
        .from('atoms')
        .select('id, title, slug, type, specialty, topic, read_time_minutes, difficulty')
        .eq('specialty', profile.specialty)
        .eq('is_published', true)
        .order('view_count', { ascending: false })
        .limit(5);
      
      recommendedAtoms = atoms || [];
    }

    // Build study plan
    const dailyGoalMinutes = prefs?.daily_goal_minutes || 60;
    const mcqTarget = prefs?.mcq_daily_target || 20;
    const studiedToday = todayStats?.study_minutes || 0;
    const mcqsToday = todayStats?.mcqs_attempted || 0;

    const studyPlan = {
      // Goals
      goals: {
        study_minutes: dailyGoalMinutes,
        mcqs: mcqTarget,
      },
      
      // Progress today
      today: {
        study_minutes: studiedToday,
        mcqs_attempted: mcqsToday,
        mcqs_correct: todayStats?.mcqs_correct || 0,
        topics_completed: todayStats?.topics_completed || 0,
        goal_progress: Math.round((studiedToday / dailyGoalMinutes) * 100),
        mcq_progress: Math.round((mcqsToday / mcqTarget) * 100),
      },
      
      // Active pathway
      active_pathway: pathways?.[0] ? {
        id: pathways[0].pathway?.id,
        title: pathways[0].pathway?.title,
        current_atom_index: pathways[0].current_atom_index,
        total_atoms: pathways[0].pathway?.total_atoms,
        progress_percent: Math.round(
          ((pathways[0].current_atom_index || 0) / (pathways[0].pathway?.total_atoms || 1)) * 100
        ),
      } : null,
      
      // Continue where you left off
      continue_learning: (recentProgress || []).map(p => ({
        atom_id: p.atom?.id,
        title: p.atom?.title,
        slug: p.atom?.slug,
        type: p.atom?.type,
        specialty: p.atom?.specialty,
        topic: p.atom?.topic,
        progress_percent: p.progress_percent,
        time_spent: p.time_spent_seconds,
        estimated_time: p.atom?.read_time_minutes,
      })),
      
      // Recommendations
      recommended: recommendedAtoms.map(a => ({
        atom_id: a.id,
        title: a.title,
        slug: a.slug,
        type: a.type,
        specialty: a.specialty,
        topic: a.topic,
        estimated_time: a.read_time_minutes,
        difficulty: a.difficulty,
      })),
      
      // Tasks for today (generated)
      tasks: generateDailyTasks(
        dailyGoalMinutes,
        studiedToday,
        mcqTarget,
        mcqsToday,
        recentProgress || [],
        recommendedAtoms
      ),
    };

    return NextResponse.json(studyPlan);
  } catch (error) {
    console.error('Study plan API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper to generate daily tasks
function generateDailyTasks(
  goalMinutes: number,
  studiedMinutes: number,
  mcqTarget: number,
  mcqsAttempted: number,
  inProgress: ProgressAtom[],
  recommended: AtomLite[]
): Array<{
  id: string;
  type: 'continue' | 'mcq' | 'new' | 'review';
  title: string;
  description: string;
  atom_id?: string;
  slug?: string;
  estimated_minutes: number;
  priority: 'high' | 'medium' | 'low';
}> {
  const tasks: Array<{
    id: string;
    type: 'continue' | 'mcq' | 'new' | 'review';
    title: string;
    description: string;
    atom_id?: string;
    slug?: string;
    estimated_minutes: number;
    priority: 'high' | 'medium' | 'low';
  }> = [];
  const remainingMinutes = goalMinutes - studiedMinutes;
  const remainingMcqs = mcqTarget - mcqsAttempted;

  // Task 1: Continue in-progress atoms
  if (inProgress.length > 0) {
    const firstIncomplete = inProgress[0];
    tasks.push({
      id: 'continue-' + firstIncomplete.atom?.id,
      type: 'continue',
      title: `Continue: ${firstIncomplete.atom?.title}`,
      description: `${firstIncomplete.progress_percent}% complete`,
      atom_id: firstIncomplete.atom?.id,
      slug: firstIncomplete.atom?.slug,
      estimated_minutes: Math.max(5, (firstIncomplete.atom?.read_time_minutes || 10) - Math.round((firstIncomplete.time_spent_seconds || 0) / 60)),
      priority: 'high',
    });
  }

  // Task 2: MCQ practice
  if (remainingMcqs > 0) {
    tasks.push({
      id: 'mcq-practice',
      type: 'mcq',
      title: `Practice ${Math.min(remainingMcqs, 10)} MCQs`,
      description: `${mcqsAttempted}/${mcqTarget} completed today`,
      estimated_minutes: Math.min(remainingMcqs, 10) * 2,
      priority: remainingMcqs > mcqTarget / 2 ? 'high' : 'medium',
    });
  }

  // Task 3: New topic from recommendations
  if (recommended.length > 0 && remainingMinutes > 10) {
    const newTopic = recommended[0];
    tasks.push({
      id: 'new-' + newTopic.id,
      type: 'new',
      title: `Start: ${newTopic.title}`,
      description: newTopic.topic || 'Recommended topic',
      atom_id: newTopic.id,
      slug: newTopic.slug,
      estimated_minutes: newTopic.read_time_minutes || 15,
      priority: 'medium',
    });
  }

  // Task 4: Review (if time permits)
  if (remainingMinutes > 20) {
    tasks.push({
      id: 'review',
      type: 'review',
      title: 'Quick Review',
      description: 'Review topics from this week',
      estimated_minutes: 10,
      priority: 'low',
    });
  }

  return tasks;
}
