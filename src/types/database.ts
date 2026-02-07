// NucleuX Academy - Database Types
// Generated manually from schema - run `npx supabase gen types typescript` for accurate types
// Date: 2026-02-07

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          specialty: string | null
          level: string | null
          institution: string | null
          target_exam: string | null
          target_date: string | null
          timezone: string | null
          plan: string | null
          onboarding_completed: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          specialty?: string | null
          level?: string | null
          institution?: string | null
          target_exam?: string | null
          target_date?: string | null
          timezone?: string | null
          plan?: string | null
          onboarding_completed?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          specialty?: string | null
          level?: string | null
          institution?: string | null
          target_exam?: string | null
          target_date?: string | null
          timezone?: string | null
          plan?: string | null
          onboarding_completed?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      user_preferences: {
        Row: {
          user_id: string
          daily_goal_minutes: number | null
          mcq_daily_target: number | null
          preferred_study_time: string | null
          notification_email: boolean | null
          notification_telegram: boolean | null
          telegram_chat_id: string | null
          theme: string | null
          atom_proactive: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          user_id: string
          daily_goal_minutes?: number | null
          mcq_daily_target?: number | null
          preferred_study_time?: string | null
          notification_email?: boolean | null
          notification_telegram?: boolean | null
          telegram_chat_id?: string | null
          theme?: string | null
          atom_proactive?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          user_id?: string
          daily_goal_minutes?: number | null
          mcq_daily_target?: number | null
          preferred_study_time?: string | null
          notification_email?: boolean | null
          notification_telegram?: boolean | null
          telegram_chat_id?: string | null
          theme?: string | null
          atom_proactive?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      streaks: {
        Row: {
          id: string
          user_id: string | null
          current_streak: number | null
          longest_streak: number | null
          last_study_date: string | null
          streak_started_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          current_streak?: number | null
          longest_streak?: number | null
          last_study_date?: string | null
          streak_started_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          current_streak?: number | null
          longest_streak?: number | null
          last_study_date?: string | null
          streak_started_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      atoms: {
        Row: {
          id: string
          title: string | null
          slug: string | null
          type: string | null
          content: Json | null
          summary: string | null
          specialty: string | null
          system: string | null
          topic: string | null
          subtopic: string | null
          tags: string[] | null
          source_type: string | null
          source_textbook: string | null
          source_edition: string | null
          source_chapter: string | null
          source_page: string | null
          difficulty: number | null
          read_time_minutes: number | null
          is_premium: boolean | null
          is_published: boolean | null
          view_count: number | null
          save_count: number | null
          avg_rating: number | null
          author_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title?: string | null
          slug?: string | null
          type?: string | null
          content?: Json | null
          summary?: string | null
          specialty?: string | null
          system?: string | null
          topic?: string | null
          subtopic?: string | null
          tags?: string[] | null
          source_type?: string | null
          source_textbook?: string | null
          source_edition?: string | null
          source_chapter?: string | null
          source_page?: string | null
          difficulty?: number | null
          read_time_minutes?: number | null
          is_premium?: boolean | null
          is_published?: boolean | null
          view_count?: number | null
          save_count?: number | null
          avg_rating?: number | null
          author_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string | null
          slug?: string | null
          type?: string | null
          content?: Json | null
          summary?: string | null
          specialty?: string | null
          system?: string | null
          topic?: string | null
          subtopic?: string | null
          tags?: string[] | null
          source_type?: string | null
          source_textbook?: string | null
          source_edition?: string | null
          source_chapter?: string | null
          source_page?: string | null
          difficulty?: number | null
          read_time_minutes?: number | null
          is_premium?: boolean | null
          is_published?: boolean | null
          view_count?: number | null
          save_count?: number | null
          avg_rating?: number | null
          author_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      mcqs: {
        Row: {
          id: string
          question: string | null
          question_type: string | null
          stem: string | null
          specialty: string | null
          topic: string | null
          subtopic: string | null
          tags: string[] | null
          difficulty: number | null
          source: string | null
          source_exam: string | null
          atom_id: string | null
          explanation_atom_id: string | null
          attempt_count: number | null
          correct_rate: number | null
          avg_time_seconds: number | null
          is_premium: boolean | null
          is_published: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          question?: string | null
          question_type?: string | null
          stem?: string | null
          specialty?: string | null
          topic?: string | null
          subtopic?: string | null
          tags?: string[] | null
          difficulty?: number | null
          source?: string | null
          source_exam?: string | null
          atom_id?: string | null
          explanation_atom_id?: string | null
          attempt_count?: number | null
          correct_rate?: number | null
          avg_time_seconds?: number | null
          is_premium?: boolean | null
          is_published?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          question?: string | null
          question_type?: string | null
          stem?: string | null
          specialty?: string | null
          topic?: string | null
          subtopic?: string | null
          tags?: string[] | null
          difficulty?: number | null
          source?: string | null
          source_exam?: string | null
          atom_id?: string | null
          explanation_atom_id?: string | null
          attempt_count?: number | null
          correct_rate?: number | null
          avg_time_seconds?: number | null
          is_premium?: boolean | null
          is_published?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      pathways: {
        Row: {
          id: string
          title: string | null
          slug: string | null
          description: string | null
          specialty: string | null
          target_exam: string | null
          difficulty: number | null
          estimated_hours: number | null
          topic_count: number | null
          is_official: boolean | null
          author_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title?: string | null
          slug?: string | null
          description?: string | null
          specialty?: string | null
          target_exam?: string | null
          difficulty?: number | null
          estimated_hours?: number | null
          topic_count?: number | null
          is_official?: boolean | null
          author_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string | null
          slug?: string | null
          description?: string | null
          specialty?: string | null
          target_exam?: string | null
          difficulty?: number | null
          estimated_hours?: number | null
          topic_count?: number | null
          is_official?: boolean | null
          author_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      user_notes: {
        Row: {
          id: string
          user_id: string | null
          title: string | null
          content: Json | null
          atom_id: string | null
          mcq_id: string | null
          specialty: string | null
          topic: string | null
          tags: string[] | null
          folder: string | null
          is_pinned: boolean | null
          color: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          title?: string | null
          content?: Json | null
          atom_id?: string | null
          mcq_id?: string | null
          specialty?: string | null
          topic?: string | null
          tags?: string[] | null
          folder?: string | null
          is_pinned?: boolean | null
          color?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string | null
          content?: Json | null
          atom_id?: string | null
          mcq_id?: string | null
          specialty?: string | null
          topic?: string | null
          tags?: string[] | null
          folder?: string | null
          is_pinned?: boolean | null
          color?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      // Additional tables - add as needed
      atom_citations: {
        Row: {
          id: string
          atom_id: string | null
          textbook: string
          edition: string | null
          chapter: string | null
          section: string | null
          page_start: number | null
          page_end: number | null
          quote: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          atom_id?: string | null
          textbook: string
          edition?: string | null
          chapter?: string | null
          section?: string | null
          page_start?: number | null
          page_end?: number | null
          quote?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          atom_id?: string | null
          textbook?: string
          edition?: string | null
          chapter?: string | null
          section?: string | null
          page_start?: number | null
          page_end?: number | null
          quote?: string | null
          created_at?: string | null
        }
      }
      user_atom_progress: {
        Row: {
          id: string
          user_id: string | null
          atom_id: string | null
          status: string | null
          progress_percent: number | null
          time_spent_seconds: number | null
          last_accessed_at: string | null
          completed_at: string | null
          rating: number | null
          is_saved: boolean | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          atom_id?: string | null
          status?: string | null
          progress_percent?: number | null
          time_spent_seconds?: number | null
          last_accessed_at?: string | null
          completed_at?: string | null
          rating?: number | null
          is_saved?: boolean | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          atom_id?: string | null
          status?: string | null
          progress_percent?: number | null
          time_spent_seconds?: number | null
          last_accessed_at?: string | null
          completed_at?: string | null
          rating?: number | null
          is_saved?: boolean | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      daily_stats: {
        Row: {
          id: string
          user_id: string | null
          date: string | null
          study_minutes: number | null
          atoms_completed: number | null
          mcqs_attempted: number | null
          mcqs_correct: number | null
          notes_created: number | null
          streak_day: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          date?: string | null
          study_minutes?: number | null
          atoms_completed?: number | null
          mcqs_attempted?: number | null
          mcqs_correct?: number | null
          notes_created?: number | null
          streak_day?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          date?: string | null
          study_minutes?: number | null
          atoms_completed?: number | null
          mcqs_attempted?: number | null
          mcqs_correct?: number | null
          notes_created?: number | null
          streak_day?: number | null
          created_at?: string | null
        }
      }
      mcq_options: {
        Row: {
          id: string
          mcq_id: string | null
          option_text: string
          option_order: number
          is_correct: boolean | null
          explanation: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          mcq_id?: string | null
          option_text: string
          option_order: number
          is_correct?: boolean | null
          explanation?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          mcq_id?: string | null
          option_text?: string
          option_order?: number
          is_correct?: boolean | null
          explanation?: string | null
          created_at?: string | null
        }
      }
      mcq_attempts: {
        Row: {
          id: string
          user_id: string | null
          mcq_id: string | null
          selected_options: string[] | null
          is_correct: boolean | null
          time_taken_seconds: number | null
          confidence: number | null
          session_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          mcq_id?: string | null
          selected_options?: string[] | null
          is_correct?: boolean | null
          time_taken_seconds?: number | null
          confidence?: number | null
          session_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          mcq_id?: string | null
          selected_options?: string[] | null
          is_correct?: boolean | null
          time_taken_seconds?: number | null
          confidence?: number | null
          session_id?: string | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type UserPreferences = Database['public']['Tables']['user_preferences']['Row']
export type Streak = Database['public']['Tables']['streaks']['Row']
export type Atom = Database['public']['Tables']['atoms']['Row']
export type MCQ = Database['public']['Tables']['mcqs']['Row']
export type Pathway = Database['public']['Tables']['pathways']['Row']
export type UserNote = Database['public']['Tables']['user_notes']['Row']
export type AtomCitation = Database['public']['Tables']['atom_citations']['Row']
export type UserAtomProgress = Database['public']['Tables']['user_atom_progress']['Row']
export type DailyStats = Database['public']['Tables']['daily_stats']['Row']
export type MCQOption = Database['public']['Tables']['mcq_options']['Row']
export type MCQAttempt = Database['public']['Tables']['mcq_attempts']['Row']
