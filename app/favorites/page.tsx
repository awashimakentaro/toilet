"use client"

import type React from "react"
import { Header } from "@/components/header"
import { TodoProvider, useTodo } from "@/context/todo-context"
import { useState, useRef, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { fadeInFromBottom, slideInFromLeft } from "@/lib/gsap-utils"
import Image from "next/image"

function FavoriteTaskItem({ text, index }: { text: string; index: number }) {
  const { removeFromFavorites, addFavoriteToTasks } = useTodo()
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (itemRef.current) {
      fadeInFromBottom(itemRef.current, 0.2 + index * 0.05)
    }
  }, [index])
  const [showTimeForm, setShowTimeForm] = useState(false)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [importance, setImportance] = useState<number>(2) // デフォルトは中程度の重要度（3段階の場合は2）
  const [timeError, setTimeError] = useState<string | null>(null) // 時間エラー用の状態を追加
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({
    poop: null,
    po: null,
    pee: null,
  })

  // コンポーネントがマウントされたときに音声要素を作成
  if (typeof window !== "undefined") {
    if (!audioRefs.current.poop) {
      audioRefs.current.poop = new Audio("/poop-sound.mp3")
    }
    if (!audioRefs.current.po) {
      audioRefs.current.po = new Audio("/po.mp3")
    }
    if (!audioRefs.current.pee) {
      audioRefs.current.pee = new Audio("/man-pee.mp3")
    }
  }

  const playRandomSound = () => {
    // 音声ファイルの配列からランダムに1つ選択
    const soundKeys = Object.keys(audioRefs.current)
    const randomKey = soundKeys[Math.floor(Math.random() * soundKeys.length)]
    const audio = audioRefs.current[randomKey]

    if (audio) {
      // 音声を最初から再生するためにcurrentTimeをリセット
      audio.currentTime = 0
      audio.play().catch((e) => {
        console.error("音声再生エラー:", e)
      })
    }
  }

  // 時間を分に変換するヘルパー関数を追加
  const convertTimeToMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(":").map(Number)
    return hours * 60 + minutes
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
    // 時間のバリデーション
    if (startTime && endTime) {
      // 時間を比較するために数値に変換
      const startMinutes = convertTimeToMinutes(startTime)
      const endMinutes = convertTimeToMinutes(endTime)

      if (endMinutes <= startMinutes) {
        setTimeError("終了時刻は開始時刻より後に設定してください")
        return
      }
    }

    setTimeError(null) // エラーをクリア

    await addFavoriteToTasks(text, startTime, endTime, importance)
    setShowTimeForm(false)
    setStartTime("")
    setEndTime("")
    setImportance(2) // 重要度をリセット（3段階の場合は中程度の2）
    // ランダムな効果音を再生
    playRandomSound()
  }

  // 時間入力フィールドの変更ハンドラを追加
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(e.target.value)
    // 終了時間が既に入力されている場合は検証
    if (endTime) {
      const startMinutes = convertTimeToMinutes(e.target.value)
      const endMinutes = convertTimeToMinutes(endTime)

      if (endMinutes <= startMinutes) {
        setTimeError("終了時刻は開始時刻より後に設定してください")
      } else {
        setTimeError(null)
      }
    }
  }

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(e.target.value)
    // 開始時間が既に入力されている場合は検証
    if (startTime) {
      const startMinutes = convertTimeToMinutes(startTime)
      const endMinutes = convertTimeToMinutes(e.target.value)

      if (endMinutes <= startMinutes) {
        setTimeError("終了時刻は開始時刻より後に設定してください")
      } else {
        setTimeError(null)
      }
    }
  }

  const handleAddWithoutTime = async () => {
    // 時間なしで追加
    await addFavoriteToTasks(text, undefined, undefined, importance)
    setShowTimeForm(false)
    setImportance(2) // 重要度をリセット（3段階の場合は中程度の2）
    // ランダムな効果音を再生
    playRandomSound()
  }

  const handleCancel = () => {
    setShowTimeForm(false)
    setStartTime("")
    setEndTime("")
    setImportance(2) // 重要度をリセット（3段階の場合は中程度の2）
  }

  // 重要度に応じた画像を取得
  const getPoopImage = (level: number) => {
    switch (level) {
      case 1:
        return {
          src: "/lv1.png",
          label: "低",
        }
      case 2:
        return {
          src: "/lv2.png",
          label: "中",
        }
      case 3:
        return {
          src: "/lv3.png",
          label: "高",
        }
      default:
        return {
          src: "/lv2.png",
          label: "中",
        }
    }
  }

  // 重要度のラベルを取得
  const getImportanceLabel = (level: number) => {
    switch (level) {
      case 1:
        return "低"
      case 2:
        return "中"
      case 3:
        return "高"
      default:
        return "中"
    }
  }

  return (
    <div ref={itemRef} className="modern-card p-5 mb-4 opacity-0 mx-3 sm:mx-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-gray-800">{text}</h3>
        <button
          onClick={() => removeFromFavorites(text)}
          className="flex items-center justify-center p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
          aria-label="お気に入りから削除"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {showTimeForm ? (
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor={`start-time-${text}`} className="modern-label">
                開始時間
              </label>
              <input
                id={`start-time-${text}`}
                type="time"
                value={startTime}
                onChange={handleStartTimeChange}
                className="modern-input"
                required
              />
            </div>
            <div>
              <label htmlFor={`end-time-${text}`} className="modern-label">
                終了時間
              </label>
              <input
                id={`end-time-${text}`}
                type="time"
                value={endTime}
                onChange={handleEndTimeChange}
                className="modern-input"
                required
              />
            </div>
          </div>

          {/* 時間エラーメッセージ */}
          {timeError && <div className="text-red-500 text-sm mt-1 mb-3">{timeError}</div>}

          {/* 重要度選択UI（3段階） */}
          <div className="mb-4">
            <label className="modern-label">タスクの重要度</label>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex space-x-3">
                {[1, 2, 3].map((level) => {
                  const poopImage = getPoopImage(level)
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setImportance(level)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center transition-all ${
                        importance === level
                          ? "bg-[var(--header)] text-white scale-110 shadow-md"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      }`}
                    >
                      <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                        <Image
                          src={poopImage.src || "/placeholder.svg"}
                          alt={`重要度${level}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 640px) 32px, 40px"
                        />
                      </div>
                      <span className="text-xs mt-1">{getImportanceLabel(level)}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1 flex justify-between">
              <span>低い重要度</span>
              <span>高い重要度</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleConfirmAdd}
              disabled={!startTime || !endTime}
              className={`flex items-center justify-center px-4 py-2 rounded-lg ${
                !startTime || !endTime ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "accent-gradient-button"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              予定に追加
            </button>
            <button
              onClick={handleAddWithoutTime}
              className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              時間なしで追加
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center justify-center p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleAddToTasks}
          className="flex items-center justify-center px-4 py-2 accent-gradient-button"
          aria-label="タスクに追加"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          予定に追加
        </button>
      )}
    </div>
  )
}

function AddFavoriteForm() {
  const [text, setText] = useState("")
  const { addToFavorites } = useTodo()

  // アニメーション用のref
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (formRef.current) {
      fadeInFromBottom(formRef.current, 0.3)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      await addToFavorites(text.trim())
      setText("")
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mb-8 opacity-0 mx-3 sm:mx-6">
      <div className="flex space-x-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="よく使う予定を入力..."
          className="modern-input flex-1"
        />
        <button type="submit" className="gradient-button flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          保存
        </button>
      </div>
    </form>
  )
}

function FavoritesPage() {
  const { favoriteTasks, isLoading } = useTodo()

  // アニメーション用のref
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (titleRef.current) {
      slideInFromLeft(titleRef.current, 0.1)
    }
    if (descRef.current) {
      fadeInFromBottom(descRef.current, 0.2)
    }
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-4">
      <Header />

      <div className="mb-8">
        <h2 ref={titleRef} className="text-3xl font-bold mb-2 text-gray-800 opacity-0">
          よく使う予定
        </h2>
        <p ref={descRef} className="text-gray-600 opacity-0">
          ここに保存した予定は、簡単に予定リストに追加できます。
        </p>
      </div>

      <AddFavoriteForm />

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-4 border-[var(--header)] animate-spin"></div>
          </div>
        </div>
      ) : favoriteTasks.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-gray-200 shadow-md my-8">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">よく使う予定がありません</h3>
          <p className="text-gray-500">上のフォームから予定を追加してください</p>
        </div>
      ) : (
        <div className="space-y-2">
          {favoriteTasks.map((task, index) => (
            <FavoriteTaskItem key={task} text={task} index={index} />
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
