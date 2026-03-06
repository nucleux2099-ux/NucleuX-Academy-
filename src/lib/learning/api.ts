import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

export type AuthContext =
  | {
      supabase: ServerSupabaseClient;
      userId: string;
      unauthorized: null;
    }
  | {
      supabase: ServerSupabaseClient;
      userId: null;
      unauthorized: NextResponse;
    };

export async function requireAuth(): Promise<AuthContext> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      supabase,
      userId: null,
      unauthorized: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  return { supabase, userId: user.id, unauthorized: null };
}

export async function userOwnsLearningTopic(
  supabase: ServerSupabaseClient,
  userId: string,
  learningTopicId: string
) {
  const { data, error } = await supabase
    .from('learning_topics')
    .select('id, user_id')
    .eq('id', learningTopicId)
    .eq('user_id', userId)
    .single();

  if (error || !data) return false;
  return true;
}

