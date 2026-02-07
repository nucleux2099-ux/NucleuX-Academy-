"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  Sparkles,
  BookOpen,
  Brain,
  Lightbulb,
  Copy,
  Check,
  StickyNote,
  RotateCcw,
  Mic,
  Paperclip,
  ChevronDown,
  Zap,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  saved?: boolean;
}

const suggestedPrompts = [
  {
    icon: Brain,
    title: "Explain a concept",
    prompt: "Explain the staging of gastric cancer and its surgical implications",
    color: "#7C3AED",
  },
  {
    icon: BookOpen,
    title: "Quiz me",
    prompt: "Quiz me on hepatobiliary anatomy with 5 MCQs",
    color: "#06B6D4",
  },
  {
    icon: Lightbulb,
    title: "Clinical case",
    prompt: "Present a clinical case of acute appendicitis and walk me through the management",
    color: "#F59E0B",
  },
  {
    icon: Sparkles,
    title: "Summarize",
    prompt: "Summarize the key points of portal hypertension management",
    color: "#10B981",
  },
];

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: `👋 **Hello, Aditya!** I'm ATOM, your AI learning companion.

I'm here to help you master Surgical GI concepts through personalized explanations, quizzes, and clinical scenarios. I can:

- 📚 Explain complex topics in simple terms
- 🎯 Quiz you with MCQs and provide detailed explanations
- 🏥 Present clinical cases for problem-based learning
- 📝 Help you create study notes
- 🔗 Connect concepts across topics

**What would you like to learn today?**`,
    timestamp: new Date(),
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentTopic, setCurrentTopic] = useState("Surgical GI");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        staging: `## Gastric Cancer Staging (TNM 8th Edition)

Understanding staging is crucial for treatment planning. Let me break it down:

### T Stage (Tumor Depth)
| Stage | Description |
|-------|-------------|
| T1a | Lamina propria/muscularis mucosae |
| T1b | Submucosa |
| T2 | Muscularis propria |
| T3 | Subserosa |
| T4a | Serosa (visceral peritoneum) |
| T4b | Adjacent structures |

### N Stage (Lymph Nodes)
- **N1:** 1-2 regional nodes
- **N2:** 3-6 regional nodes  
- **N3a:** 7-15 regional nodes
- **N3b:** >15 regional nodes

### Surgical Implications
1. **T1a tumors** → Consider endoscopic resection
2. **T1b-T2** → Subtotal gastrectomy with D2 lymphadenectomy
3. **T3-T4** → Total gastrectomy + neoadjuvant chemotherapy

📚 *Reference: Maingot's Abdominal Operations, 12th Ed, Ch22*

**Would you like me to quiz you on this topic?**`,
        quiz: `## 🎯 Hepatobiliary Anatomy Quiz

**Question 1 of 5**

The boundaries of Calot's triangle include all of the following EXCEPT:

A) Inferior surface of liver (segment V)
B) Cystic duct
C) Common hepatic duct
D) Common bile duct

---

*Take your time to think, then tell me your answer!*`,
        case: `## 🏥 Clinical Case: Acute Appendicitis

**Patient Presentation:**
A 22-year-old male presents to the ED with:
- 12-hour history of periumbilical pain that has migrated to RIF
- Anorexia, nausea, one episode of vomiting
- Low-grade fever (37.8°C)

**On Examination:**
- Tenderness at McBurney's point
- Positive Rovsing's sign
- Guarding in RIF

**Investigations:**
- WBC: 14,000/μL with neutrophilia
- CRP: 45 mg/L

---

**Question:** What is your next step in management?

1. Immediate appendectomy
2. CT abdomen with contrast
3. Diagnostic laparoscopy
4. Conservative management with antibiotics

*Share your reasoning and I'll guide you through the decision-making process.*`,
        default: `That's a great question! Let me help you understand this better.

Based on your query, I'll provide a comprehensive explanation with clinical relevance.

**Key Points:**
1. Understanding the fundamental concept
2. Clinical applications
3. Common exam questions
4. High-yield facts

Would you like me to:
- 📝 Create flashcards for this topic?
- 🎯 Quiz you with MCQs?
- 🔗 Show related concepts?

*Let me know how I can help further!*`,
      };

      let response = responses.default;
      const lowerText = messageText.toLowerCase();
      
      if (lowerText.includes("staging") || lowerText.includes("gastric")) {
        response = responses.staging;
        setCurrentTopic("Gastric Cancer");
      } else if (lowerText.includes("quiz") || lowerText.includes("mcq")) {
        response = responses.quiz;
        setCurrentTopic("Hepatobiliary Anatomy");
      } else if (lowerText.includes("case") || lowerText.includes("appendicitis")) {
        response = responses.case;
        setCurrentTopic("Acute Appendicitis");
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveAsNote = (message: Message) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === message.id ? { ...m, saved: true } : m))
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (content: string) => {
    // Basic markdown-like formatting
    return content
      .split("\n")
      .map((line, i) => {
        // Headers
        if (line.startsWith("## ")) {
          return (
            <h2 key={i} className="text-xl font-bold mt-4 mb-2 text-white">
              {line.replace("## ", "")}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={i} className="text-lg font-semibold mt-3 mb-1 text-white">
              {line.replace("### ", "")}
            </h3>
          );
        }
        // Bold
        if (line.includes("**")) {
          const parts = line.split(/\*\*(.*?)\*\*/g);
          return (
            <p key={i} className="my-1">
              {parts.map((part, j) =>
                j % 2 === 1 ? (
                  <strong key={j} className="text-white font-semibold">
                    {part}
                  </strong>
                ) : (
                  part
                )
              )}
            </p>
          );
        }
        // List items
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <li key={i} className="ml-4 my-0.5">
              {line.replace(/^[-*] /, "")}
            </li>
          );
        }
        // Numbered items
        if (/^\d+\. /.test(line)) {
          return (
            <li key={i} className="ml-4 my-0.5 list-decimal">
              {line.replace(/^\d+\. /, "")}
            </li>
          );
        }
        // Horizontal rule
        if (line === "---") {
          return <hr key={i} className="my-4 border-[#334155]" />;
        }
        // Code/reference
        if (line.startsWith("📚") || line.startsWith("*Reference")) {
          return (
            <p key={i} className="my-2 text-sm text-[#94A3B8] italic">
              {line}
            </p>
          );
        }
        // Table row
        if (line.startsWith("|")) {
          return null; // Handle tables separately
        }
        // Empty line
        if (!line.trim()) {
          return <br key={i} />;
        }
        return (
          <p key={i} className="my-1">
            {line}
          </p>
        );
      });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      {/* Context Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center animate-pulse-subtle">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10B981] rounded-full border-2 border-[#0F172A]" />
          </div>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              ATOM
              <Badge className="bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/30 text-xs">
                AI Tutor
              </Badge>
            </h1>
            <p className="text-sm text-[#94A3B8]">Online • Ready to help</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-[#334155] text-[#94A3B8]">
            <BookOpen className="w-3 h-3 mr-1" />
            {currentTopic}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMessages(initialMessages)}
            className="text-[#94A3B8] hover:text-white"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <Card className="flex-1 bg-[#1E293B]/50 border-[#334155] overflow-hidden">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                } animate-fade-in`}
              >
                {/* Avatar */}
                <Avatar
                  className={`w-8 h-8 shrink-0 ${
                    message.role === "assistant"
                      ? "bg-gradient-to-br from-[#7C3AED] to-[#06B6D4]"
                      : "bg-[#334155]"
                  }`}
                >
                  <AvatarFallback
                    className={
                      message.role === "assistant"
                        ? "bg-transparent text-white"
                        : "bg-[#334155] text-white"
                    }
                  >
                    {message.role === "assistant" ? (
                      <Zap className="w-4 h-4" />
                    ) : (
                      "A"
                    )}
                  </AvatarFallback>
                </Avatar>

                {/* Message Bubble */}
                <div
                  className={`max-w-[80%] ${
                    message.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-[#7C3AED] text-white rounded-br-md"
                        : "bg-[#0F172A] border border-[#334155] rounded-bl-md"
                    }`}
                  >
                    <div
                      className={
                        message.role === "assistant"
                          ? "text-[#94A3B8] prose prose-invert prose-sm max-w-none"
                          : ""
                      }
                    >
                      {message.role === "assistant"
                        ? formatMessage(message.content)
                        : message.content}
                    </div>
                  </div>

                  {/* Message Actions */}
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-1 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(message.id, message.content)}
                        className="h-7 px-2 text-xs text-[#94A3B8] hover:text-white"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3 h-3 mr-1" />
                        ) : (
                          <Copy className="w-3 h-3 mr-1" />
                        )}
                        {copiedId === message.id ? "Copied" : "Copy"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSaveAsNote(message)}
                        className={`h-7 px-2 text-xs ${
                          message.saved
                            ? "text-[#10B981]"
                            : "text-[#94A3B8] hover:text-white"
                        }`}
                      >
                        <StickyNote className="w-3 h-3 mr-1" />
                        {message.saved ? "Saved" : "Save as Note"}
                      </Button>
                    </div>
                  )}

                  {/* Timestamp */}
                  <p className="text-[10px] text-[#64748B] mt-1 px-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 animate-fade-in">
                <Avatar className="w-8 h-8 bg-gradient-to-br from-[#7C3AED] to-[#06B6D4]">
                  <AvatarFallback className="bg-transparent text-white">
                    <Zap className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-[#0F172A] border border-[#334155] rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          {messages.length === 1 && (
            <div className="px-4 pb-4">
              <p className="text-sm text-[#94A3B8] mb-3">Suggested prompts:</p>
              <div className="grid grid-cols-2 gap-2">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt.prompt)}
                    className="p-3 rounded-xl bg-[#0F172A] border border-[#334155] hover:border-[#7C3AED]/50 text-left transition-all group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${prompt.color}20` }}
                    >
                      <prompt.icon
                        className="w-4 h-4"
                        style={{ color: prompt.color }}
                      />
                    </div>
                    <p className="text-sm font-medium text-white">
                      {prompt.title}
                    </p>
                    <p className="text-xs text-[#94A3B8] line-clamp-1 mt-1">
                      {prompt.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-[#334155] bg-[#0F172A]/50">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask ATOM anything about Surgical GI..."
                  rows={1}
                  className="w-full px-4 py-3 pr-24 bg-[#1E293B] border border-[#334155] rounded-xl resize-none focus:outline-none focus:border-[#7C3AED] text-white placeholder-[#64748B] min-h-[48px] max-h-[120px]"
                  style={{
                    height: "auto",
                    minHeight: "48px",
                  }}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 text-[#64748B] hover:text-white"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 text-[#64748B] hover:text-white"
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="h-12 w-12 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl shrink-0 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-[10px] text-[#64748B] mt-2 text-center">
              ATOM may make mistakes. Verify important information with textbooks.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
