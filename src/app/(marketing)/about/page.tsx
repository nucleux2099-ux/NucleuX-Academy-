"use client";

import { motion } from "framer-motion";
import { Atom, Globe, BookOpen, Brain, Users, GitMerge, CircleCheck } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { SupportFooter } from "@/components/marketing/SupportFooter";

const values = [
  {
    icon: Brain,
    title: "Learning Happens at Encoding",
    description: "We don't do passive video tracking. We focus on the exact moment you encounter a concept—using active recall and metacognitive triggers to make it stick permanently.",
    color: "#E879F9",
  },
  {
    icon: Atom,
    title: "Atomic Thinking",
    description: "Our core philosophy: breaking complex medical knowledge into fundamental, irreducible units. Like atoms, these units are small, deeply understood, and infinitely combinable.",
    color: "#5BB3B3",
  },
  {
    icon: GitMerge,
    title: "Structured Retrieval",
    description: "Watching a video and feeling 'I know this' is just recognition. Being able to pull it from memory in a clinical scenario is retrieval. We build retrieval.",
    color: "#6BA8C9",
  },
];

const timeline = [
  {
    year: "The Thesis",
    event: "It started with a simple idea among a group of physicians: not another medical content dump, but a system built on first principles and retrieval-first cognition.",
  },
  {
    year: "The Prototype",
    event: "Countless late-night build sessions mapping thousands of competencies and locking in a curriculum mirror that aligned with true clinical practice.",
  },
  {
    year: "The First Circle",
    event: "A tight-knit study group rigorously testing hypotheses—prepping for board exams, running daily viva simulations, and refining clinical models.",
  },
  {
    year: "The Vision",
    event: "Scaling this deep, structured learning system to reach every medical student, resident, and practicing consultant worldwide.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E8E0D5] relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(91,179,179,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(91,179,179,0.2) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Subtle Glow Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#5BB3B3]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-[#E879F9]/5 blur-[120px] rounded-full pointer-events-none" />

      <MarketingHeader
        active="about"
        subtitle="Medical learning OS powered by ATOM"
        primaryCta={{ href: "/signup", label: "Join the Community" }}
        secondaryCta={{ href: "/campus", label: "Campus Tour" }}
      />

      <main className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-20 sm:pb-32 relative z-10">
        {/* Humble Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5BB3B3]/30 bg-[#5BB3B3]/10 px-4 py-1.5 text-sm font-medium text-[#5BB3B3] backdrop-blur-md mb-8">
            <Globe className="w-4 h-4" /> A Global Vision
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
            Building the learning system we{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BB3B3] to-[#8EE4E4]">
              wished we had.
            </span>
          </h1>
          <p className="text-xl text-[#A0B0BC] font-light leading-relaxed mb-6">
            NucleuX Academy didn't start in a boardroom. It started out of a shared frustration over passive video lectures and isolated memorization that plagues modern medical education.
          </p>
          <p className="text-lg text-[#8B9AA4] leading-relaxed">
            We realized that students don't need *more* notes. They need better organization, better retrieval design, and a true cognitive scaffolding to rely on. We set out to build a platform that scales the intensity of a high-performance study circle to every student, resident, and consultant.
          </p>
        </motion.div>

        {/* The Concept of NucleuX */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 rounded-[2rem] border border-white/5 bg-[#131E30]/40 backdrop-blur-xl p-8 lg:p-12 shadow-xl"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-6">The Meaning of NucleuX</h2>
              <blockquote className="border-l-[3px] border-[#5BB3B3] pl-6 text-[#E8E0D5] text-lg font-medium italic relative mb-6">
                <div className="absolute -left-[3px] top-0 bottom-0 w-[3px] bg-[#5BB3B3] shadow-[0_0_15px_rgba(91,179,179,0.5)] rounded-full" />
                "Like dense chromatin is condensed and well-organized inside a nucleus — that's how knowledge should be stored in your mind."
              </blockquote>
              <p className="text-[#A0B0BC] leading-relaxed">
                The ATOM philosophy forms our backbone. We break down daunting physiological pathways, complex surgical protocols, and dense diagnostic criteria into atomic, digestible units. It's an honest, first-principles approach to medicine.
              </p>
            </div>

            <div className="bg-[#0B1220]/50 rounded-2xl p-6 border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#6BA8C9]" /> Reaching Every Stage
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <CircleCheck className="w-5 h-5 text-[#5BB3B3] shrink-0 mt-0.5" />
                  <p className="text-[#A0B0BC] text-sm"><strong className="text-[#E8E0D5]">For the Student:</strong> Focused on foundational understanding, core competency tracking, and mastering board exams.</p>
                </li>
                <li className="flex gap-3">
                  <CircleCheck className="w-5 h-5 text-[#5BB3B3] shrink-0 mt-0.5" />
                  <p className="text-[#A0B0BC] text-sm"><strong className="text-[#E8E0D5]">For the Resident:</strong> Daily retrieval checkpoints, advanced case simulations, and structured weak-area tracking.</p>
                </li>
                <li className="flex gap-3">
                  <CircleCheck className="w-5 h-5 text-[#5BB3B3] shrink-0 mt-0.5" />
                  <p className="text-[#A0B0BC] text-sm"><strong className="text-[#E8E0D5]">For the Consultant:</strong> A living, breathing reference library for rare anomalies, cutting-edge pathways, and continuous calibration.</p>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Core Principles */}
        <div className="mt-28">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-4">Our Teaching Doctrine</h2>
            <p className="text-[#A0B0BC] text-lg">We are committed to a rigorous, honest educational framework that respects the science of learning.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-3xl border border-white/5 bg-[#131E30]/30 p-8 hover:bg-[#131E30]/50 transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${v.color}15`, color: v.color }}
                >
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{v.title}</h3>
                <p className="text-sm text-[#A0B0BC] leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-32">
          <h2 className="text-3xl font-bold text-white mb-12">How we got here</h2>
          <div className="grid md:grid-cols-2 gap-y-12 gap-x-8">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative pl-6 border-l-2 border-[#5BB3B3]/20"
              >
                <div className="absolute w-3 h-3 bg-[#5BB3B3] rounded-full -left-[7px] top-1.5" />
                <span className="text-sm font-bold text-[#5BB3B3] tracking-widest uppercase block mb-2">{item.year}</span>
                <p className="text-[#A0B0BC] leading-relaxed">{item.event}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Join Us CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-24 rounded-3xl border border-[#5BB3B3]/20 bg-gradient-to-br from-[#5BB3B3]/10 to-transparent p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Build the community with us.</h2>
          <p className="text-lg text-[#A0B0BC] max-w-2xl mx-auto mb-8">
            This is an evolving, living campus. Whether you are prepping for Finals, writing your MCh papers, or just trying to understand basic pathology, there is a place for you in the Common Room.
          </p>
          <a
            href="/signup"
            className="inline-flex items-center rounded-xl bg-[#5BB3B3] px-8 py-4 text-lg font-bold text-[#0B1220] hover:bg-[#4A9E9E] transition-all shadow-lg hover:shadow-[#5BB3B3]/25"
          >
            Pull up a chair
          </a>
        </motion.div>
      </main>

      <SupportFooter />
    </div>
  );
}
