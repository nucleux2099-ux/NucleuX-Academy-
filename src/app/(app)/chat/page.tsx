"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  BookOpen,
  Brain,
  Lightbulb,
  Copy,
  Check,
  StickyNote,
  RotateCcw,
  Paperclip,
  FileText,
  Presentation,
  HelpCircle,
  X,
  Loader2,
  Image as ImageIcon,
  FileUp,
  Atom,
} from "lucide-react";

const theme = {
  background: '#2D3E50',
  cardBg: '#1B2838',
  primary: '#5BB3B3',
  secondary: '#22D3EE',
  accent: '#5EEAD4',
  text: '#FFFFFF',
  textMuted: '#94A3B8',
  border: '#1E3A5F',
  glow: 'rgba(6, 182, 212, 0.3)',
  inputBg: '#162535',
};

interface Attachment {
  id: string;
  name: string;
  type: "image" | "pdf" | "other";
  size: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  saved?: boolean;
  isStreaming?: boolean;
}

const contextOptions = [
  { id: "full", label: "Full Campus", icon: "🏫" },
  { id: "surgery", label: "Surgery Library", icon: "🔪" },
  { id: "medicine", label: "Medicine Library", icon: "💊" },
  { id: "anatomy", label: "Anatomy", icon: "🦴" },
  { id: "pathology", label: "Pathology", icon: "🔬" },
  { id: "obgyn", label: "OBG", icon: "🩺" },
  { id: "pediatrics", label: "Pediatrics", icon: "👶" },
];

const quickActions = [
  { id: "ppt", icon: Presentation, label: "Generate PPT" },
  { id: "summarize", icon: FileText, label: "Summarize" },
  { id: "flashcards", icon: Brain, label: "Flashcards" },
  { id: "quiz", icon: HelpCircle, label: "Quiz Me" },
];

