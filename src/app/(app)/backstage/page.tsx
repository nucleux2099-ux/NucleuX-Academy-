"use client";

import Link from "next/link";
import {
  Monitor,
  BookOpen,
  GraduationCap,
  ClipboardCheck,
  Target,
  Users,
  Trophy,
  Atom,
  Fingerprint,
  Brain,
  BarChart3,
  Flame,
  CheckCircle,
  ChevronRight,
  Compass,
  Sparkles,
  Bookmark,
  MessageCircle,
  FileText,
  Dumbbell,
  Map,
  Stethoscope,
  Lightbulb,
  Clock,
  Eye,
  Zap,
  Layers,
  ArrowRight,
  Star,
  Info,
  Route,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────── BOLD MARKDOWN HELPER ──────────────── */

function RichText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="text-[#E8E0D5] font-semibold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

/* ──────────────────── CALLOUT COMPONENT ─────────────── */

function Callout({
  icon: Icon,
  color,
  children,
}: {
  icon: any;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-xl border"
      style={{
        backgroundColor: `${color}08`,
        borderColor: `${color}20`,
      }}
    >
      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color }} />
      <p className="text-sm text-[#A0B0BC] leading-relaxed">{children}</p>
    </div>
  );
}

/* ──────────────── QUICK LINK PILL ───────────────────── */

function QuickLink({
  href,
  icon: Icon,
  label,
  color = "#5BB3B3",
}: {
  href: string;
  icon: any;
  label: string;
  color?: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#253545] text-[#A0B0BC] hover:text-[#E8E0D5] hover:bg-[#364A5E] transition-colors border border-[rgba(255,255,255,0.04)] group"
    >
      <Icon className="w-3 h-3" style={{ color }} />
      {label}
      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
    </Link>
  );
}

/* ─────────────────── CAMPUS ROOMS ──────────────────── */

