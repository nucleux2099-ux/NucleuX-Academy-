'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface CompetencyProgress {
  competency_code: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered';
  progress_percent: number;
  xp_earned: number;
  read_at?: string;
  quizzed_at?: string;
  mastered_at?: string;
}

interface UserXP {
  total_xp: number;
  level: number;
  level_name: string;
  competencies_completed: number;
  competencies_mastered: number;
}

export function useCompetencyProgress() {
  const [progress, setProgress] = useState<CompetencyProgress[]>([]);
  const [userXP, setUserXP] = useState<UserXP | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Fetch user's competency progress
  const fetchProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get competency progress
      const { data: progressData } = await supabase
        .from('competency_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressData) {
        setProgress(progressData);
      }

      // Get user XP
      const { data: xpData } = await supabase
        .from('user_xp')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (xpData) {
        setUserXP(xpData);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  // Mark competency as read (in_progress)
  const markAsRead = async (competencyCode: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('competency_progress')
        .upsert({
          user_id: user.id,
          competency_code: competencyCode,
          status: 'in_progress',
          progress_percent: 33,
          read_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,competency_code'
        });

      if (!error) {
        await fetchProgress();
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // Mark competency as completed (quiz passed)
  const markAsCompleted = async (competencyCode: string, xpReward: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update competency progress
      const { error: progressError } = await supabase
        .from('competency_progress')
        .upsert({
          user_id: user.id,
          competency_code: competencyCode,
          status: 'completed',
          progress_percent: 100,
          xp_earned: xpReward,
          quizzed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,competency_code'
        });

      if (progressError) throw progressError;

      // Update user XP
      const currentXP = userXP?.total_xp || 0;
      const currentCompleted = userXP?.competencies_completed || 0;

      const { error: xpError } = await supabase
        .from('user_xp')
        .upsert({
          user_id: user.id,
          total_xp: currentXP + xpReward,
          competencies_completed: currentCompleted + 1,
        }, {
          onConflict: 'user_id'
        });

      if (!xpError) {
        await fetchProgress();
      }
    } catch (error) {
      console.error('Error marking as completed:', error);
    }
  };

  // Get progress for a specific competency
  const getProgress = (competencyCode: string): CompetencyProgress | undefined => {
    return progress.find(p => p.competency_code === competencyCode);
  };

  // Get completion stats
  const getStats = () => {
    const completed = progress.filter(p => p.status === 'completed' || p.status === 'mastered').length;
    const inProgress = progress.filter(p => p.status === 'in_progress').length;
    const totalXP = progress.reduce((sum, p) => sum + (p.xp_earned || 0), 0);
    
    return {
      completed,
      inProgress,
      totalXP,
      level: userXP?.level || 1,
      levelName: userXP?.level_name || 'Fresher',
    };
  };

  return {
    progress,
    userXP,
    loading,
    markAsRead,
    markAsCompleted,
    getProgress,
    getStats,
    refresh: fetchProgress,
  };
}

// Hook for pathway progress
export function usePathwayProgress() {
  const [pathways, setPathways] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchPathways = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('pathway_progress')
        .select('*')
        .eq('user_id', user.id);

      if (data) {
        setPathways(data);
      }
    } catch (error) {
      console.error('Error fetching pathways:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPathways();
  }, []);

  const startPathway = async (pathwayId: string, totalSteps: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('pathway_progress')
        .upsert({
          user_id: user.id,
          pathway_id: pathwayId,
          status: 'in_progress',
          current_step: 0,
          total_steps: totalSteps,
          started_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,pathway_id'
        });

      await fetchPathways();
    } catch (error) {
      console.error('Error starting pathway:', error);
    }
  };

  const advanceStep = async (pathwayId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const current = pathways.find(p => p.pathway_id === pathwayId);
      if (!current) return;

      const newStep = current.current_step + 1;
      const isCompleted = newStep >= current.total_steps;

      await supabase
        .from('pathway_progress')
        .update({
          current_step: newStep,
          status: isCompleted ? 'completed' : 'in_progress',
          completed_at: isCompleted ? new Date().toISOString() : null,
        })
        .eq('user_id', user.id)
        .eq('pathway_id', pathwayId);

      await fetchPathways();
    } catch (error) {
      console.error('Error advancing step:', error);
    }
  };

  return {
    pathways,
    loading,
    startPathway,
    advanceStep,
    refresh: fetchPathways,
  };
}
