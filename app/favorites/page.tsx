"use client"

import type React from "react"

import { Header } from "@/components/header"
import { TodoProvider, useTodo } from "@/context/todo-context"
import { useState, useRef } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"

function FavoriteTaskItem({ text }: { text: string }) {
  const { removeFromFavorites, addFavoriteToTasks } = useTodo()
  const [showTimeForm, setShowTimeForm] = useState(false)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // コンポーネントがマウントされたときに音声要素を作成
  if (typeof window !== "undefined" && !audioRef.current) {
    audioRef.current = new Audio("/poop-sound.mp3")
  }

  const playPoopSound = () => {
    if (audioRef.current) {
      // 音声を最初から再生するためにcurrentTimeをリセット
      audioRef.current.currentTime = 0
      audioRef.current.play().catch((e) => {
        console.error("音声再生エラー:", e)
      })
    }
  }

  const handleAddToTasks = async () => {
    if (!showTimeForm) {
      // フォームを表示する
      setShowTimeForm(true)
      return
    }

    // 時間が入力されている場合は直接追加
    if (startTime && endTime) {
      await handleConfirmAdd()
    }
  }

  const handleConfirmAdd = async () => {
    await addFavoriteToTasks(text, startTime, endTime)
    setShowTimeForm(false)
    setStartTime("")
    setEndTime("")
    // 音を再生
    playPoopSound()
  }

  const handleAddWithoutTime = async () => {
    // 時間なしで追加
    await addFavoriteToTasks(text)
    setShowTimeForm(false)
    // 音を再生
    playPoopSound()
  }

  const handleCancel = () => {
    setShowTimeForm(false)
    setStartTime("")
    setEndTime("")
  }

  return (
    <div className="p-4 mb-3 bg-[var(--card)] rounded-lg border-2 border-black">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl font-bold">{text}</span>
        <div className="flex space-x-2">
          <button
            onClick={() => removeFromFavorites(text)}
            className="bg-red-500 text-white px-3 py-1 rounded-lg border border-black"
            aria-label="お気に入りから削除"
          >
            削除
          </button>
        </div>
      </div>

      {showTimeForm ? (
        <div className="mt-2">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <label htmlFor={`start-time-${text}`} className="block text-sm font-medium mb-1">
                開始時間
              </label>
              <input
                id={`start-time-${text}`}
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2 bg-white rounded-lg border-2 border-black"
                required
              />
            </div>
            <div>
              <label htmlFor={`end-time-${text}`} className="block text-sm font-medium mb-1">
                終了時間
              </label>
              <input
                id={`end-time-${text}`}
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2 bg-white rounded-lg border-2 border-black"
                required
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleConfirmAdd}
              disabled={!startTime || !endTime}
              className={`px-3 py-1 rounded-lg border border-black ${
                !startTime || !endTime ? "bg-gray-400" : "bg-green-500 text-white"
              }`}
            >
              予定に追加
            </button>
            <button
              onClick={handleAddWithoutTime}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg border border-black"
            >
              時間なしで追加
            </button>
            <button onClick={handleCancel} className="bg-gray-300 px-3 py-1 rounded-lg border border-black">
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleAddToTasks}
          className="bg-green-500 text-white px-3 py-1 rounded-lg border border-black"
          aria-label="タスクに追加"
        >
          予定に追加
        </button>
      )}
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
          placeholder="よく使う予定を入力..."
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

      <h2 className="text-2xl font-bold mb-4">よく使う予定</h2>
      <p className="mb-4">ここに保存した予定は、簡単に予定リストに追加できます。</p>

      <AddFavoriteForm />

      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--header)]"></div>
        </div>
      ) : favoriteTasks.length === 0 ? (
        <div className="text-center p-8 bg-[var(--card)] rounded-lg border-2 border-black my-4">
          <p className="text-lg">よく使う予定がありません</p>
          <p>上のフォームから予定を追加してください</p>
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
