/**
 * NucleuX Academy - ATOM v2: useATOMStream Hook
 *
 * SSE streaming hook that connects to POST /api/atom/chat,
 * parses ATOMStreamEvent objects, and dispatches state updates
 * to the ATOMProvider.
 *
 * Handles:
 * - Agent status tracking (agent_start / agent_complete)
 * - Content delta accumulation into assistant messages
 * - Conversation ID assignment on content_complete
 * - Memory write notifications
 * - Error events with graceful degradation
 * - AbortController for cancellation
 *
 * Spec: docs/specs/ATOM_FRONTEND_SPEC.md § useATOMStream
 */

'use client';

import { useCallback, useRef } from 'react';
import type {
  ATOMRoom,
  ATOMStreamEvent,
  ATOMPageContext,
  ATOMMessage,
  AgentStatus,
} from '@/lib/types/atom';
import { useATOM } from '../provider';

// =============================================================================
// TYPES
// =============================================================================

export interface StreamOptions {
  /** Override the detected room */
  room?: ATOMRoom;
  /** Continue an existing conversation */
  conversationId?: string;
  /** Page-level context (current topic, subject, etc.) */
  pageContext?: ATOMPageContext;
  /** Override the Claude model to use */
  model?: string;
}

export interface UseATOMStreamReturn {
  /** Send a message and start streaming the response */
  send: (message: string, options?: StreamOptions) => Promise<void>;
  /** Cancel the current stream */
  cancel: () => void;
  /** Whether a stream is currently active */
  isStreaming: boolean;
}

// =============================================================================
// HOOK
// =============================================================================

export function useATOMStream(): UseATOMStreamReturn {
  const { state, dispatch } = useATOM();
  const abortRef = useRef<AbortController | null>(null);
  const accumulatorRef = useRef('');

  /**
   * Cancel any active stream.
   */
  const cancel = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    dispatch({ type: 'SET_STREAMING', isStreaming: false });
    dispatch({ type: 'CLEAR_AGENTS' });
  }, [dispatch]);

  /**
   * Send a user message and stream the ATOM response.
   */
  const send = useCallback(
    async (message: string, options?: StreamOptions) => {
      if (!message.trim()) return;
      if (state.isStreaming) {
        cancel();
      }

      // Add the user message to state
      const userMsg: ATOMMessage = {
        role: 'user',
        content: message.trim(),
        timestamp: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_MESSAGE', message: userMsg });

      // Prepare request
      const room = options?.room ?? state.activeRoom;
      const controller = new AbortController();
      abortRef.current = controller;
      accumulatorRef.current = '';

      dispatch({ type: 'SET_STREAMING', isStreaming: true });
      dispatch({ type: 'CLEAR_AGENTS' });
      dispatch({ type: 'SET_CONNECTION_STATUS', status: 'connecting' });

      try {
        const response = await fetch('/api/atom/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: message.trim(),
            room,
            conversationId: options?.conversationId ?? state.conversationId,
            pageContext: options?.pageContext,
            model: options?.model,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          throw new Error(
            (errorBody as Record<string, string>).error ??
            `Request failed with status ${response.status}`
          );
        }

        dispatch({ type: 'SET_CONNECTION_STATUS', status: 'connected' });

        // Parse SSE stream
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE lines
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? ''; // Keep incomplete line in buffer

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (!data || data === '[DONE]') continue;

            try {
              const event = JSON.parse(data) as ATOMStreamEvent;
              handleEvent(event, dispatch, accumulatorRef);
            } catch {
              // Skip malformed JSON lines
            }
          }
        }

        // Finalize: if accumulator has content, add the complete assistant message
        if (accumulatorRef.current) {
          dispatch({
            type: 'ADD_MESSAGE',
            message: {
              role: 'assistant',
              content: accumulatorRef.current,
              timestamp: new Date().toISOString(),
            },
          });
          accumulatorRef.current = '';
        }
      } catch (error: unknown) {
        if ((error as Error).name === 'AbortError') {
          // User cancelled — not an error
          return;
        }

        dispatch({
          type: 'SET_CONNECTION_STATUS',
          status: 'error',
        });

        // Add error as a system message
        dispatch({
          type: 'ADD_MESSAGE',
          message: {
            role: 'system',
            content: `Error: ${(error as Error).message ?? 'Something went wrong'}`,
            timestamp: new Date().toISOString(),
          },
        });
      } finally {
        dispatch({ type: 'SET_STREAMING', isStreaming: false });
        abortRef.current = null;
      }
    },
    [state.isStreaming, state.activeRoom, state.conversationId, cancel, dispatch]
  );

  return {
    send,
    cancel,
    isStreaming: state.isStreaming,
  };
}

// =============================================================================
// EVENT HANDLER
// =============================================================================

/**
 * Process a single SSE event and dispatch the appropriate state update.
 * Content deltas are accumulated in the ref and only committed as a
 * full message on content_complete (or stream end).
 */
function handleEvent(
  event: ATOMStreamEvent,
  dispatch: React.Dispatch<import('@/lib/types/atom').ATOMAction>,
  accumulatorRef: React.MutableRefObject<string>
) {
  switch (event.type) {
    case 'agent_start': {
      const agentStatus: AgentStatus = {
        agentId: event.agentId,
        label: event.label,
        status: 'thinking',
        startedAt: new Date().toISOString(),
      };
      dispatch({ type: 'SET_AGENT_STATUS', agentId: event.agentId, status: agentStatus });
      break;
    }

    case 'agent_complete': {
      const completed: AgentStatus = {
        agentId: event.agentId,
        label: '', // Will be merged with existing
        status: 'complete',
        completedAt: new Date().toISOString(),
        resultSummary: event.resultSummary,
      };
      dispatch({ type: 'SET_AGENT_STATUS', agentId: event.agentId, status: completed });
      break;
    }

    case 'content_delta':
      // Accumulate text chunks — don't dispatch per-token for performance.
      // The component reads from state.isStreaming + the accumulated ref.
      accumulatorRef.current += event.content;

      // Dispatch a synthetic message update so the UI re-renders with partial content.
      // We replace the last assistant message or add a new one.
      dispatch({
        type: 'ADD_MESSAGE',
        message: {
          role: 'assistant',
          content: accumulatorRef.current,
          timestamp: new Date().toISOString(),
        },
      });
      break;

    case 'content_complete':
      // Finalize the conversation ID
      dispatch({
        type: 'SET_CONVERSATION_ID',
        conversationId: event.conversationId,
      });
      break;

    case 'memory_written':
      // Could trigger a subtle notification toast
      break;

    case 'error':
      dispatch({
        type: 'ADD_MESSAGE',
        message: {
          role: 'system',
          content: `[${event.code}] ${event.message}`,
          timestamp: new Date().toISOString(),
        },
      });
      break;
  }
}
