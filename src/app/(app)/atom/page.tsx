"use client";

import { useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { BookOpen, MessageSquareText, PanelsTopLeft } from "lucide-react";
import {
  SourcesPanel, ChatPanel, ActionsPanel,
  initialSources, mockOutputs, welcomeMessage,
  type Source, type Message,
} from "@/components/chat";

type MobileTab = "sources" | "chat" | "workspace";

export default function AtomWorkspacePage() {
  const [sources, setSources] = useState<Source[]>(initialSources);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [outputs] = useState(mockOutputs);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("chat");
  const [selectedCodeBlockId, setSelectedCodeBlockId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const enabledSources = sources.filter((s) => s.enabled);

  const toggleSource = (id: string) => {
    setSources((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  const handleSend = useCallback(
    async (text?: string) => {
      const messageText = text || input.trim();
      if (!messageText || isStreaming) return;

      const enabledTitles = enabledSources.map((s) => s.title);
      const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: messageText, timestamp: new Date() };
      const assistantMessageId = crypto.randomUUID();
      const assistantMessage: Message = { id: assistantMessageId, role: "assistant", content: "", timestamp: new Date(), isStreaming: true, sources: enabledTitles };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setInput("");
      setIsStreaming(true);

      const history = [...messages, userMessage].filter((m) => m.id !== "welcome").map((m) => ({ role: m.role, content: m.content }));

      const MAX_STREAM_CHARS = 12000;
      const RETRYABLE_ERRORS = new Set(["Stream error", "Incomplete stream"]);

      const streamWithAttempt = async () => {
        abortControllerRef.current = new AbortController();
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, context: "full", deskSources: enabledTitles }),
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
        let doneSeen = false;
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;

            const data = line.slice(6);
            if (data === "[DONE]") {
              doneSeen = true;
              continue;
            }

            let parsed: { text?: string; error?: string };
            try {
              parsed = JSON.parse(data);
            } catch {
              continue;
            }

            if (parsed.error) throw new Error(parsed.error);
            if (parsed.text) {
              fullText += parsed.text;
              if (fullText.length >= MAX_STREAM_CHARS) {
                fullText = `${fullText.slice(0, MAX_STREAM_CHARS)}\n\n*[Response truncated for stability. Ask “continue” to get the next part.]*`;
                doneSeen = true;
                await reader.cancel();
                break;
              }
              setMessages((prev) => prev.map((m) => (m.id === assistantMessageId ? { ...m, content: fullText } : m)));
            }
          }
        }

        if (!doneSeen && fullText.trim().length === 0) {
          throw new Error("Incomplete stream");
        }

        setMessages((prev) => prev.map((m) => (m.id === assistantMessageId ? { ...m, isStreaming: false } : m)));
      };

      try {
        try {
          await streamWithAttempt();
        } catch (error) {
          const msg = error instanceof Error ? error.message : "Unknown error";
          const shouldRetry = RETRYABLE_ERRORS.has(msg) && !abortControllerRef.current?.signal.aborted;
          if (!shouldRetry) throw error;
          setMessages((prev) => prev.map((m) => (m.id === assistantMessageId ? { ...m, content: "⚠️ Connection was unstable. Retrying once…" } : m)));
          await streamWithAttempt();
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          setMessages((prev) => prev.map((m) => m.id === assistantMessageId ? { ...m, content: `${m.content}\n\n*[Cancelled]*`, isStreaming: false } : m));
        } else {
          const message = error instanceof Error ? error.message : "Something went wrong";
          setMessages((prev) => prev.map((m) => m.id === assistantMessageId ? {
            ...m,
            content: `❌ ${message}. Please retry. If this keeps happening, shorten the prompt or ask in parts.`,
            isStreaming: false,
          } : m));
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [input, isStreaming, messages, enabledSources]
  );

  const handleStop = () => abortControllerRef.current?.abort();
  const handleReset = () => { setMessages([welcomeMessage]); setIsStreaming(false); setSelectedCodeBlockId(null); abortControllerRef.current?.abort(); };
  const handleCopy = (id: string, content: string) => { navigator.clipboard.writeText(content); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  const handleAction = (type: string) => {
    const prompts: Record<string, string> = {
      summary: "Generate a comprehensive summary from the enabled sources, with key points and clinical pearls.",
      flashcards: "Create 10 high-yield flashcards (Q&A) from the enabled sources.",
      ppt: "Create a presentation outline with key slides from the enabled sources.",
      audio: "Create a concise audio-overview script summarizing the enabled sources for quick revision.",
    };
    handleSend(prompts[type]);
  };

  return (
    <div className="h-full flex flex-col bg-[radial-gradient(circle_at_top,_rgba(91,179,179,0.18),_transparent_35%),linear-gradient(140deg,#0F172A,#162535_35%,#0B1324)]">
      <div className="border-b border-white/10 px-4 py-3 backdrop-blur-sm bg-white/[0.03] md:hidden">
        <div className="grid grid-cols-3 gap-2">
          {([
            { key: "sources", label: "Sources", icon: BookOpen },
            { key: "chat", label: "ATOM", icon: MessageSquareText },
            { key: "workspace", label: "Workspace", icon: PanelsTopLeft },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMobileTab(tab.key)}
              className={`rounded-lg px-2 py-2 text-xs font-medium border flex items-center justify-center gap-1.5 ${
                mobileTab === tab.key ? "text-white bg-[#5BB3B3]/20 border-[#5BB3B3]/50" : "text-[#94A3B8] border-white/10"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden md:p-3 md:gap-3">
        <Card className={`w-[280px] shrink-0 border-[#1E3A5F] md:rounded-2xl rounded-none md:border border-r-0 md:border-r overflow-hidden backdrop-blur-xl bg-white/[0.03] ${mobileTab !== "sources" ? "hidden md:flex" : "flex"} flex-col`}>
          <SourcesPanel sources={sources} onToggle={toggleSource} />
        </Card>

        <Card className={`flex-1 border-[#1E3A5F] md:rounded-2xl rounded-none md:border border-x-0 md:border-x overflow-hidden bg-[#101C2B]/90 ${mobileTab !== "chat" ? "hidden md:flex" : "flex"} flex-col`}>
          <ChatPanel
            messages={messages}
            input={input}
            isStreaming={isStreaming}
            enabledSourceCount={enabledSources.length}
            copiedId={copiedId}
            onInputChange={setInput}
            onSend={() => handleSend()}
            onStop={handleStop}
            onReset={handleReset}
            onCopy={handleCopy}
            onKeyDown={handleKeyDown}
          />
        </Card>

        <Card className={`w-[360px] shrink-0 border-[#1E3A5F] md:rounded-2xl rounded-none md:border border-l-0 md:border-l overflow-hidden backdrop-blur-xl bg-white/[0.03] ${mobileTab !== "workspace" ? "hidden lg:flex" : "flex"} flex-col`}>
          <ActionsPanel
            outputs={outputs}
            isStreaming={isStreaming}
            hasEnabledSources={enabledSources.length > 0}
            onAction={handleAction}
            messages={messages}
            selectedCodeBlockId={selectedCodeBlockId}
            onSelectCodeBlock={setSelectedCodeBlockId}
            defaultTab="canvas"
          />
        </Card>
      </div>
    </div>
  );
}
