'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Feature Card Component
function FeatureCard({ 
  icon, 
  title, 
  description, 
  gradient 
}: { 
  icon: string
  title: string
  description: string
  gradient: string
}) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`relative p-6 rounded-2xl bg-gradient-to-br ${gradient} border border-white/10 backdrop-blur-sm overflow-hidden group`}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-300 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

// Step Component for How It Works
function Step({ 
  number, 
  title, 
  description, 
  icon 
}: { 
  number: number
  title: string
  description: string
  icon: string
}) {
  return (
    <motion.div 
      variants={fadeInUp}
      className="flex items-start gap-4"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold">
        {number}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{icon}</span>
          <h4 className="text-lg font-semibold text-white">{title}</h4>
        </div>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
    </motion.div>
  )
}

// Main Landing Page
export default function LandingPage() {
  const [email, setEmail] = useState('')

  const features = [
    {
      icon: '📚',
      title: 'Smart Libraries',
      description: 'Switch between Anatomy, Physiology, Surgery, and 20+ medical subjects instantly. Your entire curriculum at your fingertips.',
      gradient: 'from-blue-900/50 to-blue-950/50'
    },
    {
      icon: '🎯',
      title: 'Adaptive Modes',
      description: 'Learn, Quiz, Flashcard, Deep Dive, Case Study — choose how you learn. ATOM adapts to your style.',
      gradient: 'from-purple-900/50 to-purple-950/50'
    },
    {
      icon: '📎',
      title: 'Universal Attachments',
      description: 'Upload PDFs, Excel sheets, PowerPoints, Images, JSON — ATOM understands them all and learns from your materials.',
      gradient: 'from-emerald-900/50 to-emerald-950/50'
    },
    {
      icon: '💬',
      title: 'Socratic AI Teaching',
      description: 'Ask anything, get teaching that builds real understanding. Not answers — comprehension.',
      gradient: 'from-orange-900/50 to-orange-950/50'
    }
  ]

  const steps = [
    { icon: '📖', title: 'Choose Your Subject', description: 'Select from our comprehensive medical library' },
    { icon: '🎮', title: 'Pick Your Mode', description: 'Learn, Quiz, Flashcards, or Deep Dive' },
    { icon: '📤', title: 'Attach Your Materials', description: 'Upload notes, textbooks, or lecture slides' },
    { icon: '🚀', title: 'Start Learning', description: 'Experience AI-powered medical education' }
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-cyan-500/5 to-transparent rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🧬</span>
          <span className="text-xl font-bold text-white">ATOM</span>
          <span className="text-xs text-slate-500 hidden sm:inline">by NucleuX Academy</span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-slate-300 hover:text-white transition-colors text-sm"
          >
            Sign In
          </Link>
          <Link 
            href="/login"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-16 pb-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-8"
          >
            <span className="text-cyan-400 text-sm font-medium">✨ Atomic Teaching & Optimization Model</span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Learn Medicine{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Like Never Before
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Transform complex medical concepts into atomic units of understanding. 
            AI-powered learning that adapts to you, not the other way around.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
            >
              🎮 Try Interactive Demo
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white rounded-xl font-semibold text-lg transition-all"
            >
              🚀 Start Learning Free
            </Link>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-16 text-center"
          >
            <div>
              <div className="text-3xl font-bold text-white">1000+</div>
              <div className="text-slate-500 text-sm">Medical Topics</div>
            </div>
            <div className="w-px h-12 bg-slate-700 hidden sm:block" />
            <div>
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-slate-500 text-sm">Textbook References</div>
            </div>
            <div className="w-px h-12 bg-slate-700 hidden sm:block" />
            <div>
              <div className="text-3xl font-bold text-white">∞</div>
              <div className="text-slate-500 text-sm">Learning Possibilities</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            ATOM combines the power of AI with proven learning science to help you master medicine.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            How ATOM Works
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Four simple steps to transform your medical learning experience.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <Step key={index} number={index + 1} {...step} />
          ))}
        </motion.div>
      </section>

      {/* Demo Preview Section */}
      <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900/50 backdrop-blur-sm"
        >
          {/* Mock Interface */}
          <div className="p-4 border-b border-white/10 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
            <span className="ml-4 text-slate-500 text-sm">ATOM Learning Interface</span>
          </div>
          
          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Library */}
            <div className="space-y-4">
              <div className="text-sm text-slate-500 mb-2">📚 Current Library</div>
              <div className="p-3 bg-cyan-500/20 border border-cyan-500/50 rounded-lg text-cyan-400 font-medium">
                Anatomy - Upper Limb
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-slate-400">
                Physiology - CVS
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-slate-400">
                Surgery - GI
              </div>
            </div>

            {/* Center Panel - Chat */}
            <div className="lg:col-span-2 space-y-4">
              <div className="text-sm text-slate-500 mb-2">💬 Learning Conversation</div>
              
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm">👤</div>
                <div className="flex-1 p-3 bg-white/5 rounded-lg rounded-tl-none text-slate-300 text-sm">
                  Explain the brachial plexus in a simple way
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-sm">🧬</div>
                <div className="flex-1 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg rounded-tl-none text-slate-300 text-sm">
                  <p className="mb-2">Great question! Let's break down the brachial plexus into atomic concepts:</p>
                  <p className="mb-2">🔹 <strong>What is it?</strong> A network of nerves from C5-T1</p>
                  <p className="mb-2">🔹 <strong>Think of it as:</strong> Roots → Trunks → Divisions → Cords → Branches</p>
                  <p>🤔 <strong>Quick check:</strong> Can you tell me what "RTDCB" stands for?</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                <span className="text-slate-500">💭</span>
                <span className="text-slate-400 text-sm">Type your answer...</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center p-12 rounded-2xl bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Join thousands of medical students who are learning smarter, not harder.
          </p>

          {/* Email Signup */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button className="w-full sm:w-auto px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors whitespace-nowrap">
              Join Waitlist
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧬</span>
            <span className="text-white font-semibold">ATOM</span>
            <span className="text-slate-500 text-sm">by NucleuX Academy</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <div className="text-slate-500 text-sm">
            © 2026 NucleuX Academy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
