"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export function Header() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <header className="bg-[var(--header)] text-white text-center py-4 px-6 rounded-xl border-4 border-black mb-6">
      <h1 className="text-3xl font-bold mb-4">
        うんこフラッシュ
        <br />
        スケジュール管理
      </h1>

      {/* ログインしている場合のみナビゲーションを表示 */}
      {user && (
        <nav className="flex justify-center space-x-4">
          <Link
            href="/"
            className={`px-4 py-2 rounded-lg border-2 border-black ${
              pathname === "/" ? "bg-white text-[var(--header)]" : "bg-transparent"
            }`}
          >
            予定表
          </Link>
          <Link
            href="/favorites"
            className={`px-4 py-2 rounded-lg border-2 border-black ${
              pathname === "/favorites" ? "bg-white text-[var(--header)]" : "bg-transparent"
            }`}
          >
            よく使う予定
          </Link>
        </nav>
      )}
    </header>
  )
}
