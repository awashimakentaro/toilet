"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useEffect, useRef } from "react"
import { slideInFromLeft, slideInFromRight } from "@/lib/gsap-utils"

export function Header() {
  const pathname = usePathname()
  const { user } = useAuth()

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

  return (
    <header className="bg-white rounded-2xl shadow-lg mb-4 sm:mb-8 overflow-hidden">
      <div className="bg-gradient-to-r from-[var(--header)] to-pink-400 p-4 sm:p-6 text-white">
        <h1
          ref={titleRef}
          className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 flex items-center justify-center opacity-0"
        >
          <span className="mr-2 text-3xl sm:text-4xl">💩</span>
          フラッシュ
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
          </div>
        </nav>
      )}
    </header>
  )
}
