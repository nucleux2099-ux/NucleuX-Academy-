"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/lib/auth/context";
import { useAnalytics } from "@/lib/analytics";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
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
  { icon: Flame, title: "30 Day Streak", color: "#F59E0B", threshold: 30, type: "streak" },
  { icon: BookOpen, title: "Bookworm", color: "#7C3AED", threshold: 50, type: "topics" },
  { icon: Target, title: "Sharpshooter", color: "#10B981", threshold: 80, type: "accuracy" },
  { icon: Trophy, title: "Top Performer", color: "#06B6D4", threshold: 100, type: "topics" },
  { icon: Zap, title: "Speed Demon", color: "#EF4444", threshold: 500, type: "questions" },
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
  const router = useRouter();
  const { user, profile, streak, isLoading: userLoading, updateProfile } = useUser();
  const { analytics } = useAnalytics();
  const supabase = createClient();

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    specialty: "",
    institution: "",
    target_exam: "",
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        specialty: profile.specialty || "",
        institution: profile.institution || "",
        target_exam: profile.target_exam || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateProfile({
        full_name: formData.full_name,
        specialty: formData.specialty,
        institution: formData.institution,
        target_exam: formData.target_exam,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const stats = [
    { label: "Study Hours", value: Math.round(analytics.totalStudyMinutes / 60).toString(), icon: Clock },
    { label: "Topics Completed", value: analytics.topicsCompleted.toString(), icon: BookOpen },
    { label: "MCQs Attempted", value: analytics.totalQuestions.toLocaleString(), icon: Target },
    { label: "Current Streak", value: `${streak?.current_streak || analytics.currentStreak} days`, icon: Flame },
  ];

  const checkAchievement = (achievement: typeof achievements[0]): boolean => {
    switch (achievement.type) {
      case "streak":
        return (streak?.longest_streak || analytics.longestStreak) >= achievement.threshold;
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

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#7C3AED]" />
      </div>
    );
  }

  const displayName = profile?.full_name || user?.user_metadata?.full_name || "User";
  const initials = getInitials(displayName);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#E5E7EB]">Profile</h1>
        <p className="text-[#9CA3AF] mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Header Card */}
      <Card className="bg-[#0F2233] border-[rgba(255,255,255,0.06)] overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4]" />
        <CardContent className="relative pt-0 pb-6 px-6">
          {/* Avatar */}
          <div className="absolute -top-16 left-6">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-[#0F2233]">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-[#7C3AED] text-white text-3xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-2 right-2 p-2 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="pt-20 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#E5E7EB]">{displayName}</h2>
              <p className="text-[#9CA3AF]">
                {getLevelDisplay(profile?.level)} 
                {profile?.specialty && ` • ${profile.specialty}`}
              </p>
              <div className="flex items-center gap-4 mt-3 text-sm text-[#9CA3AF]">
                {profile?.institution && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    {profile.institution}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {formatDate(profile?.created_at)}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-[rgba(124,58,237,0.2)] text-[#7C3AED] border-[rgba(124,58,237,0.3)] px-3 py-1">
                {profile?.plan === "pro" ? "Pro Member" : "Free Plan"}
              </Badge>
              {(streak?.current_streak || analytics.currentStreak) > 0 && (
                <Badge className="bg-[rgba(245,158,11,0.2)] text-[#F59E0B] border-[rgba(245,158,11,0.3)] px-3 py-1">
                  <Flame className="w-3 h-3 mr-1" />
                  {streak?.current_streak || analytics.currentStreak} Day Streak
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-[#0F2233] border-[rgba(255,255,255,0.06)]">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[rgba(124,58,237,0.15)]">
                <stat.icon className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#E5E7EB]">{stat.value}</p>
                <p className="text-sm text-[#9CA3AF]">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-[#0F2233] border border-[rgba(255,255,255,0.06)] p-1">
          <TabsTrigger value="profile" className="data-[state=active]:bg-[#7C3AED] text-[#9CA3AF] data-[state=active]:text-white">
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-[#7C3AED] text-[#9CA3AF] data-[state=active]:text-white">
            Preferences
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-[#7C3AED] text-[#9CA3AF] data-[state=active]:text-white">
            Achievements
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="bg-[#0F2233] border-[rgba(255,255,255,0.06)]">
            <CardHeader>
              <CardTitle className="text-[#E5E7EB]">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-[#9CA3AF]">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      className="pl-10 bg-[#122A40] border-[rgba(255,255,255,0.06)] focus:border-[#7C3AED] text-[#E5E7EB]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#9CA3AF]">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <Input
                      value={user?.email || ""}
                      disabled
                      className="pl-10 bg-[#122A40] border-[rgba(255,255,255,0.06)] text-[#9CA3AF]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#9CA3AF]">Specialty</label>
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <Input
                      value={formData.specialty}
                      onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                      placeholder="e.g., Surgery, Medicine"
                      className="pl-10 bg-[#122A40] border-[rgba(255,255,255,0.06)] focus:border-[#7C3AED] text-[#E5E7EB]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#9CA3AF]">Institution</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <Input
                      value={formData.institution}
                      onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                      placeholder="Your medical college"
                      className="pl-10 bg-[#122A40] border-[rgba(255,255,255,0.06)] focus:border-[#7C3AED] text-[#E5E7EB]"
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
                  className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-lg shadow-[#7C3AED]/20"
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
            <Card className="bg-[#0F2233] border-[rgba(255,255,255,0.06)]">
              <CardHeader>
                <CardTitle className="text-[#E5E7EB]">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: Bell, label: "Daily Reminders", desc: "Get notified to study" },
                  { icon: Smartphone, label: "Telegram Notifications", desc: "ATOM will reach out on Telegram" },
                  { icon: Mail, label: "Email Updates", desc: "Weekly progress reports" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-lg bg-[#142538] border border-[rgba(255,255,255,0.06)]">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-[rgba(124,58,237,0.15)]">
                        <item.icon className="w-5 h-5 text-[#7C3AED]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#E5E7EB]">{item.label}</p>
                        <p className="text-sm text-[#9CA3AF]">{item.desc}</p>
                      </div>
                    </div>
                    <button className="w-12 h-6 rounded-full bg-[#7C3AED] relative">
                      <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-[#0D1B2A]" />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-[#0F2233] border-[rgba(255,255,255,0.06)]">
              <CardHeader>
                <CardTitle className="text-[#E5E7EB]">Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: Moon, label: "Dark Mode", desc: "Currently active" },
                  { icon: Globe, label: "Language", desc: "English" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-lg bg-[#142538] border border-[rgba(255,255,255,0.06)]">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-[rgba(6,182,212,0.15)]">
                        <item.icon className="w-5 h-5 text-[#06B6D4]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#E5E7EB]">{item.label}</p>
                        <p className="text-sm text-[#9CA3AF]">{item.desc}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-[rgba(255,255,255,0.06)] text-[#9CA3AF] hover:bg-[#142538]">
                      Change
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-[#0F2233] border-[rgba(255,255,255,0.06)]">
              <CardHeader>
                <CardTitle className="text-[#E5E7EB]">Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-[#142538] border border-[rgba(255,255,255,0.06)]">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-[rgba(16,185,129,0.15)]">
                      <Shield className="w-5 h-5 text-[#10B981]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#E5E7EB]">Two-Factor Authentication</p>
                      <p className="text-sm text-[#9CA3AF]">Add extra security</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-[rgba(255,255,255,0.06)] text-[#9CA3AF] hover:bg-[#142538]">
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-[#142538] border border-[rgba(255,255,255,0.06)]">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-[rgba(239,68,68,0.15)]">
                      <LogOut className="w-5 h-5 text-[#EF4444]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#E5E7EB]">Sign Out</p>
                      <p className="text-sm text-[#9CA3AF]">Log out of your account</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-[rgba(239,68,68,0.3)] text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)]"
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
          <Card className="bg-[#0F2233] border-[rgba(255,255,255,0.06)]">
            <CardHeader>
              <CardTitle className="text-[#E5E7EB]">Your Achievements</CardTitle>
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
                          ? "bg-gradient-to-br from-[#0F2233] to-[#0D1B2A] border-[rgba(255,255,255,0.06)]"
                          : "bg-[#0D1B2A] border-[rgba(255,255,255,0.06)] opacity-50"
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
                          style={{ color: earned ? achievement.color : "#9CA3AF" }}
                        />
                      </div>
                      <h3 className="font-semibold mb-1 text-[#E5E7EB]">{achievement.title}</h3>
                      <p className="text-sm text-[#9CA3AF]">
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
