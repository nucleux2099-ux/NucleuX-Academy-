"use client"

import { useState } from "react"
import { Search, ChevronDown, ChevronUp, HelpCircle, BookOpen, Keyboard, Bug, Atom, Rocket } from "lucide-react"
import Link from "next/link"

const faqs = [
  { q: "How does ATOM work?", a: "ATOM is your AI tutor powered by advanced language models. It adapts to your learning style, asks Socratic questions, and helps you build deep understanding of medical concepts through conversation." },
  { q: "How are MCQs generated?", a: "MCQs are generated from your study material and standard medical textbooks. They adapt to your performance — focusing more on weak areas and gradually increasing difficulty as you improve." },
  { q: "What is the Desk?", a: "The Desk is your personal study workspace. It organizes your notes, bookmarks, and resources by subject. Think of it as your digital study table where everything is within reach." },
  { q: "How do Pathways work?", a: "Pathways are structured learning journeys through specific topics. Each pathway breaks down a subject into logical steps, mixing lectures, MCQs, and ATOM conversations for comprehensive understanding." },
  { q: "Is my data private?", a: "Absolutely. Your study data, notes, and conversations are encrypted and stored securely. We never share your personal information with third parties. You own your data." },
  { q: "How to contact support?", a: "You can reach us at support@nucleux.academy or use the 'Report a Bug' option below. Our team typically responds within 24 hours." },
  { q: "Can I study offline?", a: "Currently, NucleuX Academy requires an internet connection. Offline mode for notes and downloaded lectures is on our roadmap for future releases." },
  { q: "How do achievements work?", a: "Achievements are earned by hitting milestones — study streaks, MCQ counts, accuracy targets, and more. They gamify your learning journey and help track long-term progress." },
]

const quickLinks = [
  { icon: Rocket, label: "Getting Started", desc: "New here? Start with the basics" },
  { icon: Atom, label: "ATOM Guide", desc: "Master your AI tutor" },
  { icon: Keyboard, label: "Keyboard Shortcuts", desc: "Navigate like a pro" },
  { icon: Bug, label: "Report a Bug", desc: "Help us improve" },
]

export default function HelpPage() {
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState<number | null>(null)

  const filtered = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="ui-shell ui-page space-y-6">
      <div className="flex items-center gap-3">
        <HelpCircle className="w-6 h-6 text-[#7BA69E]" />
        <h1 className="text-2xl font-bold text-[#E8E0D5]">Help Center</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0B0BC]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="How can we help?" className="w-full bg-[#253545] border border-[#7BA69E]/20 rounded-xl pl-12 pr-4 py-3 text-[#E8E0D5] placeholder-[#A0B0BC] text-sm focus:outline-none focus:border-[#7BA69E]/50" />
      </div>

      <div className="bg-[#253545] rounded-xl border border-[#7BA69E]/20 divide-y divide-[#A0B0BC]/10">
        <div className="px-5 py-3"><h2 className="text-sm font-semibold text-[#A0B0BC] uppercase tracking-wider flex items-center gap-2"><BookOpen className="w-4 h-4" /> Frequently Asked Questions</h2></div>
        {filtered.map((f, i) => (
          <div key={i} className="px-5">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between py-4 text-left">
              <span className="text-sm text-[#E8E0D5] font-medium">{f.q}</span>
              {open === i ? <ChevronUp className="w-4 h-4 text-[#7BA69E]" /> : <ChevronDown className="w-4 h-4 text-[#A0B0BC]" />}
            </button>
            {open === i && <p className="text-sm text-[#A0B0BC] pb-4 leading-relaxed">{f.a}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map(l => (
          <div key={l.label} className="bg-[#253545] rounded-xl p-4 border border-[#7BA69E]/20 hover:border-[#7BA69E]/40 cursor-pointer transition-colors">
            <l.icon className="w-6 h-6 text-[#7BA69E] mb-3" />
            <p className="text-sm font-semibold text-[#E8E0D5]">{l.label}</p>
            <p className="text-xs text-[#A0B0BC] mt-1">{l.desc}</p>
          </div>
        ))}
      </div>

      <Link href="/chat" className="block bg-[#253545] rounded-xl p-5 border border-[#7BA69E]/20 hover:border-[#7BA69E]/40 transition-colors">
        <div className="flex items-center gap-3">
          <Atom className="w-8 h-8 text-[#7BA69E]" />
          <div>
            <p className="text-[#E8E0D5] font-semibold">Ask ATOM</p>
            <p className="text-sm text-[#A0B0BC]">Can&apos;t find what you need? Ask ATOM directly</p>
          </div>
        </div>
      </Link>

      <p className="text-center text-xs text-[#A0B0BC]/50">NucleuX Academy v0.1.0-beta</p>
    </div>
  )
}
