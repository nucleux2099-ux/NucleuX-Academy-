"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  BookOpen,
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
  {
    id: "exam",
    title: "Exam Preparation",
    description: "Focused prep for NEET PG, INICET, or other exams",
    icon: GraduationCap,
  },
  {
    id: "deep",
    title: "Deep Learning",
    description: "Comprehensive understanding of concepts",
    icon: Brain,
  },
  {
    id: "revision",
    title: "Quick Revision",
    description: "Refresh knowledge before rotations or exams",
    icon: Clock,
  },
  {
    id: "mcq",
    title: "MCQ Practice",
    description: "Build problem-solving skills with questions",
    icon: Target,
  },
];

const studyTimes = [
  { id: "30min", label: "30 minutes", value: 30 },
  { id: "1hr", label: "1 hour", value: 60 },
  { id: "2hr", label: "2 hours", value: 120 },
  { id: "more", label: "2+ hours", value: 150 },
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
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
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
        return formData.selectedSpecialties.length > 0;
      case 3:
        return formData.selectedGoals.length > 0 && formData.dailyStudyTime;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="NucleuX" className="w-10 h-10" />
            <span className="text-xl font-bold text-gradient-purple">
              NucleuX Academy
            </span>
          </div>
          <span className="text-sm text-[#94A3B8]">
            Step {step} of {totalSteps}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Content */}
      <Card className="w-full max-w-2xl bg-[#1E293B]/50 border-[#334155]">
        <CardContent className="p-8">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-[#7C3AED]/20 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-[#7C3AED]" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Welcome to NucleuX! 🎉</h1>
                <p className="text-[#94A3B8]">
                  Let's personalize your learning experience
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-sm text-[#94A3B8] block">
                  What should we call you?
                </label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="bg-[#0F172A] border-[#334155] h-14 text-lg text-center"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 2: Specialty Selection */}
          {step === 2 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">
                  Hi {formData.name}! 👋
                </h1>
                <p className="text-[#94A3B8]">
                  Which subjects are you focusing on?
                </p>
                <p className="text-sm text-[#64748B] mt-1">
                  Select all that apply
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {specialties.map((specialty) => {
                  const isSelected = formData.selectedSpecialties.includes(
                    specialty.id
                  );
                  return (
                    <button
                      key={specialty.id}
                      onClick={() => toggleSpecialty(specialty.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-[#7C3AED] bg-[#7C3AED]/10"
                          : "border-[#334155] hover:border-[#7C3AED]/50"
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2"
                        style={{ backgroundColor: `${specialty.color}20` }}
                      >
                        <specialty.icon
                          className="w-5 h-5"
                          style={{ color: specialty.color }}
                        />
                      </div>
                      <p className="text-sm font-medium text-center">
                        {specialty.name}
                      </p>
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-[#7C3AED] mx-auto mt-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Goals & Study Time */}
          {step === 3 && (
            <div className="animate-fade-in space-y-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">
                  What's your learning goal?
                </h1>
                <p className="text-[#94A3B8]">
                  This helps ATOM tailor content for you
                </p>
              </div>

              {/* Goals */}
              <div className="grid sm:grid-cols-2 gap-3">
                {goals.map((goal) => {
                  const isSelected = formData.selectedGoals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? "border-[#7C3AED] bg-[#7C3AED]/10"
                          : "border-[#334155] hover:border-[#7C3AED]/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center shrink-0">
                          <goal.icon className="w-5 h-5 text-[#7C3AED]" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{goal.title}</p>
                          <p className="text-sm text-[#94A3B8]">
                            {goal.description}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-[#7C3AED] shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Study Time */}
              <div>
                <label className="text-sm text-[#94A3B8] mb-3 block">
                  How much time can you dedicate daily?
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {studyTimes.map((time) => (
                    <button
                      key={time.id}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          dailyStudyTime: time.id,
                        }))
                      }
                      className={`p-3 rounded-lg border transition-all text-center ${
                        formData.dailyStudyTime === time.id
                          ? "border-[#7C3AED] bg-[#7C3AED]/10 text-white"
                          : "border-[#334155] text-[#94A3B8] hover:border-[#7C3AED]/50"
                      }`}
                    >
                      <p className="text-sm font-medium">{time.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Telegram Connection */}
          {step === 4 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-[#06B6D4]/20 flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-10 h-10 text-[#06B6D4]" />
                </div>
                <h1 className="text-2xl font-bold mb-2">
                  Connect with ATOM on Telegram
                </h1>
                <p className="text-[#94A3B8] max-w-md mx-auto">
                  ATOM will send you daily study reminders, questions, and
                  encouragement. It's like having a study buddy in your pocket!
                </p>
              </div>

              <div className="space-y-4">
                {!formData.telegramConnected ? (
                  <Button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        telegramConnected: true,
                      }))
                    }
                    className="w-full bg-[#0088cc] hover:bg-[#0077b5] h-14"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.25.38-.51 1.07-.78 4.18-1.82 6.97-3.02 8.38-3.61 3.99-1.66 4.82-1.95 5.36-1.96.12 0 .37.03.54.17.14.12.18.28.2.45-.01.06.01.24 0 .38z" />
                    </svg>
                    Connect Telegram
                  </Button>
                ) : (
                  <div className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-[#10B981]" />
                    <div>
                      <p className="font-medium text-[#10B981]">
                        Telegram Connected!
                      </p>
                      <p className="text-sm text-[#94A3B8]">
                        ATOM will reach out shortly
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleNext}
                  className="w-full text-center text-sm text-[#94A3B8] hover:text-white py-2"
                >
                  Skip for now →
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#0F172A] border border-[#334155]">
                <p className="text-sm text-[#94A3B8]">
                  <span className="font-medium text-white">Pro tip:</span> Students
                  who connect Telegram see 40% better retention due to spaced
                  repetition reminders!
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#334155]">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1}
              className="text-[#94A3B8]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              className="bg-[#7C3AED] hover:bg-[#6D28D9] min-w-[140px]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : step === totalSteps ? (
                <>
                  Get Started
                  <Sparkles className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
