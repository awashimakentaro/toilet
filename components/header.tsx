"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useEffect, useRef, useState } from "react"
import { slideInFromLeft, slideInFromRight } from "@/lib/gsap-utils"
import { useTodo } from "@/context/todo-context"

export function Header() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { resetDailyTasks, resetOverdueTasks } = useTodo()
  const [isResetting, setIsResetting] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // アニメーション用のref
  const titleRef = useRef<HTMLHeadingElement>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (titleRef.current) {
      slideInFromLeft(titleRef.current, 0.2)
    }
    if (navRef.current) {
      slideInFromRight(navRef.current, 0.4)
    }
  }, [])

  const handleResetClick = () => {
    setShowResetConfirm(true)
  }

  const handleConfirmReset = async () => {
    setIsResetting(true)
    try {
      await resetOverdueTasks()
      setShowResetConfirm(false)
    } catch (error) {
      console.error("リセットエラー:", error)
    } finally {
      setIsResetting(false)
    }
  }

  const handleCancelReset = () => {
    setShowResetConfirm(false)
  }

  return (
    <header className="bg-white rounded-2xl shadow-lg mb-4 sm:mb-8 overflow-hidden">
      <div className="bg-gradient-to-r from-[var(--header)] to-pink-400 p-4 sm:p-6 text-white">
        <h1
          ref={titleRef}
          className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 flex items-center justify-center opacity-0"
        >
          <span className="mr-2 text-3xl sm:text-4xl">💩</span>
          うんこフラッシュ
        </h1>
        <p className="text-center text-white/80 font-medium text-sm sm:text-base">タスクを完了してスッキリしよう！</p>
      </div>

      {/* ログインしている場合のみナビゲーションを表示 */}
      {user && (
        <nav ref={navRef} className="flex justify-center p-1 sm:p-2 bg-white opacity-0">
          <div className="flex space-x-1 sm:space-x-2 p-1 sm:p-2">
            <Link
              href="/"
              className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full transition-all text-sm sm:text-base ${
                pathname === "/"
                  ? "bg-[var(--header)] text-white font-medium shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              予定表
            </Link>
            <Link
              href="/favorites"
              className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full transition-all text-sm sm:text-base ${
                pathname === "/favorites"
                  ? "bg-[var(--header)] text-white font-medium shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              よく使う予定
            </Link>
            <Link
              href="/history"
              className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full transition-all text-sm sm:text-base ${
                pathname === "/history"
                  ? "bg-[var(--header)] text-white font-medium shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              履歴
            </Link>
            {pathname === "/" && (
              <button
                onClick={handleResetClick}
                className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-full transition-all text-sm sm:text-base bg-red-100 text-red-600 hover:bg-red-200"
              >
                期限切れ削除
              </button>
            )}
          </div>
        </nav>
      )}

      {/* リセット確認モーダル */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-5 max-w-md w-full animate-fadeIn">
            <h3 className="text-xl font-bold mb-3 text-gray-800">期限切れタスクの削除確認</h3>
            <p className="text-gray-600 mb-4">
              期限切れのタスクをすべて削除しますか？削除されたタスクは履歴に未完了として保存されます。この操作は元に戻せません。
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleConfirmReset}
                disabled={isResetting}
                className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isResetting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    リセット中...
                  </div>
                ) : (
                  "リセットする"
                )}
              </button>
              <button
                onClick={handleCancelReset}
                disabled={isResetting}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
