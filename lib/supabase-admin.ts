// Supabase管理者用のユーティリティ関数
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// サーバーサイドでのみ使用するSupabase管理者クライアント
export const createAdminSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Supabase URL and Service Role Key are required")
    throw new Error("環境変数が設定されていません")
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Supabaseの認証設定を更新する関数
export async function updateSupabaseAuthSettings() {
  try {
    const supabase = createAdminSupabaseClient()

    // 現在のホスト環境を取得（サーバーサイドでは使用できないため、デプロイ時に設定する必要があります）
    const redirectUrl =
      process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL}/auth/callback`
        : "http://localhost:3000/auth/callback"

    // Supabase Auth設定を更新（管理者APIを使用）
    // 注意: この機能はSupabaseの管理者APIを使用するため、実際の実装ではSupabaseダッシュボードでの設定が推奨されます
    console.log(`認証リダイレクトURLを設定: ${redirectUrl}`)

    // ここに実際のSupabase Admin API呼び出しが入りますが、
    // 通常はSupabaseダッシュボードで設定するため、ログ出力のみとしています

    return { success: true, redirectUrl }
  } catch (error) {
    console.error("Supabase認証設定の更新に失敗しました:", error)
    return { success: false, error }
  }
}
