"use client"

import type React from "react"
import type { Task } from "@/lib/types"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { useTodo } from "@/context/todo-context"
import { useState, useRef, useEffect } from "react"
import { generatePoopAnalysis } from "@/lib/poop-analysis"
import { fadeInFromBottom } from "@/lib/gsap-utils"
import Image from "next/image"

interface TaskItemProps {
  task: Task
  index: number
}

export function TaskItem({ task, index }: TaskItemProps) {
  const { addToFavorites, editTask } = useTodo()
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<ReturnType<typeof generatePoopAnalysis> | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // 編集モード用の状態
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(task.text)
  const [editStartTime, setEditStartTime] = useState(task.startTime || "")
  const [editEndTime, setEditEndTime] = useState(task.endTime || "")
  const [editImportance, setEditImportance] = useState<number>(task.importance || 2)
  const [timeError, setTimeError] = useState<string | null>(null)

  // TaskItemコンポーネントの中で、useState部分に以下を追加
  const [isOverdue, setIsOverdue] = useState(false)

  // アニメーション用のref
  const taskItemRef = useRef<HTMLDivElement>(null)

  // useDraggableの設定を最適化
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: {
      task,
    },
    // 編集モード中または期限切れの場合はドラッグを無効化
    disabled: isEditing || isOverdue,
  })

  useEffect(() => {
    if (taskItemRef.current) {
      fadeInFromBottom(taskItemRef.current, 0.1 + index * 0.05)
    }
  }, [index])

  // useEffectを追加（既存のuseEffectの後に追加）
  useEffect(() => {
    // 終了時間が設定されている場合のみチェック
    if (task.endTime) {
      // 初回チェック
      checkIfOverdue()

      // 1分ごとに終了時間をチェック
      const intervalId = setInterval(checkIfOverdue, 60000)

      return () => clearInterval(intervalId)
    }
  }, [task.endTime])

  // スタイルを最適化
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isEditing ? "default" : isOverdue ? "not-allowed" : isDragging ? "grabbing" : "grab",
    zIndex: isDragging ? 100 : "auto",
    boxShadow: isDragging ? "0 8px 20px rgba(0, 0, 0, 0.2)" : "none",
    touchAction: "none", // タッチ操作を最適化
    WebkitTapHighlightColor: "transparent", // タップ時のハイライトを無効化
    transition: isDragging ? "none" : "all 0.2s ease", // ドラッグ中はトランジションを無効化
  }

  // 終了時間を過ぎているかチェックする関数
  const checkIfOverdue = () => {
    if (!task.endTime) return

    const now = new Date()
    const [hours, minutes] = task.endTime.split(":").map(Number)
    const endTime = new Date()
    endTime.setHours(hours, minutes, 0, 0)

    // 現在時刻が終了時刻を過ぎているかチェック
    setIsOverdue(now > endTime && !task.completed)
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

  // 編集モードを開始
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsEditing(true)
    setEditText(task.text)
    setEditStartTime(task.startTime || "")
    setEditEndTime(task.endTime || "")
    setEditImportance(task.importance || 2)
  }

  // 編集をキャンセル
  const handleCancelEdit = () => {
    setIsEditing(false)
    setTimeError(null)
  }

  // 編集を保存
  const handleSaveEdit = async () => {
    // 時間のバリデーション
    if (editStartTime && editEndTime) {
      const startMinutes = convertTimeToMinutes(editStartTime)
      const endMinutes = convertTimeToMinutes(editEndTime)

      if (endMinutes <= startMinutes) {
        setTimeError("終了時刻は開始時刻より後に設定してください")
        return
      }
    }

    setTimeError(null)

    await editTask(task.id, editText, editStartTime || undefined, editEndTime || undefined, editImportance)
    setIsEditing(false)
  }

  // 時間を分に変換するヘルパー関数
  const convertTimeToMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(":").map(Number)
    return hours * 60 + minutes
  }

  // 時間入力フィールドの変更ハンドラ
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditStartTime(e.target.value)
    // 終了時間が既に入力されている場合は検証
    if (editEndTime) {
      const startMinutes = convertTimeToMinutes(e.target.value)
      const endMinutes = convertTimeToMinutes(editEndTime)

      if (endMinutes <= startMinutes) {
        setTimeError("終了時刻は開始時刻より後に設定してください")
      } else {
        setTimeError(null)
      }
    }
  }

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditEndTime(e.target.value)
    // 開始時間が既に入力されている場合は検証
    if (editStartTime) {
      const startMinutes = convertTimeToMinutes(editStartTime)
      const endMinutes = convertTimeToMinutes(e.target.value)

      if (endMinutes <= startMinutes) {
        setTimeError("終了時刻は開始時刻より後に設定してください")
      } else {
        setTimeError(null)
      }
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
    task.startTime && task.endTime ? `${formatTime(task.startTime)} 〜 ${formatTime(task.endTime)}` : ""

  // 終了時間を過ぎている場合のスタイルを追加
  const timeDisplayStyle = isOverdue ? "bg-red-400 animate-pulse" : "bg-gradient-to-r from-blue-400 to-blue-500"

  // 重要度に応じた画像を取得（3段階）
  const getImportanceImage = (importance?: number) => {
    if (!importance) return null

    // 重要度に応じた画像とラベル（3段階）
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
        <div className="relative w-10 h-10 sm:w-12 sm:h-12" title={`重要度: ${poopImage.label}`}>
          <Image
            src={poopImage.src || "/placeholder.svg"}
            alt={`重要度${importance}`}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 40px, 48px"
          />
        </div>
        <span className="text-xs text-gray-500">{poopImage.label}</span>
      </div>
    )
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
    <div ref={taskItemRef} className="relative mb-3 opacity-0 sm:mb-5 mx-3 sm:mx-6">
      {/* ドラッグ可能な部分 */}
      <div
        ref={setNodeRef}
        style={style}
        {...(isEditing || isOverdue ? {} : attributes)}
        {...(isEditing || isOverdue ? {} : listeners)}
        className={`modern-card p-3 sm:p-5 flex flex-col ${
          isDragging ? "shadow-2xl scale-[1.02] z-50" : ""
        } ${isDragging ? "" : "transition-all duration-200"} ${
          isOverdue && !isEditing ? "border-l-4 border-red-500" : ""
        } ${isOverdue ? "opacity-80 bg-gray-50" : ""}`}
      >
        {isEditing ? (
          // 編集モード
          <div className="space-y-3">
            <div>
              <label htmlFor={`edit-text-${task.id}`} className="modern-label">
                予定内容
              </label>
              <input
                id={`edit-text-${task.id}`}
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="modern-input"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div>
                <label htmlFor={`edit-start-time-${task.id}`} className="modern-label">
                  開始時間
                </label>
                <input
                  id={`edit-start-time-${task.id}`}
                  type="time"
                  value={editStartTime}
                  onChange={handleStartTimeChange}
                  className="modern-input"
                />
              </div>
              <div>
                <label htmlFor={`edit-end-time-${task.id}`} className="modern-label">
                  終了時間
                </label>
                <input
                  id={`edit-end-time-${task.id}`}
                  type="time"
                  value={editEndTime}
                  onChange={handleEndTimeChange}
                  className="modern-input"
                />
              </div>
            </div>

            {/* 時間エラーメッセージ */}
            {timeError && <div className="text-red-500 text-sm">{timeError}</div>}

            {/* 重要度選択UI（3段階） */}
            <div>
              <label className="modern-label">タスクの重要度</label>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex space-x-3 sm:space-x-4">
                  {[1, 2, 3].map((level) => {
                    const poopImage = getImportanceImage(level)?.props.children[0].props
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setEditImportance(level)}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center transition-all ${
                          editImportance === level
                            ? "bg-[var(--header)] text-white scale-110 shadow-md"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        }`}
                      >
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                          <Image
                            src={`/lv${level}.png`}
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
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={handleSaveEdit}
                className="flex-1 accent-gradient-button flex items-center justify-center"
                disabled={!editText.trim()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                保存
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
              >
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          // 表示モード
          <>
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className="flex items-center pr-2">
                <h3 className="text-base sm:text-xl font-bold text-gray-800 mr-2">{task.text}</h3>
              </div>

              <div className="flex items-center">
                {timeDisplay && (
                  <div className={`time-display-card mr-2 ${timeDisplayStyle}`}>
                    <div className="time-display-icon">
                      {isOverdue ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5"
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
                      )}
                    </div>
                    <div className="time-display-text">
                      {timeDisplay}
                      {isOverdue && <span className="ml-1 font-bold">期限切れ</span>}
                    </div>
                  </div>
                )}

                {/* 重要度画像表示 */}
                {getImportanceImage(task.importance)}
              </div>
            </div>

            {/* ドラッグヒント */}
            {!showAnalysis && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 rounded-lg pointer-events-none group-hover:bg-opacity-5 transition-all">
                <p className="text-xs sm:text-sm text-white bg-black bg-opacity-70 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  {isOverdue ? "期限切れのため完了できません" : "ドラッグしてトイレに流す"}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ボタンとうんこ解析結果（ドラッグ可能領域の外に配置） */}
      <div className="mt-1 sm:mt-2">
        {/* ボタン行 - ドラッグ可能領域の外に配置 */}
        <div className="flex space-x-1 sm:space-x-2">
          {/* お気に入りボタン */}
          <button
            onClick={handleAddToFavorites}
            className="flex items-center justify-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-yellow-50 text-yellow-600 border border-yellow-200 hover:bg-yellow-100 transition-colors text-xs sm:text-sm"
            aria-label="お気に入りに追加"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs sm:text-sm">お気に入り</span>
          </button>

          {/* 編集ボタン - 新しく追加 */}
          <button
            onClick={handleEditClick}
            className="flex items-center justify-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors text-xs sm:text-sm"
            aria-label="タスクを編集"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            <span className="text-xs sm:text-sm">編集</span>
          </button>

          {/* うんこ解析ボタン */}
          <button
            ref={buttonRef}
            onClick={handleAnalysisClick}
            className={`flex-1 text-xs sm:text-sm ${
              isAnalyzing ? "bg-gray-500" : "bg-gradient-to-r from-[var(--header)] to-pink-400"
            } text-white p-1 sm:p-2 rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center shadow-md`}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-1 h-3 w-3 sm:h-4 sm:w-4 text-white"
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
                  className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
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
          <div className="mt-2 p-3 sm:p-4 bg-white rounded-xl border border-gray-200 shadow-md animate-fadeIn">
            <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 flex items-center text-gray-800">
              {analysisResult.emoji} {analysisResult.title}
            </h4>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100">
              <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {analysisResult.description}
              </p>
            </div>

            {/* インパクトレベルの視覚化 */}
            <div className="mt-2 sm:mt-3">
              <div className="flex items-center">
                <span className="text-xs sm:text-sm text-gray-600 mr-2">インパクト:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center ${
                        level <= analysisResult.impactLevel ? "bg-[var(--header)]" : "bg-gray-200"
                      }`}
                    >
                      {level <= analysisResult.impactLevel && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-2 w-2 sm:h-3 sm:w-3 text-white"
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
