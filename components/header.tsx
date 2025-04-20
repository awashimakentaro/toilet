"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export function Header() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("ログアウトエラー:", error)
    }
  }

  return (
    <header className="bg-[var(--header)] text-white text-center py-4 px-6 rounded-xl border-4 border-black mb-6">
      <h1 className="text-3xl font-bold mb-4">
        うんこフラッシュ
        <br />
        TODOアプリ
      </h1>

      {user ? (
        <div className="mb-4 text-sm">
          <span className="bg-white text-[var(--header)] px-2 py-1 rounded-lg">{user.email}</span>
          <button onClick={handleSignOut} className="ml-2 bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600">
            ログアウト
          </button>
        </div>
      ) : (
        <div className="mb-4 flex justify-center space-x-2">
          <Link href="/auth/login" className="bg-white text-[var(--header)] px-2 py-1 rounded-lg">
            ログイン
          </Link>
          <Link href="/auth/signup" className="bg-white text-[var(--header)] px-2 py-1 rounded-lg">
            新規登録
          </Link>
        </div>
      )}

      <nav className="flex justify-center space-x-4">
        <Link
          href="/"
          className={`px-4 py-2 rounded-lg border-2 border-black ${
            pathname === "/" ? "bg-white text-[var(--header)]" : "bg-transparent"
          }`}
        >
          タスク一覧
        </Link>
        <Link
          href="/favorites"
          className={`px-4 py-2 rounded-lg border-2 border-black ${
            pathname === "/favorites" ? "bg-white text-[var(--header)]" : "bg-transparent"
          }`}
        >
          よく使うタスク
        </Link>
      </nav>
    </header>
  )
}
