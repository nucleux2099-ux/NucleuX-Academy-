"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Stethoscope,
  Brain,
  Baby,
  Eye,
  Heart,
  Syringe,
  Microscope,
  Activity,
  BookOpen,
  Trophy,
  FlaskConical,
  GraduationCap,
  Target,
  Clock,
  Sun,
  Moon,
  Sunset,
  Coffee,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
} from "lucide-react";

const specialties = [
  { id: "surgery", label: "Surgery", icon: Syringe, color: "text-red-400" },
  { id: "medicine", label: "Medicine", icon: Stethoscope, color: "text-blue-400" },
  { id: "pediatrics", label: "Pediatrics", icon: Baby, color: "text-pink-400" },
  { id: "obgyn", label: "OB/GYN", icon: Heart, color: "text-rose-400" },
  { id: "ophthalmology", label: "Ophthalmology", icon: Eye, color: "text-cyan-400" },
  { id: "neurology", label: "Neurology", icon: Brain, color: "text-purple-400" },
  { id: "anesthesia", label: "Anesthesia", icon: Activity, color: "text-green-400" },
  { id: "pathology", label: "Pathology", icon: Microscope, color: "text-orange-400" },
  { id: "radiology", label: "Radiology", icon: FlaskConical, color: "text-yellow-400" },
];

const goals = [
  {
    id: "exam",
    label: "Exam Preparation",
    description: "NEET-PG, USMLE, PLAB, or other exams",
    icon: GraduationCap,
  },
  {
    id: "clinical",
    label: "Clinical Excellence",
    description: "Deep understanding for patient care",
    icon: Target,
  },
  {
    id: "research",
    label: "Research / Academic",
    description: "Building knowledge for teaching or research",
    icon: BookOpen,
  },
  {
    id: "general",
    label: "General Learning",
    description: "Staying updated with medical knowledge",
    icon: Sparkles,
  },
];

const timeOptions = [
  { id: "30", label: "30 min", description: "Quick daily review" },
  { id: "60", label: "1 hour", description: "Balanced learning" },
  { id: "120", label: "2 hours", description: "Deep study" },
  { id: "180", label: "3+ hours", description: "Intensive prep" },
];

const scheduleOptions = [
  { id: "morning", label: "Morning", icon: Sun, time: "6 AM - 12 PM" },
  { id: "afternoon", label: "Afternoon", icon: Coffee, time: "12 PM - 5 PM" },
  { id: "evening", label: "Evening", icon: Sunset, time: "5 PM - 9 PM" },
  { id: "night", label: "Night", icon: Moon, time: "9 PM - 12 AM" },
];

