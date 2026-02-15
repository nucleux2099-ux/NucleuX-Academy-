/**
 * NucleuX Academy - Library Types
 * 
 * Enhanced types for the dynamic library system with:
 * - Subject-based rooms
 * - Subspecialties
 * - Multi-format content
 * - View modes
 */

// =============================================================================
// VIEW MODES
// =============================================================================

export type ViewMode = 
  | 'explorer'    // Full concept, images, videos, links
  | 'examPrep'    // High-yield summary, mnemonics, MCQ pearls
  | 'textbook'    // Raw chapter content
  | 'quiz'        // Retrieval cards, instant feedback
  | 'cases'       // Clinical scenarios
  | 'roadmap';    // Prerequisites → Current → What's next

export const VIEW_MODE_CONFIG: Record<ViewMode, {
  label: string;
  icon: string;
  description: string;
  color: string;
}> = {
  explorer: {
    label: 'Explorer',
    icon: '🌳',
    description: 'Browse topics, build foundations',
    color: '#10B981',
  },
  examPrep: {
    label: 'Exam Prep',
    icon: '🎯',
    description: 'High-yield, quick revision',
    color: '#F59E0B',
  },
  textbook: {
    label: 'Textbook',
    icon: '📚',
    description: 'Chapter-wise deep study',
    color: '#6366F1',
  },
  quiz: {
    label: 'Quiz Me',
    icon: '🧪',
    description: 'Test recall, active learning',
    color: '#EC4899',
  },
  cases: {
    label: 'Cases',
    icon: '🏥',
    description: 'Clinical application',
    color: '#06B6D4',
  },
  roadmap: {
    label: 'Roadmap',
    icon: '🗺️',
    description: 'Guided learning path',
    color: '#8B5CF6',
  },
};

// =============================================================================
// SUBSPECIALTIES
// =============================================================================

export interface Subspecialty {
  id: string;
  subjectId: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  topicCount: number;
  order: number;
}

// =============================================================================
// ENHANCED TOPIC
// =============================================================================

export interface TextbookReference {
  textbook: string;
  edition?: string;
  chapter: string;
  chapterTitle?: string;
  pages?: string;
}

export interface RetrievalCard {
  id?: string;
  question: string;
  answer: string;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  tags?: string[];
}

export interface CaseScenario {
  id?: string;
  title: string;
  presentation: string;
  // Questions can be: [{question, answer}], strings, or single question/answer
  questions?: ({
    question: string;
    answer: string;
  } | string)[];
  // Answers array (parallel to questions)
  answers?: string[];
  // Single question/answer format (alternative to questions array)
  question?: string;
  answer?: string;
  keyLearning?: string[];
  difficulty?: 1 | 2 | 3 | 4 | 5;
  analysis?: string;
  clinicalPearl?: string;
  tags?: string[];
}

export interface NmcCode {
  code: string;
  domain: 'K' | 'KH' | 'SH' | 'P';
  core: boolean;
  phase?: string;
}

export interface LibraryTopic {
  id: string;
  subjectId: string;
  subspecialtyId: string;
  
  // Basic info
  name: string;
  slug: string;
  description?: string;
  
  // Multi-format content
  content: {
    // Explorer mode
    concept: string;              // Full markdown
    keyPoints?: string[];
    diagrams?: string[];          // URLs or paths
    
    // Exam prep mode  
    examPrep?: {
      summary?: string;            // One-pager markdown
      mnemonics?: string[];
      highYield?: string[];
      commonMCQs?: string[];
      clinicalPearls?: string[];  // Added by content fill
    };
    
    // Textbook mode
    textbookRefs?: TextbookReference[];
    
    // Quiz mode
    retrievalCards?: RetrievalCard[];
    
    // Cases mode
    cases?: CaseScenario[];
    
    // Roadmap mode
    grindeMap?: string;           // Visual concept map
  };
  
  // Metadata for ATOM librarian
  prerequisites?: string[];        // Topic IDs
  relatedTopics?: string[];        // Topic IDs
  difficulty?: 1 | 2 | 3 | 4 | 5;
  highYield?: boolean;
  examTags?: string[];             // ['NEET_PG', 'USMLE', etc.]
  estimatedMinutes?: number;
  nmcCodes?: NmcCode[];
  
  // Availability flags
  hasContent?: {
    concept: boolean;
    examPrep: boolean;
    textbook: boolean;
    retrievalCards: boolean;
    cases: boolean;
    grindeMap: boolean;
  };
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

// =============================================================================
// ROOM (Subject with Subspecialties)
// =============================================================================

export interface LibraryRoom {
  subject: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    color: string;
    description: string;
  };
  subspecialties: Subspecialty[];
  totalTopics: number;
}

// =============================================================================
// USER LEARNING STATE
// =============================================================================

export interface UserLearningState {
  level: 'ug' | 'pg' | 'resident' | 'practitioner';
  examTarget?: string;
  examDate?: string;
  
  // Progress
  topicsCompleted: string[];
  topicsInProgress: string[];
  
  // Performance
  cardScores: Record<string, {
    attempts: number;
    correctRate: number;
    lastAttempt: string;
  }>;
  
  // Weak areas (topic IDs with low scores)
  weakAreas: string[];
  
  // Preferences
  preferredMode: ViewMode;
  dailyGoalMinutes: number;
}
