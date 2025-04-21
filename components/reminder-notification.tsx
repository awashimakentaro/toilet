"use client"

import { useState, useEffect } from "react"
import type { Task } from "@/lib/types"

interface ReminderNotificationProps {
  task: Task
  onClose: () => void
}

export function ReminderNotification({ task, onClose }: ReminderNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  // マウント時にアニメーションを開始
  useEffect(() => {
    // 少し遅延させてからフェードイン
    setTimeout(() => setIsVisible(true), 100)

    // 通知が表示されたときに効果音を鳴らす
    try {
      const audio = new Audio("/reminder-sound.mp3")
      audio.volume = 0.7 // 音量を少し下げる
      audio.play().catch((e) => console.error("通知音の再生に失敗しました:", e))
    } catch (e) {
      console.error("通知音の再生に失敗しました:", e)
    }

    // 定期的に振動アニメーションを実行
    const shakeInterval = setInterval(() => {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }, 3000)

    // 20秒後に自動的に閉じる
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 500) // アニメーション完了後に削除
    }, 20000)

    return () => {
      clearTimeout(timer)
      clearInterval(shakeInterval)
    }
  }, [onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 500) // アニメーション完了後に削除
  }

  return (
    <div
      className={`fixed bottom-4 right-4 max-w-sm glass-effect p-4 rounded-xl shadow-lg transition-all duration-500 z-50 border border-yellow-200 ${
        isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
      } ${isShaking ? "animate-shake" : ""}`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <span className="text-2xl animate-pulse-slow">🚽</span>
        </div>
        <div className="ml-3">
          <p className="text-sm font-bold text-gray-800">「{task.text}」をまだ排出できていません</p>
          <p className="text-xs text-gray-600 mt-1">
            <span className="inline-flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              終了時刻: {task.endTime?.substring(0, 5)}
            </span>
          </p>
          <p className="text-xs text-[var(--header)] mt-2 font-medium">早くお花を摘んでください 🌸</p>
        </div>
        <button
          onClick={handleClose}
          className="ml-auto flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="通知を閉じる"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
