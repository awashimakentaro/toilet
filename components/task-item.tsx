"use client"

import type React from "react"

import type { Task } from "@/lib/types"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { useTodo } from "@/context/todo-context"
import { useState, useRef } from "react"
import { generatePoopAnalysis } from "@/lib/poop-analysis"

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const { addToFavorites } = useTodo()
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<ReturnType<typeof generatePoopAnalysis> | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: {
      task,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.stopPropagation() // イベントの伝播を停止
    e.preventDefault() // デフォルトの動作を防止
    addToFavorites(task.text)
    alert(`「${task.text}」をよく使うタスクに追加しました！`)
  }

  const handleAnalysisClick = (e: React.MouseEvent) => {
    // イベントの伝播を停止し、デフォルトの動作を防止
    e.stopPropagation()
    e.preventDefault()

    console.log("うんこ解析ボタンがクリックされました") // デバッグ用

    // 既に解析結果がある場合は表示/非表示を切り替え
    if (analysisResult) {
      setShowAnalysis(!showAnalysis)
      return
    }

    // 解析中の状態を設定
    setIsAnalyzing(true)

    // 少し遅延を入れて解析処理を実行（UIのフィードバックを見せるため）
    setTimeout(() => {
      try {
        const result = generatePoopAnalysis(task.text, task.startTime, task.endTime)
        console.log("解析結果が生成されました:", result) // デバッグ用
        setAnalysisResult(result)
        setShowAnalysis(true)
      } catch (error) {
        console.error("解析中にエラーが発生しました:", error)
      } finally {
        setIsAnalyzing(false)
      }
    }, 300)
  }

  // 時間を表示用にフォーマット
  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return ""
    // HH:MM:SS 形式から HH:MM 形式に変換
    if (timeString.includes(":")) {
      // 最初の5文字（HH:MM）だけを取得
      return timeString.substring(0, 5)
    }
    return timeString
  }

  // 時間表示の文字列を生成
  const timeDisplay =
    task.startTime && task.endTime ? `${formatTime(task.startTime)} 〜 ${formatTime(task.endTime)}` : ""

  return (
    <div className="relative mb-3">
      {/* ドラッグ可能な部分 */}
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`p-4 bg-[var(--card)] rounded-lg border-2 border-black flex flex-col ${
          transform ? "z-10" : ""
        } cursor-grab`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-bold">{task.text}</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAddToFavorites}
              className="text-yellow-500 hover:text-yellow-600 p-1"
              aria-label="お気に入りに追加"
            >
              ⭐
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          {timeDisplay && <div className="text-sm bg-blue-100 p-1 px-2 rounded-md inline-block">🕒 {timeDisplay}</div>}
        </div>

        {/* ドラッグヒント */}
        {!showAnalysis && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded-lg pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
            <p className="text-sm text-white bg-black bg-opacity-70 px-2 py-1 rounded">ドラッグしてトイレに流す</p>
          </div>
        )}
      </div>

      {/* ボタンとうんこ解析結果（ドラッグ可能領域の外に配置） */}
      <div className="mt-2">
        {/* うんこ解析ボタン - ドラッグ可能領域の外に配置 */}
        <button
          ref={buttonRef}
          onClick={handleAnalysisClick}
          className={`text-sm ${
            isAnalyzing ? "bg-gray-500" : "bg-[var(--header)]"
          } text-white p-2 px-4 rounded-md hover:opacity-90 active:scale-95 transition-all w-full`}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              解析中...
            </span>
          ) : showAnalysis ? (
            "解析を隠す"
          ) : (
            "うんこ解析を見る"
          )}
        </button>

        {/* うんこ解析結果 */}
        {showAnalysis && analysisResult && (
          <div className="mt-2 p-3 bg-[var(--card)] rounded-lg border-2 border-black animate-fadeIn">
            <h4 className="text-md font-bold mb-2 flex items-center">
              {analysisResult.emoji} {analysisResult.title}
            </h4>
            <div className="bg-white p-3 rounded-md border border-gray-300">
              <p className="text-sm whitespace-pre-line">{analysisResult.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
