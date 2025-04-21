"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useTodo } from "@/context/todo-context"

export function AddTaskForm() {
  const [text, setText] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { addTask } = useTodo()
  const audioRef = useRef<HTMLAudioElement | null>(null)

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

  // テスト用の通知タスクを追加する関数
  const addTestReminderTask = async () => {
    const now = new Date()

    // 現在時刻から2分後を終了時刻に設定
    const endMinutes = now.getMinutes() + 2
    now.setMinutes(endMinutes)
    const testEndTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

    // 開始時刻は終了時刻の30分前（実際には使用されないがフォーマット上必要）
    const startMinutes = endMinutes - 30 < 0 ? endMinutes - 30 + 60 : endMinutes - 30
    const startHours = endMinutes - 30 < 0 ? now.getHours() - 1 : now.getHours()
    const testStartTime = `${String(startHours).padStart(2, "0")}:${String(startMinutes).padStart(2, "0")}`

    await addTask("テスト通知タスク（2分後に終了）", testStartTime, testEndTime)
    alert(`テスト通知タスクを追加しました。終了時刻: ${testEndTime}（約1分30秒後に通知が表示されます）`)

    playPoopSound()
  }

  return (
    <div className="mb-6">
      {!isFormOpen ? (
        <div className="space-y-2">
          <button
            onClick={() => setIsFormOpen(true)}
            className="w-full py-3 px-4 bg-[var(--card)] rounded-lg border-4 border-black text-xl font-bold hover:bg-opacity-90 transition-colors"
          >
            予定を追加
          </button>
          <button
            onClick={addTestReminderTask}
            className="w-full py-2 px-4 bg-yellow-100 text-yellow-800 rounded-lg border-2 border-yellow-300 hover:bg-yellow-200 transition-colors text-sm"
          >
            テスト通知を追加（2分後に終了するタスク）
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-[var(--card)] p-4 rounded-lg border-4 border-black">
          <div className="mb-4">
            <label htmlFor="task-text" className="block text-sm font-medium mb-1">
              予定内容
            </label>
            <input
              id="task-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="予定を入力..."
              className="w-full p-3 bg-white rounded-lg border-2 border-black"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="start-time" className="block text-sm font-medium mb-1">
                開始時間
              </label>
              <input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-3 bg-white rounded-lg border-2 border-black"
                required
              />
            </div>
            <div>
              <label htmlFor="end-time" className="block text-sm font-medium mb-1">
                終了時間
              </label>
              <input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-3 bg-white rounded-lg border-2 border-black"
                required
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-[var(--header)] text-white rounded-lg border-2 border-black hover:opacity-90 transition-colors"
            >
              予定を追加
            </button>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="py-2 px-4 bg-gray-300 rounded-lg border-2 border-black hover:bg-gray-400 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
