/**
 * NucleuX Academy - ATOM v2: Gateway Orchestration Layer
 *
 * Single entry point for every AI interaction. Orchestrates:
 * Phase 1: Authenticate (Supabase JWT)
 * Phase 2: Session Resolve (room, conversation, context)
 * Phase 3: Lane Queue (serial per session)
 * Phase 4: Agent Orchestration (Scribe → Memorist → Router)
 * Phase 5: Pipeline Execution (Retriever → Critic → Assembler)
 * Phase 6: Generation (Claude SSE streaming)
 * Phase 7: Post-generation Persist (conversation + memory writes)
 *
 * Spec: docs/specs/ATOM_GATEWAY_SPEC.md
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type {
  ATOMRoom,
  ATOMMessage,
  ATOMPageContext,
  ATOMStreamEvent,
  StudentProfile,
  ATOMUserMemory,
  AgentId,
} from '@/lib/types/atom';
import { assembleContext } from './gateway/assembler';
import { estimateTokens } from './chunker';
import { buildSystemPrompt } from './prompts';

// Import our dedicated Agent tools
import { analyzeIntent } from './agents/scribe';
import { retrieveRelevantChunks, RetrievalResult } from './agents/retriever';
import { rerankContext } from './agents/critic';
import { preReadMemories, extractAndStoreMemory } from './agents/memorist';
import { getActivePlugins, buildPluginContext } from './agents/router';

// =============================================================================
// TYPES
// =============================================================================

/** Input to the Gateway from the API route */
export interface GatewayInput {
  userId: string;
  room: ATOMRoom;
  message: string;
  conversationId?: string;
  pageContext?: ATOMPageContext;
  model?: string;
  signal?: AbortSignal;
}

/** Gateway configuration */
export interface GatewayConfig {
  model: string;
  maxTokens: number;
  temperature: number;
  laneQueue: {
    maxQueueDepth: number;
    requestTimeoutMs: number;
  };
}

/** Internal processing context built during orchestration */
interface ProcessingContext {
  userId: string;
  room: ATOMRoom;
  conversationId: string;
  studentProfile: StudentProfile | null;
  conversationHistory: ATOMMessage[];
  memories: ATOMUserMemory[];
  retrievedChunks: RetrievalResult[];
  pageContext?: ATOMPageContext;
  scribeResult: {
    intent: string;
    keywords: string[];
    expandedQuery: string;
    needsRetrieval: boolean;
  };
  activePluginPrompts: string[];
  agentTimings: Record<string, number>;
}

// =============================================================================
// CONFIG
// =============================================================================

const DEFAULT_CONFIG: GatewayConfig = {
  model: 'claude-sonnet-4-20250514',
  maxTokens: 5_000,
  temperature: 0.7,
  laneQueue: {
    maxQueueDepth: 3,
    requestTimeoutMs: 60_000,
  },
};

// =============================================================================
// LANE QUEUE (Per-session serial execution)
// =============================================================================

type SessionKey = `user:${string}:room:${string}`;

const sessionQueues = new Map<SessionKey, Promise<void>>();
const sessionQueueDepths = new Map<SessionKey, number>();

function getSessionKey(userId: string, room: ATOMRoom): SessionKey {
  return `user:${userId}:room:${room}`;
}

async function enqueueRequest(
  sessionKey: SessionKey,
  handler: () => Promise<void>,
  maxDepth: number
): Promise<void> {
  const currentDepth = sessionQueueDepths.get(sessionKey) ?? 0;
  if (currentDepth >= maxDepth) {
    throw new GatewayError('RATE_LIMITED', 'Too many pending requests for this session');
  }

  sessionQueueDepths.set(sessionKey, currentDepth + 1);
  const currentQueue = sessionQueues.get(sessionKey) ?? Promise.resolve();

  const newQueue = currentQueue
    .then(handler)
    .catch((err) => {
      console.error(`[Gateway] Session ${sessionKey} error:`, err);
    })
    .finally(() => {
      const depth = sessionQueueDepths.get(sessionKey) ?? 1;
      if (depth <= 1) {
        sessionQueueDepths.delete(sessionKey);
      } else {
        sessionQueueDepths.set(sessionKey, depth - 1);
      }
      if (sessionQueues.get(sessionKey) === newQueue) {
        sessionQueues.delete(sessionKey);
      }
    });

  sessionQueues.set(sessionKey, newQueue);
  await newQueue;
}

