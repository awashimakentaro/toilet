"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useTodo } from "@/context/todo-context"
import { generatePoopAnalysis } from "../lib/poop-analysis"

export function AddTaskForm() {
  const [text, setText] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<ReturnType<typeof generatePoopAnalysis> | null>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      // 解析結果を生成
      const analysis = generatePoopAnalysis(text, startTime, endTime)
      setAnalysisResult(analysis)
      setShowAnalysis(true)
    }
  }

  const handleConfirmTask = () => {
    if (text.trim()) {
      addTask(text.trim(), startTime, endTime)
      setText("")
      setStartTime("")
      setEndTime("")
      setIsFormOpen(false)
      setShowAnalysis(false)
      setAnalysisResult(null)

      // 予定追加時に音を再生
      playPoopSound()
    }
  }

  const handleCancel = () => {
    setShowAnalysis(false)
    setAnalysisResult(null)
  }

  return (
    <div className="mb-6">
      {!isFormOpen ? (
        <button
          onClick={() => setIsFormOpen(true)}
          className="w-full py-3 px-4 bg-[var(--card)] rounded-lg border-4 border-black text-xl font-bold hover:bg-opacity-90 transition-colors"
        >
          予定を追加
        </button>
      ) : showAnalysis && analysisResult ? (
        <div className="bg-[var(--card)] p-4 rounded-lg border-4 border-black">
          <h3 className="text-xl font-bold mb-2 flex items-center">
            {analysisResult.emoji} {analysisResult.title}
          </h3>

          <div className="bg-white p-3 rounded-lg border-2 border-black mb-4">
            <p className="text-sm mb-2">
              <span className="font-bold">予定:</span> {text}
            </p>
            {startTime && endTime && (
              <p className="text-sm">
                <span className="font-bold">時間:</span> {startTime} 〜 {endTime}
              </p>
            )}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm whitespace-pre-line">{analysisResult.description}</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleConfirmTask}
              className="flex-1 py-2 px-4 bg-[var(--header)] text-white rounded-lg border-2 border-black hover:opacity-90 transition-colors"
            >
              この予定を追加する
            </button>
            <button
              onClick={handleCancel}
              className="py-2 px-4 bg-gray-300 rounded-lg border-2 border-black hover:bg-gray-400 transition-colors"
            >
              キャンセル
            </button>
          </div>
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
              うんこ解析
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
