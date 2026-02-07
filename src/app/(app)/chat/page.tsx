"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Paperclip,
  Mic,
  Camera,
  Zap,
  BookOpen,
  Brain,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  citations?: Citation[];
  relatedTopics?: string[];
}

interface Citation {
  source: string;
  edition: string;
  chapter: string;
  page: string;
}

const sampleMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "Explain portal hypertension and its complications",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "2",
    role: "assistant",
    content: `**Portal Hypertension** is defined as an elevation of the hepatic venous pressure gradient (HVPG) above **5 mmHg**. Clinically significant portal hypertension occurs when HVPG exceeds **10 mmHg**.

## Pathophysiology

The portal vein carries blood from the GI tract to the liver. When there's increased resistance to flow (usually due to cirrhosis), pressure builds up.

**Two components:**
1. **Increased resistance** — structural (fibrosis, nodules) + dynamic (vasoconstriction)
2. **Increased flow** — splanchnic vasodilation, hyperdynamic circulation

## Major Complications

| Complication | Mechanism | Clinical Presentation |
|--------------|-----------|----------------------|
| **Varices** | Collateral formation | Hematemesis, melena |
| **Ascites** | Splanchnic vasodilation + Na retention | Abdominal distension |
| **SBP** | Bacterial translocation | Fever, abdominal pain |
| **HE** | Ammonia bypass liver | Confusion, asterixis |
| **HRS** | Renal vasoconstriction | Oliguria, rising creatinine |

## Key Numbers to Remember

- HVPG > 5 mmHg = Portal HTN
- HVPG > 10 mmHg = Clinically significant
- HVPG > 12 mmHg = Varices may bleed
- HVPG > 20 mmHg = High risk of treatment failure`,
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    citations: [
      {
        source: "Sleisenger & Fordtran",
        edition: "11th Edition",
        chapter: "Chapter 74: Portal Hypertension",
        page: "1220-1245",
      },
    ],
    relatedTopics: ["Cirrhosis", "Ascites", "Variceal Bleeding", "TIPS", "Child-Pugh Score"],
  },
  {
    id: "3",
    role: "user",
    content: "What's the first-line treatment for acute variceal bleeding?",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
  {
    id: "4",
    role: "assistant",
    content: `Great follow-up! Acute variceal bleeding requires **simultaneous pharmacological and endoscopic therapy**.

## First-Line Management

### 1. Resuscitation
- IV access, crossmatch blood
- **Restrictive transfusion** — target Hb 7-8 g/dL (over-transfusion worsens portal pressure)
- Correct coagulopathy cautiously

### 2. Pharmacological (start IMMEDIATELY)
| Drug | Dose | Mechanism |
|------|------|-----------|
| **Octreotide** | 50 μg bolus → 50 μg/hr | Splanchnic vasoconstriction |
| **Terlipressin** | 2 mg q4h → 1 mg q4h | V1 receptor agonist |

### 3. Endoscopic (within 12 hours)
- **Band ligation** — preferred for esophageal varices
- Sclerotherapy if banding not possible

### 4. Antibiotic Prophylaxis
- **Ceftriaxone 1g IV daily** × 7 days
- Reduces mortality by preventing SBP

### 5. If Bleeding Uncontrolled
- Balloon tamponade (bridge therapy)
- **TIPS** — rescue therapy
- Surgery — last resort

## Pearl 💎
> Start vasoactive drugs BEFORE endoscopy. Don't wait for confirmation — the risk of undertreating is worse than overtreating.`,
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
    citations: [
      {
        source: "Sleisenger & Fordtran",
        edition: "11th Edition",
        chapter: "Chapter 74",
        page: "1235-1238",
      },
      {
        source: "AASLD Guidelines",
        edition: "2022",
        chapter: "Variceal Hemorrhage",
        page: "Practice Guidance",
      },
    ],
    relatedTopics: ["Octreotide", "Band Ligation", "TIPS", "Baveno Guidelines"],
  },
];

