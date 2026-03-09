'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  Brain, BookOpen, GraduationCap, Target, Trophy, Users,
  Sparkles, Zap, Shield, ArrowRight, ChevronRight,
  Fingerprint, Map, AlertTriangle, BarChart3, Database, Lock,
  MessageSquare, FileText, FlaskConical, Lightbulb, Stethoscope,
  Activity, Eye, Layers, Radio, Check,
} from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

/* ════════════════════════════════════════════════════════════
   FLOATING PARTICLES (subtle background effect)
   ════════════════════════════════════════════════════════════ */

function FloatingParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.3 + 0.05,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#5BB3B3]"
          style={{
            width: p.size, height: p.size,
            left: `${p.x}%`, top: `${p.y}%`,
            opacity: p.opacity,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [p.opacity, p.opacity * 1.8, p.opacity],
          }}
          transition={{
            duration: p.duration, repeat: Infinity,
            delay: p.delay, ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════════ */

const stats = [
  { label: 'Room Modes', value: 9, icon: Layers, suffix: '' },
  { label: 'Medical Subjects', value: 25, icon: BookOpen, suffix: '+' },
  { label: 'Core Agents', value: 5, icon: Activity, suffix: '' },
  { label: 'Memory Types', value: 7, icon: Brain, suffix: '' },
];

const atomRoles = [
  {
    icon: BookOpen, title: 'Librarian', room: 'Library',
    gradient: 'from-[#7BA69E]/20 to-[#5BB3B3]/5',
    color: '#7BA69E', accentBg: 'bg-[#7BA69E]',
    description: 'Navigate through your textbook library with contextual intelligence. Get topic relationships, prerequisites, and cross-references.',
    bullets: ['Topic relationship sidebar', 'Prerequisite detection', 'Cross-reference suggestions'],
  },
  {
    icon: GraduationCap, title: 'Lecture Partner', room: 'Classroom',
    gradient: 'from-[#6BA8C9]/20 to-[#60A5FA]/5',
    color: '#6BA8C9', accentBg: 'bg-[#6BA8C9]',
    description: 'Real-time study companion that generates structured notes, concept maps, and active recall prompts during lectures.',
    bullets: ['Real-time note generation', 'Pre-lecture primers', 'Active recall prompts'],
  },
  {
    icon: Target, title: 'Practice Partner', room: 'Training Centre',
    gradient: 'from-[#5BB3B3]/20 to-[#34D399]/5',
    color: '#5BB3B3', accentBg: 'bg-[#5BB3B3]',
    description: 'Deep clinical MCQ training with intelligent explanations, difficulty adaptation, and reasoning breakdowns.',
    bullets: ['MCQ explanation panels', 'Difficulty adaptation', 'Clinical reasoning trees'],
  },
  {
    icon: Trophy, title: 'Competition Coach', room: 'Arena',
    gradient: 'from-[#C9A86C]/20 to-[#FBBF24]/5',
    color: '#C9A86C', accentBg: 'bg-[#C9A86C]',
    description: 'Competitive analytics, strategic coaching, and post-match breakdowns for exam battles and quiz competitions.',
    bullets: ['Speed vs accuracy analysis', 'Post-match breakdowns', 'Opponent strategy insights'],
  },
  {
    icon: Brain, title: 'Cognitive Coach', room: 'Backstage',
    gradient: 'from-[#A78BFA]/20 to-[#8B5CF6]/5',
    color: '#A78BFA', accentBg: 'bg-[#A78BFA]',
    description: 'Metacognitive self-awareness tools — calibration, Bloom\'s taxonomy tracking, blind spot detection.',
    bullets: ['Confidence calibration', 'Bloom\'s taxonomy radar', 'Blind spot detection'],
  },
  {
    icon: Users, title: 'Debate Moderator', room: 'Common Room',
    gradient: 'from-[#FB923C]/20 to-[#F97316]/5',
    color: '#FB923C', accentBg: 'bg-[#FB923C]',
    description: 'Evidence-based moderation for peer discussions with fact-checking, synthesis, and structured debate views.',
    bullets: ['Fact-check badges', 'Discussion synthesis', 'Structured debate view'],
  },
];

const memoryPoints = [
  { icon: Fingerprint, title: 'Unique Identity', body: 'ATOM recognizes your learning fingerprint — strengths, weaknesses, and preferred study style.', color: '#5BB3B3', delay: 0 },
  { icon: Map, title: 'Knowledge Map', body: 'A structured map of every topic you\'ve mastered, what you\'re learning, and what needs attention.', color: '#6BA8C9', delay: 0.05 },
  { icon: AlertTriangle, title: 'Error → Lesson', body: 'Every mistake becomes a learning opportunity. ATOM tracks patterns and turns gaps into growth.', color: '#FB923C', delay: 0.1 },
  { icon: BarChart3, title: 'Confidence Calibration', body: 'Compares self-assessed confidence against real performance to calibrate clinical judgment.', color: '#A78BFA', delay: 0.15 },
  { icon: Database, title: 'Persistent Memory', body: 'Cross-session memory that grows with you. ATOM remembers your journey across days, weeks, months.', color: '#7BA69E', delay: 0.2 },
  { icon: Lock, title: 'Your Data, Your Control', body: 'Full transparency over what ATOM knows. Edit, delete, or correct any memory at any time.', color: '#C9A86C', delay: 0.25 },
];

const pipelineSteps = [
  { id: 'scribe', label: 'Scribe', color: '#60A5FA', glow: 'rgba(96,165,250,0.4)', description: 'Extracts & structures your query', icon: FileText },
  { id: 'retriever', label: 'Retriever', color: '#34D399', glow: 'rgba(52,211,153,0.4)', description: 'Finds relevant source content', icon: Eye },
  { id: 'critic', label: 'Critic', color: '#FB923C', glow: 'rgba(251,146,60,0.4)', description: 'Validates accuracy & coherence', icon: Shield },
  { id: 'memorist', label: 'Memorist', color: '#A78BFA', glow: 'rgba(167,139,250,0.4)', description: 'References your learning history', icon: Brain },
  { id: 'generator', label: 'Generate', color: '#5BB3B3', glow: 'rgba(91,179,179,0.4)', description: 'Produces the final response', icon: Sparkles },
];

const journey = [
  { stage: 'MBBS', year: 'Year 1–4', description: 'From first anatomy lesson to final exams. Structured revision, MCQ training, and spaced repetition to conquer the mountain of medical knowledge.', icon: '📚', color: '#60A5FA' },
  { stage: 'Intern', year: 'Year 5', description: 'Bridge the gap between textbook and ward. Clinical case partners, differential generators, and practical procedure guides for real patients.', icon: '🩺', color: '#34D399' },
  { stage: 'Resident', year: 'PG Studies', description: 'Specialized depth for your chosen field. Research synthesis, competition coaching, and knowledge architecture for your subspecialty.', icon: '🔬', color: '#A78BFA' },
  { stage: 'Consultant', year: 'Practice', description: 'Teaching, research, and clinical excellence. Prepare lectures, generate teaching decks, and stay current with evidence-based practice.', icon: '👨‍⚕️', color: '#C9A86C' },
];

/* ════════════════════════════════════════════════════════════
   ANIMATED COMPONENTS
   ════════════════════════════════════════════════════════════ */

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = () => {
      start += 16;
      const progress = Math.min(start / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function OrbitalAtom() {
  return (
    <div className="relative w-56 h-56 md:w-72 md:h-72">
      {/* Outer glow */}
      <div className="absolute inset-0 m-auto w-40 h-40 md:w-48 md:h-48 rounded-full bg-[#5BB3B3]/8 blur-3xl" />

      {/* Nucleus */}
      <motion.div
        className="absolute inset-0 m-auto w-16 h-16 md:w-20 md:h-20 rounded-full"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #B4E7E7, #5BB3B3 40%, #1A5C5C 80%, #0F3443)',
          boxShadow: '0 0 40px rgba(91,179,179,0.5), 0 0 80px rgba(91,179,179,0.2), inset 0 -4px 12px rgba(0,0,0,0.3)',
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Inner ring glow */}
      <motion.div
        className="absolute inset-0 m-auto w-24 h-24 md:w-28 md:h-28 rounded-full border border-[#5BB3B3]/20"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Electron rings */}
      {[
        { rotation: 0, duration: 8, color: '#7DD3FC' },
        { rotation: 60, duration: 10, color: '#A78BFA' },
        { rotation: 120, duration: 12, color: '#5BB3B3' },
      ].map(({ rotation, duration, color }, i) => (
        <motion.div
          key={i}
          className="absolute inset-2 rounded-full"
          style={{
            border: `1px solid ${color}25`,
            transform: `rotateX(72deg) rotateZ(${rotation}deg)`,
          }}
          animate={{ rotateZ: [rotation, rotation + 360] }}
          transition={{ duration, repeat: Infinity, ease: 'linear' }}
        >
          <motion.div
            className="absolute w-3 h-3 md:w-3.5 md:h-3.5 rounded-full"
            style={{
              background: `radial-gradient(circle, ${color}, ${color}80)`,
              top: '-6px', left: '50%', marginLeft: '-7px',
              boxShadow: `0 0 10px ${color}, 0 0 20px ${color}60`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

function PipelineDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % (pipelineSteps.length + 1));
    }, 2000);
    return () => clearInterval(timer);
  }, [isInView]);

  return (
    <div ref={ref} className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0">
      {pipelineSteps.map((step, i) => {
        const isActive = i <= activeStep;
        const isCurrent = i === activeStep;
        const Icon = step.icon;
        return (
          <div key={step.id} className="flex items-center">
            <motion.div
              className="relative flex flex-col items-center gap-2 px-4 py-4 rounded-2xl border backdrop-blur-sm min-w-[110px]"
              style={{
                borderColor: isActive ? `${step.color}50` : '#1E3A5F30',
                background: isActive
                  ? `linear-gradient(135deg, ${step.color}12, transparent)`
                  : 'rgba(15,31,48,0.3)',
              }}
              animate={isCurrent ? {
                boxShadow: [`0 0 0px transparent`, `0 0 28px ${step.glow}`, `0 0 0px transparent`],
                scale: [1, 1.06, 1],
              } : { scale: 1 }}
              transition={{ duration: 1.2, repeat: isCurrent ? Infinity : 0 }}
            >
              {/* Step number indicator */}
              <div
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{
                  background: isActive ? step.color : '#1E3A5F',
                  color: isActive ? '#080F1A' : '#4A6378',
                  boxShadow: isActive ? `0 0 8px ${step.glow}` : 'none',
                }}
              >
                {isActive && i < activeStep ? <Check className="w-3 h-3" /> : i + 1}
              </div>

              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300"
                style={{
                  background: isActive ? `${step.color}20` : 'transparent',
                  border: `1px solid ${isActive ? `${step.color}40` : '#1E3A5F'}`,
                }}
              >
                <Icon className="w-4 h-4" style={{ color: isActive ? step.color : '#4A6378' }} />
              </div>
              <span className="text-xs font-semibold tracking-wide" style={{ color: isActive ? step.color : '#4A6378' }}>{step.label}</span>
              <span className="text-[10px] text-center leading-tight" style={{ color: isActive ? '#8FB6D9' : '#334155' }}>{step.description}</span>
            </motion.div>

            {/* Connector line */}
            {i < pipelineSteps.length - 1 && (
              <div className="hidden sm:flex items-center">
                <motion.div
                  className="w-10 h-[2px] rounded-full"
                  style={{
                    background: isActive && i < activeStep
                      ? `linear-gradient(90deg, ${step.color}80, ${pipelineSteps[i + 1].color}80)`
                      : '#1E3A5F30',
                  }}
                  animate={isCurrent ? { opacity: [0.4, 1, 0.4] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SECTION WRAPPER with scroll animation
   ════════════════════════════════════════════════════════════ */

function Section({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════ */

export default function ATOMPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="min-h-screen bg-[#060C17] text-white overflow-x-hidden">
      <MarketingHeader />

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-20">
        <FloatingParticles />

        {/* Radial grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(91,179,179,0.04) 1px, transparent 0)',
          backgroundSize: '52px 52px',
        }} />

        {/* Radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#5BB3B3]/6 blur-[120px]" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#060C17] to-transparent" />

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="flex justify-center mb-12">
            <OrbitalAtom />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-5"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#5BB3B3]/25 bg-[#5BB3B3]/8 text-xs font-medium text-[#7DD3FC] backdrop-blur-sm">
              <Radio className="w-3.5 h-3.5 animate-pulse" /> The Engine of NucleuX Academy
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tight mb-6 leading-[1.05]"
          >
            <span className="bg-gradient-to-r from-white via-[#BFDBFE] to-[#7DD3FC] bg-clip-text text-transparent">
              Your Clinical
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#5BB3B3] via-[#7DD3FC] to-[#A78BFA] bg-clip-text text-transparent">
              Thinking Partner
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-lg sm:text-xl text-[#7A9BB5] max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            ATOM is not a chatbot — it&apos;s an <span className="text-[#A5F3FC] font-normal">ambient intelligence</span> that permeates every room
            of NucleuX Academy. Source-grounded. Memory-powered. Built for the clinical mind.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/chat"
              className="group inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-2xl bg-gradient-to-r from-[#5BB3B3] to-[#4A9999] text-white font-bold text-base shadow-[0_4px_24px_rgba(91,179,179,0.25)] hover:shadow-[0_8px_40px_rgba(91,179,179,0.4)] transition-all duration-300 hover:scale-[1.03]"
            >
              Start with ATOM
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-2xl border border-[#1E3A5F]/80 bg-[#0F1F30]/60 text-[#BFDBFE] font-semibold text-base hover:border-[#5BB3B3]/40 hover:bg-[#5BB3B3]/5 transition-all duration-300 backdrop-blur-sm"
            >
              Campus Tour <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── STATS BANNER ─── */}
      <Section className="relative py-16 border-y border-[#1E3A5F]/30">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5BB3B3]/3 via-transparent to-[#A78BFA]/3" />
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-10 text-center relative z-10">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <div className="w-10 h-10 rounded-xl bg-[#5BB3B3]/10 border border-[#5BB3B3]/20 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-[#5BB3B3]" />
                </div>
                <p className="text-4xl md:text-5xl font-extrabold text-[#E5EEF8] tracking-tight">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-[#7A9BB5] mt-1 font-medium">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* ─── ONE CORE. MANY ROLES ─── */}
      <Section className="py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#5BB3B3]/20 bg-[#5BB3B3]/5 text-[11px] font-semibold text-[#5BB3B3] uppercase tracking-wider mb-4">
              <Layers className="w-3 h-3" /> Adaptive Personas
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-5 tracking-tight">
              <span className="bg-gradient-to-r from-[#E5EEF8] via-[#BFDBFE] to-[#5BB3B3] bg-clip-text text-transparent">
                One Core. Many Roles.
              </span>
            </h2>
            <p className="text-[#7A9BB5] text-lg max-w-xl mx-auto leading-relaxed">
              ATOM transforms its persona based on which room you&apos;re in — always the right partner for the moment.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {atomRoles.map((role, i) => {
              const Icon = role.icon;
              return (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group relative rounded-2xl border border-[#1E3A5F]/60 bg-[#0B1726]/60 backdrop-blur-sm overflow-hidden"
                >
                  {/* Gradient top bar */}
                  <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${role.color}80, transparent)` }} />

                  {/* Hover gradient overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(135deg, ${role.color}08, transparent 60%)` }}
                  />

                  <div className="relative z-10 p-6">
                    <div className="flex items-center gap-3.5 mb-4">
                      <motion.div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${role.color}15, ${role.color}05)`,
                          border: `1px solid ${role.color}25`,
                        }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Icon className="w-5 h-5" style={{ color: role.color }} />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-[#E5EEF8] text-[15px]">{role.title}</h3>
                        <p className="text-[11px] text-[#4A6378] font-medium">{role.room}</p>
                      </div>
                    </div>
                    <p className="text-[13px] text-[#7A9BB5] mb-4 leading-relaxed">{role.description}</p>
                    <ul className="space-y-2">
                      {role.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-center gap-2.5 text-xs text-[#5A7A8F]">
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: role.color, boxShadow: `0 0 6px ${role.color}40` }} />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ─── HOW MEMORY WORKS ─── */}
      <Section className="py-28 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B1324]/80 to-transparent" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#A78BFA]/20 bg-[#A78BFA]/5 text-[11px] font-semibold text-[#A78BFA] uppercase tracking-wider mb-4">
              <Database className="w-3 h-3" /> Persistent Memory
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-5 tracking-tight">
              <span className="bg-gradient-to-r from-[#A78BFA] via-[#7DD3FC] to-[#5BB3B3] bg-clip-text text-transparent">
                Memory That Grows With You
              </span>
            </h2>
            <p className="text-[#7A9BB5] text-lg max-w-xl mx-auto leading-relaxed">
              7 memory types that capture your entire learning journey — preferences, strengths, weaknesses, goals, and breakthrough moments.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memoryPoints.map((point, i) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: point.delay, duration: 0.5 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  className="group rounded-2xl border border-[#1E3A5F]/40 bg-[#0B1726]/40 backdrop-blur-sm p-5 hover:bg-[#0B1726]/70 transition-all duration-300"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300"
                      style={{ background: `${point.color}10`, border: `1px solid ${point.color}20` }}
                    >
                      <Icon className="w-4.5 h-4.5" style={{ color: point.color }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#E5EEF8] mb-1.5">{point.title}</h3>
                      <p className="text-xs text-[#7A9BB5] leading-[1.7]">{point.body}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ─── AGENT PIPELINE ─── */}
      <Section className="py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#34D399]/20 bg-[#34D399]/5 text-[11px] font-semibold text-[#34D399] uppercase tracking-wider mb-4">
              <Activity className="w-3 h-3" /> Multi-Agent System
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-5 tracking-tight">
              <span className="bg-gradient-to-r from-[#60A5FA] via-[#34D399] to-[#A78BFA] bg-clip-text text-transparent">
                5-Agent Pipeline
              </span>
            </h2>
            <p className="text-[#7A9BB5] text-lg max-w-xl mx-auto leading-relaxed">
              Every ATOM response is built through a multi-agent pipeline — <span className="text-[#60A5FA]">extract</span>,{' '}
              <span className="text-[#34D399]">retrieve</span>, <span className="text-[#FB923C]">validate</span>,{' '}
              <span className="text-[#A78BFA]">remember</span>, <span className="text-[#5BB3B3]">generate</span>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <PipelineDemo />
          </motion.div>
        </div>
      </Section>

      {/* ─── OPEN STUDIO PREVIEW ─── */}
      <Section className="py-28 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B1324]/80 to-transparent" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#5BB3B3]/20 bg-[#5BB3B3]/5 text-[11px] font-semibold text-[#5BB3B3] uppercase tracking-wider mb-4">
              <Sparkles className="w-3 h-3" /> Preview
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-5 tracking-tight">
              <span className="bg-gradient-to-r from-[#E5EEF8] to-[#5BB3B3] bg-clip-text text-transparent">
                Open Studio
              </span>
            </h2>
            <p className="text-[#7A9BB5] text-lg max-w-xl mx-auto leading-relaxed">
              The unrestricted ATOM experience — source-grounded, memory-aware, with full agent access and artifact generation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-[#1E3A5F]/50 bg-[#0B1726]/60 backdrop-blur-sm overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.4)]"
          >
            {/* Window chrome */}
            <div className="h-12 border-b border-[#1E3A5F]/50 px-5 flex items-center gap-3 bg-[#080F1A]/80">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-lg bg-[#0F1F30] border border-[#1E3A5F]/50 text-[11px] text-[#4A6378]">
                  localhost:3000/chat
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#5BB3B3]/10 border border-[#5BB3B3]/25 text-[#7DD3FC] font-medium">
                ⚛️ Studio
              </span>
            </div>

            {/* 3-pane mock */}
            <div className="grid grid-cols-12 min-h-[360px]">
              {/* Left: Sources */}
              <div className="col-span-3 border-r border-[#1E3A5F]/30 p-4 bg-gradient-to-b from-[#0a1525]/50 to-transparent">
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#5BB3B3] mb-3 font-semibold">Sources</p>
                {[
                  { name: 'Shackelford\'s Surgery', active: true },
                  { name: 'Robbins Pathology', active: true },
                  { name: 'Harrison\'s Medicine', active: false },
                ].map((src, i) => (
                  <div key={src.name} className={`flex items-center gap-2.5 mb-2 px-3 py-2 rounded-xl border transition-all ${src.active ? 'bg-[#5BB3B3]/8 border-[#5BB3B3]/30' : 'border-[#1E3A5F]/30 opacity-50'}`}>
                    <div className={`w-2 h-2 rounded-full ${src.active ? 'bg-[#5BB3B3] shadow-[0_0_6px_rgba(91,179,179,0.5)]' : 'bg-[#334155]'}`} />
                    <span className="text-[11px] text-[#BFDBFE] truncate font-medium">{src.name}</span>
                  </div>
                ))}

                <div className="mt-6">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[#A78BFA] mb-2 font-semibold">Preferences</p>
                  <div className="space-y-1">
                    {['Concise', 'Intermediate', 'Bullets'].map((pref) => (
                      <div key={pref} className="px-3 py-1.5 rounded-lg bg-[#A78BFA]/8 border border-[#A78BFA]/20 text-[10px] text-[#C4B5FD]">{pref}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center: Chat */}
              <div className="col-span-6 p-5 flex flex-col">
                <div className="flex-1 space-y-4">
                  <div className="ml-auto max-w-[85%] rounded-2xl bg-[#5BB3B3]/12 border border-[#5BB3B3]/25 px-4 py-3">
                    <p className="text-[12px] text-[#E7F8F8] leading-5">Explain the pathophysiology of portal hypertension and its surgical significance.</p>
                  </div>
                  <div className="mr-auto max-w-[90%] rounded-2xl border border-[#22354D]/60 bg-[#0F1F30]/60 px-5 py-4">
                    <p className="text-[12px] text-[#C7D8EA] leading-6">
                      <span className="text-[#7DD3FC] font-semibold">Portal hypertension</span> occurs when pressure in the portal venous system exceeds
                      <span className="text-[#A78BFA] font-semibold"> 10 mmHg</span> (normal: 5-8 mmHg). Key surgical consequences include:
                    </p>
                    <ul className="mt-2 space-y-1 text-[11px] text-[#8FB6D9]">
                      <li className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#5BB3B3] mt-1.5 shrink-0" />
                        Esophageal varices → risk of life-threatening hemorrhage
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#5BB3B3] mt-1.5 shrink-0" />
                        Ascites → peritoneal fluid accumulation
                      </li>
                    </ul>
                    <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[#5BB3B3] font-medium">
                      <BookOpen className="w-3 h-3" /> Shackelford Ch.35 · Relevance 0.92
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Outputs */}
              <div className="col-span-3 border-l border-[#1E3A5F]/30 p-4 bg-gradient-to-b from-[#0a1525]/50 to-transparent">
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#7DD3FC] mb-3 font-semibold">Outputs</p>
                {[
                  { icon: FileText, label: 'Structured Summary', type: 'artifact' },
                  { icon: FlaskConical, label: 'Flashcards (12)', type: 'artifact' },
                  { icon: Lightbulb, label: 'Clinical Pearls', type: 'artifact' },
                ].map(({ icon: Icon, label, type }) => (
                  <div key={label} className="flex items-center gap-2.5 mb-2 px-3 py-2 rounded-xl border border-[#1E3A5F]/30 hover:bg-[#1E3A5F]/20 transition-colors cursor-pointer">
                    <Icon className="w-3.5 h-3.5 text-[#5BB3B3]" />
                    <span className="text-[11px] text-[#BFDBFE] font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="text-center mt-10">
            <Link
              href="/chat"
              className="group inline-flex items-center gap-2.5 px-8 py-3 rounded-2xl bg-[#5BB3B3]/10 border border-[#5BB3B3]/25 text-sm text-[#7DD3FC] font-semibold hover:bg-[#5BB3B3]/20 hover:border-[#5BB3B3]/40 transition-all duration-300"
            >
              Try ATOM Studio
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </Section>

      {/* ─── JOURNEY TIMELINE ─── */}
      <Section className="py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A86C]/20 bg-[#C9A86C]/5 text-[11px] font-semibold text-[#C9A86C] uppercase tracking-wider mb-4">
              <Stethoscope className="w-3 h-3" /> Your Entire Career
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-5 tracking-tight">
              <span className="bg-gradient-to-r from-[#BFDBFE] via-[#7DD3FC] to-[#5BB3B3] bg-clip-text text-transparent">
                A Lifelong Partner
              </span>
            </h2>
            <p className="text-[#7A9BB5] text-lg max-w-xl mx-auto leading-relaxed">
              From your first anatomy class to consultant practice — ATOM grows with you at every stage.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#60A5FA]/40 via-[#5BB3B3]/30 to-transparent hidden md:block" />

            {journey.map((stage, i) => (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.12, duration: 0.7, ease: 'easeOut' }}
                className={`flex flex-col md:flex-row items-center gap-6 mb-14 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <motion.div
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    className={`rounded-2xl border border-[#1E3A5F]/40 bg-[#0B1726]/40 backdrop-blur-sm p-7 ${i % 2 === 0 ? 'md:ml-auto md:mr-0' : 'md:mr-auto md:ml-0'} max-w-md`}
                  >
                    {/* Color bar */}
                    <div className="w-10 h-1 rounded-full mb-4" style={{ background: stage.color }} />
                    <div className={`flex items-center gap-3 mb-3 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      <span className="text-3xl">{stage.icon}</span>
                      <div>
                        <h3 className="font-extrabold text-[#E5EEF8] text-lg">{stage.stage}</h3>
                        <p className="text-xs font-semibold" style={{ color: stage.color }}>{stage.year}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#7A9BB5] leading-relaxed">{stage.description}</p>
                  </motion.div>
                </div>

                {/* Center dot */}
                <div
                  className="w-5 h-5 rounded-full border-4 border-[#060C17] z-10 hidden md:block shrink-0"
                  style={{
                    background: stage.color,
                    boxShadow: `0 0 20px ${stage.color}50`,
                  }}
                />
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── CTA ─── */}
      <Section className="py-28 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Gradient glow background */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#5BB3B3]/40 via-[#A78BFA]/30 to-[#5BB3B3]/40 blur-xl opacity-50" />

            {/* Card */}
            <div className="relative rounded-3xl border border-[#5BB3B3]/20 bg-[#0B1324]/90 backdrop-blur-xl p-14 text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="mb-8 inline-flex"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5BB3B3]/20 to-[#A78BFA]/10 border border-[#5BB3B3]/25 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-[#5BB3B3]" />
                </div>
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-extrabold mb-5 text-[#E5EEF8] tracking-tight">
                Start Learning{' '}
                <span className="bg-gradient-to-r from-[#5BB3B3] to-[#7DD3FC] bg-clip-text text-transparent">
                  Atomically
                </span>
              </h2>
              <p className="text-[#7A9BB5] mb-10 max-w-md mx-auto text-lg leading-relaxed">
                Source-grounded answers. Persistent memory. A thinking partner that understands the clinical mind.
              </p>
              <Link
                href="/chat"
                className="group inline-flex items-center gap-2.5 px-12 py-4.5 rounded-2xl bg-gradient-to-r from-[#5BB3B3] to-[#4A9999] text-white font-bold text-lg shadow-[0_8px_32px_rgba(91,179,179,0.3)] hover:shadow-[0_12px_48px_rgba(91,179,179,0.45)] transition-all duration-300 hover:scale-[1.03]"
              >
                Initialize ATOM
                <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>

      <SupportFooter />
    </div>
  );
}
