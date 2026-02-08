'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { DemoTour, useDemoTour } from '@/components/demo/DemoTour'

// ============================================
// DEMO DATA - Pre-seeded content
// ============================================

const DEMO_LIBRARIES = [
  { id: 'anatomy', name: 'Anatomy', icon: '🦴', color: 'cyan' },
  { id: 'physiology', name: 'Physiology', icon: '💓', color: 'rose' },
  { id: 'biochemistry', name: 'Biochemistry', icon: '🧪', color: 'amber' },
]

const DEMO_TOPICS: Record<string, { id: string; name: string; icon: string }[]> = {
  anatomy: [
    { id: 'brachial-plexus', name: 'Brachial Plexus', icon: '💪' },
    { id: 'heart-anatomy', name: 'Heart Anatomy', icon: '❤️' },
    { id: 'gi-tract', name: 'GI Tract Overview', icon: '🫁' },
  ],
  physiology: [
    { id: 'cardiac-cycle', name: 'Cardiac Cycle', icon: '💗' },
    { id: 'action-potential', name: 'Action Potential', icon: '⚡' },
    { id: 'renal-function', name: 'Renal Function', icon: '🫘' },
  ],
  biochemistry: [
    { id: 'glycolysis', name: 'Glycolysis', icon: '🔥' },
    { id: 'krebs-cycle', name: 'Krebs Cycle', icon: '🔄' },
    { id: 'protein-synthesis', name: 'Protein Synthesis', icon: '🧬' },
  ],
}

const DEMO_MODES = [
  { id: 'learn', name: 'Learn', icon: '📖', desc: 'Deep understanding' },
  { id: 'quiz', name: 'Quiz', icon: '❓', desc: 'Test yourself' },
  { id: 'flashcard', name: 'Flashcards', icon: '🎴', desc: 'Quick recall' },
  { id: 'case', name: 'Case Study', icon: '🏥', desc: 'Clinical scenarios' },
]

// Pre-seeded AI conversations per topic
const DEMO_CONVERSATIONS: Record<string, { role: 'user' | 'atom'; content: string }[]> = {
  'brachial-plexus': [
    { role: 'atom', content: "Welcome! 🧬 I see you've selected **Brachial Plexus**. This is a fascinating network of nerves!\n\nWould you like me to:\n• Explain the basic structure\n• Walk through a mnemonic\n• Test your knowledge with a quick question\n\nWhat sounds good?" },
  ],
  'cardiac-cycle': [
    { role: 'atom', content: "Great choice! 💗 The **Cardiac Cycle** is the heartbeat of physiology (pun intended).\n\nI can help you understand:\n• The phases (systole/diastole)\n• Pressure-volume relationships\n• The Wiggers diagram\n\nWhere should we start?" },
  ],
  'glycolysis': [
    { role: 'atom', content: "Excellent! 🔥 **Glycolysis** — the ancient pathway that every cell uses.\n\n10 reactions, but don't worry — we'll break it into atoms:\n• Investment phase (ATP in)\n• Payoff phase (ATP out)\n• Key regulatory enzymes\n\nReady to dive in?" },
  ],
}

