"use client"

import type React from "react"

import { useState } from "react"
import { useTodo } from "@/context/todo-context"

export function AddTaskForm() {
  const [text, setText] = useState("")
  const { addTask } = useTodo()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      addTask(text.trim())
      setText("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <button
        type="submit"
        className="w-full py-3 px-4 bg-[var(--card)] rounded-lg border-4 border-black text-xl font-bold hover:bg-opacity-90 transition-colors"
      >
        タスクを追加
      </button>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="新しいタスクを入力..."
        className="w-full mt-2 p-3 bg-[var(--card)] rounded-lg border-2 border-black"
      />
    </form>
  )
}
