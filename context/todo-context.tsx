"use client"

import { createContext, useState, useContext, type ReactNode, useEffect } from "react"
import type { Task } from "@/lib/types"
import { getSupabaseClient } from "@/lib/supabase"
import { useAuth } from "./auth-context"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

interface TodoContextType {
  tasks: Task[]
  favoriteTasks: string[]
  isLoading: boolean
  addTask: (text: string, startTime?: string, endTime?: string) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  flushTask: (id: string) => Promise<void>
  addToFavorites: (text: string) => Promise<void>
  removeFromFavorites: (text: string) => Promise<void>
  addFavoriteToTasks: (text: string, startTime?: string, endTime?: string) => Promise<void>
}

const TodoContext = createContext<TodoContextType | undefined>(undefined)

export function TodoProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [favoriteTasks, setFavoriteTasks] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
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
  const addTask = async (text: string, startTime?: string, endTime?: string) => {
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
  const addFavoriteToTasks = async (text: string, startTime?: string, endTime?: string) => {
    await addTask(text, startTime, endTime)
  }

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
