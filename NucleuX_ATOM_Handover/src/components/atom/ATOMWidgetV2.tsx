/**
 * NucleuX Academy - ATOM v2: Chat Widget
 *
 * Three display modes:
 * 1. Collapsed — Floating Action Button with notification badge
 * 2. Compact   — 320×400px mini-chat with quick suggestions
 * 3. Expanded  — 480×80vh full panel with agent pipeline + sources
 *
 * Wired to ATOMProvider for state and useATOMStream for SSE.
 *
 * Spec: docs/specs/ATOM_FRONTEND_SPEC.md § ATOM Widget v2
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Send,
  Sparkles,
  Maximize2,
  Minimize2,
  Trash2,
  ChevronDown,
} from 'lucide-react';
import { useATOM } from '@/lib/atom/provider';
import { useATOMStream } from '@/lib/atom/hooks/useATOMStream';
import { deduplicateStreamingMessages, accumulatorIsEmpty } from '@/lib/atom/utils';
import { AgentPipeline } from './AgentPipeline';
import { ATOM_ROOM_CONFIG } from '@/lib/types/atom';
import type { ATOMRoom } from '@/lib/types/atom';

// =============================================================================
// DISPLAY MODE
// =============================================================================

type WidgetMode = 'collapsed' | 'compact' | 'expanded';

// =============================================================================
// ROOM SUGGESTIONS
// =============================================================================

const ROOM_SUGGESTIONS: Record<ATOMRoom, string[]> = {
  desk: ['Plan my study session', 'Show weak areas', 'What should I review?'],
  library: ['Explain this topic', 'Find related concepts', 'Quiz me on this'],
  classroom: ['Summarise the lecture', 'Generate mind map', 'Key takeaways'],
  training: ['Why was I wrong?', 'Explain this concept', 'Similar questions'],
  cbme: ['My competency progress', 'Next milestones', 'Gap analysis'],
  community: ['Fact-check this claim', 'Add references', 'Summarise debate'],
  arena: ['My performance analysis', 'Target weak areas', 'Strategy tips'],
  backstage: ['Confidence calibration', 'Learning style check', 'Study patterns'],
  studio: ['Help me write', 'Generate flashcards', 'Create a summary'],
};

// =============================================================================
// COLORS
// =============================================================================

const ROOM_COLORS: Record<ATOMRoom, string> = {
  desk: '#5BB3B3',
  library: '#5BB3B3',
  classroom: '#5BB3B3',
  training: '#C9A86C',
  cbme: '#8B5CF6',
  community: '#5BB3B3',
  arena: '#F59E0B',
  backstage: '#A78BFA',
  studio: '#EC4899',
};

// =============================================================================
// COMPONENT
// =============================================================================

interface ATOMWidgetV2Props {
  /** Hide on specific paths (e.g., /chat has its own full-page UI) */
  hiddenPaths?: string[];
}