// Pre-seeded responses to common questions
const DEMO_RESPONSES: Record<string, { trigger: string[]; response: string }[]> = {
  'brachial-plexus': [
    {
      trigger: ['explain', 'structure', 'basic', 'what is'],
      response: "Let's break down the **Brachial Plexus** into atomic concepts:\n\n🔹 **What is it?** A network of nerves (C5-T1) that controls your upper limb\n\n🔹 **The Pattern:** Roots → Trunks → Divisions → Cords → Branches\n\n🔹 **Memory trick:** \"**R**obert **T**aylor **D**rinks **C**old **B**eer\" 🍺\n\n```\nC5 ─┐\nC6 ─┼─ Upper Trunk\nC7 ─── Middle Trunk\nC8 ─┼─ Lower Trunk  \nT1 ─┘\n```\n\n🤔 **Quick check:** Can you tell me which roots form the upper trunk?"
    },
    {
      trigger: ['mnemonic', 'remember', 'memory'],
      response: "Here are the **atomic mnemonics** for Brachial Plexus:\n\n**Order:** \"**R**obert **T**aylor **D**rinks **C**old **B**eer\"\n→ Roots, Trunks, Divisions, Cords, Branches\n\n**Cord positions:** Think of a traffic light 🚦\n• **L**ateral = **L**eft of artery\n• **M**edial = **M**iddle (behind)\n• **P**osterior = **P**osterior\n\n**Terminal branches:** \"**M**y **A**unt **R**aised **M**y **U**ncle\"\n→ Musculocutaneous, Axillary, Radial, Median, Ulnar\n\nWhich one would you like me to expand on?"
    },
    {
      trigger: ['c5', 'c6', 'upper trunk', 'roots'],
      response: "Correct thinking! ✅\n\n**Upper Trunk = C5 + C6**\n\nThis is clinically important because:\n\n🏥 **Erb-Duchenne Palsy** (waiter's tip position)\n• Caused by upper trunk injury\n• Usually birth trauma or motorcycle accidents\n• Affects: shoulder abduction, elbow flexion, forearm supination\n• Classic sign: arm hangs limp, internally rotated\n\n💡 **Atomic insight:** The upper trunk gives rise to the **suprascapular nerve** — that's why shoulder problems are so common in these injuries.\n\nWant to explore the clinical correlations more, or move to middle/lower trunks?"
    },
  ],
  'cardiac-cycle': [
    {
      trigger: ['phases', 'systole', 'diastole', 'start', 'begin'],
      response: "The **Cardiac Cycle** in atomic steps:\n\n**DIASTOLE** (Relaxation = Filling) 💙\n1. **Isovolumetric relaxation** — all valves closed, pressure drops\n2. **Rapid filling** — AV valves open, blood rushes in\n3. **Diastasis** — slow filling\n4. **Atrial kick** — atria contract, tops off ventricles (+20%)\n\n**SYSTOLE** (Contraction = Ejection) ❤️\n1. **Isovolumetric contraction** — all valves closed, pressure builds\n2. **Rapid ejection** — aortic/pulmonary valves open\n3. **Reduced ejection** — momentum carries blood out\n\n⏱️ At 75 bpm: Systole ≈ 0.3s, Diastole ≈ 0.5s\n\n🤔 **Think about it:** Why is diastole longer, and why does this matter clinically?"
    },
  ],
  'glycolysis': [
    {
      trigger: ['steps', 'reactions', 'pathway', 'start', 'explain'],
      response: "**Glycolysis** — 10 steps, 2 phases, infinite clinical relevance!\n\n**📉 INVESTMENT PHASE (Steps 1-5)**\n```\nGlucose → G6P → F6P → F1,6BP → DHAP + G3P\n         (-ATP)      (-ATP)\n```\nYou SPEND 2 ATP to destabilize glucose\n\n**📈 PAYOFF PHASE (Steps 6-10)**\n```\nG3P → 1,3BPG → 3PG → 2PG → PEP → Pyruvate\n      (+ATP)              (+ATP)\n```\nYou EARN 4 ATP + 2 NADH (×2 because 2 G3P!)\n\n**Net:** 2 ATP + 2 NADH + 2 Pyruvate\n\n🎯 **Rate-limiting enzyme:** PFK-1 (Step 3)\n\nWant me to go deeper on regulation, or connect this to clinical conditions?"
    },
  ],
}

const DEFAULT_RESPONSE = "That's a great question! 🧬\n\nIn the full version of ATOM, I'd give you a detailed, personalized response with:\n• Step-by-step explanations\n• Visual diagrams\n• Related clinical pearls\n• Practice questions\n\n**This is just a demo** — sign up to unlock the full learning experience!\n\n[🚀 Start Learning Free →](/login)"

// ============================================
// COMPONENTS
// ============================================

function LibrarySelector({ 
  selected, 
  onSelect 
}: { 
  selected: string
  onSelect: (id: string) => void 
}) {
  return (
    <div className="space-y-2" data-tour="library-selector">
      <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">📚 Library</div>
      {DEMO_LIBRARIES.map((lib) => (
        <button
          key={lib.id}
          onClick={() => onSelect(lib.id)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
            selected === lib.id
              ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
              : 'bg-white/5 border border-transparent hover:bg-white/10 text-slate-300'
          }`}
        >
          <span className="text-xl">{lib.icon}</span>
          <span className="font-medium">{lib.name}</span>
        </button>
      ))}
    </div>
  )
}

function TopicSelector({ 
  library, 
  selected, 
  onSelect 
}: { 
  library: string
  selected: string | null
  onSelect: (id: string) => void 
}) {
  const topics = DEMO_TOPICS[library] || []
  
  return (
    <div className="space-y-2" data-tour="topic-selector">
      <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">📑 Topics</div>
      {topics.map((topic) => (
        <button
          key={topic.id}
          onClick={() => onSelect(topic.id)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left text-sm ${
            selected === topic.id
              ? 'bg-white/10 border border-white/20 text-white'
              : 'bg-transparent hover:bg-white/5 text-slate-400'
          }`}
        >
          <span>{topic.icon}</span>
          <span>{topic.name}</span>
        </button>
      ))}
    </div>
  )
}

