"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, MessageSquare, Search, Plus, ThumbsUp, CheckCircle, Clock, Crown, Flame, Star, Sparkles, GraduationCap } from "lucide-react";

// Community room color - Amber
const roomColor = "#C9A86C";

const discussions = [
  { id: 1, title: "Best approach for Portal Hypertension MCQs?", author: "Dr. Priya", avatar: "DP", replies: 23, likes: 45, time: "2h ago", tags: ["Surgery", "Hepatobiliary"], verified: true, hot: true },
  { id: 2, title: "Struggling with Thyroid staging - tips?", author: "Rahul M.", avatar: "RM", replies: 15, likes: 32, time: "4h ago", tags: ["Surgery", "Endocrine"], verified: false, hot: false },
  { id: 3, title: "Child-Pugh vs MELD - when to use which?", author: "Dr. Arun", avatar: "DA", replies: 31, likes: 67, time: "6h ago", tags: ["Medicine", "Hepatology"], verified: true, hot: true },
  { id: 4, title: "Ranson's Criteria mnemonic that actually works", author: "Sneha K.", avatar: "SK", replies: 42, likes: 89, time: "1d ago", tags: ["Surgery", "Pancreas"], verified: false, hot: true },
  { id: 5, title: "How to approach Electrolyte imbalance questions?", author: "Meera T.", avatar: "MT", replies: 18, likes: 37, time: "2d ago", tags: ["Medicine", "Nephrology"], verified: false, hot: false },
];

const studyGroups = [
  { id: 1, name: "Surgery PG Prep", members: 156, online: 23, topic: "Surgery", color: "#DC2626" },
  { id: 2, name: "NEET-PG 2026", members: 234, online: 45, topic: "Multi-subject", color: "#5BB3B3" },
  { id: 3, name: "Internal Medicine Cases", members: 89, online: 12, topic: "Medicine", color: "#7BA69E" },
];

const facultyOfficeHours = [
  { id: 1, faculty: "Dr. Sharma", subject: "Surgery", time: "Today, 4:00 PM - 5:00 PM", avatar: "DS", available: true },
  { id: 2, faculty: "Dr. Patel", subject: "Medicine", time: "Tomorrow, 10:00 AM - 11:00 AM", avatar: "DP", available: false },
];

