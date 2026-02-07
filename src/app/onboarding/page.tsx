"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Stethoscope,
  FlaskConical,
  Brain,
  Heart,
  Bone,
  Eye,
  Baby,
  Pill,
  Target,
  GraduationCap,
  Clock,
  MessageCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

const specialties = [
  { id: "surgery", name: "Surgery", icon: Stethoscope, color: "#7C3AED" },
  { id: "medicine", name: "Internal Medicine", icon: FlaskConical, color: "#06B6D4" },
  { id: "anatomy", name: "Anatomy", icon: Bone, color: "#F59E0B" },
  { id: "physiology", name: "Physiology", icon: Brain, color: "#10B981" },
  { id: "pathology", name: "Pathology", icon: Eye, color: "#EF4444" },
  { id: "pharmacology", name: "Pharmacology", icon: Pill, color: "#8B5CF6" },
  { id: "pediatrics", name: "Pediatrics", icon: Baby, color: "#EC4899" },
  { id: "cardiology", name: "Cardiology", icon: Heart, color: "#EF4444" },
];

const goals = [
  { id: "exam", title: "Exam Preparation", description: "Focused prep for NEET PG, INICET, or other exams", icon: GraduationCap },
  { id: "deep", title: "Deep Learning", description: "Comprehensive understanding of concepts", icon: Brain },
  { id: "revision", title: "Quick Revision", description: "Refresh knowledge before rotations or exams", icon: Clock },
  { id: "mcq", title: "MCQ Practice", description: "Build problem-solving skills with questions", icon: Target },
];

const studyTimes = [
  { id: "30min", label: "30 min" },
  { id: "1hr", label: "1 hour" },
  { id: "2hr", label: "2 hours" },
  { id: "more", label: "2+ hrs" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    selectedSpecialties: [] as string[],
    selectedGoals: [] as string[],
    dailyStudyTime: "",
    telegramConnected: false,
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      setTimeout(() => router.push("/dashboard"), 1500);
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
      case 1: return formData.name.trim().length > 0;
      case 2: return formData.selectedSpecialties.length > 0;
      case 3: return formData.selectedGoals.length > 0 && formData.dailyStudyTime;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAFA] to-[#F5F3FF] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="NucleuX" width={40} height={40} />
            <span className="text-xl font-bold text-gradient-purple">NucleuX Academy</span>
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
                <div className="w-20 h-20 rounded-2xl bg-[#F5F3FF] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#7C3AED]/10">
                  <Sparkles className="w-10 h-10 text-[#7C3AED]" />
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
                  className="bg-[#F8FAFC] border-[#E2E8F0] h-14 text-lg text-center text-[#1E293B] focus:border-[#7C3AED] focus:ring-[#7C3AED]/20"
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
                        isSelected ? "border-[#7C3AED] bg-[#F5F3FF] shadow-md" : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#7C3AED]/50"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm" style={{ backgroundColor: `${s.color}15` }}>
                        <s.icon className="w-5 h-5" style={{ color: s.color }} />
                      </div>
                      <p className="text-sm font-medium text-[#1E293B]">{s.name}</p>
                      {isSelected && <CheckCircle className="w-4 h-4 text-[#7C3AED] mx-auto mt-2" />}
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
                        isSelected ? "border-[#7C3AED] bg-[#F5F3FF] shadow-md" : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#7C3AED]/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#F5F3FF] flex items-center justify-center shrink-0 shadow-sm">
                          <g.icon className="w-5 h-5 text-[#7C3AED]" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[#1E293B]">{g.title}</p>
                          <p className="text-sm text-[#64748B]">{g.description}</p>
                        </div>
                        {isSelected && <CheckCircle className="w-5 h-5 text-[#7C3AED]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div>
                <label className="text-sm text-[#64748B] mb-3 block">Daily study time?</label>
                <div className="grid grid-cols-4 gap-2">
                  {studyTimes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setFormData((prev) => ({ ...prev, dailyStudyTime: t.id }))}
                      className={`p-3 rounded-lg border text-center transition-all shadow-sm ${
                        formData.dailyStudyTime === t.id
                          ? "border-[#7C3AED] bg-[#F5F3FF] text-[#7C3AED] font-medium"
                          : "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:border-[#7C3AED]/50"
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
                <div className="w-20 h-20 rounded-2xl bg-[#F0F9FF] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#06B6D4]/10">
                  <MessageCircle className="w-10 h-10 text-[#06B6D4]" />
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
                <button onClick={handleNext} className="w-full text-center text-sm text-[#64748B] hover:text-[#7C3AED] py-2">
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
              disabled={!canProceed() || isLoading}
              className="bg-[#7C3AED] hover:bg-[#6D28D9] min-w-[140px] shadow-lg shadow-[#7C3AED]/20"
            >
              {isLoading ? (
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
