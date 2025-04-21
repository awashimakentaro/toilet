"use client"

import type React from "react"
import type { Task } from "@/lib/types"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { useTodo } from "@/context/todo-context"
import { useState, useRef, useEffect } from "react"
import { generatePoopAnalysis } from "@/lib/poop-analysis"
import { fadeInFromBottom } from "@/lib/gsap-utils"

interface TaskItemProps {
  task: Task
  index: number
}

export function TaskItem({ task, index }: TaskItemProps) {
  const { addToFavorites } = useTodo()
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<ReturnType<typeof generatePoopAnalysis> | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // アニメーション用のref
  const taskItemRef = useRef<HTMLDivElement>(null)

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: {
      task,
    },
  })

  useEffect(() => {
    if (taskItemRef.current) {
      fadeInFromBottom(taskItemRef.current, 0.1 + index * 0.05)
    }
  }, [index])

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
    zIndex: isDragging ? 100 : "auto",
    boxShadow: isDragging ? "0 8px 20px rgba(0, 0, 0, 0.2)" : "none",
  }

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.stopPropagation() // イベントの伝播を停止
    e.preventDefault() // デフォルトの動作を防止
    addToFavorites(task.text)
    alert(`「${task.text}」をよく使うタスクに追加しました！`)
  }

  const handleAnalysisClick = (e: React.MouseEvent) => {
    // イベントの伝播を停止し、デフォルトの動作を防止
    e.stopPropagation()
    e.preventDefault()

    // 既に解析結果がある場合は表示/非表示を切り替え
    if (analysisResult) {
      setShowAnalysis(!showAnalysis)
      return
    }

    // 解析中の状態を設定
    setIsAnalyzing(true)

    // 少し遅延を入れて解析処理を実行（UIのフィードバックを見せるため）
    setTimeout(() => {
      try {
        const result = generatePoopAnalysis(task.text, task.startTime, task.endTime)
        setAnalysisResult(result)
        setShowAnalysis(true)
      } catch (error) {
        console.error("解析中にエラーが発生しました:", error)
      } finally {
        setIsAnalyzing(false)
      }
    }, 300)
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
    task.startTime && task.endTime ? `${formatTime(task.startTime)} 〜 ${formatTime(task.endTime)}` : ""

  return (
    <div ref={taskItemRef} className="relative mb-5 opacity-0">
      {/* ドラッグ可能な部分 */}
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`modern-card p-5 flex flex-col ${isDragging ? "shadow-2xl" : ""} transition-all duration-200`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center pr-2">
            <h3 className="text-xl font-bold text-gray-800 mr-2">{task.text}</h3>
          </div>

          <div className="flex items-center">
            {timeDisplay && (
              <div className="time-display-card mr-2">
                <div className="time-display-icon">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="time-display-text">{timeDisplay}</div>
              </div>
            )}

            {/* ドラッグハンドル */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-grab active:cursor-grabbing">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </div>
          </div>
        </div>

        {/* ドラッグヒント */}
        {!showAnalysis && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 rounded-lg pointer-events-none group-hover:bg-opacity-5 transition-all">
            <p className="text-sm text-white bg-black bg-opacity-70 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
              ドラッグしてトイレに流す
            </p>
          </div>
        )}
      </div>

      {/* ボタンとうんこ解析結果（ドラッグ可能領域の外に配置） */}
      <div className="mt-2">
        {/* ボタン行 - ドラッグ可能領域の外に配置 */}
        <div className="flex space-x-2">
          {/* お気に入りボタン */}
          <button
            onClick={handleAddToFavorites}
            className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-600 border border-yellow-200 hover:bg-yellow-100 transition-colors"
            aria-label="お気に入りに追加"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm">お気に入り</span>
          </button>

          {/* うんこ解析ボタン */}
          <button
            ref={buttonRef}
            onClick={handleAnalysisClick}
            className={`flex-1 text-sm ${
              isAnalyzing ? "bg-gray-500" : "bg-gradient-to-r from-[var(--header)] to-pink-400"
            } text-white p-2 rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center shadow-md`}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                解析中...
              </span>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                {showAnalysis ? "解析を隠す" : "うんこ解析を見る"}
              </>
            )}
          </button>
        </div>

        {/* うんこ解析結果 */}
        {showAnalysis && analysisResult && (
          <div className="mt-3 p-4 bg-white rounded-xl border border-gray-200 shadow-md animate-fadeIn">
            <h4 className="text-lg font-bold mb-3 flex items-center text-gray-800">
              {analysisResult.emoji} {analysisResult.title}
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{analysisResult.description}</p>
            </div>

            {/* インパクトレベルの視覚化 */}
            <div className="mt-3">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">インパクト:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        level <= analysisResult.impactLevel ? "bg-[var(--header)]" : "bg-gray-200"
                      }`}
                    >
                      {level <= analysisResult.impactLevel && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
