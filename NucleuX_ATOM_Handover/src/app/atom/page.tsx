"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Atom,
  BookOpen,
  GraduationCap,
  Target,
  Swords,
  Gauge,
  Users,
  BrainCircuit,
  Network,
  Activity,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { SupportFooter } from "@/components/marketing/SupportFooter";

// --- Data Structures ---

const atomRoles = [
  {
    room: "Library",
    title: "ATOM Librarian",
    icon: BookOpen,
    color: "#5BB3B3",
    description: "Your guide through the Explorer, Exam Prep, Textbook, Quiz, Cases, and Roadmap views.",
    bullets: [
      "Builds prerequisite connections",
      "Highlights related mental models",
      "Structures your study time",
    ],
  },
  {
    room: "Classroom",
    title: "ATOM Scribe",
    icon: GraduationCap,
    color: "#6BA8C9",
    description: "Listens and synthesizes alongside you during both AI and human lectures.",
    bullets: [
      "Generates clean notes dynamically",
      "Constructs real-time mindmaps",
      "Primes sessions for fast revision",
    ],
  },
  {
    room: "Training Centre",
    title: "ATOM Trainer",
    icon: Target,
    color: "#C9A86C",
    description: "Transforms practice questions into deep, Socratic learning opportunities.",
    bullets: [
      "Targets your specific weak points",
      "Adjusts difficulty dynamically",
      "Builds NEET-PG / INICET patterns",
    ],
  },
  {
    room: "Arena",
    title: "ATOM Challenger",
    icon: Swords,
    color: "#EC4899",
    description: "Pressure-proofs your clinical knowledge with timed, high-stakes drills.",
    bullets: [
      "Mixed-set rapid fire questions",
      "Tracks speed vs. accuracy",
      "Maintains depth under pressure",
    ],
  },
  {
    room: "Backstage",
    title: "ATOM Coach",
    icon: Gauge,
    color: "#A78BFA",
    description: "Calibrates your confidence against your actual performance. No blind spots.",
    bullets: [
      "Tracks the competency ladder",
      "Highlights false confidence",
      "Applies the Kolb learning cycle",
    ],
  },
  {
    room: "Common Room",
    title: "ATOM Guide",
    icon: Users,
    color: "#10B981",
    description: "Moderates community discussions, extracting high-yield signals from the noise.",
    bullets: [
      "Structures complex case debates",
      "Extracts revision takeaways",
      "Maintains academic rigor",
    ],
  },
];

const memoryPoints = [
  {
    title: "1. Captures your fingerprint",
    body: "Tracks weak topics, common mistakes, and the 'near-miss' misconceptions that keep trapping you in MCQs.",
    icon: BrainCircuit,
    color: "#E879F9",
  },
  {
    title: "2. Builds a structured map",
    body: "Organizes knowledge into prerequisites → concepts → applications. It understands dependencies, not just playlists.",
    icon: Network,
    color: "#5BB3B3",
  },
  {
    title: "3. Converts errors to lessons",
    body: "Every wrong answer becomes a concept fix: why you chose it, the pattern trap, and the rule to prevent it.",
    icon: Activity,
    color: "#C9A86C",
  },
  {
    title: "4. Honest calibration",
    body: "Compares confidence vs. true accuracy. The goal is completely predictable performance in exams and wards.",
    icon: Target,
    color: "#F87171",
  },
  {
    title: "5. Persistent consistency",
    body: "The same partner across every room. Teacher in the Classroom, Librarian in the Library. Your map travels with you.",
    icon: Zap,
    color: "#6BA8C9",
  },
  {
    title: "6. Absolute boundaries",
    body: "Designed to avoid patient identifiers in logbooks. Built strictly for safe learning and structured academic revision.",
    icon: ShieldCheck,
    color: "#10B981",
  },
];

const journey = [
  {
    phase: "MBBS",
    title: "Foundation & Connection",
    body: "Build concepts from the ground up. Reduce overwhelm. Learn physiological mechanisms first, then compress them for exams.",
  },
  {
    phase: "Intern",
    title: "Real-world Exposure",
    body: "Turn ward cases into learning: differentials, 'don't miss' red flags, and quick bedside reasoning. Reflection starts compounding.",
  },
  {
    phase: "Resident",
    title: "Speed & Depth",
    body: "High-volume decisions demand fast recall. Arena drills secure the patterns, while Backstage keeps your calibration brutally honest.",
  },
  {
    phase: "Consultant",
    title: "Refinement & Teaching",
    body: "Sharpen clinical judgement: edge cases, pitfalls, and teaching juniors. ATOM shifts from 'help me learn' to 'help me supervise'.",
  },
];

