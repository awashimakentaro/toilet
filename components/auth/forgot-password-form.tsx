"use client"

import type React from "react"

import { useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setIsLoading(true)

    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        throw new Error("Supabaseクライアントが初期化されていません")
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        throw error
      }

      setMessage({
        type: "success",
        text: "パスワードリセットのリンクをメールで送信しました。メールをご確認ください。",
      })
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "パスワードリセットメールの送信に失敗しました",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="bg-[var(--card)] p-6 rounded-lg border-2 border-black">
        <h2 className="text-2xl font-bold mb-6 text-center">パスワードをお忘れですか？</h2>

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

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[var(--header)] text-white py-2 px-4 rounded-lg border-2 border-black hover:opacity-90 transition-opacity"
        >
          {isLoading ? "送信中..." : "リセットリンクを送信"}
        </button>
      </form>
    </div>
  )
}
