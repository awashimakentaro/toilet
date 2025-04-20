"use client"

import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import { AddTaskForm } from "@/components/add-task-form"
import { TaskItem } from "@/components/task-item"
import { ToiletDropArea } from "@/components/toilet-drop-area"
import { TodoProvider, useTodo } from "@/context/todo-context"
import { useState } from "react"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/auth/protected-route"

function TodoApp() {
  const { tasks, flushTask, isLoading } = useTodo()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && over.id === "toilet") {
      console.log("タスクがトイレにドロップされました！") // デバッグ用

      // アニメーションを開始
      setIsAnimating(true)

      // タスクを削除（アニメーション後）
      setTimeout(() => {
        flushTask(active.id as string)
      }, 500)

      // トイレの水を流す効果音を再生
      try {
        const audio = new Audio("/flush-sound.mp3")
        audio.play()
      } catch (e) {
        console.log("オーディオ再生エラー:", e)
      }
    }
  }

  const handleAnimationComplete = () => {
    setIsAnimating(false)
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="max-w-md mx-auto p-4">
        <Header />

        <h2 className="text-2xl font-bold mb-4">今日の予定表</h2>

        <AddTaskForm />

        {isLoading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--header)]"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center p-8 bg-[var(--card)] rounded-lg border-2 border-black my-4">
            <p className="text-lg">予定がありません</p>
            <p>上のフォームから予定を追加してください</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}

        <ToiletDropArea isAnimating={isAnimating} onAnimationComplete={handleAnimationComplete} />
      </div>
    </DndContext>
  )
}

export default function Home() {
  return (
    <ProtectedRoute>
      <TodoProvider>
        <TodoApp />
      </TodoProvider>
    </ProtectedRoute>
  )
}
