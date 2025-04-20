"use client"

import type React from "react"

import { Header } from "@/components/header"
import { TodoProvider, useTodo } from "@/context/todo-context"
import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"

function FavoriteTaskItem({ text }: { text: string }) {
  const { removeFromFavorites, addFavoriteToTasks } = useTodo()

  return (
    <div className="p-4 mb-3 bg-[var(--card)] rounded-lg border-2 border-black flex items-center justify-between">
      <span className="text-xl font-bold">{text}</span>
      <div className="flex space-x-2">
        <button
          onClick={() => addFavoriteToTasks(text)}
          className="bg-green-500 text-white px-3 py-1 rounded-lg border border-black"
          aria-label="タスクに追加"
        >
          追加
        </button>
        <button
          onClick={() => removeFromFavorites(text)}
          className="bg-red-500 text-white px-3 py-1 rounded-lg border border-black"
          aria-label="お気に入りから削除"
        >
          削除
        </button>
      </div>
    </div>
  )
}

function AddFavoriteForm() {
  const [text, setText] = useState("")
  const { addToFavorites } = useTodo()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      await addToFavorites(text.trim())
      setText("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex space-x-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="よく使うタスクを入力..."
          className="flex-1 p-3 bg-[var(--card)] rounded-lg border-2 border-black"
        />
        <button type="submit" className="bg-[var(--header)] text-white px-4 py-2 rounded-lg border-2 border-black">
          保存
        </button>
      </div>
    </form>
  )
}

function FavoritesPage() {
  const { favoriteTasks, isLoading } = useTodo()

  return (
    <div className="max-w-md mx-auto p-4">
      <Header />

      <h2 className="text-2xl font-bold mb-4">よく使うタスク</h2>
      <p className="mb-4">ここに保存したタスクは、簡単にタスクリストに追加できます。</p>

      <AddFavoriteForm />

      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--header)]"></div>
        </div>
      ) : favoriteTasks.length === 0 ? (
        <div className="text-center p-8 bg-[var(--card)] rounded-lg border-2 border-black my-4">
          <p className="text-lg">よく使うタスクがありません</p>
          <p>上のフォームからタスクを追加してください</p>
        </div>
      ) : (
        <div className="space-y-2">
          {favoriteTasks.map((task) => (
            <FavoriteTaskItem key={task} text={task} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function FavoritesPageWrapper() {
  return (
    <ProtectedRoute>
      <TodoProvider>
        <FavoritesPage />
      </TodoProvider>
    </ProtectedRoute>
  )
}
