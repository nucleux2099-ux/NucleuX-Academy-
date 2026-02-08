"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Atom,
  X,
  Send,
  Sparkles,
  BookOpen,
  Brain,
  Clock,
  Target,
  ChevronRight,
  Lightbulb,
  GraduationCap,
  Zap,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LibraryTopic } from "@/lib/types/library";

// =============================================================================
// TYPES
// =============================================================================

interface AtomMessage {
  id: string;
  role: 'user' | 'atom';
  content: string;
  suggestions?: TopicSuggestion[];
  timestamp: Date;
}

interface TopicSuggestion {
  topicId: string;
  topicName: string;
  reason: string;
  url: string;
}

interface AtomLibrarianProps {
  currentTopic?: LibraryTopic;
  allTopics?: LibraryTopic[];
  completedTopics?: string[];
  userLevel?: 'ug' | 'pg' | 'resident';
}

// =============================================================================
// QUICK ACTION BUTTONS
// =============================================================================

const quickActions = [
  {
    id: 'next',
    label: 'What\'s next?',
    icon: ChevronRight,
    prompt: 'What should I study next?',
  },
  {
    id: 'quiz',
    label: 'Quiz me',
    icon: Brain,
    prompt: 'Quiz me on this topic',
  },
  {
    id: 'explain',
    label: 'Explain simply',
    icon: Lightbulb,
    prompt: 'Explain this topic in simple terms',
  },
  {
    id: 'time',
    label: '20 min session',
    icon: Clock,
    prompt: 'I have 20 minutes. What can I cover?',
  },
];

// =============================================================================
// ATOM WIDGET (FLOATING BUTTON)
// =============================================================================

export function AtomWidget({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50 group",
        "w-14 h-14 rounded-full",
        "bg-gradient-to-br from-[#06B6D4] to-[#8B5CF6]",
        "shadow-lg shadow-[rgba(6,182,212,0.3)]",
        "flex items-center justify-center",
        "transition-all duration-300",
        "hover:scale-110 hover:shadow-xl hover:shadow-[rgba(6,182,212,0.4)]",
        isOpen && "rotate-90 scale-90"
      )}
    >
      {/* Pulse animation */}
      <div className="absolute inset-0 rounded-full bg-[#06B6D4] animate-ping opacity-20" />
      
      {/* Icon */}
      <Atom className={cn(
        "w-7 h-7 text-white transition-transform duration-300",
        isOpen ? "rotate-90" : "group-hover:rotate-12"
      )} />
      
      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute right-full mr-3 px-3 py-1.5 bg-[#0D1B2A] text-[#E5E7EB] text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[rgba(6,182,212,0.2)]">
          Ask ATOM
        </div>
      )}
    </button>
  );
}

// =============================================================================
// ATOM CHAT PANEL
// =============================================================================

