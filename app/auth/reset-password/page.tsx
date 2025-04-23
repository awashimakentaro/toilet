"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"
import { SimpleHeader } from "@/components/simple-header" // TodoProviderを必要としない単純なヘッダーを使用

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "パスワードが一致しません" })
      return
    }

    if (password.length < 6) {
      setMessage({ type: "error", text: "パスワードは6文字以上である必要があります" })
      return
    }

    setIsLoading(true)

    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        throw new Error("Supabaseクライアントが初期化されていません")
      }

      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        throw error
      }

      setMessage({ type: "success", text: "パスワードが正常に更新されました" })

      // 3秒後にホームページにリダイレクト
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "パスワードの更新に失敗しました" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <SimpleHeader />
      <div className="w-full max-w-md mx-auto">
        <form onSubmit={handleResetPassword} className="bg-[var(--card)] p-6 rounded-lg border-2 border-black">
          <h2 className="text-2xl font-bold mb-6 text-center">パスワードのリセット</h2>

          {message && (
            <div
              className={`${
                message.type === "success"
                  ? "bg-green-100 border-green-400 text-green-700"
                  : "bg-red-100 border-red-400 text-red-700"
              } px-4 py-3 rounded mb-4 border`}
            >
              {message.text}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              新しいパスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
              minLength={6}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              新しいパスワード（確認）
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--header)] text-white py-2 px-4 rounded-lg border-2 border-black hover:opacity-90 transition-opacity"
          >
            {isLoading ? "更新中..." : "パスワードを更新"}
          </button>
        </form>
      </div>
    </div>
  )
}
