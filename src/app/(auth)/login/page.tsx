"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  Zap,
} from "lucide-react";

export default function LoginPage() {
  const { login, quickLogin, isLoading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const success = await login(formData.email, formData.password);

    if (!success) {
      setError("Invalid credentials. Try demo@nucleux.com with any password, or use 'demo123' as password.");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  const handleQuickDemo = () => {
    quickLogin();
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#7C3AED]" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1E293B] mb-2">Welcome back</h1>
        <p className="text-[#64748B]">
          Sign in to continue your learning journey
        </p>
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

          {/* Quick Demo Button */}
          <Button
            variant="outline"
            className="w-full mb-4 border-[#7C3AED] bg-[#F5F3FF] hover:bg-[#7C3AED] hover:text-white h-12 text-[#7C3AED] font-medium shadow-sm transition-all"
            onClick={handleQuickDemo}
            disabled={isLoading}
          >
            <Zap className="w-5 h-5 mr-2" />
            Quick Demo (No Login)
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#E2E8F0]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-[#94A3B8]">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#334155]">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="pl-10 h-12 border-[#CBD5E1] focus:border-[#7C3AED] focus:ring-[#7C3AED] bg-[#F8FAFC]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-[#334155]">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#7C3AED] hover:text-[#6D28D9] font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pl-10 pr-10 h-12 border-[#CBD5E1] focus:border-[#7C3AED] focus:ring-[#7C3AED] bg-[#F8FAFC]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold shadow-lg shadow-[#7C3AED]/25 transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Demo Credentials Hint */}
          <div className="mt-4 p-3 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-sm text-[#166534]">
            <p className="font-medium mb-1">Demo Credentials:</p>
            <ul className="text-xs space-y-1 text-[#15803D]">
              <li>• <code>aditya@nucleux.com</code> (Admin)</li>
              <li>• <code>sarath@nucleux.com</code> (Faculty)</li>
              <li>• <code>demo@nucleux.com</code> (Student)</li>
              <li className="text-[#6B7280]">Any password works, or use <code>demo123</code> with any email</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <p className="text-center mt-6 text-[#64748B]">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="text-[#7C3AED] hover:text-[#6D28D9] font-semibold"
        >
          Sign up for free
        </Link>
      </p>
    </div>
  );
}