const campusRooms = [
  {
    href: "/desk",
    icon: Monitor,
    color: "#5BB3B3",
    name: "My Desk",
    tagline: "Your personal workspace",
    body: "This is **your corner** of the campus. Bookmarks, recent reads, notes — everything you've touched lives here. Think of it as your study table, always set up exactly how you left it.",
    callout: null,
    inside: [
      { label: "Bookmarks", href: "/bookmarks", icon: Bookmark, color: "#5BB3B3" },
      { label: "Notes", href: "/notes", icon: FileText, color: "#5BB3B3" },
      { label: "History", href: "/history", icon: Clock, color: "#5BB3B3" },
      { label: "Notifications", href: "/notifications", icon: Sparkles, color: "#5BB3B3" },
    ],
  },
  {
    href: "/library",
    icon: BookOpen,
    color: "#7BA69E",
    name: "Library",
    tagline: "Browse, read, and build understanding",
    body: "The **heart of the campus**. Every subject, every topic — organised by specialty and subspecialty. Open any topic and choose your reading mode:",
    callout: {
      icon: Zap,
      color: "#7BA69E",
      text: "Try **Bionic Reader** — toggle it on any reading page to bold the first half of every word. Your eyes move faster, you retain more.",
    },
    features: [
      { icon: Eye, label: "Explorer Mode", desc: "Concept notes with clinical pearls" },
      { icon: Target, label: "Exam Prep", desc: "High-yield summaries + mnemonics" },
      { icon: BookOpen, label: "Textbook Mode", desc: "Comprehensive reference notes" },
      { icon: Brain, label: "Quiz Mode", desc: "Retrieval cards for active recall" },
    ],
    inside: [
      { label: "Surgery", href: "/library/surgery", icon: Stethoscope, color: "#DC2626" },
      { label: "All Subjects", href: "/library", icon: BookOpen, color: "#7BA69E" },
      { label: "Pre-Study Workflow", href: "/library", icon: Layers, color: "#6BA8C9" },
      { label: "Mind Maps", href: "/library", icon: Route, color: "#E879F9" },
    ],
  },
  {
    href: "/classroom",
    icon: GraduationCap,
    color: "#6BA8C9",
    name: "Classroom",
    tagline: "Decks, lectures, and active learning",
    body: "Where **passive watching becomes active learning**. Slide decks with built-in templates for note-taking. Every deck you open logs to your Backstage — so ATOM knows what you've covered and what's stale.",
    callout: {
      icon: Lightbulb,
      color: "#6BA8C9",
      text: "Each deck has **SHOOT** and **SKIN** workflows built in — structured note-taking that forces you to process, not just consume.",
    },
    inside: [
      { label: "Slide Decks", href: "/classroom/decks", icon: FileText, color: "#6BA8C9" },
      { label: "Live AI Session", href: "/classroom/live-ai", icon: Sparkles, color: "#6BA8C9" },
      { label: "Templates", href: "/classroom/templates", icon: Layers, color: "#6BA8C9" },
    ],
  },
  {
    href: "/exam-centre",
    icon: ClipboardCheck,
    color: "#6366F1",
    name: "Training Centre",
    tagline: "MCQs, PYQs, OSCEs, and case drills",
    body: "This is where you **test what you know** — and discover what you don't. Every attempt feeds your **Confidence Calibration** in Backstage, so you can see exactly where you're overconfident or underconfident.",
    callout: {
      icon: Info,
      color: "#6366F1",
      text: "Your MCQ accuracy **by topic** feeds back into your Library view. Weak topics get flagged automatically — no guesswork about what to revise.",
    },
    inside: [
      { label: "MCQs", href: "/exam-centre/mcq", icon: Target, color: "#6366F1" },
      { label: "Previous Years", href: "/exam-centre/pyq", icon: FileText, color: "#6366F1" },
      { label: "OSCE Stations", href: "/exam-centre/osce", icon: Stethoscope, color: "#6366F1" },
      { label: "Case Flows", href: "/exam-centre/flow", icon: Map, color: "#6366F1" },
    ],
  },
  {
    href: "/competencies",
    icon: Target,
    color: "#E879F9",
    name: "CBME",
    tagline: "Competency-based curriculum tracking",
    body: "Your **NMC competency map**. See which competencies you've covered, which are pending, and where you stand against the curriculum. Every topic in the Library links back to a competency here.",
    callout: null,
    inside: [
      { label: "Curriculum Map", href: "/competencies", icon: Map, color: "#E879F9" },
      { label: "NBME Domains", href: "/competencies", icon: BarChart3, color: "#E879F9" },
    ],
  },
  {
    href: "/community",
    icon: Users,
    color: "#C9A86C",
    name: "Common Room",
    tagline: "Discuss, debate, and learn together",
    body: "Medicine is **not a solo sport**. Discuss cases, debate differentials, share mnemonics, and learn from peers. Every great doctor learned as much from colleagues as from textbooks.",
    callout: null,
    inside: [
      { label: "Discussions", href: "/community", icon: MessageCircle, color: "#C9A86C" },
    ],
  },
  {
    href: "/arena",
    icon: Trophy,
    color: "#D4AF37",
    name: "Arena",
    tagline: "Compete and climb the leaderboard",
    body: "Friendly competition **sharpens the mind**. Timed quizzes, leaderboards, and challenges against peers. See where you rank — then go back to the Library and close the gap.",
    callout: null,
    inside: [
      { label: "Leaderboard", href: "/leaderboard", icon: Trophy, color: "#D4AF37" },
      { label: "Challenges", href: "/arena", icon: Dumbbell, color: "#D4AF37" },
    ],
  },
  {
    href: "/chat",
    icon: Atom,
    color: "#5BB3B3",
    name: "ATOM",
    tagline: "Your AI study companion — with memory",
    body: "ATOM isn't a chatbot. ATOM is a **thinking partner** who remembers your journey. Ask a question today, and six months from now ATOM still knows what you struggled with, what you mastered, and what's due for review.",
    callout: {
      icon: Star,
      color: "#5BB3B3",
      text: "ATOM sees your **Backstage data**, your **Library reads**, your **MCQ performance** — and connects the dots. It's the only AI that gets better at helping you the longer you use it.",
    },
    inside: [],
    highlight: true,
  },
];

/* ─────────────── BACKSTAGE WIDGETS ────────────────── */