export function AtomChatPanel({ 
  isOpen, 
  onClose,
  currentTopic,
  allTopics = [],
  completedTopics = [],
  userLevel = 'pg'
}: AtomLibrarianProps & { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<AtomMessage[]>([
    {
      id: '1',
      role: 'atom',
      content: `Hey! I'm ATOM, your study companion. 🧬\n\nI know every topic in the library. Ask me anything — what to study next, explain concepts, quiz you, or help plan your session.`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate ATOM response (simulated for now)
  const generateResponse = async (userMessage: string): Promise<AtomMessage> => {
    const lowerMsg = userMessage.toLowerCase();
    
    // What's next / suggestions
    if (lowerMsg.includes('next') || lowerMsg.includes('should i study') || lowerMsg.includes('suggest')) {
      const suggestions = getNextTopicSuggestions(currentTopic, allTopics, completedTopics);
      return {
        id: Date.now().toString(),
        role: 'atom',
        content: currentTopic 
          ? `Based on your progress with **${currentTopic.name}**, here are my suggestions:`
          : `Here are some topics to get you started:`,
        suggestions,
        timestamp: new Date(),
      };
    }
    
    // Quiz request
    if (lowerMsg.includes('quiz') || lowerMsg.includes('test me')) {
      return {
        id: Date.now().toString(),
        role: 'atom',
        content: currentTopic
          ? `Ready to test yourself on **${currentTopic.name}**? 🧪\n\nSwitch to **Quiz Mode** using the view mode selector above, or ask me specific questions!\n\nQuick question: *${currentTopic.content.retrievalCards?.[0]?.question || 'What are the key features of this condition?'}*`
          : `Pick a topic first, then I can quiz you! Head to the Library and select something interesting.`,
        timestamp: new Date(),
      };
    }
    
    // Explain simply
    if (lowerMsg.includes('explain') || lowerMsg.includes('simple') || lowerMsg.includes('eli5')) {
      return {
        id: Date.now().toString(),
        role: 'atom',
        content: currentTopic
          ? `**${currentTopic.name}** in simple terms:\n\n${currentTopic.content.keyPoints.slice(0, 3).map(p => `• ${p}`).join('\n')}\n\n💡 *Think of it this way:* ${getSimpleAnalogy(currentTopic.name)}`
          : `Tell me which topic you'd like me to explain! I can break down any concept into bite-sized pieces.`,
        timestamp: new Date(),
      };
    }
    
    // Time-based study
    if (lowerMsg.includes('minute') || lowerMsg.includes('time') || lowerMsg.includes('quick')) {
      const quickTopics = allTopics
        .filter(t => t.estimatedMinutes <= 20)
        .slice(0, 3);
      return {
        id: Date.now().toString(),
        role: 'atom',
        content: `⏱️ **Quick Study Session**\n\nHere's what you can cover in 20 minutes:\n\n${quickTopics.map(t => `• **${t.name}** (${t.estimatedMinutes} min)`).join('\n')}\n\nOr switch to **Exam Prep** mode for any topic — it's optimized for quick review!`,
        timestamp: new Date(),
      };
    }
    
    // High yield
    if (lowerMsg.includes('high yield') || lowerMsg.includes('important') || lowerMsg.includes('exam')) {
      const highYieldTopics = allTopics.filter(t => t.highYield).slice(0, 5);
      return {
        id: Date.now().toString(),
        role: 'atom',
        content: `🎯 **High Yield Topics**\n\nThese are most likely to appear in exams:\n\n${highYieldTopics.map(t => `• **${t.name}** — ${t.description || 'Key topic'}`).join('\n')}\n\nUse **Exam Prep** mode for mnemonics and quick facts!`,
        timestamp: new Date(),
      };
    }
    
    // Default response
    return {
      id: Date.now().toString(),
      role: 'atom',
      content: `Great question! 🤔\n\nI'm still learning to answer that better. Try asking me:\n• "What should I study next?"\n• "Quiz me on this topic"\n• "Explain in simple terms"\n• "I have 20 minutes"\n\nOr explore the **Library** and I'll help you navigate!`,
      timestamp: new Date(),
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: AtomMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const response = await generateResponse(input);
    setIsTyping(false);
    setMessages(prev => [...prev, response]);
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
    // Trigger send after a brief delay for UX
    setTimeout(() => {
      const fakeEvent = { target: { value: prompt } };
      handleSend();
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[600px] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <Card className="bg-[#0D1B2A] border-[rgba(6,182,212,0.3)] shadow-2xl shadow-[rgba(6,182,212,0.1)] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Atom className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">ATOM</h3>
                <p className="text-xs text-white/80">Your Study Companion</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          
          {/* Current context */}
          {currentTopic && (
            <div className="mt-3 p-2 bg-white/10 rounded-lg">
              <p className="text-xs text-white/70">Currently viewing:</p>
              <p className="text-sm text-white font-medium truncate">{currentTopic.name}</p>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="h-[320px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#374151] scrollbar-track-transparent">
          {messages.map((msg) => (
            <div key={msg.id} className={cn(
              "flex",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}>
              <div className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3",
                msg.role === 'user' 
                  ? "bg-[#06B6D4] text-white rounded-br-sm" 
                  : "bg-[#142538] text-[#E5E7EB] rounded-bl-sm border border-[rgba(6,182,212,0.1)]"
              )}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                
                {/* Topic Suggestions */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.suggestions.map((sug) => (
                      <a
                        key={sug.topicId}
                        href={sug.url}
                        className="block p-2 bg-[#0D1B2A] rounded-lg hover:bg-[rgba(6,182,212,0.1)] transition-colors border border-[rgba(6,182,212,0.1)]"
                      >
                        <p className="text-sm font-medium text-[#06B6D4]">{sug.topicName}</p>
                        <p className="text-xs text-[#9CA3AF] mt-0.5">{sug.reason}</p>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#142538] rounded-2xl rounded-bl-sm px-4 py-3 border border-[rgba(6,182,212,0.1)]">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[#06B6D4] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-[#06B6D4] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-[#06B6D4] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2 border-t border-[rgba(6,182,212,0.1)]">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.prompt)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#142538] hover:bg-[rgba(6,182,212,0.1)] rounded-full text-xs text-[#9CA3AF] hover:text-[#06B6D4] transition-colors whitespace-nowrap border border-[rgba(6,182,212,0.1)]"
              >
                <action.icon className="w-3.5 h-3.5" />
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[rgba(6,182,212,0.1)]">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask ATOM anything..."
              className="flex-1 bg-[#142538] border-[rgba(6,182,212,0.2)] focus:border-[#06B6D4] text-[#E5E7EB] placeholder:text-[#6B7280]"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-[#06B6D4] hover:bg-[#0891B2] text-[#0D1B2A]"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getNextTopicSuggestions(
  currentTopic: LibraryTopic | undefined,
  allTopics: LibraryTopic[],
  completedTopics: string[]
): TopicSuggestion[] {
  if (!currentTopic) {
    // Suggest starter topics
    return allTopics
      .filter(t => t.prerequisites.length === 0)
      .slice(0, 3)
      .map(t => ({
        topicId: t.id,
        topicName: t.name,
        reason: 'Great starting point — no prerequisites',
        url: `/library/surgery/esophagus/${t.slug}`,
      }));
  }

  // Find related topics
  const suggestions: TopicSuggestion[] = [];
  
  // Add related topics
  currentTopic.relatedTopics.forEach(relatedId => {
    const topic = allTopics.find(t => t.id === relatedId);
    if (topic && !completedTopics.includes(relatedId)) {
      suggestions.push({
        topicId: topic.id,
        topicName: topic.name,
        reason: `Related to ${currentTopic.name}`,
        url: `/library/surgery/esophagus/${topic.slug}`,
      });
    }
  });

  // Add topics that have current as prerequisite
  allTopics.forEach(topic => {
    if (topic.prerequisites.includes(currentTopic.id) && !completedTopics.includes(topic.id)) {
      suggestions.push({
        topicId: topic.id,
        topicName: topic.name,
        reason: `Builds on ${currentTopic.name}`,
        url: `/library/surgery/esophagus/${topic.slug}`,
      });
    }
  });

  return suggestions.slice(0, 3);
}

function getSimpleAnalogy(topicName: string): string {
  const analogies: Record<string, string> = {
    'Achalasia Cardia': 'Imagine a door that won\'t open properly — food gets stuck because the "doorway" (LES) forgot how to relax.',
    'GERD': 'Think of a one-way valve that\'s become leaky — stomach acid keeps flowing back up where it shouldn\'t.',
    'Esophageal Anatomy': 'The esophagus is like a 25cm muscular tube with no protective coating — that\'s why it\'s delicate in surgery!',
  };
  return analogies[topicName] || 'Understanding the basics helps everything else make sense!';
}

// =============================================================================
// MAIN COMPONENT (COMBINES WIDGET + PANEL)
// =============================================================================

export function AtomLibrarian(props: AtomLibrarianProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AtomWidget onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
      <AtomChatPanel 
        {...props} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}
