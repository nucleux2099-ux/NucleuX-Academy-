/**
 * NucleuX Academy - ATOM v2: ATOMProvider
 *
 * Global state context for all ATOM frontend interactions.
 * Manages sessions, conversations, agent status, memory,
 * plugins, and proactive insights via React Context + useReducer.
 *
 * Auto-detects the current room from the Next.js pathname.
 *
 * Spec: docs/specs/ATOM_FRONTEND_SPEC.md § ATOMProvider
 */

'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import type {
  ATOMRoom,
  ATOMState,
  ATOMAction,
  ATOMMessage,
  ATOMConnectionStatus,
  AgentStatus,
  AgentId,
  ATOMUserMemory,
  InstalledPlugin,
  ATOMProactiveInsight,
  StudentProfile,
} from '@/lib/types/atom';

// =============================================================================
// ROOM DETECTION
// =============================================================================

/** Map pathname prefixes to ATOM rooms */
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

/** Detect ATOM room from the current pathname */
function detectRoom(pathname: string): ATOMRoom {
  for (const [prefix, room] of PATHNAME_ROOM_MAP) {
    if (pathname.startsWith(prefix)) return room;
  }
  return 'desk'; // Default fallback
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState: ATOMState = {
  activeRoom: 'desk',
  sessionId: null,
  conversationId: null,
  connectionStatus: 'disconnected',
  messages: [],
  isStreaming: false,
  activeAgents: [],
  recentMemories: [],
  memoryEnabled: true,
  installedPlugins: [],
  activeRoomPlugins: [],
  proactiveInsights: [],
  unreadInsightCount: 0,
  studentProfile: null,
};

// =============================================================================
// REDUCER
// =============================================================================

function atomReducer(state: ATOMState, action: ATOMAction): ATOMState {
  switch (action.type) {
    case 'SET_ROOM':
      return {
        ...state,
        activeRoom: action.room,
        // Clear agents when switching rooms
        activeAgents: [],
      };

    case 'SET_CONNECTION_STATUS':
      return { ...state, connectionStatus: action.status };

    case 'SET_CONVERSATION_ID':
      return { ...state, conversationId: action.conversationId };

    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message],
      };

    case 'SET_STREAMING':
      return { ...state, isStreaming: action.isStreaming };

    case 'SET_AGENT_STATUS': {
      const existing = state.activeAgents.findIndex(
        (a) => a.agentId === action.agentId
      );
      const updated = [...state.activeAgents];
      if (existing >= 0) {
        updated[existing] = action.status;
      } else {
        updated.push(action.status);
      }
      return { ...state, activeAgents: updated };
    }

    case 'CLEAR_AGENTS':
      return { ...state, activeAgents: [] };

    case 'SET_MEMORIES':
      return { ...state, recentMemories: action.memories };

    case 'TOGGLE_MEMORY':
      return { ...state, memoryEnabled: action.enabled };

    case 'SET_PLUGINS':
      return { ...state, installedPlugins: action.plugins };

    case 'SET_ROOM_PLUGINS':
      return { ...state, activeRoomPlugins: action.pluginIds };

    case 'ADD_INSIGHT':
      return {
        ...state,
        proactiveInsights: [action.insight, ...state.proactiveInsights],
        unreadInsightCount: state.unreadInsightCount + 1,
      };

    case 'MARK_INSIGHT_READ':
      return {
        ...state,
        proactiveInsights: state.proactiveInsights.map((i) =>
          i.id === action.insightId ? { ...i, isRead: true } : i
        ),
        unreadInsightCount: Math.max(0, state.unreadInsightCount - 1),
      };

    case 'DISMISS_INSIGHT':
      return {
        ...state,
        proactiveInsights: state.proactiveInsights.map((i) =>
          i.id === action.insightId ? { ...i, isDismissed: true } : i
        ),
      };

    case 'SET_STUDENT_PROFILE':
      return { ...state, studentProfile: action.profile };

    case 'CLEAR_CONVERSATION':
      return {
        ...state,
        messages: [],
        conversationId: null,
        activeAgents: [],
        isStreaming: false,
      };

    case 'RESET':
      return { ...initialState, activeRoom: state.activeRoom };

    default:
      return state;
  }
}

// =============================================================================
// CONTEXT
// =============================================================================

interface ATOMContextValue {
  state: ATOMState;
  dispatch: React.Dispatch<ATOMAction>;

  // Convenience methods
  sendMessage: (content: string) => void;
  clearConversation: () => void;
  setRoom: (room: ATOMRoom) => void;
}

const ATOMContext = createContext<ATOMContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

interface ATOMProviderProps {
  children: ReactNode;
  /** Override the stream hook for testing */
  onSendMessage?: (message: string, state: ATOMState) => void;
}

export function ATOMProvider({ children, onSendMessage }: ATOMProviderProps) {
  const pathname = usePathname();
  const [state, dispatch] = useReducer(atomReducer, initialState);

  // Auto-detect room from pathname
  useEffect(() => {
    const room = detectRoom(pathname);
    if (room !== state.activeRoom) {
      dispatch({ type: 'SET_ROOM', room });
    }
  }, [pathname, state.activeRoom]);

  // Convenience: send a user message
  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;

      const userMessage: ATOMMessage = {
        role: 'user',
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_MESSAGE', message: userMessage });

      // Delegate to the parent hook for actual streaming
      onSendMessage?.(content.trim(), state);
    },
    [onSendMessage, state]
  );

  const clearConversation = useCallback(() => {
    dispatch({ type: 'CLEAR_CONVERSATION' });
  }, []);

  const setRoom = useCallback((room: ATOMRoom) => {
    dispatch({ type: 'SET_ROOM', room });
  }, []);

  const value = useMemo<ATOMContextValue>(
    () => ({
      state,
      dispatch,
      sendMessage,
      clearConversation,
      setRoom,
    }),
    [state, dispatch, sendMessage, clearConversation, setRoom]
  );

  return (
    <ATOMContext.Provider value={value}>{children}</ATOMContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Access ATOM state and dispatch from any component.
 * Must be used within an <ATOMProvider>.
 */
export function useATOM(): ATOMContextValue {
  const ctx = useContext(ATOMContext);
  if (!ctx) {
    throw new Error('useATOM must be used within an <ATOMProvider>');
  }
  return ctx;
}
