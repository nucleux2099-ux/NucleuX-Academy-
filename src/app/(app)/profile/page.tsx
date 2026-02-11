"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";
import { useAnalytics } from "@/lib/analytics";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  BookOpen,
  Target,
  Clock,
  Bell,
  Moon,
  Globe,
  Shield,
  Smartphone,
  LogOut,
  Camera,
  Flame,
  Trophy,
  Zap,
  Loader2,
  Check,
  GraduationCap,
} from "lucide-react";

const achievements = [
  { icon: Flame, title: "30 Day Streak", color: "#C9A86C", threshold: 30, type: "streak" },
  { icon: BookOpen, title: "Bookworm", color: "#5BB3B3", threshold: 50, type: "topics" },
  { icon: Target, title: "Sharpshooter", color: "#10B981", threshold: 80, type: "accuracy" },
  { icon: Trophy, title: "Top Performer", color: "#5BB3B3", threshold: 100, type: "topics" },
  { icon: Zap, title: "Speed Demon", color: "#E57373", threshold: 500, type: "questions" },
];

function getInitials(name: string | null): string {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getLevelDisplay(level: string | null | undefined): string {
  const levels: Record<string, string> = {
    mbbs: "MBBS Student",
    intern: "Intern",
    pg: "PG Resident",
    practicing: "Practicing Doctor",
    other: "Medical Professional",
  };
  return levels[level || ""] || "Medical Student";
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function ProfilePage() {
  const { user, logout, isLoading: userLoading } = useAuth();
  const { analytics } = useAnalytics();

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    specialty: "",
    institution: "",
    target_exam: "",
  });

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || "",
        specialty: user.user_metadata?.specialty || "",
        institution: user.user_metadata?.institution || "",
        target_exam: user.user_metadata?.target_exam || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    // In mock mode, just show success (data doesn't persist)
    setTimeout(() => {
      setSaveSuccess(true);
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 500);
  };

  const handleLogout = () => {
    logout();
  };

  const stats = [
    { label: "Study Hours", value: Math.round(analytics.totalStudyMinutes / 60).toString(), icon: Clock },
    { label: "Topics Completed", value: analytics.topicsCompleted.toString(), icon: BookOpen },
    { label: "MCQs Attempted", value: analytics.totalQuestions.toLocaleString(), icon: Target },
    { label: "Current Streak", value: `${analytics.currentStreak} days`, icon: Flame },
  ];

  const checkAchievement = (achievement: typeof achievements[0]): boolean => {
    switch (achievement.type) {
      case "streak":
        return analytics.longestStreak >= achievement.threshold;
      case "topics":
        return analytics.topicsCompleted >= achievement.threshold;
      case "accuracy":
        return analytics.totalQuestions > 10 && 
          (analytics.correctAnswers / analytics.totalQuestions) * 100 >= achievement.threshold;
      case "questions":
        return analytics.totalQuestions >= achievement.threshold;
      default:
        return false;
    }
  };

  if (userLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#5BB3B3]" />
      </div>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const initials = getInitials(displayName);
  const userRole = user.user_metadata?.role || 'user';
  const userPlan = user.user_metadata?.plan || 'free';
  const planLabel = userRole === 'admin' ? 'Admin' : userPlan === 'premium' ? 'Premium' : userPlan === 'pro' ? 'Pro' : 'Free Plan';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#E8E0D5]">Profile</h1>
        <p className="text-[#A0B0BC] mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Header Card */}
      <Card className="bg-[#364A5E] border-[rgba(255,255,255,0.06)] overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-[#5BB3B3] to-[#5BB3B3]" />
        <CardContent className="relative pt-0 pb-6 px-6">
          {/* Avatar */}
          <div className="absolute -top-16 left-6">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-[#364A5E]">
                <AvatarImage src={user.user_metadata?.avatar_url || undefined} />
                <AvatarFallback className="bg-[#5BB3B3] text-white text-3xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-2 right-2 p-2 rounded-full bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="pt-20 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#E8E0D5]">{displayName}</h2>
              <p className="text-[#A0B0BC]">
                {userRole === 'admin' ? 'Administrator' : userRole === 'faculty' ? 'Faculty' : 'Medical Student'}
              </p>
              <div className="flex items-center gap-4 mt-3 text-sm text-[#A0B0BC]">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined Recently
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={`px-3 py-1 ${
                userRole === 'admin' 
                  ? 'bg-[rgba(239,68,68,0.2)] text-[#E57373] border-[rgba(239,68,68,0.3)]'
                  : userPlan === 'premium'
                  ? 'bg-[rgba(245,158,11,0.2)] text-[#C9A86C] border-[rgba(245,158,11,0.3)]'
                  : 'bg-[rgba(91,179,179,0.2)] text-[#5BB3B3] border-[rgba(91,179,179,0.3)]'
              }`}>
                {userRole === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                {planLabel}
              </Badge>
              {analytics.currentStreak > 0 && (
                <Badge className="bg-[rgba(245,158,11,0.2)] text-[#C9A86C] border-[rgba(245,158,11,0.3)] px-3 py-1">
                  <Flame className="w-3 h-3 mr-1" />
                  {analytics.currentStreak} Day Streak
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-[#364A5E] border-[rgba(255,255,255,0.06)]">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[rgba(91,179,179,0.15)]">
                <stat.icon className="w-5 h-5 text-[#5BB3B3]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#E8E0D5]">{stat.value}</p>
                <p className="text-sm text-[#A0B0BC]">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-[#364A5E] border border-[rgba(255,255,255,0.06)] p-1">
          <TabsTrigger value="profile" className="data-[state=active]:bg-[#5BB3B3] text-[#A0B0BC] data-[state=active]:text-white">
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-[#5BB3B3] text-[#A0B0BC] data-[state=active]:text-white">
            Preferences
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-[#5BB3B3] text-[#A0B0BC] data-[state=active]:text-white">
            Achievements
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="bg-[#364A5E] border-[rgba(255,255,255,0.06)]">
            <CardHeader>
              <CardTitle className="text-[#E8E0D5]">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-[#A0B0BC]">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0B0BC]" />
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      className="pl-10 bg-[#3A4D5F] border-[rgba(255,255,255,0.06)] focus:border-[#5BB3B3] text-[#E8E0D5]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#A0B0BC]">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0B0BC]" />
                    <Input
                      value={user.email}
                      disabled
                      className="pl-10 bg-[#3A4D5F] border-[rgba(255,255,255,0.06)] text-[#A0B0BC]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#A0B0BC]">Specialty</label>
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0B0BC]" />
                    <Input
                      value={formData.specialty}
                      onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                      placeholder="e.g., Surgery, Medicine"
                      className="pl-10 bg-[#3A4D5F] border-[rgba(255,255,255,0.06)] focus:border-[#5BB3B3] text-[#E8E0D5]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#A0B0BC]">Institution</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0B0BC]" />
                    <Input
                      value={formData.institution}
                      onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                      placeholder="Your medical college"
                      className="pl-10 bg-[#3A4D5F] border-[rgba(255,255,255,0.06)] focus:border-[#5BB3B3] text-[#E8E0D5]"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-[rgba(255,255,255,0.06)]" />

              <div className="flex justify-end items-center gap-4">
                {saveSuccess && (
                  <span className="text-sm text-[#10B981] flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Saved successfully
                  </span>
                )}
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-[#5BB3B3] hover:bg-[#4A9E9E] text-white shadow-lg shadow-[#5BB3B3]/20"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <div className="space-y-4">
            <Card className="bg-[#364A5E] border-[rgba(255,255,255,0.06)]">
              <CardHeader>
                <CardTitle className="text-[#E8E0D5]">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: Bell, label: "Daily Reminders", desc: "Get notified to study" },
                  { icon: Smartphone, label: "Telegram Notifications", desc: "ATOM will reach out on Telegram" },
                  { icon: Mail, label: "Email Updates", desc: "Weekly progress reports" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-lg bg-[#3A4D5F] border border-[rgba(255,255,255,0.06)]">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-[rgba(91,179,179,0.15)]">
                        <item.icon className="w-5 h-5 text-[#5BB3B3]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#E8E0D5]">{item.label}</p>
                        <p className="text-sm text-[#A0B0BC]">{item.desc}</p>
                      </div>
                    </div>
                    <button className="w-12 h-6 rounded-full bg-[#5BB3B3] relative">
                      <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-[#2D3E50]" />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-[#364A5E] border-[rgba(255,255,255,0.06)]">
              <CardHeader>
                <CardTitle className="text-[#E8E0D5]">Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: Moon, label: "Dark Mode", desc: "Currently active" },
                  { icon: Globe, label: "Language", desc: "English" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-lg bg-[#3A4D5F] border border-[rgba(255,255,255,0.06)]">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-[rgba(91,179,179,0.15)]">
                        <item.icon className="w-5 h-5 text-[#5BB3B3]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#E8E0D5]">{item.label}</p>
                        <p className="text-sm text-[#A0B0BC]">{item.desc}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-[rgba(255,255,255,0.06)] text-[#A0B0BC] hover:bg-[#3A4D5F]">
                      Change
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-[#364A5E] border-[rgba(255,255,255,0.06)]">
              <CardHeader>
                <CardTitle className="text-[#E8E0D5]">Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-[#3A4D5F] border border-[rgba(255,255,255,0.06)]">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-[rgba(16,185,129,0.15)]">
                      <Shield className="w-5 h-5 text-[#10B981]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#E8E0D5]">Two-Factor Authentication</p>
                      <p className="text-sm text-[#A0B0BC]">Add extra security</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-[rgba(255,255,255,0.06)] text-[#A0B0BC] hover:bg-[#3A4D5F]">
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-[#3A4D5F] border border-[rgba(255,255,255,0.06)]">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-[rgba(239,68,68,0.15)]">
                      <LogOut className="w-5 h-5 text-[#E57373]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#E8E0D5]">Sign Out</p>
                      <p className="text-sm text-[#A0B0BC]">Log out of your account</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-[rgba(239,68,68,0.3)] text-[#E57373] hover:bg-[rgba(239,68,68,0.1)]"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <Card className="bg-[#364A5E] border-[rgba(255,255,255,0.06)]">
            <CardHeader>
              <CardTitle className="text-[#E8E0D5]">Your Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => {
                  const earned = checkAchievement(achievement);
                  return (
                    <div
                      key={achievement.title}
                      className={`p-6 rounded-xl border text-center ${
                        earned
                          ? "bg-gradient-to-br from-[#364A5E] to-[#2D3E50] border-[rgba(255,255,255,0.06)]"
                          : "bg-[#2D3E50] border-[rgba(255,255,255,0.06)] opacity-50"
                      }`}
                    >
                      <div
                        className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${
                          earned ? "" : "grayscale"
                        }`}
                        style={{ backgroundColor: `${achievement.color}15` }}
                      >
                        <achievement.icon
                          className="w-8 h-8"
                          style={{ color: earned ? achievement.color : "#A0B0BC" }}
                        />
                      </div>
                      <h3 className="font-semibold mb-1 text-[#E8E0D5]">{achievement.title}</h3>
                      <p className="text-sm text-[#A0B0BC]">
                        {earned ? "Earned" : "Locked"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
