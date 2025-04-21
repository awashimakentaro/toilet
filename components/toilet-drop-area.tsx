"use client"

import { useDroppable } from "@dnd-kit/core"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { scaleIn } from "@/lib/gsap-utils"

interface ToiletDropAreaProps {
  isAnimating: boolean
  onAnimationComplete: () => void
}

export function ToiletDropArea({ isAnimating, onAnimationComplete }: ToiletDropAreaProps) {
  const [splashes, setSplashes] = useState<{ id: number; left: number; top: number; size: number }[]>([])
  const { setNodeRef, isOver } = useDroppable({
    id: "toilet",
  })

  // アニメーション用のref
  const toiletRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // コンポーネントがマウントされたら表示状態にする
    setIsVisible(true)

    if (toiletRef.current) {
      scaleIn(toiletRef.current, 0.5)
    }
  }, [])

  // アニメーションの状態が変わったときに水しぶきを生成
  useEffect(() => {
    if (isAnimating) {
      // 水しぶきのエフェクトを生成
      const newSplashes = []
      for (let i = 0; i < 8; i++) {
        newSplashes.push({
          id: Date.now() + i,
          left: 40 + Math.random() * 20, // 40%〜60%の範囲
          top: 30 + Math.random() * 20, // 30%〜50%の範囲
          size: 5 + Math.random() * 10, // 5px〜15pxの範囲
        })
      }
      setSplashes(newSplashes)

      // アニメーション終了後に状態をリセット
      const timer = setTimeout(() => {
        setSplashes([])
        onAnimationComplete()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isAnimating, onAnimationComplete])

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col items-center justify-center mt-12 mb-8 transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
      data-toilet="true"
    >
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-700 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-[var(--header)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          タスクをここにドロップ
        </h3>
        <p className="text-gray-500">完了した予定をトイレに流しましょう</p>
        <div
          className={`mt-2 text-sm font-medium ${isOver ? "text-[var(--header)]" : "text-gray-400"} transition-colors`}
        >
          ドラッグしたタスクをここで離してください
        </div>
      </div>

      <div
        ref={toiletRef}
        className={`relative w-48 h-48 mx-auto ${isOver ? "scale-110 transition-transform" : ""} ${
          isAnimating ? "toilet-shake" : "animate-float"
        }`}
      >
        <div className="bg-white p-4 rounded-full shadow-lg">
          <Image
            src="/toilet.png"
            alt="トイレ"
            width={200}
            height={200}
            style={{ objectFit: "contain" }}
            className="drop-shadow-md"
          />

          {/* 水の渦 */}
          {isAnimating && <div className="water-swirl" />}

          {/* うんち */}
          {isAnimating && <div className="poop">💩</div>}

          {/* 水しぶき */}
          {splashes.map((splash) => (
            <div
              key={splash.id}
              className="splash"
              style={{
                left: `${splash.left}%`,
                top: `${splash.top}%`,
                width: `${splash.size}px`,
                height: `${splash.size}px`,
              }}
            />
          ))}
        </div>

        {/* ドロップエリアの視覚的なヒント */}
        <div
          className={`absolute inset-0 rounded-full border-4 border-dashed transition-all duration-300 ${
            isOver
              ? "border-[var(--header)] scale-110 animate-pulse border-opacity-100"
              : "border-gray-300 scale-100 border-opacity-70"
          }`}
        />
      </div>
    </div>
  )
}
