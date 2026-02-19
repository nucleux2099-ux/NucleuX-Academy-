"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  FlaskConical,
  Brain,
  Bone,
  Target,
  GraduationCap,
  Clock,
  MessageCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

const specialties = [
  // v1: keep it focused for MBBS Y1
  { id: "anatomy", name: "Anatomy", icon: Bone, color: "#C9A86C" },
  { id: "physiology", name: "Physiology", icon: Brain, color: "#10B981" },
  { id: "biochemistry", name: "Biochemistry", icon: FlaskConical, color: "#5BB3B3" },
];

const goals = [
  { id: "exam", title: "Exam Preparation", description: "Focused prep for NEET PG, INICET, or other exams", icon: GraduationCap },
  { id: "deep", title: "Deep Learning", description: "Comprehensive understanding of concepts", icon: Brain },
  { id: "revision", title: "Quick Revision", description: "Refresh knowledge before rotations or exams", icon: Clock },
  { id: "mcq", title: "MCQ Practice", description: "Build problem-solving skills with questions", icon: Target },
];

const studyTimes = [
  { id: "30", label: "30 min", minutes: 30 },
  { id: "60", label: "1 hour", minutes: 60 },
  { id: "120", label: "2 hours", minutes: 120 },
  { id: "180", label: "2+ hrs", minutes: 180 },
];

