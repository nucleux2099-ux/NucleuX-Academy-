/**
 * NucleuX Academy - ATOM v2: Agent Pipeline Visualization
 *
 * Displays active agent statuses in a compact pipeline strip.
 * Each agent shows as a small badge that transitions through
 * idle → thinking (pulse animation) → complete (checkmark).
 *
 * Used inside the ATOMWidget expanded mode and the ATOM Panel.
 */

'use client';

import React from 'react';
import type { AgentStatus } from '@/lib/types/atom';

// =============================================================================
// CONSTANTS
// =============================================================================

/** Agent display configuration */
const AGENT_COLORS: Record<string, string> = {
  scribe: '#60A5FA',    // blue-400
  memorist: '#A78BFA',  // violet-400
  router: '#F59E0B',    // amber-500
  retriever: '#34D399',  // emerald-400
  critic: '#FB7185',    // rose-400
  assembler: '#38BDF8', // sky-400
  generator: '#5BB3B3', // teal (brand)
};

const AGENT_ICONS: Record<string, string> = {
  scribe: '✍️',
  memorist: '🧠',
  router: '🔀',
  retriever: '🔍',
  critic: '🛡️',
  assembler: '📦',
  generator: '⚡',
};

// =============================================================================
// COMPONENT
// =============================================================================

interface AgentPipelineProps {
  agents: AgentStatus[];
  /** Compact mode hides labels */
  compact?: boolean;
}

export function AgentPipeline({ agents, compact = false }: AgentPipelineProps) {
  if (agents.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: compact ? '4px' : '6px',
        padding: compact ? '4px 8px' : '6px 10px',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.04)',
        overflowX: 'auto',
      }}
    >
      {agents.map((agent, idx) => (
        <React.Fragment key={agent.agentId}>
          {idx > 0 && (
            <span
              style={{
                color: 'rgba(255,255,255,0.2)',
                fontSize: '10px',
                flexShrink: 0,
              }}
            >
              →
            </span>
          )}
          <AgentBadge agent={agent} compact={compact} />
        </React.Fragment>
      ))}
    </div>
  );
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function AgentBadge({
  agent,
  compact,
}: {
  agent: AgentStatus;
  compact: boolean;
}) {
  const color = AGENT_COLORS[agent.agentId] ?? '#9CA3AF';
  const icon = AGENT_ICONS[agent.agentId] ?? '⚙️';
  const isThinking = agent.status === 'thinking';
  const isComplete = agent.status === 'complete';
  const isError = agent.status === 'error';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: compact ? '2px 6px' : '3px 8px',
        borderRadius: '6px',
        background: isThinking
          ? `${color}20`
          : isComplete
            ? `${color}15`
            : isError
              ? 'rgba(239, 68, 68, 0.15)'
              : 'rgba(255,255,255,0.05)',
        border: `1px solid ${isThinking ? `${color}40` : isComplete ? `${color}30` : 'transparent'}`,
        transition: 'all 0.3s ease',
        flexShrink: 0,
        ...(isThinking
          ? {
              animation: 'atomPulse 1.5s ease-in-out infinite',
            }
          : {}),
      }}
    >
      <span style={{ fontSize: compact ? '10px' : '12px' }}>
        {isComplete ? '✓' : isError ? '✗' : icon}
      </span>
      {!compact && (
        <span
          style={{
            fontSize: '11px',
            color: isComplete ? color : 'rgba(255,255,255,0.7)',
            fontWeight: isThinking ? 600 : 400,
            whiteSpace: 'nowrap',
          }}
        >
          {agent.label || agent.agentId}
        </span>
      )}
      <style>{`
        @keyframes atomPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

// =============================================================================
// SOURCE ATTRIBUTION
// =============================================================================

export interface SourceItem {
  title: string;
  relevance: number;
  type: 'textbook' | 'note' | 'lecture' | 'guideline' | 'community';
}

interface SourceListProps {
  sources: SourceItem[];
  maxVisible?: number;
}

export function SourceList({ sources, maxVisible = 3 }: SourceListProps) {
  const visible = sources.slice(0, maxVisible);
  const remaining = sources.length - maxVisible;

  if (sources.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span
        style={{
          fontSize: '10px',
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        Sources
      </span>
      {visible.map((src, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '3px 6px',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.04)',
            fontSize: '11px',
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.7)' }}>{src.title}</span>
          <span
            style={{
              color: src.relevance > 0.8 ? '#34D399' : src.relevance > 0.5 ? '#FBBF24' : '#9CA3AF',
              fontSize: '10px',
              fontFamily: 'monospace',
            }}
          >
            {Math.round(src.relevance * 100)}%
          </span>
        </div>
      ))}
      {remaining > 0 && (
        <span
          style={{
            fontSize: '10px',
            color: 'rgba(255,255,255,0.3)',
            paddingLeft: '6px',
          }}
        >
          +{remaining} more
        </span>
      )}
    </div>
  );
}
