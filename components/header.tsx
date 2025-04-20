"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="bg-[var(--header)] text-white text-center py-4 px-6 rounded-xl border-4 border-black mb-6">
      <h1 className="text-3xl font-bold mb-4">
        うんこフラッシュ
        <br />
        TODOアプリ
      </h1>
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
