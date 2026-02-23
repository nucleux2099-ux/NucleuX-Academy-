"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Atom,
  X,
  Send,


  Brain,
  Clock,

  ChevronRight,
  Lightbulb,



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
        "bg-gradient-to-br from-[#5BB3B3] to-[#8B5CF6]",
        "shadow-lg shadow-[rgba(91,179,179,0.3)]",
        "flex items-center justify-center",
        "transition-all duration-300",
        "hover:scale-110 hover:shadow-xl hover:shadow-[rgba(91,179,179,0.4)]",
        isOpen && "rotate-90 scale-90"
      )}
    >
      {/* Pulse animation */}
      <div className="absolute inset-0 rounded-full bg-[#5BB3B3] animate-ping opacity-20" />
      
      {/* Icon */}
      <Atom className={cn(
        "w-7 h-7 text-white transition-transform duration-300",
        isOpen ? "rotate-90" : "group-hover:rotate-12"
      )} />
      
      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute right-full mr-3 px-3 py-1.5 bg-[#2D3E50] text-[#E8E0D5] text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[rgba(91,179,179,0.2)]">
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
  userLevel: _userLevel = 'pg'
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
  const messageCounterRef = useRef(1);

  const nextMessageId = () => {
    messageCounterRef.current += 1;
    return messageCounterRef.current.toString();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if message warrants client-side topic suggestions
  const getTopicSuggestions = (userMessage: string): TopicSuggestion[] | undefined => {
    const lowerMsg = userMessage.toLowerCase();
    if (lowerMsg.includes('next') || lowerMsg.includes('should i study') || lowerMsg.includes('suggest')) {
      return getNextTopicSuggestions(currentTopic, allTopics, completedTopics);
    }
    return undefined;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: AtomMessage = {
      id: nextMessageId(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    const currentInput = input;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Build context string for the API
    const topicContext = currentTopic
      ? `Currently viewing: ${currentTopic.name}${currentTopic.subjectId ? ` (${currentTopic.subjectId})` : ''}`
      : undefined;

    // Build messages array for API (convert atom -> assistant)
    const apiMessages = [...messages, userMessage]
      .filter(m => m.role === 'user' || m.role === 'atom')
      .map(m => ({
        role: m.role === 'atom' ? 'assistant' as const : 'user' as const,
        content: m.content,
      }));

    // Check for topic suggestions (client-side)
    const suggestions = getTopicSuggestions(currentInput);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          context: currentTopic?.subjectId || 'surgery',
          topic: topicContext,
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      // Handle SSE streaming
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullText = '';
      const responseId = nextMessageId();

      setIsTyping(false);
      // Add empty message that we'll stream into
      setMessages(prev => [...prev, {
        id: responseId,
        role: 'atom',
        content: '',
        suggestions,
        timestamp: new Date(),
      }]);

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              fullText += parsed.text;
              setMessages(prev => prev.map(m =>
                m.id === responseId ? { ...m, content: fullText } : m
              ));
            }
          } catch {
            // skip malformed chunks
          }
        }
      }
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: nextMessageId(),
        role: 'atom',
        content: `Sorry, I couldn't process that request. ${error instanceof Error ? error.message : 'Please try again.'}`,
        timestamp: new Date(),
      }]);
    }
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
    // Trigger send after a brief delay for UX
    setTimeout(() => {
      const _fakeEvent = { target: { value: prompt } };
      handleSend();
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[600px] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <Card className="bg-[#2D3E50] border-[rgba(91,179,179,0.3)] shadow-2xl shadow-[rgba(91,179,179,0.1)] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5BB3B3] to-[#8B5CF6] p-4">
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
                  ? "bg-[#5BB3B3] text-white rounded-br-sm" 
                  : "bg-[#3A4D5F] text-[#E8E0D5] rounded-bl-sm border border-[rgba(91,179,179,0.1)]"
              )}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                
                {/* Topic Suggestions */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.suggestions.map((sug) => (
                      <a
                        key={sug.topicId}
                        href={sug.url}
                        className="block p-2 bg-[#2D3E50] rounded-lg hover:bg-[rgba(91,179,179,0.1)] transition-colors border border-[rgba(91,179,179,0.1)]"
                      >
                        <p className="text-sm font-medium text-[#5BB3B3]">{sug.topicName}</p>
                        <p className="text-xs text-[#A0B0BC] mt-0.5">{sug.reason}</p>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#3A4D5F] rounded-2xl rounded-bl-sm px-4 py-3 border border-[rgba(91,179,179,0.1)]">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[#5BB3B3] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-[#5BB3B3] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-[#5BB3B3] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2 border-t border-[rgba(91,179,179,0.1)]">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.prompt)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3A4D5F] hover:bg-[rgba(91,179,179,0.1)] rounded-full text-xs text-[#A0B0BC] hover:text-[#5BB3B3] transition-colors whitespace-nowrap border border-[rgba(91,179,179,0.1)]"
              >
                <action.icon className="w-3.5 h-3.5" />
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[rgba(91,179,179,0.1)]">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask ATOM anything..."
              className="flex-1 bg-[#3A4D5F] border-[rgba(91,179,179,0.2)] focus:border-[#5BB3B3] text-[#E8E0D5] placeholder:text-[#6B7280]"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-[#5BB3B3] hover:bg-[#4A9E9E] text-[#2D3E50]"
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
      .filter(t => (t.prerequisites?.length ?? 0) === 0)
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
  (currentTopic.relatedTopics ?? []).forEach(relatedId => {
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
    if ((topic.prerequisites ?? []).includes(currentTopic.id) && !completedTopics.includes(topic.id)) {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
