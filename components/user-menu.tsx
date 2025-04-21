"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/context/auth-context"

export function UserMenu() {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

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

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsOpen(false)
    } catch (error) {
      console.error("ログアウトエラー:", error)
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
    <div className="fixed top-4 right-4 z-50" ref={menuRef}>
      {/* ユーザーアイコン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-white text-[var(--header)] rounded-full border-2 border-black flex items-center justify-center font-bold hover:bg-gray-100 transition-colors"
        aria-label="ユーザーメニュー"
      >
        {getInitials()}
      </button>

      {/* ドロップダウンメニュー */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg border-2 border-black shadow-lg overflow-hidden animate-fadeIn">
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
          </div>
          <div className="p-2">
            <button
              onClick={handleSignOut}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
