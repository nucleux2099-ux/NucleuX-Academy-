"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  BookOpen,
  FileText,
  StickyNote,
  Copy,
  Check,
  X,
  Loader2,
  Atom,
  RotateCcw,
  Brain,
  Presentation,
  Headphones,
  Plus,
  Download,
  BookMarked,
  Upload,
  Layers,
} from "lucide-react";

const theme = {
  background: "#2D3E50",
  cardBg: "#364A5E",
  primary: "#5BB3B3",
  accent: "#C9A86C",
  text: "#E8E0D5",
  textMuted: "#A0B0BC",
  border: "rgba(232, 224, 213, 0.1)",
  glow: "rgba(91, 179, 179, 0.24)",
  inputBg: "#253545",
};

// --- Types ---
interface Source {
  id: string;
  title: string;
  type: "textbook" | "notes" | "upload";
  enabled: boolean;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  sources?: string[];
}

interface OutputCard {
  id: string;
  title: string;
  type: "summary" | "flashcards" | "ppt" | "audio";
  preview: string;
  createdAt: Date;
}

// --- Mock Data ---
const initialSources: Source[] = [
  { id: "1", title: "Shackelford Ch. 35 - Esophageal Replacement", type: "textbook", enabled: true },
  { id: "2", title: "Harrison's Ch. 12 - Portal Hypertension", type: "textbook", enabled: true },
  { id: "3", title: "My Surgery Notes - Upper GI", type: "notes", enabled: false },
  { id: "4", title: "Robbins Ch. 17 - GI Pathology", type: "textbook", enabled: true },
];

const mockOutputs: OutputCard[] = [
  { id: "o1", title: "Portal Hypertension Summary", type: "summary", preview: "Key points on portal HTN pathophysiology, classification, and management...", createdAt: new Date(Date.now() - 3600000) },
  { id: "o2", title: "Esophageal Surgery Flashcards", type: "flashcards", preview: "15 flashcards covering Ivor Lewis, McKeown, transhiatal approaches...", createdAt: new Date(Date.now() - 7200000) },
];

const welcomeMessage: Message = {
  id: "welcome",
  role: "assistant",
  content: `Welcome to your **Desk** ⚛️

I'm ATOM, grounded in the sources you've selected on the left. Toggle sources on/off to control what I can reference.

Ask me anything, or use the action buttons on the right to generate study materials!`,
  timestamp: new Date(),
};

const sourceIcon = (type: Source["type"]) => {
  switch (type) {
    case "textbook": return <BookMarked className="w-4 h-4 text-[#5BB3B3]" />;
    case "notes": return <StickyNote className="w-4 h-4 text-[#C9A86C]" />;
    case "upload": return <Upload className="w-4 h-4 text-[#8FD5D5]" />;
  }
};

const outputIcon = (type: OutputCard["type"]) => {
  switch (type) {
    case "summary": return <FileText className="w-4 h-4 text-[#5BB3B3]" />;
    case "flashcards": return <Brain className="w-4 h-4 text-[#C9A86C]" />;
    case "ppt": return <Presentation className="w-4 h-4 text-[#8FD5D5]" />;
    case "audio": return <Headphones className="w-4 h-4 text-[#E879F9]" />;
  }
};

// --- Panels ---
type MobileTab = "sources" | "chat" | "actions";

