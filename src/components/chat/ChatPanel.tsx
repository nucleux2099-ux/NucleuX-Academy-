"use client";

import { useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, X, Loader2, Atom, RotateCcw, Copy, Check } from "lucide-react";
import { theme, type Message } from "./data";

function formatMessage(content: string) {
  return content.split("\n").map((line, i) => {
    if (line.startsWith("### ")) return <h3 key={i} className="text-lg font-bold mt-3 mb-1 text-white">{line.replace("### ", "")}</h3>;
    if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-bold mt-4 mb-2 text-white">{line.replace("## ", "")}</h2>;
    if (line.includes("**")) {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return <p key={i} className="my-1">{parts.map((part, j) => (j % 2 === 1 ? <strong key={j} className="text-[#5EEAD4] font-semibold">{part}</strong> : part))}</p>;
    }
    if (line.startsWith("• ") || line.startsWith("- ")) return <li key={i} className="ml-4 my-0.5 list-disc">{line.replace(/^[•\-]\s/, "")}</li>;
    if (!line.trim()) return <br key={i} />;
    return <p key={i} className="my-1">{line}</p>;
  });
}

interface ChatPanelProps {
  messages: Message[];
  input: string;
  isStreaming: boolean;
  enabledSourceCount: number;
  copiedId: string | null;
  onInputChange: (val: string) => void;
  onSend: () => void;
  onStop: () => void;
  onReset: () => void;
  onCopy: (id: string, content: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function ChatPanel({
  messages, input, isStreaming, enabledSourceCount, copiedId,
  onInputChange, onSend, onStop, onReset, onCopy, onKeyDown,
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#1E3A5F]" style={{ background: `linear-gradient(135deg, ${theme.cardBg}, #0F2438)` }}>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5BB3B3] to-[#5EEAD4] flex items-center justify-center" style={{ boxShadow: `0 0 20px ${theme.glow}` }}>
              <Atom className="w-5 h-5 text-white" />
              {isStreaming && <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-[#5BB3B3]" />}
            </div>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              ATOM <Badge className="bg-[#5BB3B3]/20 text-[#22D3EE] border-[#5BB3B3]/30 text-[10px]">{isStreaming ? "Thinking..." : "Online"}</Badge>
            </h1>
            <p className="text-[10px] text-[#94A3B8]">{enabledSourceCount} source{enabledSourceCount !== 1 ? "s" : ""} active</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onReset} className="text-[#94A3B8] hover:text-white hover:bg-[#1E3A5F] w-8 h-8">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: theme.background }}>
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
            <Avatar className="w-7 h-7 shrink-0" style={message.role === "assistant" ? { background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` } : { backgroundColor: theme.primary }}>
              <AvatarFallback className="bg-transparent text-white text-xs">
                {message.role === "assistant" ? <Atom className="w-3.5 h-3.5" /> : "Y"}
              </AvatarFallback>
            </Avatar>
            <div className={`max-w-[85%] ${message.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                message.role === "user" ? "bg-[#5BB3B3] text-white rounded-br-md" : "bg-[#1B2838] border border-[#1E3A5F] rounded-bl-md"
              }`}>
                <div className={message.role === "assistant" ? "text-[#E2E8F0] text-sm" : "text-sm"}>
                  {message.role === "assistant" ? formatMessage(message.content) : message.content}
                </div>
                {message.isStreaming && !message.content && (
                  <div className="flex items-center gap-2 mt-2"><Loader2 className="w-4 h-4 text-[#5BB3B3] animate-spin" /><span className="text-xs text-[#94A3B8]">Searching sources...</span></div>
                )}
                {message.isStreaming && message.content && <span className="inline-block w-2 h-4 bg-[#5BB3B3] animate-pulse ml-1" />}
              </div>
              {message.role === "assistant" && message.sources && !message.isStreaming && message.id !== "welcome" && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {message.sources.slice(0, 3).map((s, i) => (
                    <Badge key={i} className="bg-[#1E3A5F]/50 text-[#94A3B8] border-[#1E3A5F] text-[9px] px-1.5 py-0">📚 {s.length > 25 ? s.slice(0, 25) + "…" : s}</Badge>
                  ))}
                </div>
              )}
              {message.role === "assistant" && !message.isStreaming && message.id !== "welcome" && (
                <div className="flex items-center gap-1 mt-1">
                  <Button variant="ghost" size="sm" onClick={() => onCopy(message.id, message.content)} className="h-6 px-2 text-[10px] text-[#94A3B8] hover:text-white hover:bg-[#1E3A5F]">
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
      <div className="p-3 border-t border-[#1E3A5F]" style={{ backgroundColor: theme.cardBg }}>
        <div className="flex items-end gap-2">
          <textarea value={input} onChange={(e) => onInputChange(e.target.value)} onKeyDown={onKeyDown}
            placeholder="Ask ATOM about your sources..." rows={1} disabled={isStreaming}
            className="flex-1 px-4 py-2.5 bg-[#162535] border border-[#1E3A5F] rounded-xl resize-none focus:outline-none focus:border-[#5BB3B3] focus:ring-2 focus:ring-[#5BB3B3]/20 text-white placeholder-[#64748B] text-sm min-h-[44px] max-h-[100px] disabled:opacity-50" />
          {isStreaming ? (
            <Button onClick={onStop} className="h-11 w-11 bg-red-500 hover:bg-red-600 rounded-xl shrink-0"><X className="w-5 h-5" /></Button>
          ) : (
            <Button onClick={onSend} disabled={!input.trim()} className="h-11 w-11 bg-[#5BB3B3] hover:bg-[#22D3EE] rounded-xl shrink-0 disabled:opacity-50" style={{ boxShadow: `0 4px 20px ${theme.glow}` }}><Send className="w-5 h-5" /></Button>
          )}
        </div>
      </div>
    </div>
  );
}
