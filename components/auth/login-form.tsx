"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { staggerElements, scaleIn } from "@/lib/gsap-utils"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  // アニメーション用のref
  const formLogoRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const formFieldsRef = useRef<HTMLFormElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (formLogoRef.current) {
      scaleIn(formLogoRef.current, 0.2)
    }
    if (titleRef.current) {
      scaleIn(titleRef.current, 0.4)
    }
    if (formFieldsRef.current) {
      staggerElements(formFieldsRef.current.children, 0.15, 0.6)
    }
    if (buttonRef.current) {
      scaleIn(buttonRef.current, 1.2)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await signIn(email, password)
      router.push("/")
    } catch (err: any) {
      setError(err.message || "ログインに失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-100">
        <div ref={formLogoRef} className="flex justify-center mb-6 opacity-0">
          <div className="relative w-24 h-24">
            <Image
              src="/toilet.png"
              alt="うんこフラッシュロゴ"
              width={96}
              height={96}
              className="animate-bounce-slow"
            />
          </div>
        </div>

        <h2
          ref={titleRef}
          className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[var(--header)] to-blue-500 bg-clip-text text-transparent opacity-0"
        >
          ログイン
        </h2>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form ref={formFieldsRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="opacity-0">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--header)] focus:border-transparent transition-all duration-200"
                required
                placeholder="your-email@example.com"
              />
            </div>
          </div>

          <div className="opacity-0">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-[var(--header)] hover:text-[var(--header)]/80 transition-colors"
              >
                パスワードをお忘れですか？
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--header)] focus:border-transparent transition-all duration-200"
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            ref={buttonRef}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[var(--header)] to-blue-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--header)] disabled:opacity-50 disabled:cursor-not-allowed opacity-0"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                ログイン中...
              </div>
            ) : (
              "ログイン"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            アカウントをお持ちでない場合は{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-[var(--header)] hover:text-[var(--header)]/80 transition-colors"
            >
              こちら
            </Link>
            から登録してください。
          </p>
        </div>
      </div>
    </div>
  )
}
