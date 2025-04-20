"use client"

import { useDroppable } from "@dnd-kit/core"
import { useState, useEffect } from "react"
import Image from "next/image"

interface ToiletDropAreaProps {
  isAnimating: boolean
  onAnimationComplete: () => void
}

export function ToiletDropArea({ isAnimating, onAnimationComplete }: ToiletDropAreaProps) {
  const [splashes, setSplashes] = useState<{ id: number; left: number; top: number; size: number }[]>([])
  const { setNodeRef, isOver } = useDroppable({
    id: "toilet",
  })

  // アニメーションの状態が変わったときに水しぶきを生成
  useEffect(() => {
    if (isAnimating) {
      // 水しぶきのエフェクトを生成
      const newSplashes = []
      for (let i = 0; i < 5; i++) {
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
      className={`relative w-48 h-48 mx-auto mt-8 ${isOver ? "scale-110 transition-transform" : ""}`}
      data-toilet="true"
    >
      <div className={`relative w-full h-full ${isAnimating ? "toilet-shake" : ""}`}>
        <Image src="/toilet.png" alt="トイレ" width={200} height={200} style={{ objectFit: "contain" }} />

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
    </div>
  )
}
