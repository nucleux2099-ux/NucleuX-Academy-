/**
 * NucleuX Academy - ATOM v2 Type Definitions
 *
 * Types for the ATOMic Thinking and Organisational Model system.
 * Covers: Gateway, RAG Pipeline, Memory, Agents, MarketHub, and Frontend state.
 *
 * Specs: docs/specs/ATOM_*.md
 */

// =============================================================================
// CORE ENUMS & LITERALS
// =============================================================================

/** The 9 ATOM rooms — each has a distinct persona and agent pipeline */
export type ATOMRoom =
  | 'desk'        // Command Centre — planning & strategy
  | 'library'     // Librarian — knowledge exploration
  | 'classroom'   // Lecture Partner — active learning during lectures
  | 'training'    // Practice Partner — exam prep & MCQ training
  | 'cbme'        // Competency Guide — NMC curriculum tracking
  | 'community'   // Debate Moderator — discussion & fact-checking
  | 'arena'       // Competition Coach — competitive MCQ battles
  | 'backstage'   // Cognitive Coach — metacognition & analytics
  | 'studio';     // Open Studio — creative & freeform

/** 7 memory types managed by the Memorist agent */
export type ATOMMemoryType =
  | 'topic_mastery'        // Student demonstrated understanding
  | 'weak_area'            // Student repeatedly struggles
  | 'preference'           // Learning style preferences
  | 'insight'              // ATOM's observation about patterns
  | 'goal'                 // Exam targets and ambitions
  | 'study_pattern'        // Observed study behavior
  | 'clinical_connection'; // Breakthrough learning moments

/** 7 core agents — always available in every room */
export type CoreAgentId = 'scribe' | 'retriever' | 'critic' | 'memorist' | 'router' | 'assembler' | 'generator';

/** 10 plugin agents — activated per-room based on user installations */
export type PluginAgentId =
  | 'assessor'
  | 'challenger'
  | 'cartographer'
  | 'clinician'
  | 'examiner'
  | 'scribe_pro'
  | 'moderator'
  | 'analyst'
  | 'curriculum_mapper'
  | 'wellbeing_coach';

/** All agent IDs (core + plugin) */
export type AgentId = CoreAgentId | PluginAgentId;

/** Plugin categories for MarketHub */
export type PluginCategory =
  | 'evaluation'
  | 'generation'
  | 'analytics'
  | 'clinical'
  | 'exam'
  | 'notes'
  | 'discussion'
  | 'wellbeing'
  | 'curriculum'
  | 'subject'
  | 'community';

/** Plugin permission declarations */
export type PluginPermission =
  | 'read_memory'
  | 'write_memory'
  | 'read_analytics'
  | 'read_progress'
  | 'read_mcq_history'
  | 'ui_actions';

/** Proactive insight types (Heartbeat system) */
export type ProactiveInsightType =
  | 'study_nudge'
  | 'spaced_rep_due'
  | 'streak_alert'
  | 'exam_countdown'
  | 'weak_area_alert'
  | 'memory_insight';

/** Content view modes (mirrors filesystem) */
export type ViewMode =
  | 'explorer'
  | 'exam_prep'
  | 'textbook'
  | 'cases'
  | 'retrieval_cards'
  | 'roadmap';

// =============================================================================
// RAG PIPELINE TYPES (Migration 009)
// =============================================================================

/** A semantic chunk of content from /content/ markdown files */
export interface ContentChunk {
  id: string;
  subject: string;
  subspecialty: string;
  topicSlug: string;
  sourceFile: string;
  viewMode: ViewMode;
  chunkIndex: number;
  content: string;
  tokenCount: number | null;
  metadata: ContentChunkMetadata;
  createdAt: string;
  updatedAt: string;
}

/** Metadata extracted during chunking */
export interface ContentChunkMetadata {
  headings?: string[];
  nmcCodes?: string[];
  highYield?: boolean;
  difficulty?: 'basic' | 'intermediate' | 'advanced';
  textbookRef?: string;
  contentType?: 'clinical' | 'basic_science' | 'pathology' | 'pharmacology';
}

