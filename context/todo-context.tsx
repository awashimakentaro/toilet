"use client"

import { createContext, useState, useContext, type ReactNode, useEffect } from "react"
import type { Task } from "@/lib/types"

interface TodoContextType {
  tasks: Task[]
  favoriteTasks: string[]
  addTask: (text: string) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  flushTask: (id: string) => void
  addToFavorites: (text: string) => void
  removeFromFavorites: (text: string) => void
  addFavoriteToTasks: (text: string) => void
}

const TodoContext = createContext<TodoContextType | undefined>(undefined)

export function TodoProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "買い物", completed: false },
    { id: "2", text: "レポートを書く", completed: false },
    { id: "3", text: "ジムに行く", completed: false },
  ])

  const [favoriteTasks, setFavoriteTasks] = useState<string[]>([])

  // ローカルストレージからデータを読み込む
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks")
    const storedFavorites = localStorage.getItem("favoriteTasks")

    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }

    if (storedFavorites) {
      setFavoriteTasks(JSON.parse(storedFavorites))
    }
  }, [])

  // データが変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("favoriteTasks", JSON.stringify(favoriteTasks))
  }, [favoriteTasks])

  const addTask = (text: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
    }
    setTasks([...tasks, newTask])
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const flushTask = (id: string) => {
    // タスクを削除する前に、アニメーションのために少し待つ
    setTimeout(() => {
      deleteTask(id)
    }, 1000)
  }

  // お気に入りタスクを追加
  const addToFavorites = (text: string) => {
    if (!favoriteTasks.includes(text)) {
      setFavoriteTasks([...favoriteTasks, text])
    }
  }

  // お気に入りタスクを削除
  const removeFromFavorites = (text: string) => {
    setFavoriteTasks(favoriteTasks.filter((task) => task !== text))
  }

  // お気に入りタスクをタスクリストに追加
  const addFavoriteToTasks = (text: string) => {
    addTask(text)
  }

  return (
    <TodoContext.Provider
      value={{
        tasks,
        favoriteTasks,
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
