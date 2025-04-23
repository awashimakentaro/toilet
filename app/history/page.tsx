"use client"

import { useState, useRef, useEffect } from "react"
import { Header } from "@/components/header"
import { TodoProvider, useTodo } from "@/context/todo-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { fadeInFromBottom, slideInFromLeft } from "@/lib/gsap-utils"
import Image from "next/image"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

function HistoryItem({ history, index }: { history: any; index: number }) {
  const [showDetails, setShowDetails] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (itemRef.current) {
      fadeInFromBottom(itemRef.current, 0.1 + index * 0.05)
    }
  }, [index])

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, "yyyy年MM月dd日 HH:mm", { locale: ja })
    } catch (e) {
      return dateString
    }
  }

  // 時間を表示用にフォーマット
  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return ""
    // HH:MM:SS 形式から HH:MM 形式に変換
    if (timeString.includes(":")) {
      // 最初の5文字（HH:MM）だけを取得
      return timeString.substring(0, 5)
    }
    return timeString
  }

  // 時間表示の文字列を生成
  const timeDisplay =
    history.startTime && history.endTime ? `${formatTime(history.startTime)} 〜 ${formatTime(history.endTime)}` : ""

  // 重要度に応じた画像を取得
  const getImportanceImage = (importance?: number) => {
    if (!importance) return null

    // 重要度に応じた画像とラベル
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

    const poopImage = getPoopImage(importance)

    return (
      <div className="flex flex-col items-center justify-center ml-2">
        <div className="relative w-8 h-8 sm:w-10 sm:h-10" title={`重要度: ${poopImage.label}`}>
          <Image
            src={poopImage.src || "/placeholder.svg"}
            alt={`重要度${importance}`}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 32px, 40px"
          />
        </div>
        <span className="text-xs text-gray-500">{poopImage.label}</span>
      </div>
    )
  }

  return (
    <div ref={itemRef} className="mb-3 opacity-0">
      <div
        className="modern-card p-3 sm:p-4 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-xl sm:text-2xl mr-2">🚽</div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800">{history.text}</h3>
              <p className="text-xs sm:text-sm text-gray-500">{formatDate(history.completedAt)}</p>
            </div>
          </div>
          <div className="flex items-center">
            {timeDisplay && (
              <div className="time-display-card mr-2 scale-90 sm:scale-100">
                <div className="time-display-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 sm:h-4 sm:w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="time-display-text text-xs sm:text-sm">{timeDisplay}</div>
              </div>
            )}
            {getImportanceImage(history.importance)}
          </div>
        </div>

        {showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-100 animate-fadeIn">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-600">
                <div className="flex items-center mb-1 sm:mb-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-[var(--header)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>完了日時: {formatDate(history.completedAt)}</span>
                </div>
                {timeDisplay && (
                  <div className="flex items-center sm:ml-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-[var(--header)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>予定時間: {timeDisplay}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function HistoryPage() {
  const { taskHistory, isHistoryLoading, loadMoreHistory, isLoading } = useTodo()

  // アニメーション用のref
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const loadMoreRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (titleRef.current) {
      slideInFromLeft(titleRef.current, 0.1)
    }
    if (descRef.current) {
      fadeInFromBottom(descRef.current, 0.2)
    }
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Header />

      <div className="mb-8">
        <h2 ref={titleRef} className="text-3xl font-bold mb-2 text-gray-800 opacity-0">
          完了した予定の履歴
        </h2>
        <p ref={descRef} className="text-gray-600 opacity-0">
          トイレに流した予定の履歴を確認できます。
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-4 border-[var(--header)] animate-spin"></div>
          </div>
        </div>
      ) : taskHistory.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-gray-200 shadow-md my-8">
          <div className="text-6xl mb-4">🚽</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">履歴がありません</h3>
          <p className="text-gray-500">タスクを完了してトイレに流すと、ここに履歴が表示されます</p>
        </div>
      ) : (
        <div className="space-y-0">
          {taskHistory.map((history, index) => (
            <HistoryItem key={history.id} history={history} index={index} />
          ))}

          {/* さらに読み込むボタン */}
          <div className="flex justify-center mt-6">
            <button
              ref={loadMoreRef}
              onClick={loadMoreHistory}
              disabled={isHistoryLoading}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isHistoryLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  読み込み中...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  さらに読み込む
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function HistoryPageWrapper() {
  return (
    <ProtectedRoute>
      <TodoProvider>
        <HistoryPage />
      </TodoProvider>
    </ProtectedRoute>
  )
}
