"use client";

/**
 * NucleuX Academy - AtomLibrarian (v2 Migration)
 *
 * Library-specific ATOM companion that surfaces topic suggestions,
 * quick actions (quiz, explain, plan), and contextual awareness of
 * the current reading material.
 *
 * Migrated to ATOM v2 infrastructure:
 * - Uses useATOM() for global state (messages, streaming, agents)
 * - Uses useATOMStream() for SSE streaming to /api/atom/chat
 * - Passes library-specific pageContext with current topic info
 *
 * The parent AtomWidget FAB is replaced by the global ATOMWidgetV2
 * on library pages; this component is now a sidebar/embedded panel.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  X,
  Send,
  Sparkles,
  BookOpen,
  Brain,
  Clock,
  ChevronRight,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useATOM } from "@/lib/atom/provider";
import { useATOMStream } from "@/lib/atom/hooks/useATOMStream";
import { deduplicateStreamingMessages, accumulatorIsEmpty } from "@/lib/atom/utils";
import type { LibraryTopic } from "@/lib/types/library";
import type { ATOMMessage } from "@/lib/types/atom";

// =============================================================================
// TYPES
// =============================================================================

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
    label: "What's next?",
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
// MAIN COMPONENT
// =============================================================================

export function AtomLibrarian({
  currentTopic,
  allTopics = [],
  completedTopics = [],
  userLevel = 'pg',
}: AtomLibrarianProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <AtomLibrarianFAB onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />

      {/* Chat panel */}
      <AtomLibrarianPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        currentTopic={currentTopic}
        allTopics={allTopics}
        completedTopics={completedTopics}
        userLevel={userLevel}
      />
    </>
  );
}

// =============================================================================
// FLOATING ACTION BUTTON
// =============================================================================

function AtomLibrarianFAB({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) {
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
      <div className="absolute inset-0 rounded-full bg-[#5BB3B3] animate-ping opacity-20" />
      <BookOpen
        className={cn(
          "w-6 h-6 text-white transition-transform duration-300",
          isOpen ? "rotate-90" : "group-hover:rotate-12"
        )}
      />
      {!isOpen && (
        <div className="absolute right-full mr-3 px-3 py-1.5 bg-[#2D3E50] text-[#E8E0D5] text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[rgba(91,179,179,0.2)]">
          Ask ATOM Librarian
        </div>
      )}
    </button>
  );
}

// =============================================================================
// CHAT PANEL (v2 — uses global ATOM state + streaming)
// =============================================================================

