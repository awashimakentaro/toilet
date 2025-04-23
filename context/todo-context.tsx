"use client"

import { createContext, useState, useContext, type ReactNode, useEffect } from "react"
import type { Task } from "@/lib/types"
import { getSupabaseClient } from "@/lib/supabase"
import { useAuth } from "./auth-context"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// TodoContextTypeインターフェースに編集機能を追加
interface TodoContextType {
  tasks: Task[]
  favoriteTasks: string[]
  isLoading: boolean
  addTask: (text: string, startTime?: string, endTime?: string, importance?: number) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  flushTask: (id: string) => Promise<void>
  addToFavorites: (text: string) => Promise<void>
  removeFromFavorites: (text: string) => Promise<void>
  addFavoriteToTasks: (text: string, startTime?: string, endTime?: string, importance?: number) => Promise<void>
  reminderTasks: Task[] // リマインダーが必要なタスク
  dismissReminder: (taskId: string) => void // リマインダーを閉じる関数
  editTask: (id: string, text: string, startTime?: string, endTime?: string, importance?: number) => Promise<void> // タスク編集機能を追加
}

const TodoContext = createContext<TodoContextType | undefined>(undefined)

export function TodoProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [favoriteTasks, setFavoriteTasks] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reminderTasks, setReminderTasks] = useState<Task[]>([]) // リマインダーが必要なタスク
  const [notifiedTaskIds, setNotifiedTaskIds] = useState<Set<string>>(new Set()) // 既に通知を表示したタスクのID
  const { user } = useAuth()
  const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(null)

  // クライアントサイドでのみSupabaseを初期化
  useEffect(() => {
    setSupabase(getSupabaseClient())
  }, [])

  // ユーザーのタスクを取得
  useEffect(() => {
    if (!supabase || !user) {
      setTasks([])
      setFavoriteTasks([])
      setIsLoading(false)
      return
    }

    const fetchTasks = async () => {
      setIsLoading(true)
      try {
        // タスクを取得
        const { data: tasksData, error: tasksError } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", user.id)
          .order("start_time", { ascending: true }) // 開始時間でソート

        if (tasksError) throw tasksError

        // お気に入りタスクを取得
        const { data: favoritesData, error: favoritesError } = await supabase
          .from("favorite_tasks")
          .select("text")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (favoritesError) throw favoritesError

        setTasks(
          tasksData.map((task) => ({
            id: task.id,
            text: task.text,
            completed: task.completed,
            startTime: task.start_time,
            endTime: task.end_time,
            importance: task.importance,
          })),
        )

        setFavoriteTasks(favoritesData.map((favorite) => favorite.text))
      } catch (error) {
        console.error("データ取得エラー:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [user, supabase])

  // タスクを追加
  const addTask = async (text: string, startTime?: string, endTime?: string, importance?: number) => {
    if (!supabase || !user) return

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            user_id: user.id,
            text,
            completed: false,
            start_time: startTime || null,
            end_time: endTime || null,
            importance: importance || null,
          },
        ])
        .select()
        .single()

      if (error) throw error

      setTasks([
        {
          id: data.id,
          text: data.text,
          completed: data.completed,
          startTime: data.start_time,
          endTime: data.end_time,
          importance: data.importance,
        },
        ...tasks,
      ])
    } catch (error) {
      console.error("タスク追加エラー:", error)
    }
  }

  // タスクの完了状態を切り替え
  const toggleTask = async (id: string) => {
    if (!supabase || !user) return

    const taskToUpdate = tasks.find((task) => task.id === id)
    if (!taskToUpdate) return

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ completed: !taskToUpdate.completed })
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) throw error

      setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
    } catch (error) {
      console.error("タスク更新エラー:", error)
    }
  }

  // タスクを削除
  const deleteTask = async (id: string) => {
    if (!supabase || !user) return

    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id).eq("user_id", user.id)

      if (error) throw error

      setTasks(tasks.filter((task) => task.id !== id))

      // 通知済みリストからも削除
      if (notifiedTaskIds.has(id)) {
        const newNotifiedTaskIds = new Set(notifiedTaskIds)
        newNotifiedTaskIds.delete(id)
        setNotifiedTaskIds(newNotifiedTaskIds)
      }
    } catch (error) {
      console.error("タスク削除エラー:", error)
    }
  }

  // タスクを流す（アニメーション後に削除）
  const flushTask = async (id: string) => {
    setTimeout(() => {
      deleteTask(id)
    }, 1000)
  }

  // お気に入りタスクを追加
  const addToFavorites = async (text: string) => {
    if (!supabase || !user) return

    if (favoriteTasks.includes(text)) return

    try {
      const { error } = await supabase.from("favorite_tasks").insert([{ user_id: user.id, text }])

      if (error) throw error

      setFavoriteTasks([...favoriteTasks, text])
    } catch (error) {
      console.error("お気に入り追加エラー:", error)
    }
  }

  // お気に入りタスクを削除
  const removeFromFavorites = async (text: string) => {
    if (!supabase || !user) return

    try {
      const { error } = await supabase.from("favorite_tasks").delete().eq("user_id", user.id).eq("text", text)

      if (error) throw error

      setFavoriteTasks(favoriteTasks.filter((task) => task !== text))
    } catch (error) {
      console.error("お気に入り削除エラー:", error)
    }
  }

  // お気に入りタスクをタスクリストに追加
  const addFavoriteToTasks = async (text: string, startTime?: string, endTime?: string, importance?: number) => {
    await addTask(text, startTime, endTime, importance)
  }

  // リマインダーチェック用の効果
  useEffect(() => {
    if (tasks.length === 0) return

    // 初回ロード時にもチェックを実行
    checkReminders()

    // 10秒ごとにチェック
    const checkInterval = setInterval(checkReminders, 10000)

    // リマインダーをチェックする関数
    function checkReminders() {
      const now = new Date()
      console.log("リマインダーチェック実行:", now.toLocaleTimeString())

      const reminders: Task[] = []

      tasks.forEach((task) => {
        if (task.endTime && !task.completed) {
          // 既に通知を表示したタスクはスキップ
          if (notifiedTaskIds.has(task.id)) {
            return
          }

          // 現在の日付を取得し、タスクの終了時間を設定
          const endTime = new Date()
          const [hours, minutes] = task.endTime.split(":").map(Number)
          endTime.setHours(hours, minutes, 0, 0)

          // 終了時刻の30分前
          const reminderTime = new Date(endTime.getTime() - 30 * 60 * 1000)

          // デバッグ用ログ
          console.log(
            `タスク "${task.text}" - 終了時刻: ${endTime.toLocaleTimeString()}, ` +
              `通知時刻: ${reminderTime.toLocaleTimeString()}, ` +
              `現在時刻: ${now.toLocaleTimeString()}`,
          )

          // 現在時刻が通知時間と終了時間の間にあるかチェック
          // 誤差を許容するために1分の余裕を持たせる
          const isWithinReminderWindow =
            now.getTime() >= reminderTime.getTime() - 60000 && now.getTime() <= endTime.getTime()

          if (isWithinReminderWindow) {
            console.log(`"${task.text}" の通知条件が満たされました！`)
            reminders.push(task)

            // 通知済みとして記録
            setNotifiedTaskIds((prev) => new Set(prev).add(task.id))
          }
        }
      })

      if (reminders.length > 0) {
        console.log(
          `${reminders.length}件の新しい通知があります:`,
          reminders.map((r) => r.text),
        )
        setReminderTasks((prev) => [...prev, ...reminders])
      }
    }

    return () => clearInterval(checkInterval)
  }, [tasks, reminderTasks, notifiedTaskIds])

  // リマインダーを閉じる関数
  const dismissReminder = (taskId: string) => {
    setReminderTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  // TodoProviderコンポーネント内に編集機能を追加（returnステートメントの前に追加）
  // タスクを編集
  const editTask = async (id: string, text: string, startTime?: string, endTime?: string, importance?: number) => {
    if (!supabase || !user) return

    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          text,
          start_time: startTime || null,
          end_time: endTime || null,
          importance: importance || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) throw error

      // ローカルのタスク状態を更新
      setTasks(
        tasks.map((task) =>
          task.id === id
            ? {
                ...task,
                text,
                startTime,
                endTime,
                importance,
              }
            : task,
        ),
      )
    } catch (error) {
      console.error("タスク編集エラー:", error)
    }
  }

  // TodoContextのvalueに編集機能を追加
  return (
    <TodoContext.Provider
      value={{
        tasks,
        favoriteTasks,
        isLoading,
        addTask,
        toggleTask,
        deleteTask,
        flushTask,
        addToFavorites,
        removeFromFavorites,
        addFavoriteToTasks,
        reminderTasks,
        dismissReminder,
        editTask, // 編集機能を追加
      }}
    >
      {children}
    </TodoContext.Provider>
  )
}

export function useTodo() {
  const context = useContext(TodoContext)
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider")
  }
  return context
}