const pathways = [
  {
    id: "surgical-gi",
    title: "Surgical GI Fundamentals",
    topics: 12,
    weeks: 4,
    hours: 24,
    description: "GI Anatomy → Physiology → Imaging → Common Conditions → Surgical Approaches",
  },
  {
    id: "hepatology",
    title: "Hepatology Essentials",
    topics: 10,
    weeks: 3,
    hours: 18,
    description: "Liver Anatomy → Cirrhosis → Portal HTN → Hepatitis → Liver Tumors",
  },
  {
    id: "emergency-gi",
    title: "GI Emergencies",
    topics: 8,
    weeks: 2,
    hours: 12,
    description: "Acute Abdomen → GI Bleeding → Obstruction → Perforation → Trauma",
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [specialty, setSpecialty] = useState("");
  const [goal, setGoal] = useState("");
  const [dailyTime, setDailyTime] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [selectedPathway, setSelectedPathway] = useState("");

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const canProceed = () => {
    switch (step) {
      case 1:
        return specialty !== "";
      case 2:
        return goal !== "";
      case 3:
        return dailyTime !== "" && preferredTime !== "";
      case 4:
        return selectedPathway !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      window.location.href = "/dashboard";
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative p-6">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="NucleuX" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold text-white">NucleuX Academy</h1>
              <p className="text-xs text-gray-400">Let's personalize your experience</p>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Step {step} of {totalSteps}
          </div>
        </div>
        <div className="max-w-3xl mx-auto mt-4">
          <Progress value={progress} className="h-2 bg-gray-800" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="relative w-full max-w-3xl bg-gray-800/30 border-gray-700 backdrop-blur-xl p-8">
          {/* Step 1: Specialty */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  What's your primary specialty?
                </h2>
                <p className="text-gray-400">
                  We'll customize your learning content based on this
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {specialties.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSpecialty(s.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      specialty === s.id
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-gray-700 hover:border-gray-600 bg-gray-800/50"
                    }`}
                  >
                    <s.icon className={`w-8 h-8 mx-auto mb-2 ${s.color}`} />
                    <span className="text-sm font-medium text-white">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Goal */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  What's your learning goal?
                </h2>
                <p className="text-gray-400">
                  This helps us tailor the difficulty and pacing
                </p>
              </div>

              <div className="space-y-4">
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                      goal === g.id
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-gray-700 hover:border-gray-600 bg-gray-800/50"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg ${
                        goal === g.id ? "bg-purple-500/30" : "bg-gray-700"
                      }`}
                    >
                      <g.icon
                        className={`w-6 h-6 ${goal === g.id ? "text-purple-400" : "text-gray-400"}`}
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-white">{g.label}</p>
                      <p className="text-sm text-gray-400">{g.description}</p>
                    </div>
                    {goal === g.id && (
                      <Check className="w-5 h-5 text-purple-400 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Schedule */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  How much time can you dedicate?
                </h2>
                <p className="text-gray-400">
                  We'll create a realistic study schedule for you
                </p>
              </div>

              {/* Daily Time */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-300">Daily study time</p>
                <div className="grid grid-cols-4 gap-3">
                  {timeOptions.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setDailyTime(t.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        dailyTime === t.id
                          ? "border-purple-500 bg-purple-500/20"
                          : "border-gray-700 hover:border-gray-600 bg-gray-800/50"
                      }`}
                    >
                      <Clock
                        className={`w-6 h-6 mx-auto mb-2 ${
                          dailyTime === t.id ? "text-purple-400" : "text-gray-400"
                        }`}
                      />
                      <p className="text-sm font-medium text-white">{t.label}</p>
                      <p className="text-xs text-gray-500">{t.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Time */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-300">Best time to study</p>
                <div className="grid grid-cols-4 gap-3">
                  {scheduleOptions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setPreferredTime(s.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        preferredTime === s.id
                          ? "border-cyan-500 bg-cyan-500/20"
                          : "border-gray-700 hover:border-gray-600 bg-gray-800/50"
                      }`}
                    >
                      <s.icon
                        className={`w-6 h-6 mx-auto mb-2 ${
                          preferredTime === s.id ? "text-cyan-400" : "text-gray-400"
                        }`}
                      />
                      <p className="text-sm font-medium text-white">{s.label}</p>
                      <p className="text-xs text-gray-500">{s.time}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: First Pathway */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Choose your first learning pathway
                </h2>
                <p className="text-gray-400">
                  Start with a structured path — you can always add more later
                </p>
              </div>

              <div className="space-y-4">
                {pathways.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPathway(p.id)}
                    className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                      selectedPathway === p.id
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-gray-700 hover:border-gray-600 bg-gray-800/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            selectedPathway === p.id ? "bg-purple-500/30" : "bg-gray-700"
                          }`}
                        >
                          <Trophy
                            className={`w-5 h-5 ${
                              selectedPathway === p.id ? "text-purple-400" : "text-gray-400"
                            }`}
                          />
                        </div>
                        <h3 className="font-semibold text-white">{p.title}</h3>
                      </div>
                      {selectedPathway === p.id && (
                        <Check className="w-5 h-5 text-purple-400" />
                      )}
                    </div>

                    <div className="flex gap-4 text-sm text-gray-400 mb-3">
                      <span>{p.topics} topics</span>
                      <span>•</span>
                      <span>{p.weeks} weeks</span>
                      <span>•</span>
                      <span>{p.hours} hours total</span>
                    </div>

                    <p className="text-sm text-gray-500">{p.description}</p>
                  </button>
                ))}
              </div>

              {selectedPathway && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <p className="text-sm text-green-400">
                    Great choice! You're ready to start learning.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="border-gray-600 text-gray-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {step === totalSteps ? (
                <>
                  Start Learning
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
        </Card>
      </div>
    </div>
  );
}
