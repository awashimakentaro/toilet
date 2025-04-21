"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useTodo } from "@/context/todo-context"
import { fadeInFromBottom } from "@/lib/gsap-utils"

export function AddTaskForm() {
  const [text, setText] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [importance, setImportance] = useState<number>(2) // デフォルトは中程度の重要度（3段階の場合は2）
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { addTask } = useTodo()
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({
    poop: null,
    po: null,
    pee: null,
  })

  // アニメーション用のref
  const formContainerRef = useRef<HTMLDivElement>(null)
  const addButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (formContainerRef.current) {
      fadeInFromBottom(formContainerRef.current, 0.2)
    }
    if (addButtonRef.current) {
      fadeInFromBottom(addButtonRef.current, 0.3)
    }
  }, [])

  // コンポーネントがマウントされたときに音声要素を作成
  if (typeof window !== "undefined") {
    if (!audioRefs.current.poop) {
      audioRefs.current.poop = new Audio("/poop-sound.mp3")
    }
    if (!audioRefs.current.po) {
      audioRefs.current.po = new Audio("/po.mp3")
    }
    if (!audioRefs.current.pee) {
      audioRefs.current.pee = new Audio("/man-pee.mp3")
    }
  }

  const playRandomSound = () => {
    // 音声ファイルの配列からランダムに1つ選択
    const soundKeys = Object.keys(audioRefs.current)
    const randomKey = soundKeys[Math.floor(Math.random() * soundKeys.length)]
    const audio = audioRefs.current[randomKey]

    if (audio) {
      // 音声を最初から再生するためにcurrentTimeをリセット
      audio.currentTime = 0
      audio.play().catch((e) => {
        console.error("音声再生エラー:", e)
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      await addTask(text.trim(), startTime, endTime, importance)
      setText("")
      setStartTime("")
      setEndTime("")
      setImportance(2) // 重要度をリセット（3段階の場合は中程度の2）
      setIsFormOpen(false)

      // ランダムな効果音を再生
      playRandomSound()
    }
  }

  // 重要度に応じたうんこアイコンを取得
  const getPoopIcon = (level: number) => {
    switch (level) {
      case 1:
        return "💩"
      case 2:
        return "💩"
      case 3:
        return "💩"
      default:
        return "💩"
    }
  }

  // 重要度のラベルを取得
  const getImportanceLabel = (level: number) => {
    switch (level) {
      case 1:
        return "低"
      case 2:
        return "中"
      case 3:
        return "高"
      default:
        return "中"
    }
  }

  return (
    <div ref={formContainerRef} className="mb-4 sm:mb-8 opacity-0">
      {!isFormOpen ? (
        <button
          ref={addButtonRef}
          onClick={() => setIsFormOpen(true)}
          className="w-full py-3 sm:py-4 px-4 sm:px-6 gradient-button flex items-center justify-center text-lg sm:text-xl font-bold rounded-xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新しい予定を追加
        </button>
      ) : (
        <div className="modern-card p-4 sm:p-6 animate-fadeIn">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-[var(--header)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            予定の詳細
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
            <div>
              <label htmlFor="task-text" className="modern-label">
                予定内容
              </label>
              <input
                id="task-text"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="予定を入力..."
                className="modern-input"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div>
                <label htmlFor="start-time" className="modern-label">
                  開始時間
                </label>
                <input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="modern-input"
                  required
                />
              </div>
              <div>
                <label htmlFor="end-time" className="modern-label">
                  終了時間
                </label>
                <input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="modern-input"
                  required
                />
              </div>
            </div>

            {/* 重要度選択UI（3段階） */}
            <div>
              <label className="modern-label">タスクの重要度</label>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex space-x-3 sm:space-x-4">
                  {[1, 2, 3].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setImportance(level)}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center transition-all ${
                        importance === level
                          ? "bg-[var(--header)] text-white scale-110 shadow-md"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      }`}
                    >
                      <span className="text-sm sm:text-base font-medium">{level}</span>
                      <span className="text-xs">{getImportanceLabel(level)}</span>
                    </button>
                  ))}
                </div>
                <div className="text-2xl ml-2">{getPoopIcon(importance)}</div>
              </div>
              <div className="text-xs text-gray-500 mt-1 flex justify-between">
                <span>低い重要度</span>
                <span>高い重要度</span>
              </div>
            </div>

            <div className="flex space-x-2 sm:space-x-3 pt-1 sm:pt-2">
              <button type="submit" className="flex-1 accent-gradient-button flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                予定を追加
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