// =============================================================================
// ERROR HANDLING
// =============================================================================

export class GatewayError extends Error {
  constructor(
    public code: string,
    message: string,
    public degraded?: string[]
  ) {
    super(message);
    this.name = 'GatewayError';
  }
}

// =============================================================================
// SSE HELPERS
// =============================================================================

function encodeSSE(event: ATOMStreamEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

function createSSEStream(
  processor: (
    enqueue: (event: ATOMStreamEvent) => void,
    close: () => void
  ) => Promise<void>
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const enqueue = (event: ATOMStreamEvent) => {
        try {
          controller.enqueue(encoder.encode(encodeSSE(event)));
        } catch {
          // Stream may be closed
        }
      };
      const close = () => {
        try {
          controller.close();
        } catch {
          // Already closed
        }
      };

      try {
        await processor(enqueue, close);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        const code = error instanceof GatewayError ? error.code : 'GENERATION_FAILED';
        enqueue({ type: 'error', message, code });
        close();
      }
    },
  });
}

// =============================================================================
// AGENT PHASES
// =============================================================================

/**
 * Phase 2: Session Resolve
 * Load student profile, conversation history, and active plugins.
 */
async function resolveSession(
  supabase: SupabaseClient,
  userId: string,
  room: ATOMRoom,
  conversationId?: string
): Promise<{
  profile: StudentProfile | null;
  history: ATOMMessage[];
  resolvedConversationId: string;
}> {
  // Load student profile from profiles table
  let profile: StudentProfile | null = null;
  try {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('level, target_exam, target_exam_date, strong_subjects, weak_subjects')
      .eq('id', userId)
      .single();

    if (profileData) {
      profile = {
        level: profileData.level ?? 'mbbs_1',
        examTarget: profileData.target_exam ?? '',
        examDate: profileData.target_exam_date ?? null,
        strongSubjects: profileData.strong_subjects ?? [],
        weakSubjects: profileData.weak_subjects ?? [],
      };
    }
  } catch {
    // Profile load failed — proceed without personalization
  }

  // Load conversation history (if conversationId provided)
  let history: ATOMMessage[] = [];
  let resolvedConversationId = conversationId ?? crypto.randomUUID();

  if (conversationId) {
    try {
      const { data: convData } = await supabase
        .from('atom_conversations')
        .select('messages')
        .eq('id', conversationId)
        .eq('user_id', userId)
        .single();

      if (convData?.messages) {
        history = convData.messages as ATOMMessage[];
      }
    } catch {
      // Conversation not found — start fresh
      resolvedConversationId = crypto.randomUUID();
    }
  }

  return { profile, history, resolvedConversationId };
}

// -----------------------------------------------------------------------------
// Pipeline execution logic was moved to retriever.ts and critic.ts
// ----------------------------------------------------------------------------- 

/**
 * Phase 7: Post-generation Persist
 * Save conversation and extract memory candidates.
 */
