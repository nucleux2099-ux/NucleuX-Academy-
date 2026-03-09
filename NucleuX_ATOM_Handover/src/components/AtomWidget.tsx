"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  X, Send, Sparkles, Maximize2, Minimize2, Trash2, ArrowRight
} from 'lucide-react';
import { useATOM } from '@/lib/atom/provider';
import { useATOMStream } from '@/lib/atom/hooks/useATOMStream';
import { AgentPipeline } from './atom/AgentPipeline';
import { ATOM_ROOM_CONFIG } from '@/lib/types/atom';
import type { ATOMRoom, ATOMMessage } from '@/lib/types/atom';
import { deduplicateStreamingMessages, accumulatorIsEmpty } from '@/lib/atom/utils';

// Helper to reliably detect room from pathname (duplicates provider logic for reliable local overrides)
const PATHNAME_ROOM_MAP: [string, ATOMRoom][] = [
  ['/dashboard', 'desk'],
  ['/desk', 'desk'],
  ['/library', 'library'],
  ['/read/', 'library'],
  ['/classroom', 'classroom'],
  ['/watch/', 'classroom'],
  ['/exam-centre', 'training'],
  ['/mcqs', 'training'],
  ['/practice/', 'training'],
  ['/cbme', 'cbme'],
  ['/community', 'community'],
  ['/arena', 'arena'],
  ['/leaderboard', 'arena'],
  ['/backstage', 'backstage'],
  ['/analytics', 'backstage'],
  ['/graph', 'backstage'],
  ['/chat', 'studio'],
];

function detectRoom(pathname: string, activeStateRoom: ATOMRoom): ATOMRoom {
  for (const [prefix, room] of PATHNAME_ROOM_MAP) {
    if (pathname.startsWith(prefix)) return room;
  }
  return activeStateRoom || 'desk';
}

// =============================================================================
// DISPLAY MODE
// =============================================================================
type WidgetMode = 'collapsed' | 'expanded';

// =============================================================================
// ROOM CONFIG
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

const ROOM_SUGGESTIONS: Record<ATOMRoom, string[]> = {
  desk: ['Plan study session', 'My weak areas'],
  library: ['Explain this topic', 'Find related concepts'],
  classroom: ['Summarise lecture', 'Generate mind map'],
  training: ['Why was I wrong?', 'Similar questions'],
  cbme: ['My progress', 'Next milestones'],
  community: ['Add references', 'Summarise debate'],
  arena: ['My performance', 'Target weak areas'],
  backstage: ['Confidence check', 'Study patterns'],
  studio: ['Help me write', 'Generate flashcards'],
};

// =============================================================================
// COMPONENT
// =============================================================================

