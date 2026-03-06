"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Send, Sparkles, ArrowRight } from "lucide-react";

// Room-specific ATOM modes with dark matte theme colors
const atomModes: Record<string, {
  mode: string;
  icon: string;
  greeting: string;
  color: string;
  bgColor: string;
  suggestions: string[];
}> = {
  '/dashboard': {
    mode: 'Study Coach',
    icon: '📊',
    greeting: "Ready to optimize your study plan?",
    color: '#5BB3B3',
    bgColor: 'rgba(91, 179, 179, 0.1)',
    suggestions: ["Review my weak areas", "Plan today's study session", "Check my progress"],
  },
  '/library': {
    mode: 'Research Assistant',
    icon: '📚',
    greeting: "Need help finding connections between topics?",
    color: '#5BB3B3',
    bgColor: 'rgba(91, 179, 179, 0.1)',
    suggestions: ["Find related topics", "Explain this chapter", "Cross-reference sources"],
  },
  '/classroom': {
    mode: 'Lecture Companion',
    icon: '🎓',
    greeting: "I'm watching with you! Ask about any concept.",
    color: '#5BB3B3',
    bgColor: 'rgba(91, 179, 179, 0.1)',
    suggestions: ["Explain this concept", "Generate mind map", "Take notes for me"],
  },
  '/mcqs': {
    mode: 'Tutor',
    icon: '❓',
    greeting: "I'll explain why each answer is right or wrong.",
    color: '#C9A86C',
    bgColor: 'rgba(201, 168, 108, 0.1)',
    suggestions: ["Why was I wrong?", "Explain this concept", "Similar questions"],
  },
  '/community': {
    mode: 'Discussion Moderator',
    icon: '👥',
    greeting: "I can add textbook references to any debate!",
    color: '#5BB3B3',
    bgColor: 'rgba(91, 179, 179, 0.1)',
    suggestions: ["Add textbook reference", "Fact-check this", "Summarize thread"],
  },
  '/arena': {
    mode: 'Competitive Coach',
    icon: '🏆',
    greeting: "Let's climb that leaderboard together!",
    color: '#C9A86C',
    bgColor: 'rgba(201, 168, 108, 0.1)',
    suggestions: ["How to beat #1?", "My weak areas", "Strategy tips"],
  },
};