function AtomLibrarianPanel({
  isOpen,
  onClose,
  currentTopic,
  allTopics,
  completedTopics,
  userLevel,
}: AtomLibrarianProps & { isOpen: boolean; onClose: () => void }) {
  const { state, dispatch } = useATOM();
  const { send, cancel, isStreaming } = useATOMStream();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Build library-specific page context
  // Build library-specific page context conforming to ATOMPageContext
  const pageContext = currentTopic
    ? {
        room: 'library' as const,
        subject: currentTopic.subjectId,
        topicSlug: currentTopic.slug,
        activeContent: currentTopic.name,
      }
    : {
        room: 'library' as const,
      };

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages.length]);

  const handleSend = useCallback(() => {
    if (!input.trim() || isStreaming) return;
    send(input.trim(), { room: 'library', pageContext });
    setInput('');
  }, [input, isStreaming, send, pageContext]);

  const handleQuickAction = useCallback(
    (prompt: string) => {
      send(prompt, { room: 'library', pageContext });
    },
    [send, pageContext]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  if (!isOpen) return null;

  const displayMessages = deduplicateStreamingMessages(state.messages, isStreaming);

  // Get topic suggestions when conversation is empty or after certain queries
  const suggestions = getNextTopicSuggestions(currentTopic, allTopics ?? [], completedTopics ?? []);

  return (
    <div className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[600px] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <Card className="bg-[#2D3E50] border-[rgba(91,179,179,0.3)] shadow-2xl shadow-[rgba(91,179,179,0.1)] overflow-hidden flex flex-col max-h-[600px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5BB3B3] to-[#8B5CF6] p-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">ATOM Librarian</h3>
                <p className="text-xs text-white/80">
                  {isStreaming ? 'Thinking...' : 'Your Study Companion'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                cancel();
                onClose();
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Current topic context */}
          {currentTopic && (
            <div className="mt-3 p-2 bg-white/10 rounded-lg">
              <p className="text-xs text-white/70">Currently viewing:</p>
              <p className="text-sm text-white font-medium truncate">{currentTopic.name}</p>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#374151] scrollbar-track-transparent min-h-0">
          {displayMessages.length === 0 ? (
            <div className="text-center py-6 text-white/50 space-y-3">
              <Sparkles size={28} className="mx-auto text-[#5BB3B3] opacity-60" />
              <p className="text-sm">
                Hey! I'm ATOM, your study companion. Ask me anything about{' '}
                {currentTopic ? currentTopic.name : 'the library'}.
              </p>

              {/* Topic suggestions for empty state */}
              {suggestions.length > 0 && (
                <div className="mt-3 space-y-2 text-left">
                  <p className="text-xs text-white/40 text-center">Suggested next:</p>
                  {suggestions.map((sug) => (
                    <a
                      key={sug.topicId}
                      href={sug.url}
                      className="block p-2 bg-[#3A4D5F] rounded-lg hover:bg-[rgba(91,179,179,0.1)] transition-colors border border-[rgba(91,179,179,0.1)]"
                    >
                      <p className="text-sm font-medium text-[#5BB3B3]">{sug.topicName}</p>
                      <p className="text-xs text-[#A0B0BC] mt-0.5">{sug.reason}</p>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ) : (
            displayMessages.map((msg: ATOMMessage, idx: number) => (
              <div
                key={idx}
                className={cn(
                  'flex',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-3',
                    msg.role === 'user'
                      ? 'bg-[#5BB3B3] text-white rounded-br-sm'
                      : 'bg-[#3A4D5F] text-[#E8E0D5] rounded-bl-sm border border-[rgba(91,179,179,0.1)]'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
              </div>
            ))
          )}

          {/* Typing indicator */}
          {isStreaming && accumulatorIsEmpty(state.messages) && (
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
        <div className="px-4 py-2 border-t border-[rgba(91,179,179,0.1)] shrink-0">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.prompt)}
                disabled={isStreaming}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3A4D5F] hover:bg-[rgba(91,179,179,0.1)] rounded-full text-xs text-[#A0B0BC] hover:text-[#5BB3B3] transition-colors whitespace-nowrap border border-[rgba(91,179,179,0.1)] disabled:opacity-50"
              >
                <action.icon className="w-3.5 h-3.5" />
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[rgba(91,179,179,0.1)] shrink-0">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask ATOM anything..."
              disabled={isStreaming}
              className="flex-1 bg-[#3A4D5F] border-[rgba(91,179,179,0.2)] focus:border-[#5BB3B3] text-[#E8E0D5] placeholder:text-[#6B7280]"
            />
            <Button
              onClick={isStreaming ? cancel : handleSend}
              disabled={!isStreaming && !input.trim()}
              className="bg-[#5BB3B3] hover:bg-[#4A9E9E] text-[#2D3E50]"
            >
              {isStreaming ? <X className="w-4 h-4" /> : <Send className="w-4 h-4" />}
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
    return allTopics
      .filter((t) => (t.prerequisites?.length ?? 0) === 0)
      .slice(0, 3)
      .map((t) => ({
        topicId: t.id,
        topicName: t.name,
        reason: 'Great starting point — no prerequisites',
        url: `/library/surgery/esophagus/${t.slug}`,
      }));
  }

  const suggestions: TopicSuggestion[] = [];

  // Related topics
  (currentTopic.relatedTopics ?? []).forEach((relatedId) => {
    const topic = allTopics.find((t) => t.id === relatedId);
    if (topic && !completedTopics.includes(relatedId)) {
      suggestions.push({
        topicId: topic.id,
        topicName: topic.name,
        reason: `Related to ${currentTopic.name}`,
        url: `/library/surgery/esophagus/${topic.slug}`,
      });
    }
  });

  // Topics that have current as prerequisite
  allTopics.forEach((topic) => {
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

// Re-export sub-components for backwards compatibility
export { AtomLibrarianFAB as AtomWidget };
export { AtomLibrarianPanel as AtomChatPanel };
