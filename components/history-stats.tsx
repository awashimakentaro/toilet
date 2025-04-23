"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { TaskHistory } from "@/lib/types"
import { fadeInFromBottom } from "@/lib/gsap-utils"
import Image from "next/image"

interface HistoryStatsProps {
  taskHistory: TaskHistory[]
  completedTasks: TaskHistory[]
  uncompletedTasks: TaskHistory[]
}

export function HistoryStats({ taskHistory, completedTasks, uncompletedTasks }: HistoryStatsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (statsRef.current) {
      fadeInFromBottom(statsRef.current, 0.2)
    }
  }, [])

  // 統計情報を計算
  const stats = calculateStats(taskHistory, completedTasks, uncompletedTasks)

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
            value={stats.completedCount.toString()}
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
            title="未完了タスク"
            value={stats.uncompletedCount.toString()}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500"
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
            title="完了率"
            value={`${stats.completionRate}%`}
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
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
            {/* 完了率の視覚化 */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4">
              <h4 className="text-sm sm:text-base font-semibold mb-2 text-gray-700">完了率</h4>
              <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-green-500 rounded-l-full"
                  style={{ width: `${stats.completionRate}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                  {stats.completionRate}% 完了 ({stats.completedCount}/{stats.totalTasks})
                </div>
              </div>
            </div>

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

              {/* 完了・未完了の重要度比較 */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="text-sm sm:text-base font-semibold mb-2 text-gray-700">完了・未完了の重要度比較</h4>
                <div className="flex items-end h-32 sm:h-40">
                  {[1, 2, 3].map((level) => {
                    const completedCount = stats.completedImportanceDistribution[level - 1] || 0
                    const uncompletedCount = stats.uncompletedImportanceDistribution[level - 1] || 0
                    const totalCount = completedCount + uncompletedCount
                    const maxCount = Math.max(
                      ...[1, 2, 3].map((l) => {
                        return (
                          (stats.completedImportanceDistribution[l - 1] || 0) +
                          (stats.uncompletedImportanceDistribution[l - 1] || 0)
                        )
                      }),
                    )
                    const percentage = maxCount > 0 ? (totalCount / maxCount) * 100 : 0

                    return (
                      <div key={level} className="flex flex-col items-center flex-1">
                        <div className="w-full px-1">
                          <div className="relative" style={{ height: `${Math.max(percentage, 5)}%` }}>
                            {/* 未完了部分 */}
                            {uncompletedCount > 0 && (
                              <div
                                className="absolute bottom-0 w-full bg-amber-400 rounded-t-md"
                                style={{
                                  height: `${(uncompletedCount / totalCount) * 100}%`,
                                  opacity: 0.8,
                                }}
                              ></div>
                            )}
                            {/* 完了部分 */}
                            {completedCount > 0 && (
                              <div
                                className="absolute bottom-0 w-full bg-green-500 rounded-t-md"
                                style={{
                                  height: `${(completedCount / totalCount) * 100}%`,
                                  top: `${(uncompletedCount / totalCount) * 100}%`,
                                  opacity: 0.8,
                                }}
                              ></div>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 flex flex-col items-center">
                          <div className="relative w-6 h-6 sm:w-8 sm:h-8">
                            <Image src={`/lv${level}.png`} alt={`重要度${level}`} fill className="object-contain" />
                          </div>
                          <div className="flex flex-col text-xs mt-1">
                            <span className="text-green-600">{completedCount}完</span>
                            <span className="text-amber-600">{uncompletedCount}未</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-center mt-2 text-xs">
                  <div className="flex items-center mr-4">
                    <div className="w-3 h-3 bg-green-500 mr-1 rounded-sm"></div>
                    <span>完了</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-400 mr-1 rounded-sm"></div>
                    <span>未完了</span>
                  </div>
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

              {/* 曜日別タスク分析 */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="text-sm sm:text-base font-semibold mb-2 text-gray-700">曜日別タスク分析</h4>
                <div className="flex items-end h-32">
                  {stats.dayOfWeekAnalysis.map((item, index) => {
                    const maxTotal = Math.max(...stats.dayOfWeekAnalysis.map((i) => i.completed + i.uncompleted))
                    const percentage = maxTotal > 0 ? ((item.completed + item.uncompleted) / maxTotal) * 100 : 0
                    const completedPercentage =
                      item.completed + item.uncompleted > 0
                        ? (item.completed / (item.completed + item.uncompleted)) * 100
                        : 0

                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="w-full px-1">
                          <div className="relative" style={{ height: `${Math.max(percentage, 5)}%` }}>
                            {/* 未完了部分 */}
                            {item.uncompleted > 0 && (
                              <div
                                className="absolute bottom-0 w-full bg-amber-400 rounded-t-md"
                                style={{ height: `${100 - completedPercentage}%` }}
                              ></div>
                            )}
                            {/* 完了部分 */}
                            {item.completed > 0 && (
                              <div
                                className="absolute bottom-0 w-full bg-green-500 rounded-t-md"
                                style={{
                                  height: `${completedPercentage}%`,
                                }}
                              ></div>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 text-center">
                          <span className="text-xs">{item.day}</span>
                          <span className="block text-xs text-green-600">{item.completed}完</span>
                          <span className="block text-xs text-amber-600">{item.uncompleted}未</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 時間帯別タスク分析 */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="text-sm sm:text-base font-semibold mb-2 text-gray-700">時間帯別タスク分析</h4>
                <div className="flex items-end h-32">
                  {stats.timeRangeAnalysis.map((item, index) => {
                    const maxTotal = Math.max(...stats.timeRangeAnalysis.map((i) => i.completed + i.uncompleted))
                    const percentage = maxTotal > 0 ? ((item.completed + item.uncompleted) / maxTotal) * 100 : 0
                    const completedPercentage =
                      item.completed + item.uncompleted > 0
                        ? (item.completed / (item.completed + item.uncompleted)) * 100
                        : 0

                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="w-full px-1">
                          <div className="relative" style={{ height: `${Math.max(percentage, 5)}%` }}>
                            {/* 未完了部分 */}
                            {item.uncompleted > 0 && (
                              <div
                                className="absolute bottom-0 w-full bg-amber-400 rounded-t-md"
                                style={{ height: `${100 - completedPercentage}%` }}
                              ></div>
                            )}
                            {/* 完了部分 */}
                            {item.completed > 0 && (
                              <div
                                className="absolute bottom-0 w-full bg-green-500 rounded-t-md"
                                style={{
                                  height: `${completedPercentage}%`,
                                }}
                              ></div>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 text-center">
                          <span className="text-xs">{item.range}</span>
                          <span className="block text-xs text-green-600">{item.completed}完</span>
                          <span className="block text-xs text-amber-600">{item.uncompleted}未</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 未完了の理由分析 */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg col-span-1 sm:col-span-2">
                <h4 className="text-sm sm:text-base font-semibold mb-2 text-gray-700">未完了タスクの傾向</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <h5 className="text-xs font-medium text-gray-600 mb-1">最も未完了が多い時間帯</h5>
                    <p className="text-lg font-bold text-amber-500">{stats.mostUncompletedTimeRange}</p>
                    <p className="text-xs text-gray-500 mt-1">この時間帯の予定は完了率が低い傾向にあります</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <h5 className="text-xs font-medium text-gray-600 mb-1">最も未完了が多い曜日</h5>
                    <p className="text-lg font-bold text-amber-500">{stats.mostUncompletedDayOfWeek}</p>
                    <p className="text-xs text-gray-500 mt-1">この曜日は特に予定の完了が難しい傾向があります</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <h5 className="text-xs font-medium text-gray-600 mb-1">未完了の平均重要度</h5>
                    <div className="flex items-center">
                      <p className="text-lg font-bold text-amber-500">{stats.averageUncompletedImportance}</p>
                      <div className="relative w-6 h-6 ml-2">
                        <Image
                          src={`/lv${Math.round(Number(stats.averageUncompletedImportance)) || 2}.png`}
                          alt={`重要度${Math.round(Number(stats.averageUncompletedImportance))}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">未完了タスクの平均重要度です</p>
                  </div>
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
function calculateStats(taskHistory: TaskHistory[], completedTasks: TaskHistory[], uncompletedTasks: TaskHistory[]) {
  // 基本統計
  const totalTasks = taskHistory.length
  const completedCount = completedTasks.length
  const uncompletedCount = uncompletedTasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

  // 重要度の平均を計算（完了タスク）
  let totalCompletedImportance = 0
  let completedTasksWithImportance = 0
  completedTasks.forEach((task) => {
    if (task.importance) {
      totalCompletedImportance += task.importance
      completedTasksWithImportance++
    }
  })
  const averageCompletedImportance =
    completedTasksWithImportance > 0 ? (totalCompletedImportance / completedTasksWithImportance).toFixed(1) : "0.0"

  // 重要度の平均を計算（未完了タスク）
  let totalUncompletedImportance = 0
  let uncompletedTasksWithImportance = 0
  uncompletedTasks.forEach((task) => {
    if (task.importance) {
      totalUncompletedImportance += task.importance
      uncompletedTasksWithImportance++
    }
  })
  const averageUncompletedImportance =
    uncompletedTasksWithImportance > 0
      ? (totalUncompletedImportance / uncompletedTasksWithImportance).toFixed(1)
      : "0.0"

  // 重要度分布（1-3）
  const importanceDistribution = [0, 0, 0] // インデックス0=重要度1, インデックス1=重要度2, インデックス2=重要度3
  taskHistory.forEach((task) => {
    if (task.importance && task.importance >= 1 && task.importance <= 3) {
      importanceDistribution[task.importance - 1]++
    }
  })

  // 完了タスクの重要度分布
  const completedImportanceDistribution = [0, 0, 0]
  completedTasks.forEach((task) => {
    if (task.importance && task.importance >= 1 && task.importance <= 3) {
      completedImportanceDistribution[task.importance - 1]++
    }
  })

  // 未完了タスクの重要度分布
  const uncompletedImportanceDistribution = [0, 0, 0]
  uncompletedTasks.forEach((task) => {
    if (task.importance && task.importance >= 1 && task.importance <= 3) {
      uncompletedImportanceDistribution[task.importance - 1]++
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

  // タスク履歴から月別のカウントを集計（完了タスクのみ）
  completedTasks.forEach((task) => {
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

  // 曜日別タスク分析
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"]
  const dayOfWeekAnalysis = dayNames.map((day) => ({ day, completed: 0, uncompleted: 0 }))

  // 完了タスクの曜日別集計
  completedTasks.forEach((task) => {
    const date = new Date(task.completedAt)
    const day = date.getDay() // 0=日曜日, 1=月曜日, ...
    dayOfWeekAnalysis[day].completed++
  })

  // 未完了タスクの曜日別集計
  uncompletedTasks.forEach((task) => {
    const date = new Date(task.completedAt)
    const day = date.getDay()
    dayOfWeekAnalysis[day].uncompleted++
  })

  // 最も未完了が多い曜日を特定
  let maxUncompletedDay = 0
  let maxUncompletedDayCount = 0
  dayOfWeekAnalysis.forEach((item, index) => {
    if (item.uncompleted > maxUncompletedDayCount) {
      maxUncompletedDayCount = item.uncompleted
      maxUncompletedDay = index
    }
  })
  const mostUncompletedDayOfWeek = maxUncompletedDayCount > 0 ? dayNames[maxUncompletedDay] : "なし"

  // 時間帯別タスク分析
  const timeRanges = ["朝", "昼", "夕", "夜"]
  const timeRangeAnalysis = timeRanges.map((range) => ({ range, completed: 0, uncompleted: 0 }))

  // 完了タスクの時間帯別集計
  completedTasks.forEach((task) => {
    if (task.startTime) {
      const hour = Number.parseInt(task.startTime.split(":")[0], 10)
      let timeRangeIndex = 0

      if (hour >= 5 && hour < 12) {
        timeRangeIndex = 0 // 朝
      } else if (hour >= 12 && hour < 17) {
        timeRangeIndex = 1 // 昼
      } else if (hour >= 17 && hour < 21) {
        timeRangeIndex = 2 // 夕
      } else {
        timeRangeIndex = 3 // 夜
      }

      timeRangeAnalysis[timeRangeIndex].completed++
    }
  })

  // 未完了タスクの時間帯別集計
  uncompletedTasks.forEach((task) => {
    if (task.startTime) {
      const hour = Number.parseInt(task.startTime.split(":")[0], 10)
      let timeRangeIndex = 0

      if (hour >= 5 && hour < 12) {
        timeRangeIndex = 0 // 朝
      } else if (hour >= 12 && hour < 17) {
        timeRangeIndex = 1 // 昼
      } else if (hour >= 17 && hour < 21) {
        timeRangeIndex = 2 // 夕
      } else {
        timeRangeIndex = 3 // 夜
      }

      timeRangeAnalysis[timeRangeIndex].uncompleted++
    }
  })

  // 最も未完了が多い時間帯を特定
  let maxUncompletedTimeRange = 0
  let maxUncompletedTimeCount = 0
  timeRangeAnalysis.forEach((item, index) => {
    if (item.uncompleted > maxUncompletedTimeCount) {
      maxUncompletedTimeCount = item.uncompleted
      maxUncompletedTimeRange = index
    }
  })
  const mostUncompletedTimeRange = maxUncompletedTimeCount > 0 ? timeRanges[maxUncompletedTimeRange] : "なし"

  return {
    totalTasks,
    completedCount,
    uncompletedCount,
    completionRate,
    averageCompletedImportance,
    averageUncompletedImportance,
    importanceDistribution,
    completedImportanceDistribution,
    uncompletedImportanceDistribution,
    monthlyTasks,
    tasksThisMonth,
    dayOfWeekAnalysis,
    timeRangeAnalysis,
    mostUncompletedDayOfWeek,
    mostUncompletedTimeRange,
  }
}
