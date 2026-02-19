'use client';

import { useState } from 'react';
import { Settings, User, Palette, Bell, BookOpen, Atom, Save } from 'lucide-react';
import { useProfile, useTrackEvent, useUpdateProfile, type UserProfile } from '@/lib/api/hooks';
import { ApiStateBoundary } from '@/components/api-state-boundary';

type SettingsDraft = Partial<UserProfile> & {
  daily_goal_minutes?: number;
  mcq_daily_target?: number;
  preferred_study_time?: string;
  notification_email?: boolean;
  notification_telegram?: boolean;
  atom_proactive?: boolean;
  theme?: string;
};

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-11 h-6 rounded-full relative transition-colors ${on ? 'bg-[#A0B0BC]' : 'bg-[#2D3E50]'}`}
    >
      <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${on ? 'left-5.5' : 'left-0.5'}`} />
    </button>
  );
}

export default function SettingsPage() {
  const { data: profile, isLoading, error } = useProfile();
  const { updateProfile, isUpdating } = useUpdateProfile();
  const { trackEvent } = useTrackEvent();
  const [draft, setDraft] = useState<SettingsDraft>({});
  const [status, setStatus] = useState<string>('');

  const value = <T,>(key: keyof SettingsDraft, fallback: T): T => {
    const next = draft[key];
    return (next !== undefined ? (next as T) : fallback);
  };

  const setField = <T,>(key: keyof SettingsDraft, next: T) => {
    setDraft((prev) => ({ ...prev, [key]: next }));
  };

  const handleSave = async () => {
    setStatus('');
    try {
      await updateProfile(draft);
      setDraft({});
      setStatus('Saved successfully');
      void trackEvent('task_completed', {
        source: 'settings_save',
        updated_fields: Object.keys(draft),
      });
    } catch {
      setStatus('Failed to save settings');
    }
  };

  if (!profile) {
    return (
      <ApiStateBoundary
        isLoading={isLoading}
        error={error}
        data={profile}
        loadingText="Loading settings..."
        errorText="Unable to load settings right now."
        className="bg-[#2D3E50]"
      >
        <div />
      </ApiStateBoundary>
    );
  }

  const dailyGoal = value('daily_goal_minutes', profile.preferences.daily_goal_minutes || 60);
  const mcqTarget = value('mcq_daily_target', profile.preferences.mcq_daily_target || 20);
  const preferredStudyTime = value('preferred_study_time', profile.preferences.preferred_study_time || 'evening');
  const emailNotif = value('notification_email', profile.preferences.notification_email ?? true);
  const telegramNotif = value('notification_telegram', profile.preferences.notification_telegram ?? true);
  const atomProactive = value('atom_proactive', true);
  const theme = value('theme', profile.preferences.theme || 'dark');

  return (
    <ApiStateBoundary
      isLoading={isLoading}
      error={error}
      data={profile}
      loadingText="Loading settings..."
      errorText="Unable to load settings right now."
      className="bg-[#2D3E50]"
    >
    <div className="min-h-screen bg-[#2D3E50] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-[#A0B0BC]" />
        <h1 className="text-2xl font-bold text-[#E8E0D5]">Settings</h1>
      </div>

      <div className="bg-[#253545] rounded-xl p-5 border border-[#A0B0BC]/20 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-5 h-5 text-[#A0B0BC]" />
          <h2 className="text-lg font-semibold text-[#E8E0D5]">Account</h2>
        </div>
        <div>
          <label className="text-xs text-[#A0B0BC]">Name</label>
          <input
            value={value('full_name', profile.full_name || '')}
            onChange={(e) => setField('full_name', e.target.value)}
            className="mt-1 w-full bg-[#2D3E50] rounded-lg px-4 py-2.5 text-[#E8E0D5] text-sm border border-transparent focus:border-[#5BB3B3] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-[#A0B0BC]">Email</label>
          <div className="mt-1 bg-[#2D3E50] rounded-lg px-4 py-2.5 text-[#E8E0D5] text-sm">{profile.email}</div>
        </div>
        <div>
          <label className="text-xs text-[#A0B0BC]">Institution</label>
          <input
            value={value('institution', profile.institution || '')}
            onChange={(e) => setField('institution', e.target.value)}
            className="mt-1 w-full bg-[#2D3E50] rounded-lg px-4 py-2.5 text-[#E8E0D5] text-sm border border-transparent focus:border-[#5BB3B3] focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-[#253545] rounded-xl p-5 border border-[#A0B0BC]/20">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-[#A0B0BC]" />
          <h2 className="text-lg font-semibold text-[#E8E0D5]">Appearance</h2>
        </div>
        <div className="flex gap-2">
          {['dark', 'light', 'system'].map((nextTheme) => (
            <button
              key={nextTheme}
              onClick={() => setField('theme', nextTheme)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                theme === nextTheme ? 'bg-[#A0B0BC] text-[#253545]' : 'bg-[#2D3E50] text-[#A0B0BC] hover:text-[#E8E0D5]'
              }`}
            >
              {nextTheme}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#253545] rounded-xl p-5 border border-[#A0B0BC]/20 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-5 h-5 text-[#A0B0BC]" />
          <h2 className="text-lg font-semibold text-[#E8E0D5]">Notifications</h2>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#E8E0D5]">Email Notifications</span>
          <Toggle on={emailNotif} onToggle={() => setField('notification_email', !emailNotif)} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#E8E0D5]">Telegram Notifications</span>
          <Toggle on={telegramNotif} onToggle={() => setField('notification_telegram', !telegramNotif)} />
        </div>
      </div>

      <div className="bg-[#253545] rounded-xl p-5 border border-[#A0B0BC]/20 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-[#A0B0BC]" />
          <h2 className="text-lg font-semibold text-[#E8E0D5]">Study Preferences</h2>
        </div>
        <div>
          <label className="text-sm text-[#A0B0BC]">Daily Goal: {dailyGoal} minutes</label>
          <input
            type="range"
            min={15}
            max={240}
            step={15}
            value={dailyGoal}
            onChange={(e) => setField('daily_goal_minutes', Number(e.target.value))}
            className="w-full mt-2 accent-[#A0B0BC]"
          />
        </div>
        <div>
          <label className="text-sm text-[#A0B0BC]">MCQ Target: {mcqTarget}/day</label>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={mcqTarget}
            onChange={(e) => setField('mcq_daily_target', Number(e.target.value))}
            className="w-full mt-2 accent-[#A0B0BC]"
          />
        </div>
        <div>
          <label className="text-sm text-[#A0B0BC] block mb-2">Preferred Study Time</label>
          <div className="flex gap-2">
            {['morning', 'afternoon', 'evening', 'night'].map((slot) => (
              <button
                key={slot}
                onClick={() => setField('preferred_study_time', slot)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  preferredStudyTime === slot ? 'bg-[#A0B0BC] text-[#253545]' : 'bg-[#2D3E50] text-[#A0B0BC]'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#253545] rounded-xl p-5 border border-[#A0B0BC]/20 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Atom className="w-5 h-5 text-[#A0B0BC]" />
          <h2 className="text-lg font-semibold text-[#E8E0D5]">ATOM Settings</h2>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#E8E0D5]">Proactive Suggestions</span>
          <Toggle on={atomProactive} onToggle={() => setField('atom_proactive', !atomProactive)} />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={isUpdating}
        className="w-full flex items-center justify-center gap-2 bg-[#A0B0BC] text-[#253545] font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        <Save className="w-5 h-5" /> {isUpdating ? 'Saving...' : 'Save Settings'}
      </button>
      {status && <p className="text-center text-sm text-[#A0B0BC]">{status}</p>}
    </div>
    </ApiStateBoundary>
  );
}
