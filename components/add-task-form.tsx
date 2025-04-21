"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useTodo } from "@/context/todo-context"
import { fadeInFromBottom } from "@/lib/gsap-utils"

export function AddTaskForm() {
  const [text, setText] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { addTask } = useTodo()
  const audioRef = useRef<HTMLAudioElement | null>(null)

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
  if (typeof window !== "undefined" && !audioRef.current) {
    audioRef.current = new Audio("/poop-sound.mp3")
  }

  const playPoopSound = () => {
    if (audioRef.current) {
      // 音声を最初から再生するためにcurrentTimeをリセット
      audioRef.current.currentTime = 0
      audioRef.current.play().catch((e) => {
        console.error("音声再生エラー:", e)
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      await addTask(text.trim(), startTime, endTime)
      setText("")
      setStartTime("")
      setEndTime("")
      setIsFormOpen(false)

      // 予定追加時に音を再生
      playPoopSound()
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
