import Link from 'next/link';
import {
  Atom,
  BookOpen,
  GraduationCap,
  Target,
  Swords,
  Gauge,
  Users,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SupportFooter } from '@/components/marketing/SupportFooter';

function RoleCard({
  title,
  room,
  icon,
  color,
  bullets,
}: {
  title: string;
  room: string;
  icon: React.ReactNode;
  color: string;
  bullets: string[];
}) {
  return (
    <Card className="bg-[#364A5E]/70 border-[rgba(232,224,213,0.10)]">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center border"
            style={{ backgroundColor: `${color}18`, borderColor: `${color}33`, color }}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <div className="text-xs text-[#A0B0BC]">{room}</div>
            <div className="text-lg font-bold text-[#E8E0D5]">{title}</div>
          </div>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-[#A0B0BC]">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <span style={{ color }} className="mt-1">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function AtomPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-white/5 bg-slate-950/40 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="leading-tight">
            <div className="text-[#E8E0D5] font-bold">NucleuX Academy</div>
            <div className="text-xs text-[#A0B0BC]">Learn atomically and grow exponentially</div>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <div className="hidden md:flex items-center gap-4">
              <Link href="/campus" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">Take the tour</Link>
              <Link href="/pricing" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">Early access</Link>
              <Link href="/faq" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">FAQ</Link>
              <Link href="/contact" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">Contact</Link>
              <Link href="/login">
                <Button className="bg-[#5BB3B3] hover:bg-[#4A9E9E] text-white">
                  Enter campus <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/campus"
                className="px-3 py-2 rounded-lg bg-[#5BB3B3] hover:bg-[#4A9E9E] text-white font-medium"
              >
                Tour
              </Link>
              <Link
                href="/login"
                className="px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-[#E8E0D5] font-medium"
              >
                Enter
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-14">
        <Badge className="bg-[rgba(91,179,179,0.15)] text-[#5BB3B3] border-[rgba(91,179,179,0.3)]">
          <Atom className="w-3.5 h-3.5 mr-2" /> ATOM
        </Badge>

        <h1 className="mt-4 text-4xl font-bold text-[#E8E0D5]">ATOM — Your Thinking Partner</h1>
        <p className="mt-4 text-lg text-[#A0B0BC] max-w-3xl">
          ATOM is the AI thinking partner inside NucleuX Academy. One companion — many roles across the Virtual Campus.
          It helps MBBS students and residents build durable understanding, not just answers.
        </p>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold text-[#E8E0D5]">Origin</h2>
          <p className="mt-2 text-sm text-[#A0B0BC] max-w-4xl">
            ATOM was born from two physician brothers — one living the chaos of residency and surgical training, the other
            building the learning philosophy. The question was simple: <span className="text-[#E8E0D5]">“What if learning could be atomic?”</span>
            NucleuX Academy is the campus; ATOM is the thinking partner that makes the campus usable every day.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-[#E8E0D5]">ATOM across the Campus</h2>
          <p className="mt-1 text-sm text-[#A0B0BC]">One thinking partner, many roles — aligned to the exact room names inside the app.</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <RoleCard
              room="Library"
              title="ATOM Librarian"
              icon={<BookOpen className="w-5 h-5" />}
              color="#5BB3B3"
              bullets={[
                'Guides you through Explorer / Exam Prep / Textbook / Quiz / Cases / Roadmap',
                'Builds connections: prerequisites, related topics, mental models',
                'Helps you study with structure instead of scattered notes',
              ]}
            />
            <RoleCard
              room="Classroom"
              title="ATOM Scribe"
              icon={<GraduationCap className="w-5 h-5" />}
              color="#6BA8C9"
              bullets={[
                'Listens with you during AI classes and human classes',
                'Creates clean notes + mindmaps while you learn',
                'Helps you replay and revise sessions efficiently',
              ]}
            />
            <RoleCard
              room="Exam Centre"
              title="ATOM Trainer"
              icon={<Target className="w-5 h-5" />}
              color="#C9A86C"
              bullets={[
                'Turns practice into learning through explanations',
                'Targets topics + difficulty based on your needs',
                'Builds patterns for NEET-PG / INICET style exams',
              ]}
            />
            <RoleCard
              room="Arena"
              title="ATOM Challenger"
              icon={<Swords className="w-5 h-5" />}
              color="#EC4899"
              bullets={[
                'Pressure-proofs knowledge with timed drills and mixed sets',
                'Tracks accuracy + speed so performance becomes predictable',
                'Keeps consistency without sacrificing depth',
              ]}
            />
            <RoleCard
              room="Backstage"
              title="ATOM Coach"
              icon={<Gauge className="w-5 h-5" />}
              color="#A78BFA"
              bullets={[
                'Tracks competency ladder: UI → CI → CC → UC',
                'Calibrates confidence vs accuracy (no blind spots)',
                'Uses Kolb cycle + logbook to convert life into learning',
              ]}
            />
            <RoleCard
              room="Common Room (Community)"
              title="ATOM Guide"
              icon={<Users className="w-5 h-5" />}
              color="#10B981"
              bullets={[
                'Helps structure discussions and clarifies doubts',
                'Extracts high-yield takeaways for revision',
                'Promotes learning with signal over noise',
              ]}
            />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-[#E8E0D5]">How ATOM’s memory works</h2>
          <p className="mt-1 text-sm text-[#A0B0BC]">
            The main promise: ATOM stays with you over time — it doesn’t reset every day like a generic chatbot.
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[{
              title: '1) Captures your learning fingerprint',
              body: 'Tracks your weak topics, common mistakes, and “near-miss” misconceptions (the ones that keep repeating in MCQs).',
            }, {
              title: '2) Builds a personal map (not a playlist)',
              body: 'Organizes what you know into prerequisites → concepts → applications. It understands dependencies so it can recommend the right next step.',
            }, {
              title: '3) Converts performance into teaching',
              body: 'In Exam Centre/Arena, every wrong answer becomes a concept fix: why you chose it, what pattern trapped you, and what rule prevents it next time.',
            }, {
              title: '4) Calibrates you, not just quizzes you',
              body: 'Backstage compares confidence vs accuracy and highlights blind spots. The goal is predictable performance in exams and wards.',
            }, {
              title: '5) Stays consistent across rooms',
              body: 'Same partner, different behaviour: teacher in Classroom, librarian in Library, coach in Backstage. Your memory map travels with you.',
            }, {
              title: '6) Respects boundaries',
              body: 'Designed to avoid patient identifiers in notes/logbook. The system is built for safe learning and structured revision.',
            }].map((p) => (
              <Card key={p.title} className="bg-[#364A5E]/55 border-[rgba(232,224,213,0.10)]">
                <CardContent className="p-6">
                  <div className="text-sm font-semibold text-[#E8E0D5]">{p.title}</div>
                  <div className="mt-2 text-sm text-[#A0B0BC]">{p.body}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold text-[#E8E0D5]">What ATOM remembers (examples)</div>
            <ul className="mt-3 space-y-2 text-sm text-[#A0B0BC]">
              <li>• “You confuse pre-renal vs ATN patterns when FeNa is borderline.”</li>
              <li>• “You’re fast in cardio MCQs but accuracy drops in endocrine mixed sets.”</li>
              <li>• “Your weak nodes cluster around prerequisites (anatomy → physiology → pathology chain).”</li>
            </ul>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-[#E8E0D5]">ATOM through the journey (MBBS → Consultant)</h2>
          <p className="mt-1 text-sm text-[#A0B0BC]">
            ATOM is designed to stay as a partner across phases — the room behaviour remains the same, but the depth increases.
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[{
              title: 'MBBS (foundation)',
              body: 'Build concepts and connections. Reduce overwhelm. Learn mechanisms first, then compress for revision.',
            }, {
              title: 'Intern (real-world exposure)',
              body: 'Turn cases into learning: differentials, “don’t miss” patterns, quick bedside reasoning. Logbook + reflection starts compounding.',
            }, {
              title: 'Junior Resident (speed + depth)',
              body: 'High-volume decisions need fast recall. Arena/Exam Centre drill patterns; Backstage keeps calibration honest.',
            }, {
              title: 'Senior resident / early consultant',
              body: 'Refine judgement: edge cases, pitfalls, and teaching others. ATOM shifts from “help me learn” to “help me supervise + teach”.',
            }].map((p) => (
              <Card key={p.title} className="bg-[#364A5E]/55 border-[rgba(232,224,213,0.10)]">
                <CardContent className="p-6">
                  <div className="text-sm font-semibold text-[#E8E0D5]">{p.title}</div>
                  <div className="mt-2 text-sm text-[#A0B0BC]">{p.body}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-[#E8E0D5]">ATOM Philosophy</h2>
          <p className="mt-1 text-sm text-[#A0B0BC]">Simple rules that compound into mastery.</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Concept-first',
                body: 'Understanding mechanisms comes before compression. Build the mental model, then revise fast.',
              },
              {
                title: 'Relationships over isolated facts',
                body: 'Knowledge becomes durable when concepts connect — prerequisites, differentials, pitfalls, and patterns.',
              },
              {
                title: 'Retrieval beats rereading',
                body: 'Quiz, recall, apply. Active retrieval turns reading into usable clinical knowledge.',
              },
              {
                title: 'Calibration + reflection',
                body: 'Mastery is when confidence matches performance. Kolb cycle turns experience into improvement.',
              },
            ].map((p) => (
              <Card key={p.title} className="bg-[#364A5E]/55 border-[rgba(232,224,213,0.10)]">
                <CardContent className="p-6">
                  <div className="text-sm font-semibold text-[#E8E0D5]">{p.title}</div>
                  <div className="mt-2 text-sm text-[#A0B0BC]">{p.body}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold text-[#E8E0D5]">Trust & Boundaries</h2>
          <ul className="mt-3 space-y-2 text-sm text-[#A0B0BC]">
            <li>• ATOM flags uncertainty instead of pretending.</li>
            <li>• ATOM prefers sources and structured knowledge over hallucination.</li>
            <li>• Logbook is anonymized by default — no private patient identifiers.</li>
          </ul>
        </section>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-lg font-bold text-[#E8E0D5]">Ready to enter the campus?</div>
            <div className="text-sm text-[#A0B0BC]">Start with Library, or jump into Classroom — ATOM follows.</div>
          </div>
          <Link href="/login">
            <Button className="bg-[#5BB3B3] hover:bg-[#4A9E9E] text-white px-6">Enter Campus</Button>
          </Link>
        </div>
      </main>
      <SupportFooter />
    </div>
  );
}