const backstageWidgets = [
  {
    href: "/backstage/calibration",
    icon: Brain,
    color: "#E879F9",
    name: "Confidence Calibration",
    desc: "Are you as good as you think? Compare your **confidence** against your **accuracy** — and close the gap.",
  },
  {
    href: "/backstage/logbook",
    icon: Flame,
    color: "#F97316",
    name: "Study Logbook",
    desc: "Your **streak**, your **hours**, your **habits**. Every session logged. Consistency beats intensity.",
  },
  {
    href: "/backstage/quests",
    icon: CheckCircle,
    color: "#10B981",
    name: "Weekly Quests",
    desc: "Micro-goals that keep you moving. **50 MCQs this week?** **3 topics reviewed?** Track it here.",
  },
  {
    href: "/analytics",
    icon: BarChart3,
    color: "#5BB3B3",
    name: "Analytics",
    desc: "The big picture — **hours studied**, **topics covered**, **accuracy trends**, all in one view.",
  },
];

/* ─────────────── FEATURE SPOTLIGHT ────────────────── */

const spotlightFeatures = [
  {
    icon: Zap,
    color: "#7BA69E",
    title: "Bionic Reader",
    desc: "Toggle on any reading page. Bolds the first half of every word for **2× faster scanning**.",
    cta: { label: "Try in Library", href: "/library" },
  },
  {
    icon: Layers,
    color: "#6BA8C9",
    title: "Learning Workflows",
    desc: "**Pre-Study → AIM → SHOOT → SKIN → Mind Map** — five structured steps built into every topic.",
    cta: { label: "Open a topic", href: "/library/surgery" },
  },
  {
    icon: Brain,
    color: "#E879F9",
    title: "Confidence Calibration",
    desc: "After every MCQ, rate your confidence. We track the gap between **what you think you know** and **what you actually know**.",
    cta: { label: "See your calibration", href: "/backstage/calibration" },
  },
  {
    icon: Atom,
    color: "#5BB3B3",
    title: "ATOM Memory",
    desc: "ATOM remembers every topic you've read, every question you've answered, every note you've made. It **compounds** over your entire medical journey.",
    cta: { label: "Talk to ATOM", href: "/chat" },
  },
];

/* ─────────────────────── PAGE ──────────────────────── */

