'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, BookOpen, Clock, FileText, Flame, Target, TrendingUp, Zap } from 'lucide-react';
import { useAnalytics } from '@/lib/api/hooks';
import { ApiStateBoundary } from '@/components/api-state-boundary';

const PERIODS = [
  { label: 'This Week', days: 7 },
  { label: 'This Month', days: 30 },
  { label: 'All Time', days: 365 },
] as const;

function dayLabel(dateInput?: string) {
  if (!dateInput) return 'Day';
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return 'Day';
  return date.toLocaleDateString('en-IN', { weekday: 'short' });
}

function formatHourWindow(hour24: number) {
  const start = new Date();
  start.setHours(hour24, 0, 0, 0);
  const end = new Date();
  end.setHours((hour24 + 2) % 24, 0, 0, 0);
  return `${start.toLocaleTimeString('en-IN', { hour: 'numeric' })} - ${end.toLocaleTimeString('en-IN', { hour: 'numeric' })}`;
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>(PERIODS[0]);
  const { data: analytics, isLoading, error } = useAnalytics(period.days);

  const studyHours = ((analytics?.totalStudyMinutes || 0) / 60).toFixed(1);
  const notesEstimate = Math.round((analytics?.topicsCompleted || 0) * 0.7);
  const bars = useMemo(() => {
    if (!analytics) return [];
    if (analytics.dailyStats.length > 0) {
      return [...analytics.dailyStats]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((d) => ({
          label: dayLabel(d.date),
          minutes: d.study_minutes || 0,
          mcqs: d.mcqs_attempted || 0,
          correct: d.mcqs_correct || 0,
        }));
    }
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return analytics.weeklyStudyMinutes.map((minutes, idx) => ({
      label: labels[idx] || `D${idx + 1}`,
      minutes: minutes || 0,
      mcqs: analytics.weeklyMcqs[idx] || 0,
      correct: 0,
    }));
  }, [analytics]);

  const maxBarMinutes = Math.max(1, ...bars.map((b) => b.minutes));
  const weakAreas = bars
    .filter((b) => b.mcqs >= 5)
    .map((b) => ({
      ...b,
      accuracy: b.mcqs > 0 ? Math.round((b.correct / b.mcqs) * 100) : 0,
    }))
    .filter((b) => b.accuracy < 65)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  const peakStudyWindow = useMemo(() => {
    const sessions = analytics?.recentSessions || [];
    if (sessions.length === 0) return 'Not enough session data yet';
    const buckets = new Map<number, number>();
    for (const session of sessions) {
      if (!session.started_at) continue;
      const hour = new Date(session.started_at).getHours();
      if (Number.isNaN(hour)) continue;
      buckets.set(hour, (buckets.get(hour) || 0) + 1);
    }
    if (buckets.size === 0) return 'Not enough session data yet';
    const [bestHour] = [...buckets.entries()].sort((a, b) => b[1] - a[1])[0];
    return formatHourWindow(bestHour);
  }, [analytics?.recentSessions]);

  if (!analytics) {
    return (
      <ApiStateBoundary
        isLoading={isLoading}
        error={error}
        data={analytics}
        loadingText="Loading analytics..."
        errorText="Unable to load analytics right now."
        className="app-shell"
      >
        <div />
      </ApiStateBoundary>
    );
  }

  return (
    <ApiStateBoundary
      isLoading={isLoading}
      error={error}
      data={analytics}
      loadingText="Loading analytics..."
      errorText="Unable to load analytics right now."
      className="app-shell"
    >
    <div className="ui-shell ui-page space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#E8E0D5]">Study Analytics</h1>
        <div className="flex gap-1 bg-[#253545] rounded-xl p-1">
          {PERIODS.map((p) => (
            <button
              key={p.label}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period.label === p.label ? 'bg-[#5BB3B3] text-white' : 'text-[#A0B0BC] hover:text-[#E8E0D5]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Study Hours', value: studyHours, icon: Clock },
          { label: 'Topics Covered', value: String(analytics.topicsCompleted), icon: BookOpen },
          { label: 'MCQ Accuracy', value: `${analytics.avgAccuracy}%`, icon: Target },
          { label: 'Notes Created (est.)', value: String(notesEstimate), icon: FileText },
          { label: 'Current Streak', value: `${analytics.currentStreak}d`, icon: Flame },
        ].map((s) => (
          <div key={s.label} className="bg-[#253545] rounded-xl p-4 border border-[#5BB3B3]/20">
            <s.icon className="w-5 h-5 text-[#5BB3B3] mb-2" />
            <p className="text-2xl font-bold text-[#E8E0D5]">{s.value}</p>
            <p className="text-xs text-[#A0B0BC]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#253545] rounded-xl p-5 border border-[#5BB3B3]/20">
        <h2 className="text-lg font-semibold text-[#E8E0D5] mb-4">Recent Sessions</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[#A0B0BC] text-left border-b border-[#A0B0BC]/20">
              <th className="pb-2">Start</th>
              <th className="pb-2">Duration</th>
              <th className="pb-2">MCQs</th>
              <th className="pb-2">Accuracy</th>
              <th className="pb-2">Source</th>
            </tr>
          </thead>
          <tbody>
            {analytics.recentSessions.length === 0 && (
              <tr>
                <td className="py-3 text-[#A0B0BC]" colSpan={5}>No recent sessions found.</td>
              </tr>
            )}
            {analytics.recentSessions.map((s) => {
              const startedAt = s.started_at ? new Date(s.started_at) : null;
              const attempted = s.mcqs_attempted || 0;
              const correct = s.mcqs_correct || 0;
              const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
              return (
                <tr key={s.id} className="border-b border-[#A0B0BC]/10 text-[#E8E0D5]">
                  <td className="py-2.5">{startedAt ? startedAt.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : 'N/A'}</td>
                  <td>{s.duration_minutes ?? 0}m</td>
                  <td>{attempted}</td>
                  <td>{attempted > 0 ? `${accuracy}%` : 'N/A'}</td>
                  <td className="capitalize">{s.source || 'unknown'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-[#253545] rounded-xl p-5 border border-[#5BB3B3]/20">
        <h2 className="text-lg font-semibold text-[#E8E0D5] mb-4">Daily Activity</h2>
        <div className="flex items-end justify-between gap-2 h-40">
          {bars.length === 0 && <p className="text-sm text-[#A0B0BC]">No daily activity yet.</p>}
          {bars.map((b) => (
            <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-md bg-[#5BB3B3]" style={{ height: `${Math.max(4, (b.minutes / maxBarMinutes) * 100)}%` }} />
              <span className="text-xs text-[#A0B0BC]">{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#253545] rounded-xl p-5 border border-red-400/20">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-semibold text-[#E8E0D5]">Focus Areas</h2>
          </div>
          <div className="space-y-3">
            {weakAreas.length === 0 && (
              <div className="bg-[#2D3E50] rounded-lg p-3">
                <p className="text-[#E8E0D5] font-medium">No weak signals in the selected window.</p>
                <p className="text-xs text-[#A0B0BC]">Keep logging MCQ attempts to get better guidance.</p>
              </div>
            )}
            {weakAreas.map((w) => (
              <div key={w.label} className="flex items-center justify-between bg-[#2D3E50] rounded-lg p-3">
                <div>
                  <p className="text-[#E8E0D5] font-medium">{w.label} - {w.accuracy}%</p>
                  <p className="text-xs text-[#A0B0BC]">{w.correct}/{w.mcqs} correct answers</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#253545] rounded-xl p-5 border border-[#5BB3B3]/20">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-[#E8E0D5]">Peak Study Time</h2>
          </div>
          <p className="text-3xl font-bold text-[#5BB3B3]">{peakStudyWindow}</p>
          <p className="text-[#A0B0BC] mt-2 text-sm flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Based on your most frequent session start times in this period.
          </p>
        </div>
      </div>
    </div>
    </ApiStateBoundary>
  );
}
