"use client"

import type React from "react"

import type { Task } from "@/lib/types"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { useTodo } from "@/context/todo-context"

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const { addToFavorites } = useTodo()
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: {
      task,
    },
    // disabled: !task.completed を削除し、常にドラッグ可能にする
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.stopPropagation() // イベントの伝播を停止
    addToFavorites(task.text)
    alert(`「${task.text}」をよく使うタスクに追加しました！`)
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
          {/* チェックボックスを削除 */}
        </div>
      </div>

      {timeDisplay && (
        <div className="text-sm bg-blue-100 p-1 px-2 rounded-md inline-block self-start">🕒 {timeDisplay}</div>
      )}

      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded-lg pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
        <p className="text-sm text-white bg-black bg-opacity-70 px-2 py-1 rounded">ドラッグしてトイレに流す</p>
      </div>
    </div>
  )
}
