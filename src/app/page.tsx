"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import {
  BookOpen,
  Brain,
  Route,
  MessageCircle,
  BarChart3,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Quote,
  Trophy,
  Users,
  Target,
  Sparkles,
  GraduationCap,
  Building2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: BookOpen,
    title: "24 Standard Textbooks",
    description: "Harrison's, Bailey & Love, Robbins, Blumgart's — all indexed, searchable, and citation-ready.",
    color: "#7C3AED",
  },
  {
    icon: Route,
    title: "Personalized Pathways",
    description: "AI-generated learning paths tailored to your NEET-PG/INICET goals, weak areas, and available time.",
    color: "#06B6D4",
  },
  {
    icon: Brain,
    title: "20,000+ UWorld-Style MCQs",
    description: "Every option explained. Know WHY each answer is right or wrong. Spaced repetition built-in.",
    color: "#10B981",
  },
  {
    icon: MessageCircle,
    title: "ATOM - Your AI Tutor",
    description: "Proactive AI that reaches out via Telegram with daily questions, identifies your weak spots, and never judges.",
    color: "#F59E0B",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description: "Track subject-wise accuracy, time per question, weak topics — everything you need to improve.",
    color: "#7C3AED",
  },
  {
    icon: Zap,
    title: "Atomic Learning",
    description: "Complex topics broken into digestible atoms. 15 minutes of focused learning beats hours of passive reading.",
    color: "#06B6D4",
  },
];

const stats = [
  { value: 12456, suffix: "+", label: "Active Students", icon: Users },
  { value: 20000, suffix: "+", label: "MCQ Questions", icon: Target },
  { value: 52, suffix: "", label: "Medical Colleges", icon: Building2 },
  { value: 94, suffix: "%", label: "Improvement Rate", icon: TrendingUp },
];

const testimonials = [
  {
    name: "Dr. Priya Sharma",
    role: "NEET-PG Rank 342",
    college: "AIIMS Delhi",
    avatar: "PS",
    content: "I was stuck at 450 marks in mocks for months. ATOM identified that I was weak in Hepatobiliary surgery and Nephrology. After 2 months of focused revision with NucleuX, I jumped to 520+. The &apos;why each option is wrong&apos; explanations are game-changers.",
    rating: 5,
    badge: "Top Ranker",
  },
  {
    name: "Rahul Venkatesh",
    role: "INICET AIR 127",
    college: "CMC Vellore",
    avatar: "RV",
    content: "The personalized pathway for INICET was incredible. Instead of randomly solving MCQs, I followed a structured plan that adapted to my weak areas. My accuracy went from 62% to 84% in 3 months. The community discussions helped me understand tricky concepts.",
    rating: 5,
    badge: "INICET Topper",
  },
  {
    name: "Dr. Kavitha Menon",
    role: "MS Surgery Resident",
    college: "JIPMER",
    avatar: "KM",
    content: "As a PG resident, I have barely 30 mins/day for study. NucleuX&apos;s atomic notes let me learn during OT breaks. The citations to Maingot&apos;s and Blumgart&apos;s helped me in case presentations. ATOM&apos;s daily MCQs kept me consistent even on busy posting days.",
    rating: 5,
    badge: "Verified Resident",
  },
  {
    name: "Sneha Patel",
    role: "Final Year MBBS",
    college: "KMC Manipal",
    avatar: "SP",
    content: "Started using NucleuX 4 months before NEET-PG. The study groups feature helped me find accountability partners. We would discuss difficult MCQs every night. Scored 520 in my first attempt - something I never imagined possible!",
    rating: 5,
  },
  {
    name: "Arjun Reddy",
    role: "NEET-PG Rank 891",
    college: "Osmania MC",
    avatar: "AR",
    content: "The Arena feature made studying feel like a game. Competing on daily leaderboards kept me motivated. I especially loved the weekly tournaments - pushed me to do 100+ MCQs daily. The coins I earned got me 3 months of premium free!",
    rating: 5,
  },
  {
    name: "Dr. Mohammed Ali",
    role: "DNB Pediatrics",
    college: "Manipal Hospitals",
    avatar: "MA",
    content: "NucleuX helped me crack DNB CET for Pediatrics. The subject-wise notes from Nelson&apos;s and OP Ghai were perfectly organized. What I loved most: asking ATOM doubts at 2 AM without feeling embarrassed. It explains until I truly understand.",
    rating: 5,
    badge: "DNB Success",
  },
];

// Top colleges using NucleuX
const colleges = [
  "AIIMS Delhi", "CMC Vellore", "JIPMER", "KMC Manipal", 
  "MAMC Delhi", "Grant MC Mumbai", "Stanley MC Chennai", 
  "Osmania MC", "KGMU Lucknow", "GMC Thiruvananthapuram"
];

