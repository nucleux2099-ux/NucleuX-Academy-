"use client";

import { useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import {
  SourcesPanel, ChatPanel, ActionsPanel,
  theme, initialSources, mockOutputs, welcomeMessage,
  type Source, type Message,
} from "@/components/chat";

type MobileTab = "sources" | "chat" | "actions";

export default function DeskPage() {
  const [sources, setSources] = useState<Source[]>(initialSources);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [outputs] = useState(mockOutputs);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("chat");
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
          setMessages((prev) => prev.map((m) => m.id === assistantMessageId ? { ...m, content: m.content + "\n\n*[Cancelled]*", isStreaming: false } : m));
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
  const handleReset = () => { setMessages([welcomeMessage]); setIsStreaming(false); abortControllerRef.current?.abort(); };
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
    <div className="flex flex-col h-[calc(100vh-8rem)] -m-4 sm:-m-6" style={{ backgroundColor: theme.background }}>
      {/* Mobile Tabs */}
      <div className="flex md:hidden border-b border-[#1E3A5F]" style={{ backgroundColor: theme.cardBg }}>
        {(["sources", "chat", "actions"] as MobileTab[]).map((tab) => (
          <button key={tab} onClick={() => setMobileTab(tab)}
            className={`flex-1 py-3 text-xs font-medium capitalize transition-colors ${mobileTab === tab ? "text-[#5BB3B3] border-b-2 border-[#5BB3B3]" : "text-[#94A3B8]"}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden">
        <Card className={`w-[280px] shrink-0 border-[#1E3A5F] rounded-none border-r overflow-hidden ${mobileTab !== "sources" ? "hidden md:flex" : "flex"} flex-col`} style={{ backgroundColor: theme.cardBg }}>
          <SourcesPanel sources={sources} onToggle={toggleSource} />
        </Card>
        <div className={`flex-1 flex-col overflow-hidden ${mobileTab !== "chat" ? "hidden md:flex" : "flex"}`}>
          <ChatPanel messages={messages} input={input} isStreaming={isStreaming}
            enabledSourceCount={enabledSources.length} copiedId={copiedId}
            onInputChange={setInput} onSend={() => handleSend()} onStop={handleStop}
            onReset={handleReset} onCopy={handleCopy} onKeyDown={handleKeyDown} />
        </div>
        <Card className={`w-[320px] shrink-0 border-[#1E3A5F] rounded-none border-l overflow-hidden ${mobileTab !== "actions" ? "hidden lg:flex" : "flex"} flex-col`} style={{ backgroundColor: theme.cardBg }}>
          <ActionsPanel outputs={outputs} isStreaming={isStreaming} hasEnabledSources={enabledSources.length > 0} onAction={handleAction} />
        </Card>
      </div>
    </div>
  );
}