export function AtomWidget() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, dispatch } = useATOM();
  const { send, cancel, isStreaming } = useATOMStream();
  const [mode, setMode] = useState<WidgetMode>('collapsed');
  const [input, setInput] = useState('');
  const [model, setModel] = useState('claude-3-7-sonnet-20250219');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hide on /chat as it has its own UI
  if (pathname === '/chat') {
    return null;
  }

  // Determine current room from path reliably
  const room: ATOMRoom = detectRoom(pathname, state.activeRoom);

  const accent = ROOM_COLORS[room];
  const config = ATOM_ROOM_CONFIG[room];
  const suggestions = ROOM_SUGGESTIONS[room];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages.length]);

  // Focus input when exploring
  useEffect(() => {
    if (mode === 'expanded') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [mode]);

  const handleSend = useCallback(() => {
    if (!input.trim() || isStreaming) return;
    send(input.trim(), { room, model });
    setInput('');
  }, [input, isStreaming, send, room, model]);

  const handleSuggestion = useCallback((text: string) => {
    send(text, { room, model });
  }, [send, room, model]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Collapsed Mode (Floating Button)
  if (mode === 'collapsed') {
    return (
      <button
        onClick={() => setMode('expanded')}
        className="fixed bottom-20 lg:bottom-6 right-4 z-50 group shadow-xl"
        style={{ animation: 'float 3s ease-in-out infinite' }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-110 relative overflow-hidden border"
          style={{
            background: `linear-gradient(135deg, #364A5E, #3A4D5F)`,
            borderColor: `${accent}40`,
            boxShadow: `0 8px 32px ${accent}30`,
          }}
        >
          <Sparkles className="text-white relative z-10 w-6 h-6" />
          <div className="absolute inset-0 rounded-2xl animate-ping opacity-10" style={{ backgroundColor: accent }} />
        </div>
        <Badge
          className="absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5 shadow-lg border-0"
          style={{ backgroundColor: accent, color: '#2D3E50' }}
        >
          {config.persona}
        </Badge>
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
        `}</style>
      </button>
    );
  }

  // Expanded Mode (Chat Panel)
  const displayMessages = deduplicateStreamingMessages(state.messages, isStreaming);

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 w-80 sm:w-[26rem] h-[32rem] max-h-[85vh] animate-in slide-in-from-bottom-4 duration-300 flex flex-col rounded-2xl shadow-2xl overflow-hidden border bg-[#1E293B]"
      style={{ borderColor: `${accent}30` }}>

      {/* HEADER */}
      <div className="p-4 flex items-center justify-between" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-white flex items-center gap-2">
              ATOM v2
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="bg-white/10 text-white border-0 text-[10px] rounded-full px-2 py-0.5 outline-none appearance-none cursor-pointer hover:bg-white/20 transition-colors"
                title="Select Anthropic Model"
              >
                <option value="claude-3-7-sonnet-20250219" className="bg-[#1E293B] text-white">Claude 3.7 Sonnet</option>
                <option value="claude-3-5-sonnet-20241022" className="bg-[#1E293B] text-white">Claude 3.5 Sonnet</option>
                <option value="claude-3-5-haiku-20241022" className="bg-[#1E293B] text-white">Claude 3.5 Haiku</option>
                <option value="claude-3-opus-20240229" className="bg-[#1E293B] text-white">Claude 3 Opus</option>
              </select>
            </div>
            {/* Phase 5 MarketHub Plugins display */}
            <p className="text-white/80 text-xs flex items-center gap-1">
              Online • {state.installedPlugins.filter(p => p.isActive).length} Plugins Active
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => router.push('/chat')} className="text-white/80 hover:text-white hover:bg-white/20" title="Open full studio">
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => { cancel(); setMode('collapsed'); }} className="text-white/80 hover:text-white hover:bg-white/20">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* PHASE 3 AGENT PIPELINE TRACKER */}
      {state.activeAgents.length > 0 && (
        <div className="bg-[#2D3E50] border-b border-white/5 p-2 px-4 shadow-inner">
          <AgentPipeline agents={state.activeAgents} compact={true} />
        </div>
      )}

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#2D3E50]">
        {displayMessages.length === 0 ? (
          <div className="text-center py-6 text-white/50 space-y-4 flex flex-col items-center">
            <Sparkles size={32} color={accent} className="opacity-50" />
            <p className="text-sm">I'm connected to the Gateway. How can I help in the {config.label}?</p>
            <div className="flex gap-2 flex-wrap justify-center mt-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="text-xs px-3 py-1.5 rounded-full border transition-all hover:bg-white/5"
                  style={{ borderColor: `${accent}40`, color: accent }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          displayMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed break-words whitespace-pre-wrap ${msg.role === 'user' ? 'text-white rounded-br-sm' : 'bg-[#3A4D5F] border border-white/5 text-white/90 rounded-bl-sm'
                  }`}
                style={msg.role === 'user' ? { backgroundColor: accent } : {}}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}

        {isStreaming && accumulatorIsEmpty(state.messages) && (
          <div className="flex justify-start">
            <div className="bg-[#3A4D5F] border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: accent, animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: accent, animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: accent, animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 border-t border-white/5 bg-[#364A5E] flex items-center gap-2">
        {state.messages.length > 0 && (
          <button onClick={() => dispatch({ type: 'CLEAR_CONVERSATION' })} className="text-white/30 hover:text-white/60 p-2" aria-label="Clear">
            <Trash2 size={16} />
          </button>
        )}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask ATOM..."
          disabled={isStreaming}
          className="flex-1 bg-[#2D3E50] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 transition-all"
          style={{ '--tw-ring-color': accent } as any}
        />
        <Button
          size="icon"
          onClick={isStreaming ? cancel : handleSend}
          disabled={!isStreaming && !input.trim()}
          className="rounded-xl flex-shrink-0"
          style={{ backgroundColor: isStreaming ? '#EF4444' : accent, color: isStreaming ? 'white' : '#1E293B' }}
        >
          {isStreaming ? <X size={16} /> : <Send size={16} />}
        </Button>
      </div>

    </div>
  );
}

// =============================================================================
// RE-EXPORTS (shared utilities — canonical source is @/lib/atom/utils)
// =============================================================================

export { deduplicateStreamingMessages, accumulatorIsEmpty } from '@/lib/atom/utils';