async function persistConversation(
  supabase: SupabaseClient,
  userId: string,
  room: ATOMRoom,
  conversationId: string,
  messages: ATOMMessage[],
  topicSlug?: string
): Promise<void> {
  try {
    // Generate a title from the first user message
    const firstUserMsg = messages.find(m => m.role === 'user');
    const title = firstUserMsg
      ? firstUserMsg.content.slice(0, 80) + (firstUserMsg.content.length > 80 ? '...' : '')
      : 'New conversation';

    // Upsert conversation
    const { error } = await supabase
      .from('atom_conversations')
      .upsert({
        id: conversationId,
        user_id: userId,
        room,
        title,
        topic_slug: topicSlug ?? null,
        messages,
        metadata: {
          messageCount: messages.length,
          tokensUsed: messages.reduce((sum, m) => sum + estimateTokens(m.content), 0),
        },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (error) {
      console.error('[Gateway] Conversation persist error:', error.message);
    }
  } catch (error) {
    console.error('[Gateway] Persist failed:', error);
  }
}

// =============================================================================
// MAIN GATEWAY PROCESS
// =============================================================================

/**
 * Process an ATOM request through the full 7-phase pipeline.
 * Returns an SSE ReadableStream.
 */
export function processGatewayRequest(
  input: GatewayInput,
  config: GatewayConfig = DEFAULT_CONFIG
): ReadableStream<Uint8Array> {
  const sessionKey = getSessionKey(input.userId, input.room);

  return createSSEStream(async (enqueue, close) => {
    await enqueueRequest(
      sessionKey,
      async () => {
        // ---------------------------------------------------------------
        // Phase 2: Session Resolve
        // ---------------------------------------------------------------
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const cohereApiKey = process.env.COHERE_API_KEY;
        const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

        if (!anthropicApiKey) {
          throw new GatewayError('GENERATION_FAILED', 'ANTHROPIC_API_KEY not configured');
        }

        const supabase = createClient(supabaseUrl, serviceRoleKey, {
          auth: { persistSession: false },
        });

        enqueue({ type: 'agent_start', agentId: 'scribe', label: 'Understanding your question...' });

        const { profile, history, resolvedConversationId } =
          await resolveSession(supabase, input.userId, input.room, input.conversationId);

        // ---------------------------------------------------------------
        // Phase 5: Router Agent (MarketHub Plugins)
        // ---------------------------------------------------------------
        const activePlugins = await getActivePlugins(input.userId, input.room);
        const pluginContextStr = buildPluginContext(activePlugins);

        // Map them as "active plugins" for frontend display if needed, but here we just need the text.

        // ---------------------------------------------------------------
        // Phase 4a: Scribe Agent
        // ---------------------------------------------------------------
        // We pass history so Scribe can see previous context if needed
        const scribeData = await analyzeIntent(input.message, history.map(m => ({ role: m.role, content: m.content })));

        enqueue({
          type: 'agent_complete',
          agentId: 'scribe',
          resultSummary: `Intent: ${scribeData.intent}, retrieval: ${scribeData.requiresRetrieval}`,
        });

        // ---------------------------------------------------------------
        // Phase 4b: Memorist Read
        // ---------------------------------------------------------------
        const agentsDegraded: string[] = [];
        let memoryContextStr = '';

        enqueue({ type: 'agent_start', agentId: 'memorist', label: 'Loading your learning history...' });
        try {
          memoryContextStr = await preReadMemories(input.userId, scribeData.expandedQuery);
          enqueue({
            type: 'agent_complete',
            agentId: 'memorist',
            resultSummary: memoryContextStr ? 'Memories loaded' : 'No memories found',
          });
        } catch {
          agentsDegraded.push('memorist');
          enqueue({ type: 'agent_complete', agentId: 'memorist', resultSummary: 'Skipped (error)' });
        }

        // ---------------------------------------------------------------
        // Phase 5: Pipeline Execution (Retriever → Critic → Assembler)
        // ---------------------------------------------------------------
        let assembledContentStr = '';

        if (scribeData.requiresRetrieval) {
          enqueue({ type: 'agent_start', agentId: 'retriever', label: 'Searching knowledge base...' });

          let candidates: any[] = [];
          try {
            candidates = await retrieveRelevantChunks(scribeData.expandedQuery);
            enqueue({ type: 'agent_complete', agentId: 'retriever', resultSummary: `Found ${candidates.length} sources` });
          } catch (e) {
            agentsDegraded.push('retriever');
            enqueue({ type: 'agent_complete', agentId: 'retriever', resultSummary: 'Failed' });
          }

          if (candidates.length > 0) {
            enqueue({ type: 'agent_start', agentId: 'critic', label: 'Reranking for relevance...' });
            try {
              const criticData = await rerankContext(input.message, candidates, 5, 0.3);
              assembledContentStr = assembleContext(criticData.acceptedChunks);
              enqueue({ type: 'agent_complete', agentId: 'critic', resultSummary: `Distilled to top ${criticData.acceptedChunks.length}` });
            } catch (e) {
              agentsDegraded.push('critic');
              enqueue({ type: 'agent_complete', agentId: 'critic', resultSummary: 'Failed' });
            }
          }
        }

        // ---------------------------------------------------------------
        // Phase 5b: Combined System Prompt
        // ---------------------------------------------------------------
        // Build base system prompt
        let systemPrompt = buildSystemPrompt(input.room, assembledContentStr);

        // Inject MarketHub plugins
        if (pluginContextStr) {
          systemPrompt += `\n\n${pluginContextStr}`;
        }

        // Inject Memorist Context
        if (memoryContextStr) {
          systemPrompt += `\n\n${memoryContextStr}`;
        }

        // Inject Scribe intent
        systemPrompt += `\n\n## Detected Context\nUser Intent: ${scribeData.intent}\nFocus on answering appropriately.`;

        // Build message history for Claude
        const userMsg: ATOMMessage = {
          role: 'user',
          content: input.message,
          timestamp: new Date().toISOString(),
        };

        // Combine trimmed history + new user message
        const claudeMessages: Anthropic.MessageParam[] = [
          ...history.slice(-10).map(m => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
          { role: 'user', content: input.message },
        ];

        // Ensure conversation starts with 'user' role (Anthropic requirement)
        if (claudeMessages.length > 0 && claudeMessages[0].role !== 'user') {
          claudeMessages.unshift({
            role: 'user',
            content: '[Conversation resumed]',
          });
        }

        // Ensure alternating user/assistant messages (merge consecutive same-role messages)
        const mergedMessages: Anthropic.MessageParam[] = [];
        for (const msg of claudeMessages) {
          if (mergedMessages.length > 0 && mergedMessages[mergedMessages.length - 1].role === msg.role) {
            // Merge with previous message
            const prev = mergedMessages[mergedMessages.length - 1];

            // Handle Claude Vision arrays vs strings safely
            if (typeof prev.content === 'string' && typeof msg.content === 'string') {
              prev.content = `${prev.content}\n\n${msg.content}`;
            }
          } else {
            mergedMessages.push({ ...msg });
          }
        }

        // ---------------------------------------------------------------
        // Phase 6: Generation (Claude Streaming)
        // ---------------------------------------------------------------
        // Execute Claude Generation
        let resultSummary = '';
        enqueue({ type: 'agent_start', agentId: 'generator', label: 'Formulating response...' });

        const anthropic = new Anthropic({ apiKey: anthropicApiKey });

        const stream = await anthropic.messages.stream({
          model: input.model || 'claude-3-5-sonnet-20241022',
          max_tokens: 2048,
          system: systemPrompt,
          messages: mergedMessages,
        });

        let fullResponse = '';

        for await (const event of stream) {
          // Check abort
          if (input.signal?.aborted) {
            break;
          }

          if (event.type === 'content_block_delta') {
            const delta = event.delta;
            if ('text' in delta) {
              fullResponse += delta.text;
              enqueue({ type: 'content_delta', content: delta.text });
            }
          }
        }

        // ---------------------------------------------------------------
        // Phase 7: Post-generation Persist
        // ---------------------------------------------------------------
        const assistantMsg: ATOMMessage = {
          role: 'assistant',
          content: fullResponse,
          timestamp: new Date().toISOString(),
        };

        const updatedHistory = [...history, userMsg, assistantMsg];

        // Fire-and-forget persist (don't block response)
        persistConversation(
          supabase,
          input.userId,
          input.room,
          resolvedConversationId,
          updatedHistory,
          input.pageContext?.topicSlug
        ).catch(err => console.error('[Gateway] Async persist error:', err));

        // Fire-and-forget memorist extract
        Promise.resolve().then(() => {
          extractAndStoreMemory(input.userId, updatedHistory, resolvedConversationId, input.room)
            .catch(err => console.error('[Gateway] Async memory extract error:', err));
        });

        // Send completion event
        enqueue({
          type: 'content_complete',
          conversationId: resolvedConversationId,
        });

        // Send degradation notice if any agents failed
        if (agentsDegraded.length > 0) {
          enqueue({
            type: 'error',
            code: 'PARTIAL_DEGRADATION',
            message: `Some features unavailable: ${agentsDegraded.join(', ')}`,
          });
        }

        close();
      },
      config.laneQueue.maxQueueDepth
    );
  });
}