export function ATOMWidgetV2({ hiddenPaths = ['/chat'] }: ATOMWidgetV2Props) {
  const pathname = usePathname();
  const { state, dispatch } = useATOM();
  const { send, cancel, isStreaming } = useATOMStream();
  const [mode, setMode] = useState<WidgetMode>('collapsed');
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hide on specified paths
  if (hiddenPaths.some((p) => pathname.startsWith(p))) return null;

  const room = state.activeRoom;
  const accent = ROOM_COLORS[room];
  const config = ATOM_ROOM_CONFIG[room];
  const suggestions = ROOM_SUGGESTIONS[room];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages.length]);

  // Focus input when opening
  useEffect(() => {
    if (mode !== 'collapsed') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [mode]);

  const handleSend = useCallback(() => {
    if (!input.trim() || isStreaming) return;
    send(input.trim());
    setInput('');
  }, [input, isStreaming, send]);

  const handleSuggestion = useCallback(
    (text: string) => {
      send(text);
    },
    [send]
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

  // ===== COLLAPSED MODE =====
  if (mode === 'collapsed') {
    return (
      <button
        onClick={() => setMode('compact')}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${accent}, ${accent}CC)`,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 20px ${accent}40`,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          zIndex: 9999,
        }}
        aria-label="Open ATOM"
      >
        <Sparkles size={24} color="white" />
        {state.unreadInsightCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#EF4444',
              color: 'white',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {state.unreadInsightCount > 9 ? '9+' : state.unreadInsightCount}
          </span>
        )}
      </button>
    );
  }

  // ===== COMPACT & EXPANDED MODES =====
  const isExpanded = mode === 'expanded';
  const width = isExpanded ? 480 : 340;
  const height = isExpanded ? '80vh' : '420px';

  // Deduplicate streaming messages: during streaming, content_delta dispatches
  // ADD_MESSAGE for every token. We only show the latest assistant message.
  const displayMessages = deduplicateStreamingMessages(state.messages, isStreaming);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: `${width}px`,
        maxHeight: height,
        borderRadius: '16px',
        background: '#1E293B',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 9999,
        transition: 'width 0.3s ease, max-height 0.3s ease',
      }}
    >
      {/* ─── HEADER ─── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color={accent} />
          <span style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>
            ATOM
          </span>
          <Badge
            variant="outline"
            style={{
              fontSize: '10px',
              color: accent,
              borderColor: `${accent}40`,
              padding: '1px 6px',
            }}
          >
            {config.persona}
          </Badge>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={() => setMode(isExpanded ? 'compact' : 'expanded')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: 'rgba(255,255,255,0.5)',
            }}
            aria-label={isExpanded ? 'Compact mode' : 'Expand'}
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            onClick={() => {
              cancel();
              setMode('collapsed');
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: 'rgba(255,255,255,0.5)',
            }}
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* ─── AGENT PIPELINE (expanded only) ─── */}
      {isExpanded && state.activeAgents.length > 0 && (
        <div style={{ padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <AgentPipeline agents={state.activeAgents} compact={false} />
        </div>
      )}

      {/* ─── AGENT PIPELINE (compact — minimal) ─── */}
      {!isExpanded && state.activeAgents.length > 0 && (
        <div style={{ padding: '4px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <AgentPipeline agents={state.activeAgents} compact={true} />
        </div>
      )}

      {/* ─── MESSAGES ─── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {displayMessages.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '24px 12px',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            <Sparkles
              size={32}
              color={accent}
              style={{ margin: '0 auto 12px' }}
            />
            <p style={{ fontSize: '13px', marginBottom: '16px' }}>
              {config.persona} mode active.
              <br />
              How can I help?
            </p>

            {/* Suggestions */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                alignItems: 'stretch',
              }}
            >
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  style={{
                    background: `${accent}15`,
                    border: `1px solid ${accent}30`,
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.2s',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {displayMessages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} accent={accent} />
        ))}

        {isStreaming && accumulatorIsEmpty(state.messages) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '12px',
            }}
          >
            <span style={{ animation: 'atomPulse 1.5s ease-in-out infinite' }}>
              ●
            </span>
            ATOM is thinking...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ─── INPUT BAR ─── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 12px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        {state.messages.length > 0 && (
          <button
            onClick={() => dispatch({ type: 'CLEAR_CONVERSATION' })}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.3)',
              padding: '4px',
              flexShrink: 0,
            }}
            aria-label="Clear conversation"
          >
            <Trash2 size={14} />
          </button>
        )}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask ATOM..."
          disabled={isStreaming}
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            padding: '8px 12px',
            color: 'white',
            fontSize: '13px',
            outline: 'none',
          }}
        />
        <Button
          size="sm"
          onClick={isStreaming ? cancel : handleSend}
          disabled={!isStreaming && !input.trim()}
          style={{
            background: isStreaming ? '#EF4444' : accent,
            border: 'none',
            borderRadius: '8px',
            padding: '8px',
            flexShrink: 0,
          }}
        >
          {isStreaming ? <X size={14} /> : <Send size={14} />}
        </Button>
      </div>

      {/* Global animation keyframes */}
      <style>{`
        @keyframes atomPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function MessageBubble({
  message,
  accent,
}: {
  message: { role: string; content: string; timestamp: string };
  accent: string;
}) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      <div
        style={{
          maxWidth: '85%',
          padding: '8px 12px',
          borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
          background: isUser
            ? `${accent}25`
            : isSystem
              ? 'rgba(239, 68, 68, 0.1)'
              : 'rgba(255,255,255,0.06)',
          border: isSystem
            ? '1px solid rgba(239, 68, 68, 0.2)'
            : '1px solid rgba(255,255,255,0.04)',
          color: isSystem ? '#FCA5A5' : 'rgba(255,255,255,0.9)',
          fontSize: '13px',
          lineHeight: '1.5',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {message.content}
      </div>
    </div>
  );
}