export default function DeskPage() {
  const [sources, setSources] = useState<Source[]>(initialSources);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [outputs] = useState<OutputCard[]>(mockOutputs);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const enabledSources = sources.filter((s) => s.enabled);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleSource = (id: string) => {
    setSources((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  // --- Chat Logic (reused from /chat) ---
  const handleSend = useCallback(
    async (text?: string) => {
      const messageText = text || input.trim();
      if (!messageText || isStreaming) return;

      const enabledTitles = enabledSources.map((s) => s.title);

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: messageText,
        timestamp: new Date(),
      };

      const assistantMessageId = crypto.randomUUID();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
        sources: enabledTitles,
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setInput("");
      setIsStreaming(true);

      const history = [...messages, userMessage]
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        abortControllerRef.current = new AbortController();

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history,
            context: "full",
            deskSources: enabledTitles,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to get response");
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullText += parsed.text;
                  setMessages((prev) =>
                    prev.map((m) => (m.id === assistantMessageId ? { ...m, content: fullText } : m))
                  );
                }
                if (parsed.error) throw new Error(parsed.error);
              } catch {
                // skip malformed
              }
            }
          }
        }

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMessageId ? { ...m, isStreaming: false } : m))
        );
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessageId ? { ...m, content: m.content + "\n\n*[Cancelled]*", isStreaming: false } : m
            )
          );
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessageId
                ? { ...m, content: `❌ Error: ${error instanceof Error ? error.message : "Something went wrong"}`, isStreaming: false }
                : m
            )
          );
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [input, isStreaming, messages, enabledSources]
  );

  const handleStop = () => abortControllerRef.current?.abort();

  const handleReset = () => {
    setMessages([welcomeMessage]);
    setIsStreaming(false);
    abortControllerRef.current?.abort();
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAction = (type: string) => {
    const prompts: Record<string, string> = {
      summary: "Generate a comprehensive summary from the enabled sources, with key points and clinical pearls.",
      flashcards: "Create 10 high-yield flashcards (Q&A) from the enabled sources.",
      ppt: "Create a presentation outline with key slides from the enabled sources.",
      audio: "Create a concise audio-overview script summarizing the enabled sources for quick revision.",
    };
    handleSend(prompts[type]);
  };

  const formatMessage = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("### ")) return <h3 key={i} className="text-lg font-bold mt-3 mb-1 text-[#E8E0D5]">{line.replace("### ", "")}</h3>;
      if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-bold mt-4 mb-2 text-[#E8E0D5]">{line.replace("## ", "")}</h2>;
      if (line.includes("**")) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="my-1">
            {parts.map((part, j) => (j % 2 === 1 ? <strong key={j} className="text-[#C9A86C] font-semibold">{part}</strong> : part))}
          </p>
        );
      }
      if (line.startsWith("• ") || line.startsWith("- ")) {
        return <li key={i} className="ml-4 my-0.5 list-disc">{line.replace(/^[•\-]\s/, "")}</li>;
      }
      if (!line.trim()) return <br key={i} />;
      return <p key={i} className="my-1">{line}</p>;
    });
  };

  // ========== SOURCES PANEL ==========
  const SourcesPanel = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[#253545]">
        <h2 className="text-sm font-semibold text-[#E8E0D5] flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#5BB3B3]" />
          Sources
          <Badge className="bg-[#5BB3B3]/20 text-[#C9A86C] border-[#5BB3B3]/30 text-[10px] ml-auto">
            {enabledSources.length}/{sources.length}
          </Badge>
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {sources.map((source) => (
          <button
            key={source.id}
            onClick={() => toggleSource(source.id)}
            className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
              source.enabled ? "bg-[#5BB3B3]/10 border border-[#5BB3B3]/30" : "border border-transparent hover:bg-[#253545]/50"
            }`}
          >
            <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
              source.enabled ? "border-[#5BB3B3] bg-[#5BB3B3]" : "border-[#475569]"
            }`}>
              {source.enabled && <Check className="w-3 h-3 text-[#E8E0D5]" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                {sourceIcon(source.type)}
                <span className={`text-xs font-medium truncate ${source.enabled ? "text-[#E8E0D5]" : "text-[#A0B0BC]"}`}>
                  {source.title}
                </span>
              </div>
              <span className="text-[10px] text-[#64748B] capitalize">{source.type}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="p-3 border-t border-[#253545]">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-dashed border-[#253545] bg-transparent text-[#A0B0BC] hover:text-[#5BB3B3] hover:border-[#5BB3B3] hover:bg-[#5BB3B3]/10"
        >
          <Plus className="w-3 h-3 mr-2" />
          Add Source
        </Button>
      </div>
    </div>
  );

  // ========== CHAT PANEL ==========
  const ChatPanel = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#253545]" style={{ background: `linear-gradient(135deg, ${theme.cardBg}, #2D3E50)` }}>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5BB3B3] to-[#C9A86C] flex items-center justify-center" style={{ boxShadow: `0 0 20px ${theme.glow}` }}>
              <Atom className="w-5 h-5 text-[#E8E0D5]" />
              {isStreaming && <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-[#5BB3B3]" />}
            </div>
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#E8E0D5] flex items-center gap-2">
              ATOM
              <Badge className="bg-[#5BB3B3]/20 text-[#8FD5D5] border-[#5BB3B3]/30 text-[10px]">
                {isStreaming ? "Thinking..." : "Online"}
              </Badge>
            </h1>
            <p className="text-[10px] text-[#A0B0BC]">
              {enabledSources.length} source{enabledSources.length !== 1 ? "s" : ""} active
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleReset} className="text-[#A0B0BC] hover:text-[#E8E0D5] hover:bg-[#253545] w-8 h-8">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: theme.background }}>
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
            <Avatar className="w-7 h-7 shrink-0" style={message.role === "assistant" ? { background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` } : { backgroundColor: theme.primary }}>
              <AvatarFallback className="bg-transparent text-[#E8E0D5] text-xs">
                {message.role === "assistant" ? <Atom className="w-3.5 h-3.5" /> : "Y"}
              </AvatarFallback>
            </Avatar>
            <div className={`max-w-[85%] ${message.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                message.role === "user" ? "bg-[#5BB3B3] text-[#E8E0D5] rounded-br-md" : "bg-[#2D3E50] border border-[#253545] rounded-bl-md"
              }`}>
                <div className={message.role === "assistant" ? "text-[#E2E8F0] text-sm" : "text-sm"}>
                  {message.role === "assistant" ? formatMessage(message.content) : message.content}
                </div>
                {message.isStreaming && !message.content && (
                  <div className="flex items-center gap-2 mt-2">
                    <Loader2 className="w-4 h-4 text-[#5BB3B3] animate-spin" />
                    <span className="text-xs text-[#A0B0BC]">Searching sources...</span>
                  </div>
                )}
                {message.isStreaming && message.content && (
                  <span className="inline-block w-2 h-4 bg-[#5BB3B3] animate-pulse ml-1" />
                )}
              </div>
              {/* Source badges */}
              {message.role === "assistant" && message.sources && !message.isStreaming && message.id !== "welcome" && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {message.sources.slice(0, 3).map((s, i) => (
                    <Badge key={i} className="bg-[#253545]/50 text-[#A0B0BC] border-[#253545] text-[9px] px-1.5 py-0">
                      📚 {s.length > 25 ? s.slice(0, 25) + "…" : s}
                    </Badge>
                  ))}
                </div>
              )}
              {/* Actions */}
              {message.role === "assistant" && !message.isStreaming && message.id !== "welcome" && (
                <div className="flex items-center gap-1 mt-1">
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(message.id, message.content)} className="h-6 px-2 text-[10px] text-[#A0B0BC] hover:text-[#E8E0D5] hover:bg-[#253545]">
                    {copiedId === message.id ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copiedId === message.id ? "Copied" : "Copy"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[#253545]" style={{ backgroundColor: theme.cardBg }}>
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask ATOM about your sources..."
            rows={1}
            disabled={isStreaming}
            className="flex-1 px-4 py-2.5 bg-[#253545] border border-[#253545] rounded-xl resize-none focus:outline-none focus:border-[#5BB3B3] focus:ring-2 focus:ring-[#5BB3B3]/20 text-[#E8E0D5] placeholder-[#64748B] text-sm min-h-[44px] max-h-[100px] disabled:opacity-50"
          />
          {isStreaming ? (
            <Button onClick={handleStop} className="h-11 w-11 bg-red-500 hover:bg-red-600 rounded-xl shrink-0">
              <X className="w-5 h-5" />
            </Button>
          ) : (
            <Button onClick={() => handleSend()} disabled={!input.trim()} className="h-11 w-11 bg-[#5BB3B3] hover:bg-[#4A9E9E] rounded-xl shrink-0 disabled:opacity-50" style={{ boxShadow: `0 4px 20px ${theme.glow}` }}>
              <Send className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  // ========== ACTIONS PANEL ==========
  const ActionsPanel = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[#253545]">
        <h2 className="text-sm font-semibold text-[#E8E0D5] flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#5BB3B3]" />
          Actions & Output
        </h2>
      </div>

      {/* Action Buttons */}
      <div className="p-3 grid grid-cols-2 gap-2">
        {[
          { key: "summary", icon: FileText, label: "Summary", color: "#5BB3B3" },
          { key: "flashcards", icon: Brain, label: "Flashcards", color: "#C9A86C" },
          { key: "ppt", icon: Presentation, label: "Create PPT", color: "#8FD5D5" },
          { key: "audio", icon: Headphones, label: "Audio Overview", color: "#E879F9" },
        ].map((action) => (
          <Button
            key={action.key}
            variant="outline"
            size="sm"
            onClick={() => handleAction(action.key)}
            disabled={isStreaming || enabledSources.length === 0}
            className="border-[#253545] bg-transparent hover:border-[#5BB3B3] hover:bg-[#5BB3B3]/10 text-[#A0B0BC] hover:text-[#E8E0D5] justify-start h-10"
          >
            <action.icon className="w-3.5 h-3.5 mr-1.5" style={{ color: action.color }} />
            <span className="text-xs">{action.label}</span>
          </Button>
        ))}
      </div>

      {/* Output Cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {outputs.length === 0 ? (
          <div className="text-center py-8 text-[#64748B]">
            <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Generated outputs will appear here</p>
          </div>
        ) : (
          outputs.map((output) => (
            <Card key={output.id} className="border-[#253545] bg-[#253545]">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  {outputIcon(output.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#E8E0D5] truncate">{output.title}</p>
                    <p className="text-[10px] text-[#A0B0BC] mt-0.5 line-clamp-2">{output.preview}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-[#A0B0BC] hover:text-[#5BB3B3] hover:bg-[#5BB3B3]/10">
                        <Copy className="w-3 h-3 mr-1" /> Copy
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-[#A0B0BC] hover:text-[#5BB3B3] hover:bg-[#5BB3B3]/10">
                        <Download className="w-3 h-3 mr-1" /> Save
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="ui-shell ui-page">
      <div className="ui-panel h-[calc(100vh-9rem)] overflow-hidden p-0 sm:h-[calc(100vh-9.5rem)]">
        <div className="flex h-full flex-col" style={{ backgroundColor: theme.background }}>
          {/* Mobile Tab Bar */}
          <div className="flex border-b md:hidden" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            {(["sources", "chat", "actions"] as MobileTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setMobileTab(tab)}
                className={`flex-1 py-3 text-xs font-medium capitalize transition-colors ${
                  mobileTab === tab ? "border-b-2 border-[#5BB3B3] text-[#5BB3B3]" : "text-[#A0B0BC]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Desktop: 3-column layout */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sources Panel */}
            <Card
              className={`w-[280px] shrink-0 rounded-none border-r overflow-hidden ${mobileTab !== "sources" ? "hidden md:flex" : "flex"} flex-col`}
              style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
            >
              {SourcesPanel}
            </Card>

            {/* Chat Panel */}
            <div className={`flex-1 flex-col overflow-hidden ${mobileTab !== "chat" ? "hidden md:flex" : "flex"}`}>
              {ChatPanel}
            </div>

            {/* Actions Panel */}
            <Card
              className={`w-[320px] shrink-0 rounded-none border-l overflow-hidden ${mobileTab !== "actions" ? "hidden lg:flex" : "flex"} flex-col`}
              style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
            >
              {ActionsPanel}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