// Animated counter hook
function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!start) return;
    
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, start]);
  
  return count;
}

// Intersection Observer hook
function useInView(threshold: number = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [threshold]);
  
  return { ref, inView };
}

// Stat counter component
function StatCounter({ value, suffix, label, icon: Icon }: { value: number; suffix: string; label: string; icon: React.ComponentType<{ className?: string }> }) {
  const { ref, inView } = useInView(0.5);
  const count = useCountUp(value, 2000, inView);
  
  return (
    <div ref={ref} className="text-center p-6 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-lg transition-all">
      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-[#06B6D4]/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-[#7C3AED]" />
      </div>
      <div className="text-3xl md:text-4xl font-bold text-gradient-purple">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[#64748B] mt-1">{label}</div>
    </div>
  );
}

export default function LandingPage() {
  // Use useSyncExternalStore for hydration-safe mounting
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image 
              src="/logo.svg" 
              alt="NucleuX"
              width={40}
              height={40}
              className="transition-transform group-hover:scale-110" 
            />
            <span className="text-xl font-bold text-gradient-purple">NucleuX Academy</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-[#64748B] hover:text-[#1E293B] transition-colors">Features</Link>
            <Link href="#testimonials" className="text-[#64748B] hover:text-[#1E293B] transition-colors">Success Stories</Link>
            <Link href="#pricing" className="text-[#64748B] hover:text-[#1E293B] transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC]">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] shadow-lg shadow-[#7C3AED]/20">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-white to-[#F5F3FF]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Floating Logo */}
            <div className={`mb-8 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
              <Image 
                src="/logo.svg" 
                alt="NucleuX"
                width={96}
                height={96}
                className="mx-auto animate-float drop-shadow-xl"
              />
            </div>
            
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5F3FF] border border-[#E9D5FF] mb-8 shadow-sm ${mounted ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
              <Sparkles className="w-4 h-4 text-[#7C3AED]" />
              <span className="text-sm text-[#7C3AED] font-medium">Trusted by 12,000+ NEET-PG Aspirants</span>
            </div>
            
            {/* Headline with Animation */}
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 leading-tight text-[#1E293B] ${mounted ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              Crack <span className="text-gradient-purple">NEET-PG</span> with
              <br />
              <span className="text-gradient-cyan">AI-Powered</span> Learning
            </h1>
            
            {/* Subheadline */}
            <p className={`text-xl text-[#64748B] mb-10 max-w-2xl mx-auto ${mounted ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
              24 standard textbooks. 20,000+ UWorld-style MCQs. An AI tutor that reaches out. 
              Built by doctors, for doctors.
            </p>
            
            {/* CTAs */}
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 ${mounted ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
              <Link href="/signup">
                <Button size="lg" className="bg-[#7C3AED] hover:bg-[#6D28D9] shadow-xl shadow-[#7C3AED]/25 text-lg px-8">
                  Start 7-Day Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="border-[#E2E8F0] text-[#1E293B] hover:bg-[#F8FAFC] text-lg px-8">
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className={`flex items-center justify-center gap-6 text-sm text-[#64748B] ${mounted ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.45s' }}>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                Cancel anytime
              </span>
              <span className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#F59E0B]" />
                100+ toppers in 2025
              </span>
            </div>

            {/* Stats Grid */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 ${mounted ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
              {stats.map((stat) => (
                <StatCounter key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} icon={stat.icon} />
              ))}
            </div>
          </div>

          {/* College logos */}
          <div className={`mt-16 text-center ${mounted ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
            <p className="text-sm text-[#94A3B8] mb-6">Students from top medical colleges trust NucleuX</p>
            <div className="flex flex-wrap justify-center gap-4">
              {colleges.slice(0, 6).map((college) => (
                <Badge key={college} className="bg-white text-[#64748B] border-[#E2E8F0] px-4 py-2 shadow-sm">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  {college}
                </Badge>
              ))}
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className={`mt-20 relative ${mounted ? 'animate-slide-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.7s' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-transparent to-transparent z-10" />
            <div className="rounded-xl overflow-hidden border border-[#E2E8F0] shadow-2xl shadow-[#7C3AED]/10">
              <div className="bg-white p-2 flex items-center gap-2 border-b border-[#E2E8F0]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                </div>
                <div className="flex-1 text-center text-xs text-[#94A3B8]">NucleuX Academy — Your Personal Study Desk</div>
              </div>
              <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F5F3FF] h-[400px] flex items-center justify-center relative overflow-hidden">
                <Image src="/logo.svg" alt="Preview" width={128} height={128} className="opacity-20 animate-float" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#1E293B] mb-2">Your Dashboard Preview</p>
                    <p className="text-[#64748B]">Personalized study plans, progress tracking, AI recommendations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-[#F5F3FF] text-[#7C3AED] border-[#E9D5FF] mb-4">Features</Badge>
            <h2 className="text-4xl font-bold text-[#1E293B] mb-4">Everything you need to <span className="text-gradient-purple">crack NEET-PG</span></h2>
            <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
              Not just another question bank. A complete ecosystem designed around how doctors actually learn.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#7C3AED]/30 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-sm"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-semibold text-[#1E293B] mb-2 group-hover:text-[#7C3AED] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#64748B]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof - Success Stories */}
      <section id="testimonials" className="py-20 px-6 bg-gradient-to-b from-[#F8FAFC] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-[#FFFBEB] text-[#D97706] border-[#FDE68A] mb-4">Success Stories</Badge>
            <h2 className="text-4xl font-bold text-[#1E293B] mb-4">Real Results from <span className="text-gradient-cyan">Real Doctors</span></h2>
            <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
              100+ rank holders in NEET-PG 2025. Here&apos;s what they have to say.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="p-6 rounded-xl bg-white border border-[#E2E8F0] hover:shadow-xl transition-all shadow-sm relative"
              >
                {/* Quote icon */}
                <Quote className="absolute top-4 right-4 w-8 h-8 text-[#7C3AED]/10" />
                
                {/* Badge */}
                {testimonial.badge && (
                  <Badge className="bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white border-none mb-4 shadow-md">
                    <Trophy className="w-3 h-3 mr-1" />
                    {testimonial.badge}
                  </Badge>
                )}
                
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>
                
                {/* Content */}
                <p className="text-[#64748B] mb-6 leading-relaxed text-sm">
                  &quot;{testimonial.content}&quot;
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center text-white font-semibold shadow-md">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-[#1E293B]">{testimonial.name}</div>
                    <div className="text-sm text-[#7C3AED] font-medium">{testimonial.role}</div>
                    <div className="text-xs text-[#94A3B8]">{testimonial.college}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ATOM Feature Highlight */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-[#F5F3FF] via-white to-[#F0F9FF] rounded-2xl border border-[#E2E8F0] p-8 md:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C3AED]/5 rounded-full blur-3xl" />
            <div className="grid md:grid-cols-2 gap-8 items-center relative">
              <div>
                <Badge className="bg-[#7C3AED] text-white mb-4">Meet ATOM</Badge>
                <h2 className="text-3xl font-bold text-[#1E293B] mb-4">
                  An AI Tutor That <span className="text-gradient-purple">Actually Reaches Out</span>
                </h2>
                <p className="text-[#64748B] mb-6">
                  Most apps wait for you. ATOM doesn&apos;t. Get daily MCQs on Telegram, personalized weak area reminders, 
                  and 24/7 doubt solving. Like having a senior who never sleeps.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    "Daily Telegram MCQs at your preferred time",
                    "Identifies weak topics from your performance",
                    "Explains until you truly understand",
                    "No question is too basic"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[#64748B]">
                      <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] shadow-lg shadow-[#7C3AED]/20">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Meet ATOM
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center shadow-2xl">
                  <span className="text-8xl">🦁</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-20 px-6 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-2xl bg-gradient-to-br from-[#F5F3FF] via-white to-[#F0F9FF] border border-[#E2E8F0] shadow-xl">
            <Badge className="bg-[#10B981]/10 text-[#059669] border-[#A7F3D0] mb-4">Limited Offer</Badge>
            <h2 className="text-4xl font-bold text-[#1E293B] mb-4">Start Your NEET-PG Journey Today</h2>
            <p className="text-[#64748B] text-lg mb-8">
              Join 12,000+ medical students already preparing smarter, not harder.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link href="/signup">
                <Button size="lg" className="bg-[#7C3AED] hover:bg-[#6D28D9] shadow-xl shadow-[#7C3AED]/25 px-8">
                  Start 7-Day Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#64748B]">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                7 days free, then ₹299/month
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#E2E8F0] bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image src="/logo.svg" alt="NucleuX" width={32} height={32} />
              <span className="font-semibold text-[#1E293B]">NucleuX Academy</span>
            </div>
            <p className="text-[#64748B] text-sm text-center">
              © 2026 NucleuX Academy. Built with 🦁 for medical students who dream of becoming great doctors.
            </p>
            <div className="flex items-center gap-6 text-sm text-[#64748B]">
              <Link href="#" className="hover:text-[#7C3AED]">Privacy</Link>
              <Link href="#" className="hover:text-[#7C3AED]">Terms</Link>
              <Link href="#" className="hover:text-[#7C3AED]">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
