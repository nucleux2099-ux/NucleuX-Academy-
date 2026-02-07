"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  CheckCircle,
  Stethoscope,
  AlertCircle,
} from "lucide-react";

const specialties = [
  "General Medicine",
  "Surgery",
  "Pediatrics",
  "Obstetrics & Gynecology",
  "Orthopedics",
  "Cardiology",
  "Neurology",
  "Dermatology",
  "Psychiatry",
  "Radiology",
  "Other",
];

const levels = [
  { id: "mbbs", label: "MBBS Student", description: "Undergraduate" },
  { id: "intern", label: "Intern", description: "Internship year" },
  { id: "pg", label: "PG Resident", description: "MD/MS/DNB" },
  { id: "practicing", label: "Practicing Doctor", description: "Post-residency" },
  { id: "other", label: "Other", description: "Allied health" },
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    level: "",
    specialty: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === 1) {
      setStep(2);
      return;
    }

    setIsLoading(true);

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.name,
          level: formData.level,
          specialty: formData.specialty,
        },
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    // If email confirmation is disabled, redirect to onboarding
    if (data.user && data.session) {
      router.push("/onboarding");
      router.refresh();
    } else {
      // If email confirmation is enabled, show success message
      setError("Check your email to confirm your account");
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return { score: 0, label: "", color: "" };
    if (password.length < 6) return { score: 1, label: "Weak", color: "bg-red-500" };
    if (password.length < 8) return { score: 2, label: "Fair", color: "bg-yellow-500" };
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { score: 4, label: "Strong", color: "bg-green-500" };
    }
    return { score: 3, label: "Good", color: "bg-cyan-500" };
  };

  const strength = passwordStrength();

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1E293B] mb-2">
          {step === 1 ? "Create your account" : "Tell us about yourself"}
        </h1>
        <p className="text-[#64748B]">
          {step === 1
            ? "Join thousands of medical students learning smarter"
            : "Help us personalize your learning experience"}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className={`w-3 h-3 rounded-full transition-colors ${step >= 1 ? "bg-[#7C3AED]" : "bg-[#E2E8F0]"}`} />
        <div className={`w-12 h-1 rounded transition-colors ${step >= 2 ? "bg-[#7C3AED]" : "bg-[#E2E8F0]"}`} />
        <div className={`w-3 h-3 rounded-full transition-colors ${step >= 2 ? "bg-[#7C3AED]" : "bg-[#E2E8F0]"}`} />
      </div>

      <Card className="bg-white border-[#E2E8F0] shadow-lg">
        <CardContent className="p-6">
          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <>
              {/* Social Signup Buttons */}
              <div className="space-y-3 mb-6">
                <Button
                  variant="outline"
                  className="w-full border-[#CBD5E1] bg-white hover:border-[#7C3AED] hover:bg-[#F5F3FF] h-12 text-[#1E293B] font-medium shadow-sm transition-all"
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E2E8F0]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-[#94A3B8]">
                    or continue with email
                  </span>
                </div>
              </div>

              {/* Signup Form Step 1 */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-[#64748B] mb-1.5 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <Input
                      type="text"
                      placeholder="Dr. John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="pl-10 bg-[#F8FAFC] border-[#E2E8F0] h-12 text-[#1E293B] focus:border-[#7C3AED] focus:ring-[#7C3AED]/20"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-[#64748B] mb-1.5 block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="pl-10 bg-[#F8FAFC] border-[#E2E8F0] h-12 text-[#1E293B] focus:border-[#7C3AED] focus:ring-[#7C3AED]/20"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-[#64748B] mb-1.5 block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, password: e.target.value }))
                      }
                      className="pl-10 pr-10 bg-[#F8FAFC] border-[#E2E8F0] h-12 text-[#1E293B] focus:border-[#7C3AED] focus:ring-[#7C3AED]/20"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {/* Password Strength */}
                  {formData.password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded ${
                              i <= strength.score ? strength.color : "bg-[#E2E8F0]"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-[#64748B]">
                        Password strength:{" "}
                        <span className={strength.score >= 3 ? "text-green-600" : "text-yellow-600"}>
                          {strength.label}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] h-12 shadow-lg shadow-[#7C3AED]/20"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </>
          ) : (
            /* Step 2: Professional Details */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm text-[#64748B] mb-3 block flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  What describes you best?
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {levels.map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, level: level.id }))}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        formData.level === level.id
                          ? "border-[#7C3AED] bg-[#F5F3FF]"
                          : "border-[#E2E8F0] hover:border-[#7C3AED]/50 bg-[#F8FAFC]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#1E293B]">{level.label}</p>
                          <p className="text-sm text-[#64748B]">{level.description}</p>
                        </div>
                        {formData.level === level.id && (
                          <CheckCircle className="w-5 h-5 text-[#7C3AED]" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-[#64748B] mb-1.5 block">
                  Primary Interest / Specialty
                </label>
                <select
                  value={formData.specialty}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, specialty: e.target.value }))
                  }
                  className="w-full h-12 px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20"
                  required
                >
                  <option value="">Select specialty...</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-[#E2E8F0] h-12 hover:bg-[#F8FAFC]"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#7C3AED] hover:bg-[#6D28D9] h-12 shadow-lg shadow-[#7C3AED]/20"
                  disabled={isLoading || !formData.level || !formData.specialty}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Sign In Link */}
      <p className="text-center mt-6 text-[#64748B]">
        Already have an account?{" "}
        <Link href="/login" className="text-[#7C3AED] hover:underline font-medium">
          Sign in
        </Link>
      </p>

      {/* Terms */}
      <p className="text-center mt-4 text-xs text-[#94A3B8]">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="text-[#7C3AED] hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-[#7C3AED] hover:underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
