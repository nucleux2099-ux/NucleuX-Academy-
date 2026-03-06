'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import {
  ArrowRight,
  BookOpen, // Added for Library
  MonitorPlay, // Added for Classroom
  Stethoscope, // Added for Training Centre
  Building2, // Added for Common Room
  Activity, // Added for Backstage
  GraduationCap,
  LayoutDashboard,
  Swords, // Added for Arena
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

// Full 8-Room Campus Tour Data
const featureCards = [
  {
    title: 'My Desk (Command Center)',
    subtitle: 'Your personalized starting point.',
    description: 'ATOM Study Coach lays out your daily mission, maps your knowledge graph, and sets the trajectory for your learning. Never wonder what to study next.',
    icon: LayoutDashboard,
    color: 'from-[#6366F1]/20 to-[#6366F1]/5',
    borderColor: 'border-[#6366F1]/30',
    iconColor: 'text-[#6366F1]',
    image: '/screenshots/dashboard_view_1771599470366.png',
    direction: 'left',
    features: [
      'Daily AI-generated study missions',
      'Personalized knowledge gap visualization',
      'Direct access to recent notes & lectures'
    ]
  },
  {
    title: 'Dynamic Concept Library',
    subtitle: 'See the big picture. Learn the connections.',
    description: 'A living, interconnected encyclopedia covering UG to Super-Specialty. See exactly how diseases, drugs, and physiological mechanisms intertwine in a visual graph.',
    icon: BookOpen,
    color: 'from-[#E879F9]/20 to-[#E879F9]/5',
    borderColor: 'border-[#E879F9]/30',
    iconColor: 'text-[#E879F9]',
    image: '/screenshots/library_view_1771599499519.png',
    direction: 'right',
    features: [
      'Interactive 3D medical knowledge maps',
      'Cross-linked topics from UG to PG',
      'One-click deep dives into pathologies'
    ]
  },
  {
    title: 'The Classroom',
    subtitle: 'Active Learning Lab.',
    description: 'Watch high-yield lectures fused with an interactive drawing canvas and AI-powered mind maps. Transform passive video watching into active knowledge synthesis.',
    icon: MonitorPlay,
    color: 'from-[#5BB3B3]/20 to-[#5BB3B3]/5',
    borderColor: 'border-[#5BB3B3]/30',
    iconColor: 'text-[#5BB3B3]',
    image: '/screenshots/classroom_view_1771599516526.png',
    direction: 'left',
    features: [
      'High-yield core video lectures',
      'Synchronized AI-generated mind maps',
      'Split-screen interactive drawing canvas'
    ]
  },
  {
    title: 'Training Centre (AI Tutor)',
    subtitle: 'Learn Atomically. Grow Exponentially.',
    description: "Guided Socratic learning with a first-principles focus. ATOM isn't just a chatbot; it's a clinical mentor that breaks down extreme complexity into digestible, atomic units of knowledge.",
    icon: Stethoscope,
    color: 'from-[#F59E0B]/20 to-[#F59E0B]/5',
    borderColor: 'border-[#F59E0B]/30',
    iconColor: 'text-[#F59E0B]',
    image: '/screenshots/training_centre_view_1771599616781.png',
    direction: 'right',
    features: [
      'Socratic step-by-step case resolution',
      'Instant feedback on clinical reasoning',
      'Customized difficulty based on performance'
    ]
  },
  {
    title: 'CBME Curriculum Engine',
    subtitle: 'The NMC Blueprint.',
    description: 'Stay perfectly aligned with the latest National Medical Commission guidelines. Track your competencies module by module, ensuring no academic blind spots remain.',
    icon: GraduationCap,
    color: 'from-[#10B981]/20 to-[#10B981]/5',
    borderColor: 'border-[#10B981]/30',
    iconColor: 'text-[#10B981]',
    image: '/screenshots/cbme_view_1771599534255.png',
    direction: 'left',
    features: [
      'Automated NMC competency tracking',
      'Module-by-module progress analytics',
      'Logbook integration for clinical skills'
    ]
  },
  {
    title: 'The Common Room',
    subtitle: 'Medical Community Hub.',
    description: 'Medicine is a team sport. Join study groups, debate complex cases, and connect with top contributors from medical colleges nationwide.',
    icon: Building2,
    color: 'from-[#3B82F6]/20 to-[#3B82F6]/5',
    borderColor: 'border-[#3B82F6]/30',
    iconColor: 'text-[#3B82F6]',
    image: '/screenshots/common_room_view_1771599551762.png',
    direction: 'right',
    features: [
      'Real-time collaborative study groups',
      'Peer-to-peer complex case debates',
      'Mentorship from top-performing seniors'
    ]
  },
  {
    title: 'The Arena',
    subtitle: 'Competitive Mastery.',
    description: 'Test your mettle. Engage in daily challenges, climb the leaderboards, and enter high-stakes tournaments to prove your clinical prowess to your peers.',
    icon: Swords,
    color: 'from-[#EF4444]/20 to-[#EF4444]/5',
    borderColor: 'border-[#EF4444]/30',
    iconColor: 'text-[#EF4444]',
    image: '/screenshots/arena_view_1771599572692.png',
    direction: 'left',
    features: [
      'Daily clinical vignette challenges',
      'National real-time leaderboards',
      'High-stakes mock exam tournaments'
    ]
  },
  {
    title: 'Backstage Analytics',
    subtitle: 'Confidence Calibration.',
    description: 'Know exactly what you don\'t know. Advanced analytics automatically surface your weakest links and force spaced repetition where it hurts most.',
    icon: Activity,
    color: 'from-[#8B5CF6]/20 to-[#8B5CF6]/5',
    borderColor: 'border-[#8B5CF6]/30',
    iconColor: 'text-[#8B5CF6]',
    image: '/screenshots/backstage_analytics_1771605505290.png',
    direction: 'right',
    features: [
      'Predictive exam readiness scoring',
      'Granular weak-points identification',
      'Automated spaced-repetition scheduling'
    ]
  }
];

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E8E0D5] overflow-hidden" ref={containerRef}>
      <MarketingHeader
        active="home"
        subtitle="Medical learning OS powered by ATOM"
        primaryCta={{ href: '/signup', label: 'Start with ATOM' }}
        secondaryCta={{ href: '/campus', label: 'Campus Tour' }}
      />

      {/* Hero Section - Visual & Punchy */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-24 pb-20 sm:pt-32 sm:pb-32 flex flex-col items-center text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5BB3B3]/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#E879F9]/10 blur-[100px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 max-w-4xl flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5BB3B3]/40 bg-[#5BB3B3]/10 px-5 py-2 text-sm text-[#5BB3B3] font-medium tracking-wide mb-8 shadow-[0_0_15px_rgba(91,179,179,0.2)]">
            <Sparkles className="w-4 h-4" /> Next-Gen Clinical Education
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6">
            Your Medical Universe. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BB3B3] to-[#8EE4E4]">
              Fully Digitized.
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-[#A0B0BC] max-w-2xl font-light leading-relaxed mb-10">
            Welcome to the NucleuX Academy Campus. Eight interconnected rooms designed to rewire your clinical thinking and build true medical mastery.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/signup" className="group relative inline-flex items-center justify-center rounded-2xl px-8 py-4 text-lg font-bold text-[#0B1220] bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(91,179,179,0.3)] hover:shadow-[0_0_40px_rgba(91,179,179,0.5)]">
              Begin the Campus Tour
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature Showcase - Bold Scrolling Cards */}
      <section className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="mb-20 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">The Virtual Campus Tour</h2>
          <p className="text-xl text-[#A0B0BC]">Eight interconnected rooms. One continuous learning loop.</p>
        </div>

        <div className="space-y-32">
          {featureCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: card.direction === 'left' ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`flex flex-col lg:flex-row items-center gap-12 ${card.direction === 'right' ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Text Content */}
              <div className="flex-1 space-y-6">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} border ${card.borderColor}`}>
                  <card.icon className={`w-7 h-7 ${card.iconColor}`} />
                </div>
                <h3 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">{card.title}</h3>
                <h4 className={`text-xl font-medium ${card.iconColor}`}>{card.subtitle}</h4>
                <p className="text-lg text-[#A0B0BC] leading-relaxed">{card.description}</p>

                <ul className="space-y-3 pt-4">
                  {card.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-[#E8E0D5]">
                      <div className={`flex-shrink-0 w-5 h-5 ${card.iconColor}`}>
                        <CheckCircle2 className="w-full h-full" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual Card (Image Mockup) */}
              <div className="flex-1 w-full max-w-2xl">
                <div className={`relative aspect-[4/3] rounded-3xl overflow-hidden border ${card.borderColor} bg-gradient-to-br ${card.color} p-2 shadow-2xl`}>
                  <div className="absolute inset-0 bg-[#0B1220]/50 backdrop-blur-sm -z-10" />
                  <div className="w-full h-full rounded-2xl bg-[#131E30] flex items-center justify-center border border-white/5 overflow-hidden">
                    {card.image ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    ) : (
                      <div className="text-center p-8">
                        <card.icon className={`w-16 h-16 mx-auto mb-4 opacity-50 ${card.iconColor}`} />
                        <p className="text-xl font-medium text-white/50">Coming Soon</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Massive CTA Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[3rem] border border-[#5BB3B3]/30 bg-gradient-to-br from-[#5BB3B3]/10 to-transparent p-12 sm:p-20 text-center overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-t from-[#0B1220] to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              Ready to rewire your brain?
            </h2>
            <p className="text-xl text-[#A0B0BC] mb-10 leading-relaxed">
              Join thousands of medical students who have upgraded their learning OS. Stop memorizing. Start diagnosing.
            </p>
            <Link href="/signup" className="group sticky z-50 inline-flex items-center justify-center rounded-2xl px-12 py-5 text-xl font-bold text-[#0B1220] bg-white hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
              Enter the Academy
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      <SupportFooter />
    </div>
  );
}
