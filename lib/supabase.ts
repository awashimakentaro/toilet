import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// クライアント側のSupabaseクライアント（シングルトンパターン）
let supabaseInstance: SupabaseClient<Database> | null = null

export const getSupabaseClient = (): SupabaseClient<Database> | null => {
  if (supabaseInstance) return supabaseInstance

  // クライアントサイドでのみ初期化
  if (typeof window !== "undefined") {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase URL and Anon Key are required")
      return null
    }

    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }

  return supabaseInstance
}

// サーバー側のSupabaseクライアント（サーバーコンポーネントやAPI Routesで使用）
export const createServerSupabaseClient = (): SupabaseClient<Database> | null => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Supabase URL and Service Role Key are required")
    return null
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