/** Result from hybrid_search_chunks() RPC */
export interface HybridSearchResult extends ContentChunk {
  vectorScore: number;
  ftsScore: number;
  combinedScore: number;
}

/** Parameters for hybrid_search_chunks() */
export interface HybridSearchParams {
  embedding: number[];         // 384-dimensional vector
  queryText: string;
  subject?: string;
  subspecialty?: string;
  viewModes?: ViewMode[];
  limit?: number;
  vectorWeight?: number;       // default 0.7
  ftsWeight?: number;          // default 0.3
}

// =============================================================================
// MEMORY TYPES (Migration 010)
// =============================================================================

/** A stored conversation with full message history */
export interface ATOMConversation {
  id: string;
  userId: string;
  room: ATOMRoom;
  title: string | null;
  topicSlug: string | null;
  messages: ATOMMessage[];
  metadata: ConversationMetadata;
  createdAt: string;
  updatedAt: string;
}

/** Metadata for a conversation */
export interface ConversationMetadata {
  messageCount?: number;
  compactedAt?: string;
  compactedSummary?: string;
  tokensUsed?: number;
  lastActiveAgents?: AgentId[];
}

/** A single message in a conversation thread */
export interface ATOMMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  agentId?: AgentId | null;
  agentLabel?: string | null;
  metadata?: {
    sources?: string[];
    pluginData?: any;
    [key: string]: any;
  };
}

