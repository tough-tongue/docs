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
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      tt_sessions: {
        Row: {
          id: string
          user_id: string
          tt_session_id: string
          scenario_id: string
          scenario_name: string | null
          started_at: string | null
          completed_at: string | null
          duration_seconds: number | null
          status: 'started' | 'completed' | 'incomplete' | 'analyzing'
          analysis_data: Json | null
          score: number | null
          feedback_summary: string | null
          strengths: string[] | null
          areas_for_improvement: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tt_session_id: string
          scenario_id: string
          scenario_name?: string | null
          started_at?: string | null
          completed_at?: string | null
          duration_seconds?: number | null
          status?: 'started' | 'completed' | 'incomplete' | 'analyzing'
          analysis_data?: Json | null
          score?: number | null
          feedback_summary?: string | null
          strengths?: string[] | null
          areas_for_improvement?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tt_session_id?: string
          scenario_id?: string
          scenario_name?: string | null
          started_at?: string | null
          completed_at?: string | null
          duration_seconds?: number | null
          status?: 'started' | 'completed' | 'incomplete' | 'analyzing'
          analysis_data?: Json | null
          score?: number | null
          feedback_summary?: string | null
          strengths?: string[] | null
          areas_for_improvement?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          scenario_id: string
          scenario_name: string | null
          total_attempts: number
          completed_attempts: number
          best_score: number | null
          average_score: number | null
          latest_score: number | null
          total_time_seconds: number
          average_time_seconds: number | null
          last_practiced_at: string | null
          current_streak: number
          longest_streak: number
          last_practice_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          scenario_id: string
          scenario_name?: string | null
          total_attempts?: number
          completed_attempts?: number
          best_score?: number | null
          average_score?: number | null
          latest_score?: number | null
          total_time_seconds?: number
          average_time_seconds?: number | null
          last_practiced_at?: string | null
          current_streak?: number
          longest_streak?: number
          last_practice_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          scenario_id?: string
          scenario_name?: string | null
          total_attempts?: number
          completed_attempts?: number
          best_score?: number | null
          average_score?: number | null
          latest_score?: number | null
          total_time_seconds?: number
          average_time_seconds?: number | null
          last_practiced_at?: string | null
          current_streak?: number
          longest_streak?: number
          last_practice_date?: string | null
          created_at?: string
          updated_at?: string
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