// --- Components ---

export default function AtomPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E8E0D5] relative overflow-hidden" ref={containerRef}>
      {/* Subtle Grid Overlays (Removed Noisy Background for better legibility) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(91,179,179,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(91,179,179,0.2) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Hero Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#5BB3B3]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[#E879F9]/5 blur-[150px] rounded-full pointer-events-none" />

      <MarketingHeader
        active="atom"
        subtitle="Medical learning OS powered by ATOM"
        primaryCta={{ href: "/signup", label: "Start with ATOM" }}
        secondaryCta={{ href: "/campus", label: "Campus Tour" }}
        showRooms={true}
      />

      <main className="relative z-10 pb-32">
        {/* --- HERO SECTION --- */}
        <section className="max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-[#5BB3B3]/20 blur-2xl rounded-full" />
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#131E30] to-[#0B1220] border border-[#5BB3B3]/30 flex items-center justify-center relative z-10 shadow-[0_0_40px_rgba(91,179,179,0.2)]">
                <Atom className="w-12 h-12 text-[#5BB3B3] animate-[spin_10s_linear_infinite]" />
              </div>
            </div>

            <Badge className="bg-[#5BB3B3]/10 text-[#5BB3B3] border-[#5BB3B3]/20 px-4 py-1.5 text-sm mb-6">
              The Engine of NucleuX
            </Badge>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 leading-none">
              Your Clinical <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BB3B3] to-[#8EE4E4]">
                Thinking Partner.
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-[#A0B0BC] max-w-3xl font-light leading-relaxed">
              ATOM isn't a generic chatbot. It is a highly-specialized AI architecture that lives inside every room of the NucleuX campus, building a persistent memory of your medical cognition.
            </p>
          </motion.div>
        </section>

        {/* --- INTERACTIVE ROLES SECTION --- */}
        <section className="relative px-6 py-24 border-y border-white/5 bg-[#0B1220]/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">One Core. Many Roles.</h2>
              <p className="text-xl text-[#A0B0BC] max-w-2xl mx-auto">
                As you move through the virtual campus, ATOM dynamically shifts its behavior to suit the environment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {atomRoles.map((role, i) => (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative rounded-[2rem] border border-white/10 bg-[#131E30]/60 p-8 hover:bg-[#131E30]/90 transition-all duration-500 overflow-hidden"
                >
                  {/* Hover Glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${role.color}, transparent 70%)` }}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                        style={{ backgroundColor: `${role.color}15`, border: `1px solid ${role.color}30` }}
                      >
                        <role.icon className="w-7 h-7" style={{ color: role.color }} />
                      </div>
                      <span className="text-sm font-bold uppercase tracking-widest text-[#6B7A88]">
                        {role.room}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
                      {role.title}
                    </h3>
                    <p className="text-[#A0B0BC] leading-relaxed mb-6 flex-grow">
                      {role.description}
                    </p>

                    <div className="pt-6 border-t border-white/10">
                      <ul className="space-y-3">
                        {role.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: role.color }} />
                            <span className="text-sm text-[#8B9AA4]">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- STICKY MEMORY NARRATIVE --- */}
        <section className="relative w-full">
          <div className="max-w-7xl mx-auto px-6 py-32">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

              {/* Sticky "Brain" Graphic */}
              <div className="lg:sticky lg:top-32 w-full aspect-square max-h-[600px] rounded-[3rem] border border-[#5BB3B3]/20 bg-gradient-to-br from-[#131E30] to-[#0B1220] flex items-center justify-center p-8 shadow-[0_0_50px_rgba(91,179,179,0.1)] overflow-hidden relative">
                {/* Simulated Neural Network Animation */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                    className="w-[800px] h-[800px] border-[1px] border-dashed border-[#5BB3B3] rounded-full absolute"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                    className="w-[600px] h-[600px] border-[1px] border-dashed border-[#E879F9] rounded-full absolute"
                  />
                </div>

                <div className="relative z-10 text-center">
                  <div className="w-32 h-32 mx-auto rounded-full bg-[#0B1220] border-2 border-[#5BB3B3]/50 flex items-center justify-center shadow-[0_0_40px_rgba(91,179,179,0.3)] mb-6">
                    <Atom className="w-16 h-16 text-[#5BB3B3]" />
                  </div>
                  <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 tracking-tight">
                    Persistent Memory
                  </h3>
                  <p className="mt-4 text-[#A0B0BC] max-w-sm mx-auto">
                    ATOM doesn't reset. It builds a continuously evolving cognitive mirror of your medical mind.
                  </p>
                </div>
              </div>

              {/* Scrolling Text Content */}
              <div className="space-y-12">
                <div className="mb-12">
                  <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                    How the <span className="text-[#5BB3B3]">Memory works.</span>
                  </h2>
                  <p className="mt-6 text-xl text-[#A0B0BC]">
                    Generic chatbots forget who you are every time you open a new tab. ATOM remembers yesterday's mistakes to shape tomorrow's learning.
                  </p>
                </div>

                {memoryPoints.map((point, i) => (
                  <motion.div
                    key={point.title}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ margin: "-20% 0px -20% 0px" }}
                    transition={{ duration: 0.5 }}
                    className="p-8 rounded-[2rem] border border-white/5 bg-[#131E30]/40 backdrop-blur-md relative overflow-hidden group hover:border-white/10 transition-colors"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full" />
                    <div className="flex gap-6 relative z-10">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border"
                        style={{ backgroundColor: `${point.color}15`, borderColor: `${point.color}30` }}
                      >
                        <point.icon className="w-6 h-6" style={{ color: point.color }} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white mb-2">{point.title}</h4>
                        <p className="text-lg text-[#A0B0BC] leading-relaxed">{point.body}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- VERTICAL TIMELINE: THE JOURNEY --- */}
        <section className="relative px-6 py-32 bg-gradient-to-b from-[#0B1220] via-[#131E30]/50 to-[#0B1220]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">A Lifelong Partner.</h2>
              <p className="text-xl text-[#A0B0BC]">
                ATOM is structured to scale with your clinical responsibility.
              </p>
            </div>

            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-[27px] sm:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#5BB3B3]/0 via-[#5BB3B3]/50 to-[#5BB3B3]/0 transform sm:-translate-x-1/2" />

              <div className="space-y-24">
                {journey.map((step, i) => (
                  <motion.div
                    key={step.phase}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className={`relative flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? "md:flex-row-reverse" : ""
                      }`}
                  >
                    {/* Content Half */}
                    <div className={`w-full md:w-1/2 ${i % 2 === 0 ? "md:pl-16 text-left" : "md:pr-16 text-left md:text-right"}`}>
                      <span className="text-sm font-bold tracking-widest text-[#5BB3B3] uppercase mb-2 block">
                        Phase 0{i + 1}
                      </span>
                      <h3 className="text-2xl font-bold text-white mb-4">{step.phase}: {step.title}</h3>
                      <p className="text-[#A0B0BC] text-lg leading-relaxed">{step.body}</p>
                    </div>

                    {/* Node (Hidden on mobile to prevent overlap, centered on desktop line) */}
                    <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center w-8 h-8 bg-[#0B1220] border-4 border-[#5BB3B3] rounded-full z-10 shadow-[0_0_15px_rgba(91,179,179,0.3)]">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>

                    {/* Empty Space Half for balancing (on Desktop) */}
                    <div className="hidden md:block md:w-1/2" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- MASSIVE CTA --- */}
        <section className="max-w-5xl mx-auto px-6 pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-[3rem] border border-[#5BB3B3]/30 bg-gradient-to-br from-[#5BB3B3]/10 to-transparent p-12 sm:p-20 text-center shadow-[0_0_50px_rgba(91,179,179,0.1)] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#0B1220] opacity-50 -z-10" />
            <h2 className="text-4xl sm:text-6xl font-black text-white mb-6">
              Start learning Atomically.
            </h2>
            <p className="text-xl text-[#A0B0BC] max-w-2xl mx-auto mb-10">
              Stop relying on generic AI that forgets you. Build your medical mind with a unified, persistent clinical architecture.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-2xl bg-[#5BB3B3] hover:bg-[#4A9E9E] text-[#0B1220] px-10 py-5 text-xl font-bold transition-all hover:scale-105 shadow-[0_0_30px_rgba(91,179,179,0.4)]"
            >
              Initialize ATOM
            </Link>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