// Default ATOM mode for unspecified routes
const defaultMode = {
  mode: 'Assistant',
  icon: '⚛️',
  greeting: "How can I help you today?",
  color: '#5BB3B3',
  bgColor: 'rgba(91, 179, 179, 0.1)',
  suggestions: ["Ask a question", "Get help", "Explore topics"],
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function AtomWidget() {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Don't show on chat page (ATOM has its own full interface there)
  if (pathname === '/chat') {
    return null;
  }

  // Get current room's ATOM mode
  const getAtomMode = () => {
    // Check for exact match first
    if (atomModes[pathname]) return atomModes[pathname];

    // Check for partial matches (e.g., /library/1 matches /library)
    for (const [path, mode] of Object.entries(atomModes)) {
      if (pathname.startsWith(path)) return mode;
    }

    return defaultMode;
  };

  const currentMode = getAtomMode();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    const currentMessages = [...messages, userMessage];
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const apiMessages = currentMessages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          context: 'surgery',
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullText = '';
      const responseId = (Date.now() + 1).toString();

      setIsTyping(false);
      setMessages(prev => [...prev, { id: responseId, role: 'assistant', content: '' }]);

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
          } catch { /* skip */ }
        }
      }
    } catch {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I couldn\'t connect. Try the full ATOM chat for a better experience.',
      }]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleOpenFullChat = () => {
    router.push('/chat');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Collapsed widget button
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-20 lg:bottom-6 right-4 z-50 group"
        style={{
          animation: 'float 3s ease-in-out infinite',
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 relative overflow-hidden border"
          style={{
            background: `linear-gradient(135deg, #364A5E, #3A4D5F)`,
            borderColor: `${currentMode.color}40`,
            boxShadow: `0 8px 32px ${currentMode.color}30, 0 0 20px ${currentMode.color}20`,
          }}
        >
          {/* Glow effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: `radial-gradient(circle at center, ${currentMode.color}30 0%, transparent 70%)`,
            }}
          />

          {/* Cyan ring */}
          <div
            className="absolute inset-0 rounded-2xl opacity-50"
            style={{
              boxShadow: `inset 0 0 10px ${currentMode.color}30`,
            }}
          />

          {/* Icon */}
          <span className="text-2xl relative z-10">{currentMode.icon}</span>

          {/* Pulse ring */}
          <div
            className="absolute inset-0 rounded-2xl animate-ping opacity-10"
            style={{ backgroundColor: currentMode.color }}
          />
        </div>

        {/* Mode badge */}
        <Badge
          className="absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5 shadow-lg border-0 whitespace-nowrap"
          style={{
            backgroundColor: currentMode.color,
            color: '#2D3E50'
          }}
        >
          {currentMode.mode}
        </Badge>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
        `}</style>
      </button>
    );
  }

  // Expanded chat panel - Dark Navy theme
  return (
    <div
      className="fixed bottom-20 lg:bottom-6 right-4 z-50 w-80 sm:w-96 animate-in slide-in-from-bottom-4 duration-300"
    >
      <div
        className="bg-[#364A5E] rounded-2xl shadow-2xl overflow-hidden border"
        style={{ borderColor: `${currentMode.color}30` }}
      >
        {/* Header */}
        <div
          className="p-4 flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, ${currentMode.color}, ${currentMode.color}dd)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2D3E50]/30 backdrop-blur flex items-center justify-center">
              <span className="text-xl">{currentMode.icon}</span>
            </div>
            <div>
              <h3 className="font-semibold text-[#2D3E50] flex items-center gap-2">
                ATOM
                <Badge className="bg-[#2D3E50]/20 text-[#2D3E50] border-0 text-[10px]">
                  {currentMode.mode}
                </Badge>
              </h3>
              <p className="text-[#2D3E50]/70 text-xs">Online • Ready to help</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleOpenFullChat}
              className="h-8 w-8 text-[#2D3E50]/70 hover:text-[#2D3E50] hover:bg-[#2D3E50]/20"
              title="Open full chat"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(false)}
              className="h-8 w-8 text-[#2D3E50]/70 hover:text-[#2D3E50] hover:bg-[#2D3E50]/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Greeting */}
        <div
          className="p-4 border-b"
          style={{
            backgroundColor: currentMode.bgColor,
            borderColor: `${currentMode.color}20`,
          }}
        >
          <p className="text-sm" style={{ color: currentMode.color }}>
            <Sparkles className="w-4 h-4 inline mr-1" />
            {currentMode.greeting}
          </p>
        </div>

        {/* Messages */}
        <div className="h-48 overflow-y-auto p-4 space-y-3 bg-[#2D3E50]">
          {messages.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-[#A0B0BC]">Start a conversation or try a suggestion below</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${msg.role === 'user'
                      ? 'text-[#2D3E50] rounded-br-md'
                      : 'bg-[#3A4D5F] border border-[rgba(91,179,179,0.15)] text-[#E8E0D5] rounded-bl-md'
                    }`}
                  style={msg.role === 'user' ? { backgroundColor: currentMode.color } : {}}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#3A4D5F] border border-[rgba(91,179,179,0.15)] rounded-2xl rounded-bl-md px-3 py-2">
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: currentMode.color, animationDelay: '0ms' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: currentMode.color, animationDelay: '150ms' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: currentMode.color, animationDelay: '300ms' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="p-3 border-t border-[rgba(91,179,179,0.1)] bg-[#364A5E]">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {currentMode.suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(suggestion)}
                className="shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all hover:shadow-md"
                style={{
                  borderColor: `${currentMode.color}40`,
                  color: currentMode.color,
                  backgroundColor: currentMode.bgColor,
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-3 border-t border-[rgba(91,179,179,0.1)] bg-[#364A5E]">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask ATOM..."
              className="flex-1 px-3 py-2 text-sm bg-[#3A4D5F] border border-[rgba(91,179,179,0.15)] rounded-xl text-[#E8E0D5] placeholder:text-[#A0B0BC] focus:outline-none focus:ring-2 transition-all"
              style={{
                '--tw-ring-color': `${currentMode.color}40`,
              } as React.CSSProperties}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              className="rounded-xl px-3 disabled:opacity-50"
              style={{ backgroundColor: currentMode.color, color: '#2D3E50' }}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
