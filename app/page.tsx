"use client"

import {
  DndContext,
  type DragEndEvent,
  pointerWithin,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
} from "@dnd-kit/core"
import { AddTaskForm } from "@/components/add-task-form"
import { TaskItem } from "@/components/task-item"
import { ToiletDropArea } from "@/components/toilet-drop-area"
import { TodoProvider, useTodo } from "@/context/todo-context"
import { useState, useMemo, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ReminderNotification } from "@/components/reminder-notification"
import { fadeInFromBottom } from "@/lib/gsap-utils"

function TodoApp() {
  const { tasks, flushTask, isLoading, reminderTasks, dismissReminder } = useTodo()

  // DndContextのセンサー設定を最適化
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // ポインターの移動が5px以上で開始（小さな動きでは開始しない）
      activationConstraint: {
        distance: 8, // 5pxから8pxに増加してより意図的な操作を要求
        delay: 0, // 遅延を0に設定
      },
    }),
    useSensor(TouchSensor, {
      // タッチの移動が10px以上で開始（スクロールとの区別）
      activationConstraint: {
        delay: 150, // 250msから150msに短縮
        tolerance: 8, // 10pxから8pxに変更
      },
    }),
  )

  const [isAnimating, setIsAnimating] = useState(false)

  // アニメーション用のref
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (titleRef.current) {
      fadeInFromBottom(titleRef.current, 0.1)
    }
    if (subtitleRef.current) {
      fadeInFromBottom(subtitleRef.current, 0.2)
    }
  }, [])

  // タスクを終了時刻でソート
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      // 終了時刻がない場合は最後に表示
      if (!a.endTime) return -1
      if (!b.endTime) return 1

      // 時間を比較するために数値に変換
      const aTime = a.endTime.split(":").map(Number)
      const bTime = b.endTime.split(":").map(Number)

      // 時間で比較
      if (aTime[0] !== bTime[0]) {
        return aTime[0] - bTime[0]
      }

      // 時間が同じなら分で比較
      return aTime[1] - bTime[1]
    })
  }, [tasks])

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
    <DndContext onDragEnd={handleDragEnd} collisionDetection={pointerWithin} sensors={sensors}>
      <div className="max-w-2xl mx-auto px-6 sm:px-4">
        <Header />

        <div className="mb-8">
          <h2 ref={titleRef} className="text-3xl font-bold mb-2 text-gray-800 opacity-0">
            今日の予定表
          </h2>
          <p ref={subtitleRef} className="text-gray-600 opacity-0">
            完了した予定はトイレに流してスッキリしましょう！
          </p>
        </div>

        <AddTaskForm />

        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-4 border-[var(--header)] animate-spin"></div>
            </div>
          </div>
        ) : sortedTasks.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-xl border border-gray-200 shadow-md my-8">
            <div className="text-6xl mb-4">🚽</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">予定がありません</h3>
            <p className="text-gray-500">上のフォームから予定を追加してください</p>
          </div>
        ) : (
          <div className="space-y-0">
            {sortedTasks.map((task, index) => (
              <TaskItem key={task.id} task={task} index={index} />
            ))}
          </div>
        )}

        <ToiletDropArea isAnimating={isAnimating} onAnimationComplete={handleAnimationComplete} />

        {/* リマインダー通知を表示 */}
        {reminderTasks.map((task) => (
          <ReminderNotification key={task.id} task={task} onClose={() => dismissReminder(task.id)} />
        ))}
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
