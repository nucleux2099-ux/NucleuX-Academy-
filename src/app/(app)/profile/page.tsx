"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
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
} from "lucide-react";

const achievements = [
  { icon: Flame, title: "30 Day Streak", color: "#F59E0B", earned: true },
  { icon: BookOpen, title: "Bookworm", color: "#7C3AED", earned: true },
  { icon: Target, title: "Sharpshooter", color: "#10B981", earned: true },
  { icon: Trophy, title: "Top Performer", color: "#06B6D4", earned: false },
  { icon: Zap, title: "Speed Demon", color: "#EF4444", earned: false },
];

const stats = [
  { label: "Total Study Hours", value: "248", icon: Clock },
  { label: "Topics Completed", value: "156", icon: BookOpen },
  { label: "MCQs Attempted", value: "2,340", icon: Target },
  { label: "Current Streak", value: "12 days", icon: Flame },
];

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-[#94A3B8] mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Header Card */}
      <Card className="bg-[#1E293B] border-[#334155] overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4]" />
        <CardContent className="relative pt-0 pb-6 px-6">
          {/* Avatar */}
          <div className="absolute -top-16 left-6">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-[#1E293B]">
                <AvatarImage src="/avatar.jpg" />
                <AvatarFallback className="bg-[#7C3AED] text-white text-3xl">
                  AC
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
              <h2 className="text-2xl font-bold">Aditya Chandra Bhatla</h2>
              <p className="text-[#94A3B8]">Medical Student • Surgical GI Track</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-[#94A3B8]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  India
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined Jan 2025
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/30 px-3 py-1">
                Pro Member
              </Badge>
              <Badge className="bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30 px-3 py-1">
                <Flame className="w-3 h-3 mr-1" />
                12 Day Streak
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-[#1E293B] border-[#334155]">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[#7C3AED]/20">
                <stat.icon className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-[#94A3B8]">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-[#1E293B] border border-[#334155] p-1">
          <TabsTrigger value="profile" className="data-[state=active]:bg-[#7C3AED]">
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-[#7C3AED]">
            Preferences
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-[#7C3AED]">
            Achievements
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="bg-[#1E293B] border-[#334155]">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-[#94A3B8]">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <Input
                      defaultValue="Aditya Chandra Bhatla"
                      className="pl-10 bg-[#0F172A] border-[#334155] focus:border-[#7C3AED]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#94A3B8]">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <Input
                      defaultValue="aditya@nucleux.academy"
                      className="pl-10 bg-[#0F172A] border-[#334155] focus:border-[#7C3AED]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#94A3B8]">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <Input
                      defaultValue="+91 94944 75875"
                      className="pl-10 bg-[#0F172A] border-[#334155] focus:border-[#7C3AED]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#94A3B8]">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <Input
                      defaultValue="Hyderabad, India"
                      className="pl-10 bg-[#0F172A] border-[#334155] focus:border-[#7C3AED]"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-[#334155]" />

              <div className="flex justify-end">
                <Button className="bg-[#7C3AED] hover:bg-[#6D28D9]">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <div className="space-y-4">
            <Card className="bg-[#1E293B] border-[#334155]">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: Bell, label: "Daily Reminders", desc: "Get notified to study" },
                  { icon: Smartphone, label: "Telegram Notifications", desc: "ATOM will reach out on Telegram" },
                  { icon: Mail, label: "Email Updates", desc: "Weekly progress reports" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-lg bg-[#0F172A]">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-[#7C3AED]/20">
                        <item.icon className="w-5 h-5 text-[#7C3AED]" />
                      </div>
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-[#94A3B8]">{item.desc}</p>
                      </div>
                    </div>
                    <button className="w-12 h-6 rounded-full bg-[#7C3AED] relative">
                      <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-[#1E293B] border-[#334155]">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: Moon, label: "Dark Mode", desc: "Currently active" },
                  { icon: Globe, label: "Language", desc: "English" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-lg bg-[#0F172A]">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-[#06B6D4]/20">
                        <item.icon className="w-5 h-5 text-[#06B6D4]" />
                      </div>
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-[#94A3B8]">{item.desc}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-[#334155]">
                      Change
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-[#1E293B] border-[#334155]">
              <CardHeader>
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-[#0F172A]">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-[#10B981]/20">
                      <Shield className="w-5 h-5 text-[#10B981]" />
                    </div>
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-[#94A3B8]">Add extra security</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-[#334155]">
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-[#0F172A]">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-red-500/20">
                      <LogOut className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium">Sign Out</p>
                      <p className="text-sm text-[#94A3B8]">Log out of your account</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <Card className="bg-[#1E293B] border-[#334155]">
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.title}
                    className={`p-6 rounded-xl border text-center ${
                      achievement.earned
                        ? "bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-[#334155]"
                        : "bg-[#0F172A] border-[#334155] opacity-50"
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${
                        achievement.earned ? "" : "grayscale"
                      }`}
                      style={{ backgroundColor: `${achievement.color}20` }}
                    >
                      <achievement.icon
                        className="w-8 h-8"
                        style={{ color: achievement.earned ? achievement.color : "#94A3B8" }}
                      />
                    </div>
                    <h3 className="font-semibold mb-1">{achievement.title}</h3>
                    <p className="text-sm text-[#94A3B8]">
                      {achievement.earned ? "Earned" : "Locked"}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
