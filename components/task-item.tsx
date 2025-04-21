"use client"

import type React from "react"

import type { Task } from "@/lib/types"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { useTodo } from "@/context/todo-context"
import { useState, useEffect } from "react"
import { generatePoopAnalysis } from "@/lib/poop-analysis"

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const { addToFavorites } = useTodo()
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<ReturnType<typeof generatePoopAnalysis> | null>(null)

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

  // タスクが変更されたときに解析結果をリセット
  useEffect(() => {
    if (task.text && (task.startTime || task.endTime)) {
      setAnalysisResult(generatePoopAnalysis(task.text, task.startTime, task.endTime))
    }
  }, [task])

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.stopPropagation() // イベントの伝播を停止
    addToFavorites(task.text)
    alert(`「${task.text}」をよく使うタスクに追加しました！`)
  }

  const toggleAnalysis = (e: React.MouseEvent) => {
    e.stopPropagation() // ドラッグイベントを妨げないように
    setShowAnalysis(!showAnalysis)
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
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`relative p-4 mb-3 bg-[var(--card)] rounded-lg border-2 border-black flex flex-col ${
        transform ? "z-10" : ""
      } cursor-grab`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl font-bold">{task.text}</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAddToFavorites}
            className="text-yellow-500 hover:text-yellow-600"
            aria-label="お気に入りに追加"
          >
            ⭐
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        {timeDisplay && <div className="text-sm bg-blue-100 p-1 px-2 rounded-md inline-block">🕒 {timeDisplay}</div>}

        <button onClick={toggleAnalysis} className="text-sm bg-[var(--header)] text-white p-1 px-2 rounded-md ml-auto">
          {showAnalysis ? "解析を隠す" : "うんこ解析を見る"}
        </button>
      </div>

      {/* うんこ解析結果 */}
      {showAnalysis && analysisResult && (
        <div className="mt-3 pt-3 border-t border-gray-300">
          <h4 className="text-md font-bold mb-2 flex items-center">
            {analysisResult.emoji} {analysisResult.title}
          </h4>
          <div className="bg-white p-2 rounded-md border border-gray-300">
            <p className="text-sm whitespace-pre-line">{analysisResult.description}</p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded-lg pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
        <p className="text-sm text-white bg-black bg-opacity-70 px-2 py-1 rounded">ドラッグしてトイレに流す</p>
      </div>
    </div>
  )
}
