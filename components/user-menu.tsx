"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { fadeInFromBottom } from "@/lib/gsap-utils"

export function UserMenu() {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const logoutButtonRef = useRef<HTMLButtonElement>(null)

  // メニュー外のクリックを検出して閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // メニューが開いたときにログアウトボタンにアニメーションを適用
  useEffect(() => {
    if (isOpen && logoutButtonRef.current) {
      fadeInFromBottom(logoutButtonRef.current, 0.2)
    }
  }, [isOpen])

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true)
      await signOut()
      setIsOpen(false)
    } catch (error) {
      console.error("ログアウトエラー:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // ユーザーがログインしていない場合は何も表示しない
  if (!user) {
    return null
  }

  // ユーザーのイニシャルを取得
  const getInitials = () => {
    if (!user.email) return "?"
    return user.email.charAt(0).toUpperCase()
  }

  return (
    <div className="fixed top-2 sm:top-4 right-2 sm:right-4 z-50" ref={menuRef}>
      {/* ユーザーアイコン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[var(--header)] to-pink-500 text-white rounded-full border-2 border-white shadow-lg flex items-center justify-center font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
        aria-label="ユーザーメニュー"
      >
        {getInitials()}
      </button>

      {/* ドロップダウンメニュー */}
      {isOpen && (
        <div className="absolute right-0 mt-2 sm:mt-3 w-60 sm:w-72 bg-white/80 rounded-xl sm:rounded-2xl border border-gray-100 shadow-xl overflow-hidden animate-fadeIn backdrop-blur-sm">
          <div className="p-3 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[var(--header)] to-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                {getInitials()}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{user.email}</p>
                <p className="text-xs text-gray-500">ログイン中</p>
              </div>
            </div>
          </div>

          <div className="p-2 sm:p-3">
            <button
              ref={logoutButtonRef}
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-[var(--header)] to-pink-500 text-white font-medium shadow-md hover:shadow-lg hover:translate-y-[-2px] active:translate-y-0 transition-all duration-300 opacity-0 group text-sm sm:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:rotate-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="relative">
                {isLoggingOut ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4"
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
                    ログアウト中...
                  </div>
                ) : (
                  "ログアウト"
                )}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </span>
            </button>
          </div>

          <div className="px-3 pb-2 sm:pb-3">
            <div className="text-xs text-center text-gray-400 mt-1 sm:mt-2">
              &copy; {new Date().getFullYear()} うんこフラッシュTODO
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
