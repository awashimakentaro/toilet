"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("認証を処理中...")
  const router = useRouter()

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const supabase = getSupabaseClient()
      if (!supabase) {
        setMessage("エラーが発生しました。再度お試しください。")
        return
      }

      // URLからハッシュパラメータを取得
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get("access_token")
      const refreshToken = hashParams.get("refresh_token")
      const type = hashParams.get("type")

      if (accessToken && type === "recovery") {
        // パスワードリセットの場合
        setMessage("パスワードをリセットしています...")
        router.push("/auth/reset-password")
        return
      }

      if (accessToken) {
        try {
          // セッションを設定
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || "",
          })

          if (error) {
            throw error
          }

          setMessage("認証に成功しました！リダイレクトします...")
          setTimeout(() => {
            router.push("/")
          }, 2000)
        } catch (error) {
          console.error("認証エラー:", error)
          setMessage("認証に失敗しました。再度お試しください。")
        }
      } else {
        // URLにアクセストークンがない場合
        const { data, error } = await supabase.auth.getSession()

        if (error || !data.session) {
          setMessage("認証情報が見つかりません。ログインしてください。")
          setTimeout(() => {
            router.push("/auth/login")
          }, 2000)
        } else {
          setMessage("すでにログインしています。リダイレクトします...")
          setTimeout(() => {
            router.push("/")
          }, 2000)
        }
      }
    }

    handleEmailConfirmation()
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)]">
      <div className="w-full max-w-md p-8 bg-[var(--card)] rounded-lg border-2 border-black">
        <h1 className="text-2xl font-bold mb-4 text-center">認証処理</h1>
        <p className="text-center">{message}</p>
        <div className="flex justify-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--header)]"></div>
        </div>
      </div>
    </div>
  )
}