function ModeSelector({ 
  selected, 
  onSelect 
}: { 
  selected: string
  onSelect: (id: string) => void 
}) {
  return (
    <div className="flex gap-2 flex-wrap" data-tour="mode-selector">
      {DEMO_MODES.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onSelect(mode.id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
            selected === mode.id
              ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
              : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
          }`}
        >
          <span>{mode.icon}</span>
          <span>{mode.name}</span>
        </button>
      ))}
    </div>
  )
}

interface Message {
  role: 'user' | 'atom'
  content: string
}

function ChatMessage({ message }: { message: Message }) {
  const isAtom = message.role === 'atom'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isAtom ? '' : 'flex-row-reverse'}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isAtom ? 'bg-cyan-600' : 'bg-slate-700'
      }`}>
        {isAtom ? '🧬' : '👤'}
      </div>
      <div className={`flex-1 max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
        isAtom 
          ? 'bg-cyan-500/10 border border-cyan-500/30 rounded-tl-none text-slate-200' 
          : 'bg-white/10 rounded-tr-none text-slate-200'
      }`}>
        {message.content.split('\n').map((line, i) => {
          // Simple markdown-ish rendering
          if (line.startsWith('```')) return null
          if (line.startsWith('• ')) {
            return <div key={i} className="ml-2">{line}</div>
          }
          // Bold text
          const parts = line.split(/(\*\*.*?\*\*)/g)
          return (
            <div key={i} className={line === '' ? 'h-2' : ''}>
              {parts.map((part, j) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={j} className="text-white">{part.slice(2, -2)}</strong>
                }
                return <span key={j}>{part}</span>
              })}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ============================================
// MAIN DEMO PAGE
// ============================================

export default function DemoPage() {
  const [library, setLibrary] = useState('anatomy')
  const [topic, setTopic] = useState<string | null>('brachial-plexus')
  const [mode, setMode] = useState('learn')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [questionsUsed, setQuestionsUsed] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Tour state
  const { showTour, hasSeenTour, completeTour, skipTour, restartTour } = useDemoTour()
  
  const MAX_QUESTIONS = 5

  // Initialize conversation when topic changes
  useEffect(() => {
    if (topic && DEMO_CONVERSATIONS[topic]) {
      setMessages(DEMO_CONVERSATIONS[topic])
    } else if (topic) {
      setMessages([{
        role: 'atom',
        content: `Welcome! 🧬 You've selected a topic. In the full ATOM experience, I'd have comprehensive content here.\n\nTry asking me something, or switch to a featured topic like **Brachial Plexus**, **Cardiac Cycle**, or **Glycolysis** for the full demo experience!`
      }])
    }
  }, [topic])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const findResponse = (userInput: string): string => {
    if (!topic) return DEFAULT_RESPONSE
    
    const topicResponses = DEMO_RESPONSES[topic]
    if (!topicResponses) return DEFAULT_RESPONSE
    
    const lowerInput = userInput.toLowerCase()
    for (const resp of topicResponses) {
      if (resp.trigger.some(t => lowerInput.includes(t))) {
        return resp.response
      }
    }
    return DEFAULT_RESPONSE
  }

  const handleSend = () => {
    if (!input.trim() || questionsUsed >= MAX_QUESTIONS) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setQuestionsUsed(prev => prev + 1)
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(() => {
      const response = findResponse(userMessage)
      setMessages(prev => [...prev, { role: 'atom', content: response }])
      setIsTyping(false)
    }, 800 + Math.random() * 700)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Guided Tour */}
      {showTour && (
        <DemoTour onComplete={completeTour} onSkip={skipTour} />
      )}
      
      {/* Header */}
      <header className="border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/landing" className="flex items-center gap-2">
              <span className="text-2xl">🧬</span>
              <span className="text-lg font-bold text-white">ATOM</span>
            </Link>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
              DEMO MODE
            </span>
          </div>
          <div className="flex items-center gap-3">
            {hasSeenTour && (
              <button
                onClick={restartTour}
                className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
              >
                🎯 Restart Tour
              </button>
            )}
            <span className="text-sm text-slate-400">
              {MAX_QUESTIONS - questionsUsed} questions left
            </span>
            <Link 
              href="/login"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Sign Up Free →
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex h-[calc(100vh-57px)]">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 p-4 flex flex-col gap-6 overflow-y-auto">
          <LibrarySelector selected={library} onSelect={(id) => {
            setLibrary(id)
            setTopic(null)
            setMessages([])
          }} />
          
          <TopicSelector 
            library={library} 
            selected={topic} 
            onSelect={setTopic} 
          />

          {/* Demo Limitations Notice */}
          <div className="mt-auto p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="text-amber-400 text-xs font-medium mb-1">⚡ Demo Limits</div>
            <div className="text-slate-400 text-xs">
              • 3 sample subjects<br/>
              • 5 questions max<br/>
              • Pre-loaded responses
            </div>
            <Link href="/login" className="text-cyan-400 text-xs hover:underline mt-2 block">
              Unlock unlimited →
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Mode Selector */}
          <div className="p-4 border-b border-white/10">
            <ModeSelector selected={mode} onSelect={setMode} />
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" data-tour="chat-area">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} />
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center">
                  🧬
                </div>
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10">
            {questionsUsed >= MAX_QUESTIONS ? (
              <div className="text-center py-4">
                <div className="text-slate-400 mb-3">You've used all 5 demo questions! 🎉</div>
                <Link 
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-cyan-500/25"
                >
                  🚀 Continue with Full Access
                </Link>
              </div>
            ) : (
              <div className="flex gap-3" data-tour="chat-input">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={topic ? "Ask ATOM anything..." : "Select a topic first..."}
                  disabled={!topic}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || !topic}
                  className="px-4 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
