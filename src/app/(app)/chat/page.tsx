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
  Download,
  Loader2,
  CheckCircle2,
  Image as ImageIcon,
  FileUp,
  Atom,
} from "lucide-react";

// Dark theme colors
const theme = {
  background: '#0D1B2A',
  cardBg: '#1B2838',
  primary: '#06B6D4',
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

interface ProgressStep {
  step: string;
  progress: number;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  saved?: boolean;
  status?: "thinking" | "working" | "done";
  progress?: ProgressStep[];
  attachment?: {
    type: string;
    name: string;
    slides?: number;
  };
}

const contextOptions = [
  { id: "full", label: "Full Campus", icon: "🏫" },
  { id: "surgery", label: "Surgery Library", icon: "🔪" },
  { id: "medicine", label: "Medicine Library", icon: "💊" },
  { id: "harrisons", label: "Harrison's Only", icon: "📕" },
  { id: "robbins", label: "Robbins Only", icon: "📗" },
  { id: "bailey", label: "Bailey & Love", icon: "📘" },
  { id: "shackelford", label: "Shackelford", icon: "📙" },
];

const quickActions = [
  { id: "ppt", icon: Presentation, label: "Generate PPT" },
  { id: "summarize", icon: FileText, label: "Summarize" },
  { id: "flashcards", icon: Brain, label: "Flashcards" },
  { id: "quiz", icon: HelpCircle, label: "Quiz Me" },
];

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: `Welcome back, Sarath! 👋

I'm **ATOM**, your AI companion for mastering medicine.

I can help you:
• **Answer questions** with textbook references
• **Generate PPTs** & summaries
• **Create flashcards** for spaced repetition
• **Explain concepts** atomically

Currently talking to: **📚 Surgery Library**

What would you like to learn today?`,
    timestamp: new Date(),
    status: "done",
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedContext, setSelectedContext] = useState("surgery");
  const [attachments, setAttachments] = useState<Attachment[]>([
    { id: "1", name: "xray-chest.jpg", type: "image", size: "1.2 MB" },
    { id: "2", name: "ct-abdomen.pdf", type: "pdf", size: "3.4 MB" },
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateATOMResponse = useCallback(() => {
    const messageId = crypto.randomUUID();
    const thinkingMessage: Message = {
      id: messageId,
      role: "assistant",
      content: "Let me check the relevant sources...",
      timestamp: new Date(),
      status: "thinking",
    };
    setMessages((prev) => [...prev, thinkingMessage]);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkingMessage.id
            ? {
                ...m,
                content: "I'll create that for you!",
                status: "working",
                progress: [
                  { step: "Reading Shackelford Ch. 35...", progress: 100 },
                  { step: "Found 8 relevant sections", progress: 100 },
                  { step: "Generating PPT structure...", progress: 100 },
                  { step: "Creating slides...", progress: 60 },
                ],
              }
            : m
        )
      );
    }, 1000);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkingMessage.id
            ? {
                ...m,
                progress: [
                  { step: "Reading Shackelford Ch. 35...", progress: 100 },
                  { step: "Found 8 relevant sections", progress: 100 },
                  { step: "Generating PPT structure...", progress: 100 },
                  { step: "Creating slides...", progress: 100 },
                ],
              }
            : m
        )
      );
    }, 2000);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkingMessage.id
            ? {
                ...m,
                content: `✅ **Done!** I've created a 12-slide presentation covering:

• **Gastric conduit** (most common)
• **Colon interposition**
• **Jejunal free grafts**
• **Outcomes & complications**

Based on Shackelford 9th Ed, Ch. 35

📚 *Reference: Shackelford's Surgery of the Alimentary Tract, 9th Ed, Ch. 35 - Esophageal Replacement*`,
                status: "done",
                progress: undefined,
                attachment: {
                  type: "ppt",
                  name: "Esophageal_Replacement_Methods.pptx",
                  slides: 12,
                },
              }
            : m
        )
      );
      setIsTyping(false);
    }, 3500);
  }, []);

  const handleSend = useCallback(async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    simulateATOMResponse();
  }, [input, simulateATOMResponse]);

  const handleQuickAction = (actionId: string) => {
    const prompts: Record<string, string> = {
      ppt: "Create a PPT on esophageal replacement methods and outcomes",
      summarize: "Summarize the key points of portal hypertension management",
      flashcards: "Create flashcards for hepatobiliary anatomy",
      quiz: "Quiz me on gastric cancer staging with 5 MCQs",
    };
    handleSend(prompts[actionId]);
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

  const handleAddFile = () => {
    fileInputRef.current?.click();
  };

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

  const formatMessage = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("## ")) {
        return (
          <h2 key={i} className="text-xl font-bold mt-4 mb-2 text-white">
            {line.replace("## ", "")}
          </h2>
        );
      }
      if (line.includes("**")) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="my-1">
            {parts.map((part, j) =>
              j % 2 === 1 ? (
                <strong key={j} className="text-[#5EEAD4] font-semibold">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      }
      if (line.startsWith("• ") || line.startsWith("- ")) {
        return (
          <li key={i} className="ml-4 my-0.5 list-disc">
            {line.replace(/^[•-] /, "")}
          </li>
        );
      }
      if (line.startsWith("📚") || line.startsWith("*Reference")) {
        return (
          <p key={i} className="my-2 text-sm text-[#94A3B8] italic">
            {line}
          </p>
        );
      }
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

  const renderProgress = (progress: ProgressStep[]) => {
    return (
      <div className="space-y-2 mt-3">
        {progress.map((step, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center gap-2">
              {step.progress === 100 ? (
                <CheckCircle2 className="w-3 h-3 text-[#5EEAD4]" />
              ) : (
                <Loader2 className="w-3 h-3 text-[#06B6D4] animate-spin" />
              )}
              <span className="text-xs text-[#94A3B8]">{step.step}</span>
            </div>
            <div className="h-1.5 bg-[#1E3A5F] rounded-full overflow-hidden ml-5">
              <div
                className="h-full bg-gradient-to-r from-[#06B6D4] to-[#5EEAD4] rounded-full transition-all duration-500"
                style={{ width: `${step.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
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
              <BookOpen className="w-4 h-4 text-[#06B6D4]" />
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
                    ? "bg-[#06B6D4]/20 text-[#22D3EE] font-medium"
                    : "text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-white"
                }`}
              >
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedContext === option.id
                    ? "border-[#06B6D4]"
                    : "border-[#475569]"
                }`}>
                  {selectedContext === option.id && (
                    <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
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
                <Paperclip className="w-4 h-4 text-[#06B6D4]" />
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
                  <p className="text-xs font-medium text-white truncate">
                    {attachment.name}
                  </p>
                  <p className="text-[10px] text-[#94A3B8]">{attachment.size}</p>
                </div>
                <button
                  onClick={() => handleRemoveAttachment(attachment.id)}
                  className="opacity-0 group-hover:opacity-100 text-[#94A3B8] hover:text-[#EF4444] transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddFile}
              className="w-full border-dashed border-[#1E3A5F] bg-transparent text-[#94A3B8] hover:text-[#06B6D4] hover:border-[#06B6D4] hover:bg-[#06B6D4]/10"
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
              <Lightbulb className="w-4 h-4 text-[#06B6D4]" />
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
                className="border-[#1E3A5F] bg-transparent hover:border-[#06B6D4] hover:bg-[#06B6D4]/10 text-[#94A3B8] hover:text-[#22D3EE] justify-start"
              >
                <action.icon className="w-3 h-3 mr-1.5 text-[#06B6D4]" />
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
              {/* ATOM Avatar with glow */}
              <div 
                className="w-12 h-12 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#5EEAD4] flex items-center justify-center shadow-lg relative"
                style={{ 
                  boxShadow: `0 0 30px ${theme.glow}, 0 0 60px ${theme.glow}`,
                }}
              >
                <Atom className="w-6 h-6 text-white" />
                {/* Animated ring */}
                <div 
                  className="absolute inset-0 rounded-full animate-ping opacity-30"
                  style={{ backgroundColor: theme.primary }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10B981] rounded-full border-2 border-[#1B2838]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                ATOM
                <Badge className="bg-[#06B6D4]/20 text-[#22D3EE] border-[#06B6D4]/30 text-xs">
                  AI Companion
                </Badge>
              </h1>
              <p className="text-sm text-[#94A3B8]">
                Online • Talking to{" "}
                <span className="text-[#22D3EE] font-medium">
                  {contextOptions.find((c) => c.id === selectedContext)?.label}
                </span>
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMessages(initialMessages)}
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
                className={`flex gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                } animate-fade-in`}
              >
                {/* Avatar */}
                <Avatar
                  className={`w-8 h-8 shrink-0 shadow-sm ${
                    message.role === "assistant"
                      ? ""
                      : ""
                  }`}
                  style={message.role === "assistant" ? {
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                    boxShadow: `0 0 15px ${theme.glow}`,
                  } : { backgroundColor: theme.primary }}
                >
                  <AvatarFallback
                    className={
                      message.role === "assistant"
                        ? "bg-transparent text-white"
                        : "bg-transparent text-white"
                    }
                  >
                    {message.role === "assistant" ? (
                      <Atom className="w-4 h-4" />
                    ) : (
                      "S"
                    )}
                  </AvatarFallback>
                </Avatar>

                {/* Message Bubble */}
                <div className={`max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === "user"
                        ? "bg-[#06B6D4] text-white rounded-br-md"
                        : "bg-[#1B2838] border border-[#1E3A5F] rounded-bl-md"
                    }`}
                  >
                    <div
                      className={
                        message.role === "assistant"
                          ? "text-[#E2E8F0] prose prose-sm max-w-none prose-invert"
                          : ""
                      }
                    >
                      {message.role === "assistant"
                        ? formatMessage(message.content)
                        : message.content}
                    </div>

                    {/* Progress Indicators */}
                    {message.status === "thinking" && (
                      <div className="flex items-center gap-2 mt-2">
                        <Loader2 className="w-4 h-4 text-[#06B6D4] animate-spin" />
                        <span className="text-xs text-[#94A3B8]">Thinking...</span>
                      </div>
                    )}

                    {message.status === "working" && message.progress && renderProgress(message.progress)}

                    {/* Attachment Download */}
                    {message.attachment && (
                      <div className="mt-3 p-3 bg-[#162535] rounded-lg border border-[#1E3A5F]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#06B6D4]/20 flex items-center justify-center">
                            <Presentation className="w-5 h-5 text-[#06B6D4]" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">
                              {message.attachment.name}
                            </p>
                            <p className="text-xs text-[#94A3B8]">
                              {message.attachment.slides} slides • Ready to download
                            </p>
                          </div>
                          <Button
                            size="sm"
                            className="bg-[#06B6D4] hover:bg-[#22D3EE] text-white"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message Actions */}
                  {message.role === "assistant" && message.status === "done" && (
                    <div className="flex items-center gap-1 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(message.id, message.content)}
                        className="h-7 px-2 text-xs text-[#94A3B8] hover:text-white hover:bg-[#1E3A5F]"
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
                            ? "text-[#5EEAD4]"
                            : "text-[#94A3B8] hover:text-white hover:bg-[#1E3A5F]"
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
            {isTyping && messages[messages.length - 1]?.status !== "thinking" && 
              messages[messages.length - 1]?.status !== "working" && (
              <div className="flex gap-3 animate-fade-in">
                <Avatar 
                  className="w-8 h-8 shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                    boxShadow: `0 0 15px ${theme.glow}`,
                  }}
                >
                  <AvatarFallback className="bg-transparent text-white">
                    <Atom className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-[#1B2838] border border-[#1E3A5F] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#06B6D4] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-[#06B6D4] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-[#06B6D4] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

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
                  className="w-full px-4 py-3 pr-12 bg-[#162535] border border-[#1E3A5F] rounded-xl resize-none focus:outline-none focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 text-white placeholder-[#64748B] min-h-[48px] max-h-[120px] shadow-inner"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAddFile}
                  className="absolute right-2 bottom-2 w-8 h-8 text-[#64748B] hover:text-[#06B6D4] hover:bg-[#06B6D4]/10"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="h-12 w-12 bg-[#06B6D4] hover:bg-[#22D3EE] rounded-xl shrink-0 disabled:opacity-50 shadow-lg"
                style={{ boxShadow: `0 4px 20px ${theme.glow}` }}
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
