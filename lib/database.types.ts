export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          text: string
          completed: boolean
          created_at: string
          updated_at: string
          start_time: string | null
          end_time: string | null
          importance: number | null
        }
        Insert: {
          id?: string
          user_id: string
          text: string
          completed?: boolean
          created_at?: string
          updated_at?: string
          start_time?: string | null
          end_time?: string | null
          importance?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          text?: string
          completed?: boolean
          created_at?: string
          updated_at?: string
          start_time?: string | null
          end_time?: string | null
          importance?: number | null
        }
      }
      favorite_tasks: {
        Row: {
          id: string
          user_id: string
          text: string
          created_at: string
          start_time: string | null
          end_time: string | null
          importance: number | null
        }
        Insert: {
          id?: string
          user_id: string
          text: string
          created_at?: string
          start_time?: string | null
          end_time?: string | null
          importance?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          text?: string
          created_at?: string
          start_time?: string | null
          end_time?: string | null
          importance?: number | null
        }
      }
      task_history: {
        Row: {
          id: string
          user_id: string
          text: string
          completed_at: string
          start_time: string | null
          end_time: string | null
          importance: number | null
          original_task_id: string | null
          completed?: boolean
        }
        Insert: {
          id?: string
          user_id: string
          text: string
          completed_at?: string
          start_time?: string | null
          end_time?: string | null
          importance?: number | null
          original_task_id?: string | null
          completed?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          text?: string
          completed_at?: string
          start_time?: string | null
          end_time?: string | null
          importance?: number | null
          original_task_id?: string | null
          completed?: boolean
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
