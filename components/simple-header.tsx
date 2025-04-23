"use client"

import { useEffect, useRef } from "react"
import { slideInFromLeft } from "@/lib/gsap-utils"

export function SimpleHeader() {
  // アニメーション用のref
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (titleRef.current) {
      slideInFromLeft(titleRef.current, 0.2)
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
          うんこフラッシュ
        </h1>
        <p className="text-center text-white/80 font-medium text-sm sm:text-base">タスクを完了してスッキリしよう！</p>
      </div>
    </header>
  )
}