export default function BackstagePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-24">
      {/* ── Hero ── */}
      <header className="pt-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#5BB3B3] to-[#4A9E9E] flex items-center justify-center shadow-lg shadow-[#5BB3B3]/20">
            <Compass className="w-6 h-6 text-[#1E2D3D]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#E8E0D5]">
              Welcome to Campus
            </h1>
            <p className="text-sm text-[#A0B0BC]">
              Your map to everything inside NucleuX Academy
            </p>
          </div>
        </div>

        <p className="text-[#A0B0BC] leading-relaxed text-[15px]">
          <RichText text="This is your **home base**. Every room on campus is built for a specific part of your learning journey — reading, practising, testing, competing, reflecting. Start anywhere you like. **ATOM connects the dots** across all of them." />
        </p>
      </header>

      {/* ── Quick Start ── */}
      <section className="flex flex-wrap gap-2">
        <QuickLink href="/library/surgery" icon={Stethoscope} label="Jump into Surgery" color="#DC2626" />
        <QuickLink href="/exam-centre/mcq" icon={Target} label="Solve MCQs" color="#6366F1" />
        <QuickLink href="/chat" icon={Atom} label="Ask ATOM" color="#5BB3B3" />
        <QuickLink href="/backstage/calibration" icon={Brain} label="Check Calibration" color="#E879F9" />
        <QuickLink href="/library" icon={BookOpen} label="Browse Library" color="#7BA69E" />
      </section>

      {/* ── Campus Rooms ── */}
      <section>
        <h2 className="text-lg font-semibold text-[#E8E0D5] mb-4 flex items-center gap-2">
          <Map className="w-5 h-5 text-[#5BB3B3]" />
          Campus Rooms
        </h2>

        <div className="space-y-4">
          {campusRooms.map((room) => (
            <div
              key={room.href}
              className={cn(
                "rounded-2xl border transition-all duration-200",
                "bg-[#2D3E50]/60 hover:bg-[#364A5E]/80",
                "highlight" in room && room.highlight
                  ? "border-[rgba(91,179,179,0.3)] shadow-lg shadow-[#5BB3B3]/5"
                  : "border-[rgba(255,255,255,0.06)]"
              )}
            >
              <Link href={room.href} className="block p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${room.color}18` }}
                  >
                    <room.icon className="w-5 h-5" style={{ color: room.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#E8E0D5] text-base">{room.name}</h3>
                      {"highlight" in room && room.highlight && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#5BB3B3] text-[#1E2D3D]">
                          AI
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-[#A0B0BC]/30 ml-auto flex-shrink-0" />
                    </div>
                    <p className="text-xs font-medium mb-2" style={{ color: room.color }}>
                      {room.tagline}
                    </p>
                    <p className="text-sm text-[#A0B0BC] leading-relaxed">
                      <RichText text={room.body} />
                    </p>
                  </div>
                </div>
              </Link>

              {/* Reading mode features (Library special) */}
              {"features" in room && room.features && (
                <div className="px-5 sm:px-6 pb-3 ml-[3.75rem]">
                  <div className="grid grid-cols-2 gap-2">
                    {room.features.map((f: any) => (
                      <div
                        key={f.label}
                        className="flex items-center gap-2 text-xs text-[#A0B0BC] bg-[#253545]/80 rounded-lg px-3 py-2 border border-[rgba(255,255,255,0.03)]"
                      >
                        <f.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: room.color }} />
                        <div>
                          <span className="text-[#E8E0D5] font-medium">{f.label}</span>
                          <span className="hidden sm:inline text-[#A0B0BC]"> — {f.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Callout */}
              {room.callout && (
                <div className="px-5 sm:px-6 pb-3 ml-[3.75rem]">
                  <Callout icon={room.callout.icon} color={room.callout.color}>
                    <RichText text={room.callout.text} />
                  </Callout>
                </div>
              )}

              {/* Sub-links */}
              {room.inside.length > 0 && (
                <div className="px-5 sm:px-6 pb-4 pt-1 flex flex-wrap gap-2 ml-[3.75rem]">
                  {room.inside.map((sub) => (
                    <QuickLink key={sub.href + sub.label} href={sub.href} icon={sub.icon} label={sub.label} color={sub.color} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature Spotlight ── */}
      <section>
        <h2 className="text-lg font-semibold text-[#E8E0D5] mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#C9A86C]" />
          Things You Should Try
        </h2>
        <p className="text-sm text-[#A0B0BC] mb-4">
          <RichText text="Features that make NucleuX different from reading a PDF." />
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          {spotlightFeatures.map((f) => (
            <Link
              key={f.title}
              href={f.cta.href}
              className="group rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#2D3E50]/60 hover:bg-[#364A5E]/80 p-4 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${f.color}18` }}
                >
                  <f.icon className="w-4 h-4" style={{ color: f.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#E8E0D5] text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-[#A0B0BC] leading-relaxed mb-2">
                    <RichText text={f.desc} />
                  </p>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-medium group-hover:gap-2 transition-all"
                    style={{ color: f.color }}
                  >
                    {f.cta.label} <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Backstage (Your Cognitive OS) ── */}
      <section>
        <h2 className="text-lg font-semibold text-[#E8E0D5] mb-2 flex items-center gap-2">
          <Fingerprint className="w-5 h-5 text-[#F59E0B]" />
          Your Backstage
        </h2>
        <p className="text-sm text-[#A0B0BC] mb-4 leading-relaxed">
          <RichText text="The **Backstage** is where you see yourself clearly. Not what you've read — but what you've **retained**. Not how many hours — but how **effectively** you spent them. This is your Cognitive OS." />
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          {backstageWidgets.map((w) => (
            <Link
              key={w.href}
              href={w.href}
              className="group rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#2D3E50]/60 hover:bg-[#364A5E]/80 p-4 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${w.color}18` }}
                >
                  <w.icon className="w-4 h-4" style={{ color: w.color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#E8E0D5] text-sm mb-1">{w.name}</h3>
                  <p className="text-xs text-[#A0B0BC] leading-relaxed">
                    <RichText text={w.desc} />
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Callout icon={Info} color="#F59E0B">
          <RichText text="Everything here updates automatically as you use the campus. Read a topic? It shows in your logbook. Solve MCQs? Your calibration updates. **You don't need to track anything manually.**" />
        </Callout>
      </section>

      {/* ── Philosophy Footer ── */}
      <footer className="text-center pt-4 pb-8">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#253545] border border-[rgba(255,255,255,0.04)]">
          <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
          <p className="text-xs text-[#A0B0BC]">
            <RichText text="**Learn with structure. Practice with feedback. Progress with calibration.**" />
          </p>
        </div>
      </footer>
    </div>
  );
}