/** A persistent memory entry about a student */
export interface ATOMUserMemory {
  id: string;
  userId: string;
  memoryType: ATOMMemoryType;
  content: string;
  relevanceScore: number;
  sourceRoom: ATOMRoom | null;
  topicSlug: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Result from search_memories() RPC */
export interface MemorySearchResult {
  id: string;
  memoryType: ATOMMemoryType;
  content: string;
  relevanceScore: number;
  similarity: number;
  sourceRoom: ATOMRoom | null;
  topicSlug: string | null;
  createdAt: string;
}

/** Parameters for search_memories() RPC */
export interface MemorySearchParams {
  userId: string;
  embedding: number[];         // 384-dimensional vector
  limit?: number;              // default 5
  minScore?: number;           // default 0.3
}

/** A proactive insight (Heartbeat notification) */
export interface ATOMProactiveInsight {
  id: string;
  userId: string;
  type: ProactiveInsightType;
  title: string;
  message: string;
  actionUrl: string | null;
  isRead: boolean;
  isDismissed: boolean;
  metadata: ProactiveInsightMetadata;
  createdAt: string;
}

/** Metadata for proactive insights */
export interface ProactiveInsightMetadata {
  priority?: 'high' | 'medium' | 'low';
  relatedTopics?: string[];
  dueCards?: number;
  streakDays?: number;
  examDaysRemaining?: number;
}

/** Memory candidate from Memorist write phase */
export interface MemoryCandidate {
  type: ATOMMemoryType;
  content: string;
}

/** Assembled memory context for system prompt injection */
export interface MemoryContext {
  goals: ATOMUserMemory[];
  weakAreas: ATOMUserMemory[];
  masteredTopics: ATOMUserMemory[];
  preferences: ATOMUserMemory[];
  insights: ATOMUserMemory[];
  studyPatterns: ATOMUserMemory[];
  clinicalConnections: ATOMUserMemory[];
  tokenBudget: number;
  totalTokensUsed: number;
}

// =============================================================================
// MARKETHUB TYPES (Migration 011)
// =============================================================================

/** A plugin in the MarketHub registry */
export interface ATOMPlugin {
  id: string;
  pluginId: string;
  name: string;
  description: string;
  longDescription: string | null;
  version: string;
  authorId: string | null;
  authorName: string;
  category: PluginCategory;
  defaultRooms: ATOMRoom[];
  requiredCoreAgents: CoreAgentId[];
  permissions: PluginPermission[];
  systemPrompt: string;
  skills: PluginSkill[];
  configSchema: Record<string, unknown>;
  isCore: boolean;
  isFree: boolean;
  priceCents: number;
  installCount: number;
  rating: number;
  reviewCount: number;
  screenshots: string[];
  changelog: PluginChangelogEntry[];
  isPublished: boolean;
  isApproved: boolean;
  isDeprecated: boolean;
  createdAt: string;
  updatedAt: string;
}

/** A plugin skill (capability declaration) */
export interface PluginSkill {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
}

/** Plugin changelog entry */
export interface PluginChangelogEntry {
  version: string;
  date: string;
  changes: string;
}

/** A user's plugin installation */
export interface UserPlugin {
  id: string;
  userId: string;
  pluginId: string;
  isActive: boolean;
  activeRooms: ATOMRoom[] | null;
  config: Record<string, unknown>;
  installedAt: string;
}

/** A plugin review */
export interface PluginReview {
  id: string;
  userId: string;
  pluginId: string;
  rating: number;
  reviewText: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Plugin analytics (daily aggregation) */
export interface PluginAnalytics {
  id: string;
  pluginId: string;
  userId: string;
  room: ATOMRoom;
  invocationCount: number;
  lastInvokedAt: string | null;
  periodStart: string;
  createdAt: string;
}

/** Plugin listing for MarketHub browse/search */
export interface PluginListing {
  pluginId: string;
  name: string;
  description: string;
  authorName: string;
  category: PluginCategory;
  rating: number;
  reviewCount: number;
  installCount: number;
  isFree: boolean;
  priceCents: number;
  defaultRooms: ATOMRoom[];
  screenshots: string[];
}

/** Installed plugin (extends listing with user-specific data) */
export interface InstalledPlugin extends PluginListing {
  isActive: boolean;
  activeRooms: ATOMRoom[];
  config: Record<string, unknown>;
  installedAt: string;
}

// =============================================================================
// AGENT TYPES
// =============================================================================

/** Agent execution status (shown in Agent Transparency panel) */
export interface AgentStatus {
  agentId: AgentId;
  label: string;
  status: 'idle' | 'thinking' | 'complete' | 'error';
  startedAt?: string;
  completedAt?: string;
  resultSummary?: string;
}

/** Plugin execution context (passed to plugin.execute()) */
export interface PluginContext {
  room: ATOMRoom;
  userMessage: string;
  conversationHistory: ATOMMessage[];
  retrievedChunks: ContentChunk[];
  userMemory: ATOMUserMemory[];
  studentProfile: StudentProfile;
  topicContext?: ATOMPageContext;
  pluginConfig: Record<string, unknown>;
}

/** Plugin execution result */
export interface PluginResult {
  contextInjection?: string;
  directResponse?: string;
  memoryWrites?: MemoryCandidate[];
  uiActions?: UIAction[];
}

/** Client-side UI action triggered by a plugin */
export interface UIAction {
  type: 'navigate' | 'open_panel' | 'show_card' | 'show_notification' | 'download';
  payload: Record<string, unknown>;
}

// =============================================================================
// GATEWAY & SESSION TYPES
// =============================================================================

/** Student profile injected into system prompt (subset of full profile) */
export interface StudentProfile {
  level: string;
  examTarget: string;
  examDate: string | null;
  strongSubjects: string[];
  weakSubjects: string[];
}

/** Page context sent from frontend to Gateway */
export interface ATOMPageContext {
  room: ATOMRoom;
  subject?: string;
  subspecialty?: string;
  topicSlug?: string;
  viewMode?: ViewMode;
  activeContent?: string;
}

export interface ATOMChatRequest {
  message: string;
  conversationId?: string;
  room: ATOMRoom;
  pageContext?: ATOMPageContext;
  model?: string;
}

/** ATOM SSE stream event types */
export type ATOMStreamEvent =
  | { type: 'agent_start'; agentId: AgentId; label: string }
  | { type: 'agent_complete'; agentId: AgentId; resultSummary?: string }
  | { type: 'content_delta'; content: string }
  | { type: 'content_complete'; conversationId: string }
  | { type: 'memory_written'; count: number }
  | { type: 'error'; message: string; code: string };

/** Connection status for ATOM */
export type ATOMConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// =============================================================================
// FRONTEND STATE (ATOMProvider)
// =============================================================================

/** Global ATOM state managed by ATOMProvider context */
export interface ATOMState {
  activeRoom: ATOMRoom;
  sessionId: string | null;
  conversationId: string | null;
  connectionStatus: ATOMConnectionStatus;
  messages: ATOMMessage[];
  isStreaming: boolean;
  activeAgents: AgentStatus[];
  recentMemories: ATOMUserMemory[];
  memoryEnabled: boolean;
  installedPlugins: InstalledPlugin[];
  activeRoomPlugins: string[];
  proactiveInsights: ATOMProactiveInsight[];
  unreadInsightCount: number;
  studentProfile: StudentProfile | null;
}

/** Actions dispatched to ATOMProvider reducer */
export type ATOMAction =
  | { type: 'SET_ROOM'; room: ATOMRoom }
  | { type: 'SET_CONNECTION_STATUS'; status: ATOMConnectionStatus }
  | { type: 'SET_CONVERSATION_ID'; conversationId: string }
  | { type: 'ADD_MESSAGE'; message: ATOMMessage }
  | { type: 'SET_STREAMING'; isStreaming: boolean }
  | { type: 'SET_AGENT_STATUS'; agentId: AgentId; status: AgentStatus }
  | { type: 'CLEAR_AGENTS' }
  | { type: 'SET_MEMORIES'; memories: ATOMUserMemory[] }
  | { type: 'TOGGLE_MEMORY'; enabled: boolean }
  | { type: 'SET_PLUGINS'; plugins: InstalledPlugin[] }
  | { type: 'SET_ROOM_PLUGINS'; pluginIds: string[] }
  | { type: 'ADD_INSIGHT'; insight: ATOMProactiveInsight }
  | { type: 'MARK_INSIGHT_READ'; insightId: string }
  | { type: 'DISMISS_INSIGHT'; insightId: string }
  | { type: 'SET_STUDENT_PROFILE'; profile: StudentProfile }
  | { type: 'CLEAR_CONVERSATION' }
  | { type: 'RESET' };

// =============================================================================
// DECAY RATES (Reference constants)
// =============================================================================

/** Memory decay rates per type (applied daily by cron) */
export const MEMORY_DECAY_RATES: Record<ATOMMemoryType, { rate: number; halfLifeDays: number }> = {
  topic_mastery: { rate: 0.99, halfLifeDays: 69 },
  weak_area: { rate: 0.97, halfLifeDays: 23 },
  preference: { rate: 0.995, halfLifeDays: 138 },
  insight: { rate: 0.97, halfLifeDays: 23 },
  goal: { rate: 0.995, halfLifeDays: 138 },
  study_pattern: { rate: 0.97, halfLifeDays: 23 },
  clinical_connection: { rate: 0.99, halfLifeDays: 69 },
};

/** Room labels for display */
export const ATOM_ROOM_CONFIG: Record<ATOMRoom, { label: string; persona: string }> = {
  desk: { label: 'My Desk', persona: 'Command Centre' },
  library: { label: 'Library', persona: 'Librarian' },
  classroom: { label: 'Classroom', persona: 'Lecture Partner' },
  training: { label: 'Training Centre', persona: 'Practice Partner' },
  cbme: { label: 'CBME', persona: 'Competency Guide' },
  community: { label: 'Common Room', persona: 'Debate Moderator' },
  arena: { label: 'Arena', persona: 'Competition Coach' },
  backstage: { label: 'Backstage', persona: 'Cognitive Coach' },
  studio: { label: 'Open Studio', persona: 'Creative Partner' },
};
