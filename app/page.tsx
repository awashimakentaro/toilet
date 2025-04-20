"use client"

import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import { AddTaskForm } from "@/components/add-task-form"
import { TaskItem } from "@/components/task-item"
import { ToiletDropArea } from "@/components/toilet-drop-area"
import { TodoProvider, useTodo } from "@/context/todo-context"
import { useState } from "react"
import { Header } from "@/components/header"

function TodoApp() {
  const { tasks, flushTask } = useTodo()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && over.id === "toilet" && active.data.current?.task.completed) {
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

        <AddTaskForm />

        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>

        <ToiletDropArea isAnimating={isAnimating} onAnimationComplete={handleAnimationComplete} />
      </div>
    </DndContext>
  )
}

export default function Home() {
  return (
    <TodoProvider>
      <TodoApp />
    </TodoProvider>
  )
}
