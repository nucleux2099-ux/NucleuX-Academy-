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
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────── CAMPUS ROOMS ─────────────────────────── */

const campusRooms = [
  {
    href: "/desk",
    icon: Monitor,
    color: "#5BB3B3",
    name: "My Desk",
    tagline: "Your personal workspace",
    body: "This is **your corner** of the campus. Bookmarks, recent reads, notes — everything you've touched lives here. Think of it as your study table, always set up exactly how you left it.",
    inside: [
      { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
      { label: "Notes", href: "/notes", icon: FileText },
      { label: "History", href: "/history", icon: Clock },
    ],
  },
  {
    href: "/library",
    icon: BookOpen,
    color: "#7BA69E",
    name: "Library",
    tagline: "Browse, read, and build understanding",
    body: "The **heart of the campus**. Every subject, every topic — organised by specialty and subspecialty. Pick a subject, open a topic, and read in **Explorer**, **Exam Prep**, or **Textbook** mode. Toggle **Bionic Reader** for faster scanning. Your **Pre-Study**, **AIM**, and **Mind Map** workflows live inside each topic.",
    inside: [
      { label: "Surgery", href: "/library/surgery", icon: Stethoscope },
      { label: "All Subjects", href: "/library", icon: BookOpen },
    ],
  },
  {
    href: "/classroom",
    icon: GraduationCap,
    color: "#6BA8C9",
    name: "Classroom",
    tagline: "Decks, lectures, and active learning",
    body: "Where **passive watching becomes active learning**. Slide decks with built-in templates for note-taking. Live AI sessions for real-time Q&A. Every deck logs to your **Backstage** so ATOM knows what you've covered.",
    inside: [
      { label: "Decks", href: "/classroom/decks", icon: FileText },
      { label: "Live AI", href: "/classroom/live-ai", icon: Sparkles },
    ],
  },
  {
    href: "/exam-centre",
    icon: ClipboardCheck,
    color: "#6366F1",
    name: "Training Centre",
    tagline: "MCQs, PYQs, OSCEs, and case drills",
    body: "This is where you **test what you know** — and discover what you don't. Solve MCQs, practice previous year questions, run through OSCE stations, and work clinical case flows. Every attempt feeds your **Confidence Calibration** so you can see exactly where you're overconfident or underconfident.",
    inside: [
      { label: "MCQs", href: "/exam-centre/mcq", icon: Target },
      { label: "PYQs", href: "/exam-centre/pyq", icon: FileText },
      { label: "OSCEs", href: "/exam-centre/osce", icon: Stethoscope },
      { label: "Case Flows", href: "/exam-centre/flow", icon: Map },
    ],
  },
  {
    href: "/competencies",
    icon: Target,
    color: "#E879F9",
    name: "CBME",
    tagline: "Competency-based curriculum tracking",
    body: "Your **NMC competency map**. See which competencies you've covered, which are pending, and where you stand against the curriculum. Maps directly to your **NBME domains** and **subject progress**.",
    inside: [],
  },
  {
    href: "/community",
    icon: Users,
    color: "#C9A86C",
    name: "Common Room",
    tagline: "Discuss, debate, and learn together",
    body: "Medicine is **not a solo sport**. The Common Room is where you discuss cases, debate differentials, share mnemonics, and learn from peers. Every great doctor learned as much from colleagues as from textbooks.",
    inside: [],
  },
  {
    href: "/arena",
    icon: Trophy,
    color: "#D4AF37",
    name: "Arena",
    tagline: "Compete and climb the leaderboard",
    body: "Friendly competition sharpens the mind. **Timed quizzes**, **leaderboards**, and **challenges** against peers. See where you rank — then go back to the Library and close the gap.",
    inside: [
      { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
    ],
  },
  {
    href: "/chat",
    icon: Atom,
    color: "#5BB3B3",
    name: "ATOM",
    tagline: "Your AI study companion — with memory",
    body: "ATOM isn't a chatbot. ATOM is a **thinking partner** who remembers your journey. Ask a question today, and six months from now ATOM still knows what you struggled with, what you mastered, and what's due for review. ATOM sees your Backstage data, your Library reads, your MCQ performance — and connects the dots for you.",
    inside: [],
    highlight: true,
  },
];

/* ─────────────────────── BACKSTAGE WIDGETS ──────────────────────── */

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

/* ────────────────────── BOLD MARKDOWN HELPER ─────────────────────── */

function RichText({ text }: { text: string }) {
  // Convert **bold** to <strong>
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="text-[#E8E0D5] font-semibold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/* ─────────────────────────── PAGE ─────────────────────────────── */

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
          <RichText text="This is your **home base**. Every room on campus is designed for a specific part of your learning journey — from reading and note-taking to testing, competing, and reflecting. Start anywhere. ATOM connects the dots across all of them." />
        </p>
      </header>

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
                room.highlight
                  ? "border-[rgba(91,179,179,0.3)] shadow-lg shadow-[#5BB3B3]/5"
                  : "border-[rgba(255,255,255,0.06)]"
              )}
            >
              <Link href={room.href} className="block p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${room.color}18` }}
                  >
                    <room.icon
                      className="w-5 h-5"
                      style={{ color: room.color }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#E8E0D5] text-base">
                        {room.name}
                      </h3>
                      {room.highlight && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#5BB3B3] text-[#1E2D3D]">
                          AI
                        </span>
                      )}
                      <ChevronRight
                        className="w-4 h-4 text-[#A0B0BC] ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        style={{ color: room.color }}
                      />
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

              {/* Sub-links */}
              {room.inside.length > 0 && (
                <div className="px-5 sm:px-6 pb-4 pt-0 flex flex-wrap gap-2 ml-[3.75rem]">
                  {room.inside.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#253545] text-[#A0B0BC] hover:text-[#E8E0D5] hover:bg-[#364A5E] transition-colors border border-[rgba(255,255,255,0.04)]"
                    >
                      <sub.icon className="w-3 h-3" />
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
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
                  <h3 className="font-semibold text-[#E8E0D5] text-sm mb-1">
                    {w.name}
                  </h3>
                  <p className="text-xs text-[#A0B0BC] leading-relaxed">
                    <RichText text={w.desc} />
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Philosophy Footer ── */}
      <footer className="text-center pt-4 pb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#253545] border border-[rgba(255,255,255,0.04)]">
          <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
          <p className="text-xs text-[#A0B0BC]">
            <RichText text="**Learn with structure. Practice with feedback. Progress with calibration.**" />
          </p>
        </div>
      </footer>
    </div>
  );
}
