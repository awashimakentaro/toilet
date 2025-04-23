"use client"

import { useDroppable } from "@dnd-kit/core"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { scaleIn } from "@/lib/gsap-utils"
import { useTodo } from "@/context/todo-context"

// インターフェースを更新
interface ToiletDropAreaProps {
  isAnimating: boolean
  onAnimationComplete: () => void
}

export function ToiletDropArea({ isAnimating, onAnimationComplete }: ToiletDropAreaProps) {
  const [splashes, setSplashes] = useState<{ id: number; left: number; top: number; size: number }[]>([])
  const { setNodeRef, isOver } = useDroppable({
    id: "toilet",
  })
  const { resetOverdueTasks } = useTodo()
  const [isResetting, setIsResetting] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // アニメーション用のref
  const toiletRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  // 期限切れタスク削除ボタンのハンドラ
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
    <div className="flex flex-col items-center justify-center mt-8 sm:mt-12 mb-4 sm:mb-8">
      <div
        ref={setNodeRef}
        className={`flex flex-col items-center justify-center transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
        data-toilet="true"
      >
        <div className="text-center mb-2 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-700 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 mr-1 sm:mr-2 text-[var(--header)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            タスクをここにドロップ
          </h3>
          <p className="text-gray-500 text-sm sm:text-base">完了した予定をトイレに流しましょう</p>
          <div
            className={`mt-1 sm:mt-2 text-xs sm:text-sm font-medium ${isOver ? "text-[var(--header)]" : "text-gray-400"} transition-colors`}
          >
            ドラッグしたタスクをここで離してください
          </div>
        </div>

        <div
          ref={toiletRef}
          className={`relative w-36 h-36 sm:w-48 sm:h-48 mx-auto ${isOver ? "scale-110 transition-transform" : ""} ${
            isAnimating ? "toilet-shake" : "animate-float"
          }`}
        >
          <div className="bg-white p-3 sm:p-4 rounded-full shadow-lg">
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
            style={{
              pointerEvents: "none", // ドラッグ操作を妨げないように
            }}
          />
        </div>
      </div>

      {/* 期限切れ削除ボタン - トイレの下に追加 */}
      <button
        onClick={handleResetClick}
        className="mt-6 px-6 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all text-sm sm:text-base flex items-center justify-center shadow-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        期限切れタスクを削除
      </button>

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
    </div>
  )
}