const exams = [
  { id: "neet_pg", label: "NEET PG" },
  { id: "inicet", label: "INICET" },
  { id: "fmge", label: "FMGE" },
  { id: "usmle", label: "USMLE" },
  { id: "none", label: "No specific exam" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    track: "mbbs_y1_cbme",
    selectedSpecialties: ["anatomy", "physiology", "biochemistry"] as string[],
    selectedGoals: [] as string[],
    dailyStudyTime: "60",
    targetExam: "none",
    telegramConnected: false,
  });

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  // Load existing user data
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      // Check if already completed onboarding
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile?.onboarding_completed) {
        router.push("/dashboard");
        return;
      }

      // Pre-fill name from profile or auth metadata
      const name = profile?.full_name || user.user_metadata?.full_name || "";
      setFormData(prev => ({ ...prev, name }));
      setIsLoading(false);
    };

    loadUserData();
  }, [router, supabase]);

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Final step - save everything to Supabase
      await saveOnboardingData();
    }
  };

  const saveOnboardingData = async () => {
    setIsSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.name,
          level: formData.track === "mbbs_y1_cbme" ? "mbbs_y1" : null,
          specialty: formData.selectedSpecialties[0] || null, // Primary subject focus
          target_exam: formData.targetExam !== "none" ? formData.targetExam : null,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
      }

      // Update preferences
      const studyTimeMinutes = studyTimes.find(t => t.id === formData.dailyStudyTime)?.minutes || 60;
      
      const { error: prefsError } = await supabase
        .from("user_preferences")
        .update({
          daily_goal_minutes: studyTimeMinutes,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (prefsError) {
        console.error("Preferences update error:", prefsError);
      }

      // Navigate to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Onboarding save error:", error);
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleSpecialty = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedSpecialties: prev.selectedSpecialties.includes(id)
        ? prev.selectedSpecialties.filter((s) => s !== id)
        : [...prev.selectedSpecialties, id],
    }));
  };

  const toggleGoal = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedGoals: prev.selectedGoals.includes(id)
        ? prev.selectedGoals.filter((g) => g !== id)
        : [...prev.selectedGoals, id],
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.trim().length > 0;
      case 2:
        return !!formData.track;
      case 3:
        return formData.selectedSpecialties.length > 0;
      case 4:
        return (
          formData.selectedGoals.length > 0 &&
          formData.dailyStudyTime &&
          formData.targetExam
        );
      default:
        return true;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAFAFA] to-[#F5F3FF] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5BB3B3]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAFA] to-[#F5F3FF] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#5BB3B3] to-[#4A9E9E] flex items-center justify-center shadow-md">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#5BB3B3] to-[#5BB3B3] bg-clip-text text-transparent">
              NucleuX Academy
            </span>
          </div>
          <span className="text-sm text-[#64748B]">Step {step} of {totalSteps}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="w-full max-w-2xl bg-white border-[#E2E8F0] shadow-xl">
        <CardContent className="p-8">
          {step === 1 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-[#F5F3FF] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#5BB3B3]/10">
                  <Sparkles className="w-10 h-10 text-[#5BB3B3]" />
                </div>
                <h1 className="text-3xl font-bold text-[#1E293B] mb-2">Welcome to NucleuX! 🎉</h1>
                <p className="text-[#64748B]">Let&apos;s personalize your learning experience</p>
              </div>
              <div>
                <label className="text-sm text-[#64748B] block mb-2">What should we call you?</label>
                <Input
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="bg-[#F8FAFC] border-[#E2E8F0] h-14 text-lg text-center text-[#1E293B] focus:border-[#5BB3B3] focus:ring-[#5BB3B3]/20"
                  autoFocus
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-[#1E293B] mb-2">Hi {formData.name}! 👋</h1>
                <p className="text-[#64748B]">Which subjects are you focusing on?</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {specialties.map((s) => {
                  const isSelected = formData.selectedSpecialties.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleSpecialty(s.id)}
                      className={`p-4 rounded-xl border-2 transition-all shadow-sm ${
                        isSelected ? "border-[#5BB3B3] bg-[#F5F3FF] shadow-md" : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#5BB3B3]/50"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm" style={{ backgroundColor: `${s.color}15` }}>
                        <s.icon className="w-5 h-5" style={{ color: s.color }} />
                      </div>
                      <p className="text-sm font-medium text-[#1E293B]">{s.name}</p>
                      {isSelected && <CheckCircle className="w-4 h-4 text-[#5BB3B3] mx-auto mt-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in space-y-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-[#1E293B] mb-2">What&apos;s your learning goal?</h1>
                <p className="text-[#64748B]">This helps ATOM tailor content for you</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {goals.map((g) => {
                  const isSelected = formData.selectedGoals.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      onClick={() => toggleGoal(g.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all shadow-sm ${
                        isSelected ? "border-[#5BB3B3] bg-[#F5F3FF] shadow-md" : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#5BB3B3]/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#F5F3FF] flex items-center justify-center shrink-0 shadow-sm">
                          <g.icon className="w-5 h-5 text-[#5BB3B3]" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[#1E293B]">{g.title}</p>
                          <p className="text-sm text-[#64748B]">{g.description}</p>
                        </div>
                        {isSelected && <CheckCircle className="w-5 h-5 text-[#5BB3B3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Target Exam */}
              <div>
                <label className="text-sm text-[#64748B] mb-3 block">Target exam?</label>
                <div className="flex flex-wrap gap-2">
                  {exams.map((exam) => (
                    <button
                      key={exam.id}
                      onClick={() => setFormData((prev) => ({ ...prev, targetExam: exam.id }))}
                      className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                        formData.targetExam === exam.id
                          ? "border-[#5BB3B3] bg-[#F5F3FF] text-[#5BB3B3] font-medium"
                          : "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:border-[#5BB3B3]/50"
                      }`}
                    >
                      {exam.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Study Time */}
              <div>
                <label className="text-sm text-[#64748B] mb-3 block">Daily study time?</label>
                <div className="grid grid-cols-4 gap-2">
                  {studyTimes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setFormData((prev) => ({ ...prev, dailyStudyTime: t.id }))}
                      className={`p-3 rounded-lg border text-center transition-all shadow-sm ${
                        formData.dailyStudyTime === t.id
                          ? "border-[#5BB3B3] bg-[#F5F3FF] text-[#5BB3B3] font-medium"
                          : "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:border-[#5BB3B3]/50"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-[#F0F9FF] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#5BB3B3]/10">
                  <MessageCircle className="w-10 h-10 text-[#5BB3B3]" />
                </div>
                <h1 className="text-2xl font-bold text-[#1E293B] mb-2">Connect with ATOM on Telegram</h1>
                <p className="text-[#64748B] max-w-md mx-auto">
                  ATOM will send you daily study reminders, questions, and encouragement!
                </p>
              </div>
              <div className="space-y-4">
                {!formData.telegramConnected ? (
                  <Button
                    onClick={() => setFormData((prev) => ({ ...prev, telegramConnected: true }))}
                    className="w-full bg-[#0088cc] hover:bg-[#0077b5] h-14 shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Connect Telegram
                  </Button>
                ) : (
                  <div className="p-4 rounded-xl bg-[#DCFCE7] border border-[#10B981]/30 flex items-center gap-3 shadow-sm">
                    <CheckCircle className="w-6 h-6 text-[#10B981]" />
                    <div>
                      <p className="font-medium text-[#10B981]">Telegram Connected!</p>
                      <p className="text-sm text-[#64748B]">ATOM will reach out shortly</p>
                    </div>
                  </div>
                )}
                <button onClick={handleNext} className="w-full text-center text-sm text-[#64748B] hover:text-[#5BB3B3] py-2">
                  Skip for now →
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E2E8F0]">
            <Button variant="ghost" onClick={handleBack} disabled={step === 1} className="text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isSaving}
              className="bg-[#5BB3B3] hover:bg-[#4A9E9E] min-w-[140px] shadow-lg shadow-[#5BB3B3]/20"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : step === totalSteps ? (
                <>Get Started <Sparkles className="w-4 h-4 ml-2" /></>
              ) : (
                <>Continue <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
