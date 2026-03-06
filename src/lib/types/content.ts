/**
 * NucleuX Academy - Content Types
 * 
 * Three-dimensional content organization:
 * - Subject (horizontal): Surgery, Medicine, etc.
 * - Topic (units within subjects)
 * - Depth (vertical): MBBS → PG → Super Specialty
 */

// =============================================================================
// ENUMS & CONSTANTS
// =============================================================================

export type Depth = 'mbbs' | 'pg' | 'superSpecialty';
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export const DEPTH_LABELS: Record<Depth, string> = {
  mbbs: 'MBBS',
  pg: 'PG',
  superSpecialty: 'Super Specialty',
};

export const DEPTH_COLORS: Record<Depth, string> = {
  mbbs: '#10B981',        // Green
  pg: '#7C3AED',          // Purple
  superSpecialty: '#F59E0B', // Amber
};

// =============================================================================
// SUBJECT
// =============================================================================

export interface Subject {
  id: string;
  name: string;
  slug: string;
  icon: string;              // Emoji or Lucide icon name
  color: string;             // Theme color hex
  description: string;
  topicCount: number;        // Computed
  order: number;             // Display order
}

// =============================================================================
// TOPIC
// =============================================================================

export interface SourceReference {
  textbook: string;          // "Bailey & Love"
  edition?: string;          // "28th"
  chapter?: string;          // "Chapter 72"
  pages?: string;            // "1302-1315"
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  slug: string;              // URL-friendly
  
  // Depth availability
  depth: {
    mbbs: boolean;
    pg: boolean;
    superSpecialty: boolean;
  };
  
  // Hierarchy
  parentTopicId?: string;    // For sub-topics
  prerequisites?: string[];  // Topic IDs to complete first
  
  // Metadata
  tags: string[];
  estimatedMinutes: number;
  difficulty: Difficulty;
  
  // Sources
  sources: SourceReference[];
  
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// CONTENT
// =============================================================================

export interface MediaItem {
  id: string;
  type: 'image' | 'diagram' | 'flowchart' | 'video';
  url: string;
  caption: string;
  source?: string;
  alt?: string;
}

export interface TableData {
  id: string;
  caption: string;
  headers: string[];
  rows: string[][];
}

export interface ContentSection {
  id: string;
  heading: string;
  content: string;           // Markdown
  minDepth: Depth;           // Minimum depth to see this section
  order: number;
}

export interface Content {
  id: string;
  topicId: string;
  
  // Content sections (filtered by user's depth)
  sections: ContentSection[];
  
  // Quick reference
  keyPoints: string[];
  mnemonics?: string[];
  clinicalPearls?: string[];
  
  // Media
  diagrams?: MediaItem[];
  tables?: TableData[];
  flowcharts?: MediaItem[];
  
  // Metadata
  version: number;
  lastReviewedAt?: Date;
  reviewedBy?: string;
}

// =============================================================================
// MCQ
// =============================================================================

export interface MCQOption {
  id: string;                // "a", "b", "c", "d", "e"
  text: string;
  isCorrect: boolean;
}

export type MCQSourceType = 'original' | 'adapted' | 'pastExam';
export type ExamType = 'NEET-PG' | 'INICET' | 'FMGE' | 'NEET-SS' | 'DNB' | 'AIIMS' | 'Other';

export interface MCQ {
  id: string;
  topicId: string;
  subjectId: string;         // Denormalized for filtering
  
  // Question
  stem: string;              // Markdown
  options: MCQOption[];
  correctOptionId: string;
  
  // Explanation
  explanation: string;       // Markdown
  keyConceptIds?: string[];
  
  // Classification
  depth: Depth;
  difficulty: Difficulty;
  examTypes?: ExamType[];
  year?: number;             // If from past exam
  
  // Source
  source?: {
    type: MCQSourceType;
    reference?: string;      // "NEET-PG 2023 Q42"
  };
  
  // Media
  image?: MediaItem;
  
  // Stats (computed, updated periodically)
  stats?: {
    timesAttempted: number;
    correctRate: number;     // 0-1
    avgTimeSeconds: number;
  };
  
  // Review status
  status: 'draft' | 'reviewed' | 'published';
  reviewedBy?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// FLASHCARD
// =============================================================================

export type FlashcardType = 'fact' | 'concept' | 'clinical' | 'image';

export interface Flashcard {
  id: string;
  topicId: string;
  subjectId: string;         // Denormalized
  
  // Card content
  front: string;             // Markdown
  back: string;              // Markdown
  
  // Media
  frontImage?: MediaItem;
  backImage?: MediaItem;
  
  // Classification
  depth: Depth;
  type: FlashcardType;
  tags?: string[];
  
  // Spaced repetition defaults
  defaultIntervalDays: number;
  
  createdAt: Date;
}

// =============================================================================
// PATHWAY
// =============================================================================

export interface PathwayModule {
  id: string;
  name: string;
  description?: string;
  topicIds: string[];
  order: number;
}

export interface Pathway {
  id: string;
  name: string;
  slug: string;
  description: string;
  
  // Target
  subjectId: string;
  depth: Depth;
  
  // Structure
  modules: PathwayModule[];
  
  // Metadata
  totalTopics: number;
  estimatedHours: number;
  difficulty: Difficulty;
  
  // Cover image
  coverImage?: string;
  
  // Author
  createdBy: string;
  isOfficial: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// COMBINED TYPES (for API responses)
// =============================================================================

export interface TopicWithContent extends Topic {
  content?: Content;
  mcqCount?: number;
  flashcardCount?: number;
}

export interface SubjectWithTopics extends Subject {
  topics: Topic[];
}

export interface PathwayWithProgress extends Pathway {
  userProgress?: {
    completedTopics: number;
    totalTopics: number;
    percentComplete: number;
    currentModule: number;
    currentTopic: number;
  };
}
