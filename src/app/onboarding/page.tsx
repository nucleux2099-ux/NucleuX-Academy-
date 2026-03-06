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
        router.push("/desk");
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

      // Navigate to desk
      router.push("/desk");
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
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5BB3B3]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220] flex flex-col items-center justify-center p-6 text-[#E8E0D5] relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#5BB3B3]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#C9A86C]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="w-full max-w-2xl mb-8 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#131E30] to-[#0B1220] border border-[#5BB3B3]/30 flex items-center justify-center shadow-[0_0_15px_rgba(91,179,179,0.2)]">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#5BB3B3] to-[#8EE4E4] bg-clip-text text-transparent tracking-tight">
              NucleuX Academy
            </span>
          </div>
          <span className="text-sm text-[#A0B0BC] font-medium tracking-wide">PHASE 0{step} OF 0{totalSteps}</span>
        </div>
        <Progress value={progress} className="h-1.5 bg-[#1B2838] border border-white/5 [&>div]:bg-[#5BB3B3]" />
      </div>

      <Card className="w-full max-w-2xl bg-[#131E30]/60 backdrop-blur-xl border-white/10 shadow-2xl relative z-10">
        <CardContent className="p-8 sm:p-12">
          {step === 1 && (
            <div className="animate-fade-in space-y-8 text-center">
              <div className="w-24 h-24 rounded-3xl bg-[#0B1220] border border-[#5BB3B3]/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(91,179,179,0.15)]">
                <Sparkles className="w-12 h-12 text-[#5BB3B3]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-3">Initialize Student Profile</h1>
                <p className="text-[#A0B0BC] text-lg">ATOM is ready. What should your Clinical Tutor call you?</p>
              </div>
              <div className="pt-4 max-w-md mx-auto">
                <Input
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="bg-[#0B1220] border-white/10 h-16 text-xl text-center text-white focus:border-[#5BB3B3] focus:ring-[#5BB3B3]/20 shadow-inner rounded-xl"
                  autoFocus
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in space-y-8">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-white mb-3">Welcome, {formData.name}.</h1>
                <p className="text-[#A0B0BC] text-lg">Select the core subjects you wish to focus on.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {specialties.map((s) => {
                  const isSelected = formData.selectedSpecialties.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleSpecialty(s.id)}
                      className={`group p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${isSelected
                        ? "border-[#5BB3B3] bg-[#5BB3B3]/10 shadow-[0_0_20px_rgba(91,179,179,0.15)]"
                        : "border-white/10 bg-[#0B1220]/50 hover:bg-[#0B1220] hover:border-white/20"
                        }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors ${isSelected ? "bg-[#5BB3B3]/20" : "bg-[#1B2838]"}`}>
                        <s.icon className={`w-6 h-6 ${isSelected ? "text-[#5BB3B3]" : "text-[#A0B0BC]"}`} />
                      </div>
                      <p className={`text-sm font-semibold tracking-wide ${isSelected ? "text-white" : "text-[#A0B0BC] group-hover:text-[#E8E0D5]"}`}>{s.name}</p>
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle className="w-5 h-5 text-[#5BB3B3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in space-y-10">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-3">Define Your Directives</h1>
                <p className="text-[#A0B0BC] text-lg">This allows ATOM to calibrate its difficulty algorithm.</p>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold tracking-widest text-[#6B7A88] uppercase block mb-4">Primary Goal</label>
                <div className="grid sm:grid-cols-2 gap-4">
                  {goals.map((g) => {
                    const isSelected = formData.selectedGoals.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        onClick={() => toggleGoal(g.id)}
                        className={`p-5 rounded-2xl border text-left transition-all duration-300 relative ${isSelected
                          ? "border-[#5BB3B3] bg-[#5BB3B3]/10 shadow-[0_0_15px_rgba(91,179,179,0.1)]"
                          : "border-white/10 bg-[#0B1220]/50 hover:border-white/20"
                          }`}
                      >
                        <div className="flex gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? "bg-[#5BB3B3]/20" : "bg-[#1B2838]"}`}>
                            <g.icon className={`w-5 h-5 ${isSelected ? "text-[#5BB3B3]" : "text-[#A0B0BC]"}`} />
                          </div>
                          <div>
                            <p className={`font-semibold mb-1 ${isSelected ? "text-white" : "text-[#A0B0BC]"}`}>{g.title}</p>
                            <p className="text-sm text-[#6B7A88] leading-relaxed">{g.description}</p>
                          </div>
                        </div>
                        {isSelected && <CheckCircle className="absolute top-4 right-4 w-5 h-5 text-[#5BB3B3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8 pt-4 border-t border-white/5">
                {/* Target Exam */}
                <div>
                  <label className="text-sm font-bold tracking-widest text-[#6B7A88] uppercase block mb-4">Target Exam</label>
                  <div className="flex flex-wrap gap-2">
                    {exams.map((exam) => (
                      <button
                        key={exam.id}
                        onClick={() => setFormData((prev) => ({ ...prev, targetExam: exam.id }))}
                        className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${formData.targetExam === exam.id
                          ? "border-[#C9A86C] bg-[#C9A86C]/10 text-[#C9A86C] shadow-[0_0_10px_rgba(201,168,108,0.15)]"
                          : "border-white/10 bg-[#0B1220]/50 text-[#A0B0BC] hover:border-white/20 hover:text-white"
                          }`}
                      >
                        {exam.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Daily Study Time */}
                <div>
                  <label className="text-sm font-bold tracking-widest text-[#6B7A88] uppercase block mb-4">Commitment</label>
                  <div className="grid grid-cols-4 gap-2">
                    {studyTimes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setFormData((prev) => ({ ...prev, dailyStudyTime: t.id }))}
                        className={`p-3 rounded-xl border text-center transition-all ${formData.dailyStudyTime === t.id
                          ? "border-[#5BB3B3] bg-[#5BB3B3]/10 text-[#5BB3B3] font-bold shadow-[0_0_10px_rgba(91,179,179,0.1)]"
                          : "border-white/10 bg-[#0B1220]/50 text-[#A0B0BC] hover:border-white/20 hover:text-white"
                          }`}
                      >
                        <span className="text-xs block mb-1">{t.label.split(' ')[0]}</span>
                        <span className="text-[10px] text-[#6B7A88] uppercase">{t.label.split(' ').slice(1).join(' ')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in space-y-8 text-center max-w-md mx-auto">
              <div className="w-24 h-24 rounded-3xl bg-[#0B1220] flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#0088cc]/10" />
                <MessageCircle className="w-12 h-12 text-[#0088cc] relative z-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-3">Sync Notifications</h1>
                <p className="text-[#A0B0BC] text-lg leading-relaxed">
                  Connect Telegram to receive spaced repetition triggers, daily drills, and study plans directly to your phone.
                </p>
              </div>
              <div className="space-y-4 pt-4">
                {!formData.telegramConnected ? (
                  <Button
                    onClick={() => setFormData((prev) => ({ ...prev, telegramConnected: true }))}
                    className="w-full bg-[#0088cc] hover:bg-[#0077b5] h-14 rounded-xl text-white font-bold shadow-[0_0_20px_rgba(0,136,204,0.3)] transition-all hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-5 h-5 mr-3" />
                    Connect Telegram
                  </Button>
                ) : (
                  <div className="p-4 rounded-xl bg-[#5BB3B3]/10 border border-[#5BB3B3]/30 flex items-center justify-center gap-3">
                    <CheckCircle className="w-6 h-6 text-[#5BB3B3]" />
                    <span className="font-bold text-[#5BB3B3]">Telegram Synchronized!</span>
                  </div>
                )}
                <button onClick={handleNext} className="w-full text-center text-sm font-medium text-[#6B7A88] hover:text-[#A0B0BC] py-3 transition-colors">
                  Skip this step
                </button>
              </div>
            </div>
          )}

          {/* Navigation Footer */}
          <div className="flex items-center justify-between mt-12 pt-6 border-t border-white/5">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1}
              className="text-[#A0B0BC] hover:text-white hover:bg-white/5 h-12 px-6 rounded-xl font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isSaving}
              className="bg-[#5BB3B3] hover:bg-[#4A9E9E] text-[#0B1220] min-w-[160px] h-12 rounded-xl font-bold shadow-[0_0_20px_rgba(91,179,179,0.3)] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : step === totalSteps ? (
                <>Enter Campus <ArrowRight className="w-5 h-5 ml-2 text-[#0B1220]" /></>
              ) : (
                <>Continue <ArrowRight className="w-5 h-5 ml-2 text-[#0B1220]" /></>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