const quickActions = [
  { label: "Quiz me on this", icon: Brain },
  { label: "Show related topics", icon: Sparkles },
  { label: "Explain simpler", icon: MessageSquare },
  { label: "Clinical case", icon: BookOpen },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate ATOM response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I understand you're asking about "${input}". Let me look that up in the textbooks and provide a comprehensive answer with citations...

*This is a demo response. In production, ATOM would provide detailed, sourced answers from the medical library.*`,
        timestamp: new Date(),
        citations: [
          {
            source: "Demo Source",
            edition: "Latest",
            chapter: "Relevant Chapter",
            page: "123-456",
          },
        ],
      };
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <span className="text-lg">⚛️</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ATOM</h1>
              <p className="text-sm text-gray-400">Your AI Medical Tutor</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
              New Chat
            </Button>
            <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
              History
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea ref={scrollRef} className="flex-1 pr-4">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] ${
                    message.role === "user"
                      ? "bg-purple-600/30 border border-purple-500/30"
                      : "bg-gray-800/50 border border-gray-700/50"
                  } rounded-2xl p-4`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">⚛️</span>
                      <span className="text-sm font-medium text-purple-400">ATOM</span>
                    </div>
                  )}
                  
                  {/* Message Content - Render as markdown-like */}
                  <div className="prose prose-invert prose-sm max-w-none">
                    {message.content.split("\n").map((line, i) => {
                      if (line.startsWith("## ")) {
                        return (
                          <h3 key={i} className="text-lg font-bold text-white mt-4 mb-2">
                            {line.replace("## ", "")}
                          </h3>
                        );
                      }
                      if (line.startsWith("### ")) {
                        return (
                          <h4 key={i} className="text-md font-semibold text-gray-200 mt-3 mb-1">
                            {line.replace("### ", "")}
                          </h4>
                        );
                      }
                      if (line.startsWith("**") && line.endsWith("**")) {
                        return (
                          <p key={i} className="font-bold text-white">
                            {line.replace(/\*\*/g, "")}
                          </p>
                        );
                      }
                      if (line.startsWith("> ")) {
                        return (
                          <blockquote
                            key={i}
                            className="border-l-4 border-purple-500 pl-4 italic text-gray-300 my-2"
                          >
                            {line.replace("> ", "")}
                          </blockquote>
                        );
                      }
                      if (line.startsWith("| ")) {
                        return null; // Skip table lines for now (simplified)
                      }
                      if (line.startsWith("- ")) {
                        return (
                          <li key={i} className="text-gray-300 ml-4">
                            {line.replace("- ", "")}
                          </li>
                        );
                      }
                      if (line.trim() === "") {
                        return <br key={i} />;
                      }
                      return (
                        <p key={i} className="text-gray-300">
                          {line}
                        </p>
                      );
                    })}
                  </div>

                  {/* Citations */}
                  {message.citations && message.citations.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-700/50">
                      <p className="text-xs text-gray-500 mb-2">📚 Sources</p>
                      <div className="space-y-1">
                        {message.citations.map((citation, i) => (
                          <div
                            key={i}
                            className="text-xs text-gray-400 flex items-center gap-2 hover:text-purple-400 cursor-pointer transition-colors"
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>
                              {citation.source} {citation.edition} — {citation.chapter}, p.{citation.page}
                            </span>
                            <ExternalLink className="w-3 h-3" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Topics */}
                  {message.relatedTopics && message.relatedTopics.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.relatedTopics.map((topic) => (
                        <Badge
                          key={topic}
                          variant="outline"
                          className="border-purple-500/30 text-purple-400 hover:bg-purple-500/20 cursor-pointer transition-colors"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <p className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">⚛️</span>
                    <span className="text-sm font-medium text-purple-400">ATOM</span>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.1s]" />
                      <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="flex gap-2 my-4 overflow-x-auto pb-2">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-300 hover:border-purple-500 hover:text-purple-400 whitespace-nowrap"
            >
              <action.icon className="w-4 h-4 mr-2" />
              {action.label}
            </Button>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3">
          <div className="flex items-center gap-3">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask ATOM anything about medicine..."
              className="flex-1 bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-gray-500"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-700/50">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Mic className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Camera className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Zap className="w-4 h-4 mr-1" />
              Quick Q
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Context Panel */}
      <div className="w-80 hidden xl:block space-y-4">
        {/* Current Context */}
        <Card className="bg-gray-800/30 border-gray-700 p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">📚 Current Context</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Topic</span>
              <span className="text-white">Portal Hypertension</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">System</span>
              <span className="text-white">GI / Hepatology</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Pathway</span>
              <span className="text-purple-400">Liver Diseases</span>
            </div>
          </div>
        </Card>

        {/* Sources */}
        <Card className="bg-gray-800/30 border-gray-700 p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">📖 Sources Used</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-2 text-sm group cursor-pointer">
              <BookOpen className="w-4 h-4 text-cyan-500 mt-0.5" />
              <div>
                <p className="text-white group-hover:text-purple-400 transition-colors">
                  Sleisenger 11th Ed
                </p>
                <p className="text-gray-500 text-xs">Ch.74: Portal Hypertension</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm group cursor-pointer">
              <BookOpen className="w-4 h-4 text-green-500 mt-0.5" />
              <div>
                <p className="text-white group-hover:text-purple-400 transition-colors">
                  AASLD Guidelines 2022
                </p>
                <p className="text-gray-500 text-xs">Variceal Hemorrhage</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gray-800/30 border-gray-700 p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">💡 Quick Actions</h3>
          <div className="space-y-2">
            {[
              "Quiz me on this topic",
              "Show visual diagram",
              "Add to my pathway",
              "Save as note",
              "Share with peer",
            ].map((action) => (
              <button
                key={action}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-700/50 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <span>{action}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ))}
          </div>
        </Card>

        {/* Related Topics */}
        <Card className="bg-gray-800/30 border-gray-700 p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">🔗 Related Topics</h3>
          <div className="flex flex-wrap gap-2">
            {["Cirrhosis", "Ascites", "TIPS", "Child-Pugh", "MELD Score", "HRS", "SBP"].map(
              (topic) => (
                <Badge
                  key={topic}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-400 cursor-pointer transition-colors"
                >
                  {topic}
                </Badge>
              )
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
