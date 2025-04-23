"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { TaskHistory } from "@/lib/types"
import { fadeInFromBottom } from "@/lib/gsap-utils"
import Image from "next/image"

interface HistoryStatsProps {
  taskHistory: TaskHistory[]
}

export function HistoryStats({ taskHistory }: HistoryStatsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (statsRef.current) {
      fadeInFromBottom(statsRef.current, 0.2)
    }
  }, [])

  // 統計情報を計算
  const stats = calculateStats(taskHistory)

  return (
    <div ref={statsRef} className="mb-6 opacity-0">
      <div className="modern-card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-[var(--header)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            統計情報
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={isExpanded ? "詳細を隠す" : "詳細を表示"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform ${isExpanded ? "transform rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* 基本統計情報（常に表示） */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="完了タスク"
            value={stats.totalTasks.toString()}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            }
          />
          <StatCard
            title="平均重要度"
            value={stats.averageImportance}
            icon={
              <div className="relative w-6 h-6">
                <Image
                  src={`/lv${Math.round(Number.parseFloat(stats.averageImportance)) || 2}.png`}
                  alt="平均重要度"
                  fill
                  className="object-contain"
                />
              </div>
            }
          />
          <StatCard
            title="最多時間帯"
            value={stats.mostCommonTimeRange}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500"
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
            }
          />
          <StatCard
            title="今月の完了"
            value={stats.tasksThisMonth.toString()}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500"
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
            }
          />
        </div>

        {/* 詳細統計情報（展開時のみ表示） */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 重要度分布 */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="text-sm sm:text-base font-semibold mb-2 text-gray-700">重要度分布</h4>
                <div className="flex items-end h-32 sm:h-40">
                  {stats.importanceDistribution.map((count, index) => {
                    const level = index + 1
                    const percentage = stats.totalTasks > 0 ? (count / stats.totalTasks) * 100 : 0
                    return (
                      <div key={level} className="flex flex-col items-center flex-1">
                        <div className="w-full px-1">
                          <div
                            className="bg-[var(--header)] rounded-t-md"
                            style={{ height: `${Math.max(percentage, 5)}%` }}
                          ></div>
                        </div>
                        <div className="mt-2 flex flex-col items-center">
                          <div className="relative w-6 h-6 sm:w-8 sm:h-8">
                            <Image src={`/lv${level}.png`} alt={`重要度${level}`} fill className="object-contain" />
                          </div>
                          <span className="text-xs mt-1">{count}件</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 月別完了タスク */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="text-sm sm:text-base font-semibold mb-2 text-gray-700">月別完了タスク</h4>
                <div className="flex items-end h-32 sm:h-40">
                  {stats.monthlyTasks.map((item, index) => {
                    const maxCount = Math.max(...stats.monthlyTasks.map((i) => i.count))
                    const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="w-full px-1">
                          <div
                            className="bg-blue-400 rounded-t-md"
                            style={{ height: `${Math.max(percentage, 5)}%` }}
                          ></div>
                        </div>
                        <div className="mt-2 text-center">
                          <span className="text-xs">{item.month}</span>
                          <span className="block text-xs">{item.count}件</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 曜日別完了タスク */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="text-sm sm:text-base font-semibold mb-2 text-gray-700">曜日別完了タスク</h4>
                <div className="flex items-end h-32">
                  {stats.dayOfWeekTasks.map((item, index) => {
                    const maxCount = Math.max(...stats.dayOfWeekTasks.map((i) => i.count))
                    const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="w-full px-1">
                          <div
                            className="bg-green-400 rounded-t-md"
                            style={{ height: `${Math.max(percentage, 5)}%` }}
                          ></div>
                        </div>
                        <div className="mt-2 text-center">
                          <span className="text-xs">{item.day}</span>
                          <span className="block text-xs">{item.count}件</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 時間帯別完了タスク */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="text-sm sm:text-base font-semibold mb-2 text-gray-700">時間帯別完了タスク</h4>
                <div className="flex items-end h-32">
                  {stats.timeRangeTasks.map((item, index) => {
                    const maxCount = Math.max(...stats.timeRangeTasks.map((i) => i.count))
                    const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="w-full px-1">
                          <div
                            className="bg-yellow-400 rounded-t-md"
                            style={{ height: `${Math.max(percentage, 5)}%` }}
                          ></div>
                        </div>
                        <div className="mt-2 text-center">
                          <span className="text-xs">{item.range}</span>
                          <span className="block text-xs">{item.count}件</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-center text-gray-500">
              * 統計情報は現在表示されている履歴データに基づいています
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 統計カードコンポーネント
function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex items-center mb-1">
        {icon}
        <h4 className="text-xs sm:text-sm font-medium text-gray-500 ml-2">{title}</h4>
      </div>
      <p className="text-lg sm:text-xl font-bold text-gray-800">{value}</p>
    </div>
  )
}

// 統計情報を計算する関数
function calculateStats(taskHistory: TaskHistory[]) {
  // 基本統計
  const totalTasks = taskHistory.length

  // 重要度の平均を計算
  let totalImportance = 0
  let tasksWithImportance = 0
  taskHistory.forEach((task) => {
    if (task.importance) {
      totalImportance += task.importance
      tasksWithImportance++
    }
  })
  const averageImportance = tasksWithImportance > 0 ? (totalImportance / tasksWithImportance).toFixed(1) : "0.0"

  // 重要度分布（1-3）
  const importanceDistribution = [0, 0, 0] // インデックス0=重要度1, インデックス1=重要度2, インデックス2=重要度3
  taskHistory.forEach((task) => {
    if (task.importance && task.importance >= 1 && task.importance <= 3) {
      importanceDistribution[task.importance - 1]++
    }
  })

  // 月別タスク数（直近6ヶ月）
  const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
  const monthlyTasksMap = new Map<string, number>()

  // 現在の月から過去6ヶ月分の月を初期化
  const today = new Date()
  for (let i = 0; i < 6; i++) {
    const d = new Date(today)
    d.setMonth(today.getMonth() - i)
    const monthKey = `${d.getFullYear()}-${d.getMonth()}`
    monthlyTasksMap.set(monthKey, 0)
  }

  // タスク履歴から月別のカウントを集計
  taskHistory.forEach((task) => {
    const date = new Date(task.completedAt)
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`
    if (monthlyTasksMap.has(monthKey)) {
      monthlyTasksMap.set(monthKey, (monthlyTasksMap.get(monthKey) || 0) + 1)
    }
  })

  // 月別データを配列に変換
  const monthlyTasks = Array.from(monthlyTasksMap.entries())
    .map(([key, count]) => {
      const [year, month] = key.split("-").map(Number)
      return {
        month: monthNames[month],
        count,
      }
    })
    .reverse() // 古い月から新しい月の順に並べる

  // 今月のタスク数
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const currentMonthKey = `${currentYear}-${currentMonth}`
  const tasksThisMonth = monthlyTasksMap.get(currentMonthKey) || 0

  // 曜日別タスク数
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"]
  const dayOfWeekMap = new Map<number, number>()

  // 曜日ごとに初期化
  for (let i = 0; i < 7; i++) {
    dayOfWeekMap.set(i, 0)
  }

  // タスク履歴から曜日別のカウントを集計
  taskHistory.forEach((task) => {
    const date = new Date(task.completedAt)
    const day = date.getDay() // 0=日曜日, 1=月曜日, ...
    dayOfWeekMap.set(day, (dayOfWeekMap.get(day) || 0) + 1)
  })

  // 曜日別データを配列に変換
  const dayOfWeekTasks = Array.from(dayOfWeekMap.entries()).map(([day, count]) => ({
    day: dayNames[day],
    count,
  }))

  // 時間帯別タスク数
  const timeRanges = ["朝", "昼", "夕", "夜"]
  const timeRangeMap = new Map<string, number>()

  // 時間帯ごとに初期化
  timeRanges.forEach((range) => {
    timeRangeMap.set(range, 0)
  })

  // タスク履歴から時間帯別のカウントを集計
  taskHistory.forEach((task) => {
    if (task.startTime) {
      const hour = Number.parseInt(task.startTime.split(":")[0], 10)
      let timeRange = ""

      if (hour >= 5 && hour < 12) {
        timeRange = "朝"
      } else if (hour >= 12 && hour < 17) {
        timeRange = "昼"
      } else if (hour >= 17 && hour < 21) {
        timeRange = "夕"
      } else {
        timeRange = "夜"
      }

      timeRangeMap.set(timeRange, (timeRangeMap.get(timeRange) || 0) + 1)
    }
  })

  // 時間帯別データを配列に変換
  const timeRangeTasks = timeRanges.map((range) => ({
    range,
    count: timeRangeMap.get(range) || 0,
  }))

  // 最も多い時間帯
  let mostCommonTimeRange = "なし"
  let maxTimeRangeCount = 0

  timeRangeTasks.forEach((item) => {
    if (item.count > maxTimeRangeCount) {
      maxTimeRangeCount = item.count
      mostCommonTimeRange = item.range
    }
  })

  if (maxTimeRangeCount === 0) {
    mostCommonTimeRange = "なし"
  }

  return {
    totalTasks,
    averageImportance,
    importanceDistribution,
    monthlyTasks,
    tasksThisMonth,
    dayOfWeekTasks,
    timeRangeTasks,
    mostCommonTimeRange,
  }
}
