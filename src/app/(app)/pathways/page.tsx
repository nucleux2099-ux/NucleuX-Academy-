"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Route,
  Clock,
  BookOpen,
  CheckCircle,
  Lock,
  Play,
  ChevronRight,
} from "lucide-react";

const pathways = [
  {
    id: 1,
    title: "Surgical GI Mastery",
    description: "Complete pathway for surgical gastroenterology",
    progress: 65,
    totalTopics: 24,
    completedTopics: 16,
    estimatedTime: "40 hours",
    difficulty: "Advanced",
    status: "active",
    color: "#7C3AED",
  },
  {
    id: 2,
    title: "Medical GI Essentials",
    description: "Core concepts in medical gastroenterology",
    progress: 30,
    totalTopics: 18,
    completedTopics: 5,
    estimatedTime: "25 hours",
    difficulty: "Intermediate",
    status: "active",
    color: "#06B6D4",
  },
  {
    id: 3,
    title: "Hepatology Deep Dive",
    description: "Advanced liver disease management",
    progress: 0,
    totalTopics: 20,
    completedTopics: 0,
    estimatedTime: "30 hours",
    difficulty: "Advanced",
    status: "locked",
    color: "#10B981",
  },
  {
    id: 4,
    title: "GI Anatomy Foundations",
    description: "Essential anatomical knowledge for GI",
    progress: 100,
    totalTopics: 12,
    completedTopics: 12,
    estimatedTime: "15 hours",
    difficulty: "Beginner",
    status: "completed",
    color: "#F59E0B",
  },
];

const activePathwayTopics = [
  { id: 1, title: "Esophageal Anatomy", status: "completed", duration: "20 min" },
  { id: 2, title: "Esophageal Disorders", status: "completed", duration: "45 min" },
  { id: 3, title: "Gastric Physiology", status: "completed", duration: "35 min" },
  { id: 4, title: "Peptic Ulcer Disease", status: "completed", duration: "40 min" },
  { id: 5, title: "Gastric Cancer", status: "completed", duration: "50 min" },
  { id: 6, title: "Hepatobiliary Anatomy", status: "current", duration: "30 min" },
  { id: 7, title: "Cholecystitis & Cholelithiasis", status: "upcoming", duration: "35 min" },
  { id: 8, title: "Pancreatic Disorders", status: "upcoming", duration: "45 min" },
  { id: 9, title: "Liver Tumors", status: "locked", duration: "40 min" },
  { id: 10, title: "Portal Hypertension", status: "locked", duration: "35 min" },
];

export default function PathwaysPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#E5E7EB]">Learning Pathways</h1>
        <p className="text-[#9CA3AF] mt-1">
          Structured learning paths tailored to your goals
        </p>
      </div>

      {/* Pathway Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {pathways.map((pathway) => (
          <Card
            key={pathway.id}
            className={`bg-[#0F2233] border-[rgba(255,255,255,0.06)] hover:border-[${pathway.color}]/30 transition-all cursor-pointer ${
              pathway.status === "locked" ? "opacity-60" : ""
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${pathway.color}15` }}
                >
                  <Route className="w-6 h-6" style={{ color: pathway.color }} />
                </div>
                <Badge
                  className={
                    pathway.status === "completed"
                      ? "bg-[rgba(16,185,129,0.2)] text-[#10B981] border-[rgba(16,185,129,0.3)]"
                      : pathway.status === "active"
                      ? "bg-[rgba(124,58,237,0.2)] text-[#7C3AED] border-[rgba(124,58,237,0.3)]"
                      : "bg-[#142538] text-[#9CA3AF] border-[rgba(255,255,255,0.06)]"
                  }
                >
                  {pathway.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                  {pathway.status === "locked" && <Lock className="w-3 h-3 mr-1" />}
                  {pathway.status === "active" && <Play className="w-3 h-3 mr-1" />}
                  {pathway.status.charAt(0).toUpperCase() + pathway.status.slice(1)}
                </Badge>
              </div>

              <h3 className="text-xl font-semibold mb-2 text-[#E5E7EB]">{pathway.title}</h3>
              <p className="text-[#9CA3AF] text-sm mb-4">{pathway.description}</p>

              <div className="flex items-center gap-4 text-sm text-[#9CA3AF] mb-4">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {pathway.totalTopics} topics
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {pathway.estimatedTime}
                </span>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#9CA3AF]">
                    {pathway.completedTopics}/{pathway.totalTopics} completed
                  </span>
                  <span
                    className={pathway.progress === 100 ? "text-[#10B981]" : "text-[#E5E7EB]"}
                  >
                    {pathway.progress}%
                  </span>
                </div>
                <Progress
                  value={pathway.progress}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Pathway Details */}
      <Card className="bg-[#0F2233] border-[rgba(255,255,255,0.06)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-[#E5E7EB]">
            <div className="p-2 rounded-lg bg-[rgba(124,58,237,0.15)]">
              <Route className="w-5 h-5 text-[#7C3AED]" />
            </div>
            Surgical GI Mastery - Topic Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[rgba(255,255,255,0.06)]" />

            <div className="space-y-4">
              {activePathwayTopics.map((topic) => (
                <div key={topic.id} className="flex items-start gap-4 relative">
                  {/* Status dot */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 ${
                      topic.status === "completed"
                        ? "bg-[#10B981]"
                        : topic.status === "current"
                        ? "bg-[#7C3AED] glow-dashboard"
                        : topic.status === "upcoming"
                        ? "bg-[#0F2233] border-2 border-[rgba(255,255,255,0.06)]"
                        : "bg-[#0F2233] border-2 border-[rgba(255,255,255,0.06)]"
                    }`}
                  >
                    {topic.status === "completed" && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                    {topic.status === "current" && (
                      <Play className="w-4 h-4 text-white" />
                    )}
                    {topic.status === "locked" && (
                      <Lock className="w-4 h-4 text-[#9CA3AF]" />
                    )}
                    {topic.status === "upcoming" && (
                      <span className="w-2 h-2 bg-[#9CA3AF] rounded-full" />
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 p-4 rounded-lg border transition-all ${
                      topic.status === "current"
                        ? "bg-[rgba(124,58,237,0.1)] border-[rgba(124,58,237,0.3)]"
                        : topic.status === "completed"
                        ? "bg-[#142538] border-[rgba(255,255,255,0.06)]"
                        : "bg-[#142538]/50 border-[rgba(255,255,255,0.03)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4
                          className={`font-medium ${
                            topic.status === "locked" ? "text-[#9CA3AF]" : "text-[#E5E7EB]"
                          }`}
                        >
                          {topic.title}
                        </h4>
                        <p className="text-sm text-[#9CA3AF] mt-1">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {topic.duration}
                        </p>
                      </div>
                      {topic.status !== "locked" && (
                        <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