const topContributors = [
  { name: "Dr. Priya Menon", points: 2450, rank: 1, badge: "Expert" },
  { name: "Rahul Sharma", points: 2180, rank: 2, badge: "Pro" },
  { name: "Dr. Arun Kumar", points: 1950, rank: 3, badge: "Expert" },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("discussions");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="ui-shell ui-page space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#E8E0D5] flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[rgba(180,83,9,0.15)] flex items-center justify-center">
              <Users className="w-6 h-6 text-[#C9A86C]" />
            </div>
            👥 Common Room
          </h1>
          <p className="text-[#A0B0BC] mt-1">Discuss, learn, and grow together</p>
        </div>
        <Button className="bg-[#C9A86C] hover:bg-[#92400E] text-white"><Plus className="w-4 h-4 mr-2" />New Discussion</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Discussions", value: "1,234", icon: MessageSquare, color: "#C9A86C" },
          { label: "Study Groups", value: "48", icon: Users, color: "#7BA69E" },
          { label: "Online Now", value: "156", icon: Flame, color: "#E57373" },
          { label: "Your Contributions", value: "23", icon: Star, color: "#C9A86C" },
        ].map((stat, i) => (
          <Card key={i} className="ui-stat-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#E8E0D5]">{stat.value}</p>
                <p className="text-xs text-[#A0B0BC]">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Discussions & Groups */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between gap-4 mb-4">
              <TabsList className="rounded-xl border border-[rgba(91,179,179,0.15)] bg-[#364A5E] p-1">
                <TabsTrigger value="discussions" className="data-[state=active]:bg-[#C9A86C] data-[state=active]:text-white text-[#A0B0BC]">
                  <MessageSquare className="w-4 h-4 mr-2" />Discussions
                </TabsTrigger>
                <TabsTrigger value="groups" className="data-[state=active]:bg-[#C9A86C] data-[state=active]:text-white text-[#A0B0BC]">
                  <Users className="w-4 h-4 mr-2" />Study Groups
                </TabsTrigger>
              </TabsList>
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0B0BC]" />
                <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
                  className="pl-10 bg-[#3A4D5F] border-[rgba(91,179,179,0.15)] text-[#E8E0D5] placeholder:text-[#A0B0BC]" />
              </div>
            </div>

            <TabsContent value="discussions" className="space-y-4">
              {discussions.map((d) => (
                <Card
                  key={d.id}
                  className="ui-panel ui-interactive cursor-pointer border-l-4 border-[rgba(91,179,179,0.15)] bg-[#364A5E] transition-all hover:border-[rgba(180,83,9,0.3)]"
                  style={{ borderLeftColor: roomColor }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10 bg-[rgba(180,83,9,0.15)]">
                        <AvatarFallback className="text-[#C9A86C] text-sm">{d.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-[#E8E0D5] truncate">{d.title}</h3>
                          {d.hot && <Badge className="bg-[rgba(239,68,68,0.2)] text-[#E57373] border-none text-xs"><Flame className="w-3 h-3 mr-1" />Hot</Badge>}
                          {d.verified && <CheckCircle className="w-4 h-4 text-[#7BA69E]" />}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-[#A0B0BC]">
                          <span>{d.author}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{d.time}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {d.tags.map((tag) => (
                            <Badge key={tag} className="bg-[#3A4D5F] text-[#A0B0BC] border-[rgba(91,179,179,0.1)] text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#A0B0BC]">
                        <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" />{d.likes}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" />{d.replies}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="groups" className="grid sm:grid-cols-2 gap-4">
              {studyGroups.map((g) => (
                <Card className="ui-panel ui-interactive cursor-pointer border-[rgba(91,179,179,0.15)] bg-[#364A5E] transition-all hover:border-[rgba(180,83,9,0.3)]" key={g.id}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${g.color}15` }}>
                        <Users className="w-6 h-6" style={{ color: g.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#E8E0D5]">{g.name}</h3>
                        <p className="text-xs text-[#A0B0BC]">{g.topic}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#A0B0BC]">{g.members} members</span>
                      <Badge className="bg-[rgba(5,150,105,0.2)] text-[#7BA69E] border-none"><span className="w-2 h-2 bg-[#7BA69E] rounded-full mr-1 animate-pulse" />{g.online} online</Badge>
                    </div>
                    <Button className="w-full mt-4 bg-[#3A4D5F] hover:bg-[rgba(180,83,9,0.1)] text-[#C9A86C] border border-[rgba(180,83,9,0.3)]">Join Group</Button>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Contributors */}
          <Card className="ui-panel border-[rgba(91,179,179,0.15)] bg-[#364A5E]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#E8E0D5]">
                <Crown className="w-5 h-5 text-[#C9A86C]" />
                Top Contributors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topContributors.map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#3A4D5F] border border-[rgba(91,179,179,0.1)]">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    i === 0 ? "bg-[rgba(245,158,11,0.2)] text-[#C9A86C]" : 
                    i === 1 ? "bg-[rgba(156,163,175,0.2)] text-[#A0B0BC]" : 
                    "bg-[rgba(180,83,9,0.2)] text-[#C9A86C]"
                  }`}>{c.rank}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#E8E0D5] text-sm truncate">{c.name}</p>
                    <p className="text-xs text-[#A0B0BC]">{c.points} points</p>
                  </div>
                  <Badge className="bg-[rgba(180,83,9,0.15)] text-[#C9A86C] border-none text-xs">{c.badge}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ATOM Card */}
          <Card className="ui-panel border-[rgba(180,83,9,0.2)] bg-gradient-to-br from-[rgba(180,83,9,0.1)] to-[#364A5E]">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#C9A86C] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#E8E0D5]">ATOM Says</h3>
                  <p className="text-xs text-[#A0B0BC]">Discussion Moderator</p>
                </div>
              </div>
              <p className="text-sm text-[#A0B0BC] mb-3">&quot;The discussion on Portal Hypertension has great textbook references! I can add more if needed.&quot;</p>
              <Button className="w-full bg-[#C9A86C] hover:bg-[#92400E] text-white"><MessageSquare className="w-4 h-4 mr-2" />Ask ATOM</Button>
            </CardContent>
          </Card>

          {/* Faculty Office Hours */}
          <Card className="ui-panel border-[rgba(91,179,179,0.15)] bg-[#364A5E]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#E8E0D5]">
                <GraduationCap className="w-5 h-5 text-[#C9A86C]" />
                Faculty Office Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {facultyOfficeHours.map((f) => (
                <div key={f.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#3A4D5F] border border-[rgba(91,179,179,0.1)]">
                  <Avatar className="w-10 h-10 bg-[rgba(180,83,9,0.15)]">
                    <AvatarFallback className="text-[#C9A86C] text-sm">{f.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#E8E0D5] text-sm">{f.faculty}</p>
                    <p className="text-xs text-[#A0B0BC]">{f.subject}</p>
                    <p className="text-xs text-[#A0B0BC] flex items-center gap-1 mt-1"><Clock className="w-3 h-3" />{f.time}</p>
                  </div>
                  {f.available ? (
                    <Badge className="bg-[rgba(5,150,105,0.2)] text-[#7BA69E] border-none text-xs">Open</Badge>
                  ) : (
                    <Badge className="bg-[rgba(156,163,175,0.2)] text-[#A0B0BC] border-none text-xs">Upcoming</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
