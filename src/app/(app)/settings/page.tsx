"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, Bell, Moon, Sun, Globe, Shield, Smartphone, 
  Mail, Clock, BookOpen, Brain, Zap, Download, Trash2,
  ChevronRight, Check, Volume2, VolumeX
} from "lucide-react";

const settingsSections = [
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
    description: "Manage how you receive updates",
    settings: [
      { id: "push", label: "Push Notifications", description: "Get notified on your device", enabled: true },
      { id: "email", label: "Email Digest", description: "Weekly summary of your progress", enabled: true },
      { id: "reminder", label: "Study Reminders", description: "Daily reminders to study", enabled: true },
      { id: "arena", label: "Arena Alerts", description: "New competitions and challenges", enabled: false },
      { id: "community", label: "Community Updates", description: "Replies and mentions", enabled: true },
    ]
  },
  {
    id: "study",
    title: "Study Preferences",
    icon: BookOpen,
    description: "Customize your learning experience",
    settings: [
      { id: "spaced", label: "Spaced Repetition", description: "Enable intelligent review scheduling", enabled: true },
      { id: "interleave", label: "Interleaved Practice", description: "Mix topics for better retention", enabled: true },
      { id: "difficulty", label: "Adaptive Difficulty", description: "Auto-adjust based on performance", enabled: true },
      { id: "timer", label: "Focus Timer", description: "Pomodoro-style study sessions", enabled: false },
    ]
  },
  {
    id: "atom",
    title: "ATOM Preferences",
    icon: Brain,
    description: "Configure your AI companion",
    settings: [
      { id: "proactive", label: "Proactive Suggestions", description: "ATOM suggests what to study", enabled: true },
      { id: "explain", label: "Detailed Explanations", description: "Comprehensive answer breakdowns", enabled: true },
      { id: "voice", label: "Voice Responses", description: "ATOM reads explanations aloud", enabled: false },
      { id: "feedback", label: "Instant Feedback", description: "Immediate MCQ explanations", enabled: true },
    ]
  },
  {
    id: "privacy",
    title: "Privacy & Data",
    icon: Shield,
    description: "Control your data and privacy",
    settings: [
      { id: "analytics", label: "Learning Analytics", description: "Track your study patterns", enabled: true },
      { id: "share", label: "Share Progress", description: "Show stats on leaderboard", enabled: true },
      { id: "history", label: "Save History", description: "Keep study session records", enabled: true },
    ]
  }
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    settingsSections.forEach(section => {
      section.settings.forEach(setting => {
        initial[setting.id] = setting.enabled;
      });
    });
    return initial;
  });
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [saved, setSaved] = useState(false);

  const toggleSetting = (id: string) => {
    setSettings(prev => ({ ...prev, [id]: !prev[id] }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#E8E0D5] flex items-center gap-3">
            <Settings className="w-8 h-8 text-[#5BB3B3]" />
            Settings
          </h1>
          <p className="text-[#A0B0BC] mt-1">Customize your NucleuX experience</p>
        </div>
        <Button 
          onClick={handleSave}
          className={`${saved ? 'bg-[#7BA69E]' : 'bg-[#5BB3B3]'} hover:bg-[#4A9E9E] text-[#2D3E50]`}
        >
          {saved ? <><Check className="w-4 h-4 mr-2" /> Saved</> : 'Save Changes'}
        </Button>
      </div>

      {/* Theme Selector */}
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
        <CardHeader>
          <CardTitle className="text-lg text-[#E8E0D5] flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-[#5BB3B3]" /> : <Sun className="w-5 h-5 text-[#C9A86C]" />}
            Appearance
          </CardTitle>
          <CardDescription className="text-[#A0B0BC]">Choose your preferred theme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {[
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'system', label: 'System', icon: Smartphone },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as typeof theme)}
                className={`flex-1 p-4 rounded-xl border transition-all ${
                  theme === t.id 
                    ? 'bg-[rgba(91,179,179,0.15)] border-[#5BB3B3] text-[#E8E0D5]' 
                    : 'bg-[#3A4D5F] border-[rgba(91,179,179,0.1)] text-[#A0B0BC] hover:border-[rgba(91,179,179,0.3)]'
                }`}
              >
                <t.icon className={`w-6 h-6 mx-auto mb-2 ${theme === t.id ? 'text-[#5BB3B3]' : ''}`} />
                <p className="text-sm font-medium">{t.label}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings Sections */}
      {settingsSections.map((section) => (
        <Card key={section.id} className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
          <CardHeader>
            <CardTitle className="text-lg text-[#E8E0D5] flex items-center gap-2">
              <section.icon className="w-5 h-5 text-[#5BB3B3]" />
              {section.title}
            </CardTitle>
            <CardDescription className="text-[#A0B0BC]">{section.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {section.settings.map((setting) => (
              <div 
                key={setting.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#3A4D5F] border border-[rgba(91,179,179,0.1)]"
              >
                <div>
                  <p className="font-medium text-[#E8E0D5]">{setting.label}</p>
                  <p className="text-sm text-[#6B7280]">{setting.description}</p>
                </div>
                <Switch 
                  checked={settings[setting.id]} 
                  onCheckedChange={() => toggleSetting(setting.id)}
                  className="data-[state=checked]:bg-[#5BB3B3]"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Danger Zone */}
      <Card className="bg-[#364A5E] border-[rgba(239,68,68,0.3)]">
        <CardHeader>
          <CardTitle className="text-lg text-[#E57373] flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-[#A0B0BC]">Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)]">
            <div>
              <p className="font-medium text-[#E8E0D5]">Export All Data</p>
              <p className="text-sm text-[#6B7280]">Download your notes, progress, and history</p>
            </div>
            <Button variant="outline" className="border-[#E57373] text-[#E57373] hover:bg-[rgba(239,68,68,0.1)]">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)]">
            <div>
              <p className="font-medium text-[#E8E0D5]">Delete Account</p>
              <p className="text-sm text-[#6B7280]">Permanently remove all your data</p>
            </div>
            <Button variant="outline" className="border-[#E57373] text-[#E57373] hover:bg-[rgba(239,68,68,0.1)]">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
