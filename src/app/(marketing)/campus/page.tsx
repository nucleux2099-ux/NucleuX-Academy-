'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, GraduationCap, LayoutDashboard, Atom, Users, Swords, BarChart3, Map } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

const rooms = [
  { id: '01', title: 'Welcome Center', icon: BookOpen, role: 'Orientation', purpose: 'Set intent, define weak zones, and commit to a path.', color: '#94A3B8' },
  { id: '02', title: 'Library', icon: BookOpen, role: 'Knowledge Layer', purpose: 'Build concepts with prerequisite and cross-topic links.', color: '#6366F1' },
  { id: '03', title: 'Exam Center', icon: GraduationCap, role: 'Retrieval Layer', purpose: 'Stress-test recall and reasoning through questions and cases.', color: '#F59E0B' },
  { id: '04', title: 'AI Tutor (ATOM Chamber)', icon: Atom, role: 'Teaching Layer', purpose: 'Guided Socratic learning with first-principles focus.', color: '#5BB3B3' },
  { id: '05', title: 'Desk', icon: LayoutDashboard, role: 'Planning Layer', purpose: 'Prioritize what to study next with deliberate structure.', color: '#E879F9' },
  { id: '06', title: 'Common Room', icon: Users, role: 'Consolidation Layer', purpose: 'Discuss, distill, and stabilize understanding.', color: '#10B981' },
  { id: '07', title: 'Arena', icon: Swords, role: 'Pressure Layer', purpose: 'Train decisions under constraints and uncertainty.', color: '#EF4444' },
  { id: '08', title: 'Backstage', icon: BarChart3, role: 'Calibration Layer', purpose: 'Detect error patterns and confidence mismatch for correction.', color: '#F97316' },
];

export default function CampusTourPage() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E8E0D5] relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(16,185,129,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow Effects */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#10B981]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[#3B82F6]/10 blur-[150px] rounded-full pointer-events-none" />

      <MarketingHeader active="campus" subtitle="Medical learning OS powered by ATOM" primaryCta={{ href: '/signup', label: 'Start with ATOM' }} secondaryCta={{ href: '/rooms', label: 'Library Rooms' }} />

      <section className="max-w-7xl mx-auto px-6 pt-16 sm:pt-24 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl text-center mx-auto"
        >
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-[#A0B0BC] backdrop-blur-md mb-6">
            <Map className="w-4 h-4 text-[#10B981]" />
            Campus Map
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-white leading-tight tracking-tight">
            A virtual campus built for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#3B82F6]">
              clinical mastery.
            </span>
          </h1>
          <p className="mt-8 text-xl text-[#A0B0BC] font-light max-w-2xl mx-auto leading-relaxed">
            These rooms are not just pages for navigation. They are stages of cognition: orientation, encoding, retrieval,
            pressure, and calibration.
          </p>
        </motion.div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24 relative z-10">
        <div className="relative border-l-2 border-white/10 pl-8 ml-4 md:pl-0 md:ml-0 md:border-l-0">
          {/* Central Line for Desktop */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#10B981]/50 via-white/10 to-transparent" />

          <div className="space-y-12 md:space-y-24">
            {rooms.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className={`relative flex flex-col md:flex-row items-start md:items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Connector Dot */}
                <div className={`absolute top-6 -left-[41px] md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 w-6 h-6 rounded-full border-4 border-[#0B1220] z-10 box-content shadow-[0_0_15px_rgba(255,255,255,0.1)]`} style={{ backgroundColor: room.color }} />

                {/* Content Card */}
                <div className={`w-full md:w-[45%] ${i % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                  <div className="rounded-[2rem] border border-white/10 bg-[#131E30]/40 backdrop-blur-xl p-8 hover:bg-[#131E30]/70 hover:border-white/20 transition-all duration-300 shadow-xl group relative overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none mix-blend-screen"
                      style={{ background: `radial-gradient(circle at top right, ${room.color}, transparent 70%)` }}
                    />

                    <div className="flex items-start justify-between mb-6">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner"
                        style={{ backgroundColor: `${room.color}15`, border: `1px solid ${room.color}30` }}
                      >
                        <room.icon className="w-7 h-7" style={{ color: room.color }} />
                      </div>
                      <span className="text-4xl font-black text-white/5 group-hover:text-white/10 transition-colors pointer-events-none select-none">
                        {room.id}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white tracking-tight mb-2">{room.title}</h3>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${room.color}20`, color: room.color }}>
                      {room.role}
                    </div>
                    <p className="text-[#A0B0BC] leading-relaxed text-lg">
                      {room.purpose}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[3rem] border border-[#10B981]/30 bg-gradient-to-br from-[#10B981]/10 to-[#131E30]/50 backdrop-blur-xl p-12 sm:p-20 flex flex-col items-center text-center shadow-[0_0_50px_rgba(16,185,129,0.1)]"
        >
          <div className="w-20 h-20 rounded-3xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center mb-8 shadow-inner">
            <Map className="w-10 h-10 text-[#10B981]" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 tracking-tight">Walk in with curiosity. Walk out with clarity.</h2>
          <p className="text-xl text-[#A0B0BC] mt-1 mb-10 max-w-2xl font-light">Start from any room. ATOM keeps the whole system coherent and ensures you master the concepts.</p>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-2xl px-8 py-4 text-lg font-bold text-[#0B1220] bg-gradient-to-r from-[#10B981] to-[#059669] hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
            >
              Start with ATOM <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/rooms"
              className="inline-flex items-center justify-center rounded-2xl px-8 py-4 text-lg font-bold text-white border border-white/20 bg-white/5 hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
            >
              Browse Library Rooms
            </Link>
          </div>
        </motion.div>
      </section>

      <SupportFooter />
    </div>
  );
}