const welcomeMessage: Message = {
  id: "welcome",
  role: "assistant",
  content: `I'm **ATOM**, your AI thinking partner for mastering medicine.

I can help you:
• **Answer questions** grounded in textbook content
• **Explain concepts** atomically — from fundamentals up
• **Create flashcards** & study aids
• **Quiz you** with MCQs and explanations

Select a library context on the left, then ask me anything. Let's learn! ⚛️`,
  timestamp: new Date(),
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedContext, setSelectedContext] = useState("surgery");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isStreaming) return;

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
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
    setIsStreaming(true);

    // Build message history (exclude welcome message and streaming placeholder)
    const history = [...messages, userMessage]
      .filter(m => m.id !== 'welcome')
      .map(m => ({ role: m.role, content: m.content }));

    try {
      abortControllerRef.current = new AbortController();
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          context: selectedContext,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullText += parsed.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessageId
                      ? { ...m, content: fullText }
                      : m
                  )
                );
              }
              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (e) {
              // Skip malformed JSON lines
              if (e instanceof Error && e.message !== 'Stream error') {
                // Ignore parse errors from partial chunks
              }
            }
          }
        }
      }

      // Mark streaming as done
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? { ...m, isStreaming: false }
            : m
        )
      );
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // User cancelled
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId
              ? { ...m, content: m.content + '\n\n*[Cancelled]*', isStreaming: false }
              : m
          )
        );
      } else {
        console.error('Chat error:', error);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId
              ? { ...m, content: `❌ Error: ${error instanceof Error ? error.message : 'Something went wrong'}. Please try again.`, isStreaming: false }
              : m
          )
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [input, isStreaming, messages, selectedContext]);

  const handleQuickAction = (actionId: string) => {
    const prompts: Record<string, string> = {
      ppt: "Create a detailed summary with key points on esophageal replacement methods and outcomes, formatted for a presentation",
      summarize: "Summarize the key points of portal hypertension management in a high-yield format",
      flashcards: "Create 10 flashcards (Q&A format) for hepatobiliary anatomy — focus on surgically relevant landmarks",
      quiz: "Quiz me with 5 MCQs on gastric cancer staging. Give one question at a time, wait for my answer, then explain.",
    };
    handleSend(prompts[actionId]);
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
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

  const handleAddFile = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments: Attachment[] = Array.from(files).map((file, i) => ({
        id: (Date.now() + i).toString(),
        name: file.name,
        type: file.type.startsWith("image/") ? "image" : file.type === "application/pdf" ? "pdf" : "other",
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      }));
      setAttachments((prev) => [...prev, ...newAttachments]);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([welcomeMessage]);
    setIsStreaming(false);
    abortControllerRef.current?.abort();
  };

  const formatMessage = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("### ")) {
        return <h3 key={i} className="text-lg font-bold mt-3 mb-1 text-white">{line.replace("### ", "")}</h3>;
      }
      if (line.startsWith("## ")) {
        return <h2 key={i} className="text-xl font-bold mt-4 mb-2 text-white">{line.replace("## ", "")}</h2>;
      }
      if (line.startsWith("# ")) {
        return <h1 key={i} className="text-2xl font-bold mt-4 mb-2 text-white">{line.replace("# ", "")}</h1>;
      }
      if (line.includes("**")) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="my-1">
            {parts.map((part, j) =>
              j % 2 === 1 ? (
                <strong key={j} className="text-[#5EEAD4] font-semibold">{part}</strong>
              ) : (
                part
              )
            )}
          </p>
        );
      }
      if (line.startsWith("• ") || line.startsWith("- ") || line.match(/^\d+\./)) {
        const text = line.replace(/^[•\-]\s/, '').replace(/^\d+\.\s/, '');
        return <li key={i} className="ml-4 my-0.5 list-disc">{text}</li>;
      }
      if (line.startsWith("📚") || line.startsWith("*Reference") || line.startsWith("*Source")) {
        return <p key={i} className="my-2 text-sm text-[#94A3B8] italic">{line}</p>;
      }
      if (line.startsWith("```")) {
        return null; // Simple code block handling — skip fences
      }
      if (!line.trim()) return <br key={i} />;
      return <p key={i} className="my-1">{line}</p>;
    });
  };

  return (
    <div 
      className="flex h-[calc(100vh-8rem)] gap-4 page-transition -m-4 sm:-m-6 p-4 sm:p-6"
      style={{ backgroundColor: theme.background }}
    >
      {/* Left Panel - Context & Actions */}
      <div className="w-72 shrink-0 space-y-4 hidden lg:block">
        {/* Context Selector */}
        <Card className="border-[#1E3A5F] shadow-xl" style={{ backgroundColor: theme.cardBg }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#5BB3B3]" />
              Context
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {contextOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedContext(option.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedContext === option.id
                    ? "bg-[#5BB3B3]/20 text-[#22D3EE] font-medium"
                    : "text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-white"
                }`}
              >
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedContext === option.id ? "border-[#5BB3B3]" : "border-[#475569]"
                }`}>
                  {selectedContext === option.id && (
                    <span className="w-2 h-2 rounded-full bg-[#5BB3B3]" />
                  )}
                </span>
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card className="border-[#1E3A5F] shadow-xl" style={{ backgroundColor: theme.cardBg }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-[#5BB3B3]" />
                Attachments ({attachments.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-2 px-3 py-2 bg-[#162535] rounded-lg group border border-[#1E3A5F]"
              >
                {attachment.type === "image" ? (
                  <ImageIcon className="w-4 h-4 text-[#22D3EE]" />
                ) : (
                  <FileText className="w-4 h-4 text-[#5EEAD4]" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{attachment.name}</p>
                  <p className="text-[10px] text-[#94A3B8]">{attachment.size}</p>
                </div>
                <button
                  onClick={() => handleRemoveAttachment(attachment.id)}
                  className="opacity-0 group-hover:opacity-100 text-[#94A3B8] hover:text-[#E57373] transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddFile}
              className="w-full border-dashed border-[#1E3A5F] bg-transparent text-[#94A3B8] hover:text-[#5BB3B3] hover:border-[#5BB3B3] hover:bg-[#5BB3B3]/10"
            >
              <FileUp className="w-3 h-3 mr-2" />
              Add files
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-[#1E3A5F] shadow-xl" style={{ backgroundColor: theme.cardBg }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#5BB3B3]" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.id)}
                disabled={isStreaming}
                className="border-[#1E3A5F] bg-transparent hover:border-[#5BB3B3] hover:bg-[#5BB3B3]/10 text-[#94A3B8] hover:text-[#22D3EE] justify-start"
              >
                <action.icon className="w-3 h-3 mr-1.5 text-[#5BB3B3]" />
                <span className="text-xs">{action.label}</span>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Main Chat Area */}
      <Card 
        className="flex-1 backdrop-blur border-[#1E3A5F] overflow-hidden shadow-2xl flex flex-col"
        style={{ backgroundColor: theme.cardBg }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b border-[#1E3A5F]"
          style={{ background: `linear-gradient(135deg, ${theme.cardBg}, #0F2438)` }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div 
                className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5BB3B3] to-[#5EEAD4] flex items-center justify-center shadow-lg relative"
                style={{ boxShadow: `0 0 30px ${theme.glow}, 0 0 60px ${theme.glow}` }}
              >
                <Atom className="w-6 h-6 text-white" />
                {isStreaming && (
                  <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: theme.primary }} />
                )}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#1B2838] ${isStreaming ? 'bg-yellow-400' : 'bg-[#10B981]'}`} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                ATOM
                <Badge className="bg-[#5BB3B3]/20 text-[#22D3EE] border-[#5BB3B3]/30 text-xs">
                  {isStreaming ? 'Thinking...' : 'Online'}
                </Badge>
              </h1>
              <p className="text-sm text-[#94A3B8]">
                Talking to{" "}
                <span className="text-[#22D3EE] font-medium">
                  {contextOptions.find((c) => c.id === selectedContext)?.label}
                </span>
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="text-[#94A3B8] hover:text-white hover:bg-[#1E3A5F]"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages Area */}
        <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            style={{ backgroundColor: theme.background }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""} animate-fade-in`}
              >
                <Avatar
                  className="w-8 h-8 shrink-0 shadow-sm"
                  style={message.role === "assistant" ? {
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                    boxShadow: `0 0 15px ${theme.glow}`,
                  } : { backgroundColor: theme.primary }}
                >
                  <AvatarFallback className="bg-transparent text-white">
                    {message.role === "assistant" ? <Atom className="w-4 h-4" /> : "Y"}
                  </AvatarFallback>
                </Avatar>

                <div className={`max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === "user"
                        ? "bg-[#5BB3B3] text-white rounded-br-md"
                        : "bg-[#1B2838] border border-[#1E3A5F] rounded-bl-md"
                    }`}
                  >
                    <div className={message.role === "assistant" ? "text-[#E2E8F0] prose prose-sm max-w-none prose-invert" : ""}>
                      {message.role === "assistant"
                        ? formatMessage(message.content)
                        : message.content}
                    </div>

                    {message.isStreaming && !message.content && (
                      <div className="flex items-center gap-2 mt-2">
                        <Loader2 className="w-4 h-4 text-[#5BB3B3] animate-spin" />
                        <span className="text-xs text-[#94A3B8]">Searching library & thinking...</span>
                      </div>
                    )}

                    {message.isStreaming && message.content && (
                      <span className="inline-block w-2 h-4 bg-[#5BB3B3] animate-pulse ml-1" />
                    )}
                  </div>

                  {/* Message Actions */}
                  {message.role === "assistant" && !message.isStreaming && message.id !== "welcome" && (
                    <div className="flex items-center gap-1 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(message.id, message.content)}
                        className="h-7 px-2 text-xs text-[#94A3B8] hover:text-white hover:bg-[#1E3A5F]"
                      >
                        {copiedId === message.id ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                        {copiedId === message.id ? "Copied" : "Copy"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSaveAsNote(message)}
                        className={`h-7 px-2 text-xs ${
                          message.saved ? "text-[#5EEAD4]" : "text-[#94A3B8] hover:text-white hover:bg-[#1E3A5F]"
                        }`}
                      >
                        <StickyNote className="w-3 h-3 mr-1" />
                        {message.saved ? "Saved" : "Save as Note"}
                      </Button>
                    </div>
                  )}

                  <p className="text-[10px] text-[#64748B] mt-1 px-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[#1E3A5F]" style={{ backgroundColor: theme.cardBg }}>
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask ATOM anything..."
                  rows={1}
                  disabled={isStreaming}
                  className="w-full px-4 py-3 pr-12 bg-[#162535] border border-[#1E3A5F] rounded-xl resize-none focus:outline-none focus:border-[#5BB3B3] focus:ring-2 focus:ring-[#5BB3B3]/20 text-white placeholder-[#64748B] min-h-[48px] max-h-[120px] shadow-inner disabled:opacity-50"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAddFile}
                  className="absolute right-2 bottom-2 w-8 h-8 text-[#64748B] hover:text-[#5BB3B3] hover:bg-[#5BB3B3]/10"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              </div>
              {isStreaming ? (
                <Button
                  onClick={handleStop}
                  className="h-12 w-12 bg-red-500 hover:bg-red-600 rounded-xl shrink-0 shadow-lg"
                >
                  <X className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="h-12 w-12 bg-[#5BB3B3] hover:bg-[#22D3EE] rounded-xl shrink-0 disabled:opacity-50 shadow-lg"
                  style={{ boxShadow: `0 4px 20px ${theme.glow}` }}
                >
                  <Send className="w-5 h-5" />
                </Button>
              )}
            </div>
            <p className="text-[10px] text-[#64748B] mt-2 text-center">
              ATOM uses textbook content from your selected library. Always verify critical clinical information.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
