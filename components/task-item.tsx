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
  const { toggleTask, addToFavorites } = useTodo()
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: {
      task,
    },
    disabled: !task.completed, // 完了したタスクのみドラッグ可能
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`relative p-4 mb-3 bg-[var(--card)] rounded-lg border-2 border-black flex items-center justify-between ${
        task.completed ? "opacity-70" : ""
      } ${transform ? "z-10" : ""} ${task.completed ? "cursor-grab" : "cursor-default"}`}
    >
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold">{task.text}</span>
        <button
          onClick={handleAddToFavorites}
          className="ml-2 text-yellow-500 hover:text-yellow-600"
          aria-label="お気に入りに追加"
        >
          ⭐
        </button>
      </div>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleTask(task.id)}
        className="w-6 h-6 border-2 border-black"
      />
      {task.completed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded-lg pointer-events-none">
          <p className="text-sm text-white bg-black bg-opacity-70 px-2 py-1 rounded">ドラッグしてトイレに流す</p>
        </div>
      )}
    </div>
  )
}
