import Link from "next/link";
import {
  BookOpen,
  Brain,
  Route,
  MessageCircle,
  BarChart3,
  Zap,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BookOpen,
    title: "Curated Library",
    description: "Access structured study materials organized by specialty, topic, and difficulty level.",
    color: "#7C3AED",
  },
  {
    icon: Route,
    title: "Personalized Pathways",
    description: "AI-generated learning paths tailored to your goals, pace, and learning style.",
    color: "#06B6D4",
  },
  {
    icon: Brain,
    title: "Smart Assessments",
    description: "MCQs with spaced repetition to reinforce knowledge and identify weak areas.",
    color: "#10B981",
  },
  {
    icon: MessageCircle,
    title: "Proactive AI Tutor",
    description: "ATOM reaches out via Telegram with reminders, questions, and encouragement.",
    color: "#F59E0B",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Track reading time, engagement, and knowledge retention with detailed insights.",
    color: "#7C3AED",
  },
  {
    icon: Zap,
    title: "Atomic Learning",
    description: "Break complex topics into digestible units that compound over time.",
    color: "#06B6D4",
  },
];

const stats = [
  { value: "500+", label: "Study Materials" },
  { value: "10,000+", label: "MCQ Questions" },
  { value: "50+", label: "Learning Pathways" },
  { value: "24/7", label: "AI Support" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="NucleuX" className="w-10 h-10" />
            <span className="text-xl font-bold text-gradient-purple">NucleuX Academy</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-[#94A3B8] hover:text-white transition-colors">Features</Link>
            <Link href="#pricing" className="text-[#94A3B8] hover:text-white transition-colors">Pricing</Link>
            <Link href="#about" className="text-[#94A3B8] hover:text-white transition-colors">About</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-[#94A3B8] hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] glow-purple">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/30 mb-8">
              <Zap className="w-4 h-4 text-[#7C3AED]" />
              <span className="text-sm text-[#7C3AED]">Powered by AI • Designed for Medical Students</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Learn <span className="text-gradient-purple">Atomically</span>.
              <br />
              Grow <span className="text-gradient-cyan">Exponentially</span>.
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-[#94A3B8] mb-10 max-w-2xl mx-auto">
              A complete learning ecosystem with personalized AI agents, adaptive pathways, 
              and proactive engagement. Your AI tutor that actually reaches out.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/dashboard">
                <Button size="lg" className="bg-[#7C3AED] hover:bg-[#6D28D9] glow-purple text-lg px-8">
                  Start Learning Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="border-[#334155] text-white hover:bg-[#1E293B] text-lg px-8">
                  See Features
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gradient-purple">{stat.value}</div>
                  <div className="text-[#94A3B8] mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent z-10" />
            <div className="rounded-xl overflow-hidden border border-[#1E293B] glow-purple">
              <div className="bg-[#1E293B] p-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                </div>
                <div className="flex-1 text-center text-xs text-[#94A3B8]">NucleuX Academy Dashboard</div>
              </div>
              <div className="bg-[#0F172A] h-[400px] flex items-center justify-center">
                <img src="/logo.svg" alt="Preview" className="w-32 h-32 opacity-30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-[#0B1120]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need to <span className="text-gradient-purple">excel</span></h2>
            <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
              Built on principles of atomic learning — breaking complex knowledge into digestible units that compound over time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-[#1E293B]/50 border border-[#334155] hover:border-[#7C3AED]/50 transition-all duration-300 group"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-[#7C3AED] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#94A3B8]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-2xl bg-gradient-to-br from-[#7C3AED]/20 to-[#06B6D4]/20 border border-[#7C3AED]/30">
            <h2 className="text-4xl font-bold mb-4">Ready to transform your learning?</h2>
            <p className="text-[#94A3B8] text-lg mb-8">
              Join thousands of medical students who are learning smarter, not harder.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-[#7C3AED] hover:bg-[#6D28D9] glow-purple">
                  Get Started for Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-[#94A3B8]">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                Free forever plan
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                No credit card required
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#1E293B]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="NucleuX" className="w-8 h-8" />
              <span className="font-semibold">NucleuX Academy</span>
            </div>
            <p className="text-[#94A3B8] text-sm">
              © 2025 NucleuX Academy. Built with 🦁 by Narasimha & Aditya
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
