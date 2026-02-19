'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAnalytics, useProfile } from '@/lib/api/hooks';
import { ApiStateBoundary } from '@/components/api-state-boundary';
import { User, Clock, Target, Percent, Flame, Calendar, Settings } from 'lucide-react';

const ROOM = '#5BB3B3';

function formatRelativeTime(input?: string) {
  if (!input) return 'No recent activity';
  const then = new Date(input).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - then);
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(input).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function ProfilePage() {
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile();
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useAnalytics(30);

  const isLoading = profileLoading || analyticsLoading;
  const error = profileError || analyticsError;
  const name = profile?.full_name || profile?.username || profile?.email || 'User';
  const specialty = profile?.specialty || 'General';
  const level = profile?.level || 'student';
  const plan = profile?.plan || 'free';
  const studyHours = ((analytics?.totalStudyMinutes || 0) / 60).toFixed(1);
  const totalQuestions = analytics?.totalQuestions || 0;
  const accuracy = analytics?.avgAccuracy || 0;
  const currentStreak = profile?.streak?.current_streak || analytics?.currentStreak || 0;
  const recentSessions = analytics?.recentSessions || [];

  const achievements = [
    { name: 'Streak Starter', unlocked: currentStreak >= 3, hint: 'Maintain 3-day streak' },
    { name: 'MCQ Runner', unlocked: totalQuestions >= 50, hint: 'Attempt 50 MCQs' },
    { name: 'Consistent Accuracy', unlocked: accuracy >= 70, hint: 'Keep 70%+ accuracy' },
    { name: 'Focused Learner', unlocked: (analytics?.topicsCompleted || 0) >= 10, hint: 'Complete 10 topics' },
  ];

  return (
    <ApiStateBoundary
      isLoading={isLoading}
      error={error}
      data={profile || analytics}
      loadingText="Loading profile..."
      errorText="Unable to load profile right now."
    >
    <div className="min-h-screen p-6 space-y-6">
      <Card className="bg-[#253545] border-[rgba(232,224,213,0.06)] rounded-xl p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: `${ROOM}22` }}>
            <User size={36} style={{ color: ROOM }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#E8E0D5]">{name}</h1>
            <p className="text-sm text-[#A0B0BC] capitalize">{level} • {specialty}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="text-xs" style={{ backgroundColor: `${ROOM}22`, color: ROOM }}>
                {plan.toUpperCase()} Plan
              </Badge>
              <Badge className="text-xs bg-amber-500/20 text-amber-400">
                {profile?.onboarding_completed ? 'Onboarding Complete' : 'Onboarding Pending'}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Study Hours', value: studyHours, icon: Clock, color: ROOM },
          { label: 'Questions', value: String(totalQuestions), icon: Target, color: '#E879F9' },
          { label: 'Accuracy', value: `${accuracy}%`, icon: Percent, color: '#34d399' },
          { label: 'Current Streak', value: `${currentStreak}d`, icon: Flame, color: '#f97316' },
        ].map((s) => (
          <Card key={s.label} className="bg-[#253545] border-[rgba(232,224,213,0.06)] rounded-xl p-4 text-center">
            <s.icon size={20} className="mx-auto mb-2" style={{ color: s.color }} />
            <p className="text-xl font-bold text-[#E8E0D5]">{s.value}</p>
            <p className="text-[10px] text-[#A0B0BC]">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#253545] border-[rgba(232,224,213,0.06)] rounded-xl p-5">
          <h3 className="text-[#E8E0D5] font-semibold mb-4">Progress Milestones</h3>
          <div className="grid grid-cols-1 gap-3">
            {achievements.map((a) => (
              <div key={a.name} className={`flex items-center justify-between p-3 rounded-xl ${a.unlocked ? 'bg-[#1a2a38]' : 'bg-[#1a2a38]/50 opacity-60'}`}>
                <p className="text-sm text-[#E8E0D5]">{a.name}</p>
                <p className="text-xs text-[#A0B0BC]">{a.unlocked ? 'Unlocked' : a.hint}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-[#253545] border-[rgba(232,224,213,0.06)] rounded-xl p-5">
          <h3 className="text-[#E8E0D5] font-semibold mb-4">Recent Sessions</h3>
          <div className="space-y-3">
            {recentSessions.length === 0 && (
              <p className="text-sm text-[#A0B0BC]">No recent sessions yet.</p>
            )}
            {recentSessions.slice(0, 5).map((session, index) => {
              const startedAt = typeof session.started_at === 'string' ? session.started_at : undefined;
              const duration = typeof session.duration_minutes === 'number' ? `${session.duration_minutes} min` : 'In progress';
              return (
                <div key={startedAt || index} className="flex items-center justify-between p-3 rounded-xl bg-[#1a2a38]">
                  <p className="text-sm text-[#E8E0D5]">{duration}</p>
                  <p className="text-xs text-[#A0B0BC]">{formatRelativeTime(startedAt)}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="bg-[#253545] border-[rgba(232,224,213,0.06)] rounded-xl p-5">
        <h3 className="text-[#E8E0D5] font-semibold mb-4 flex items-center gap-2">
          <Settings size={16} style={{ color: ROOM }} /> Preferences Snapshot
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#1a2a38]">
            <span className="text-xs text-[#A0B0BC]">Daily Goal</span>
            <span className="text-xs text-[#E8E0D5] font-medium">{profile?.preferences?.daily_goal_minutes || 60} min</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#1a2a38]">
            <span className="text-xs text-[#A0B0BC]">MCQ Target</span>
            <span className="text-xs text-[#E8E0D5] font-medium">{profile?.preferences?.mcq_daily_target || 20} / day</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#1a2a38]">
            <span className="text-xs text-[#A0B0BC]">Preferred Time</span>
            <span className="text-xs text-[#E8E0D5] font-medium capitalize">{profile?.preferences?.preferred_study_time || 'evening'}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#1a2a38]">
            <span className="text-xs text-[#A0B0BC]">Theme</span>
            <span className="text-xs text-[#E8E0D5] font-medium capitalize">{profile?.preferences?.theme || 'dark'}</span>
          </div>
        </div>
      </Card>

      <p className="text-center text-xs text-[#A0B0BC]/50 flex items-center justify-center gap-2">
        <Calendar size={12} /> Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'N/A'}
      </p>
    </div>
    </ApiStateBoundary>
  );
}
