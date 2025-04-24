"use client"

import { createContext, useState, useContext, type ReactNode, useEffect } from "react"
import type { Task, TaskHistory, FavoriteTask } from "@/lib/types"
import { getSupabaseClient } from "@/lib/supabase"
import { useAuth } from "./auth-context"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

interface TodoContextType {
  tasks: Task[]
  favoriteTasks: FavoriteTask[] // 型を変更
  taskHistory: TaskHistory[]
  isLoading: boolean
  isHistoryLoading: boolean
  addTask: (text: string, startTime?: string, endTime?: string, importance?: number) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  flushTask: (id: string) => Promise<void>
  addToFavorites: (text: string, startTime?: string, endTime?: string, importance?: number) => Promise<void> // 引数を追加
  removeFromFavorites: (id: string) => Promise<void> // IDで削除するように変更
  addFavoriteToTasks: (favoriteTask: FavoriteTask) => Promise<void> // 引数を変更
  reminderTasks: Task[]
  dismissReminder: (taskId: string) => void
  editTask: (id: string, text: string, startTime?: string, endTime?: string, importance?: number) => Promise<void>
  loadMoreHistory: () => Promise<void>
  resetDailyTasks: () => Promise<void>
  resetOverdueTasks: () => Promise<void>
}

const TodoContext = createContext<TodoContextType | undefined>(undefined)

export function TodoProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [favoriteTasks, setFavoriteTasks] = useState<FavoriteTask[]>([])
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)
  const [historyPage, setHistoryPage] = useState(0)
  const [hasMoreHistory, setHasMoreHistory] = useState(true)
  const [reminderTasks, setReminderTasks] = useState<Task[]>([])
  const [notifiedTaskIds, setNotifiedTaskIds] = useState<Set<string>>(new Set())
  const { user } = useAuth()
  const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(null)
  const [currentDate, setCurrentDate] = useState<string>(new Date().toDateString())

  // 日付変更の検出とタスクリセット
  useEffect(() => {
    // 1分ごとに日付をチェック
    const dateCheckInterval = setInterval(() => {
      const now = new Date()
      const todayString = now.toDateString()

      // 日付が変わった場合（00:00を過ぎた場合）
      if (currentDate !== todayString) {
        console.log("日付が変わりました:", todayString)
        setCurrentDate(todayString)
        resetDailyTasks()
      }
    }, 60000) // 1分ごとにチェック

    // コンポーネントのアンマウント時にインターバルをクリア
    return () => clearInterval(dateCheckInterval)
  }, [currentDate])

  // アプリ起動時にも日付チェックを行う
  useEffect(() => {
    const checkDateOnStartup = async () => {
      if (!user || !supabase) return

      try {
        // 最後のログイン日を取得（ローカルストレージから）
        const lastLoginDate = localStorage.getItem(`last-login-date-${user.id}`) || ""
        const today = new Date().toDateString()

        // 最後のログインが昨日以前の場合、タスクをリセット
        if (lastLoginDate !== today) {
          console.log("前回のログインから日付が変わっています。タスクをリセットします。")
          await resetDailyTasks()
        }

        // 今日の日付を保存
        localStorage.setItem(`last-login-date-${user.id}`, today)
      } catch (error) {
        console.error("日付チェックエラー:", error)
      }
    }

    checkDateOnStartup()
  }, [user, supabase])

  // 日付変更時のタスクリセット関数
  const resetDailyTasks = async () => {
    if (!supabase || !user) return

    try {
      console.log("タスクのリセットを開始します...")
      setIsLoading(true)

      // 未完了のタスクを履歴に保存（オプション）
      const uncompletedTasks = tasks.filter((task) => !task.completed)

      if (uncompletedTasks.length > 0) {
        console.log(`${uncompletedTasks.length}件の未完了タスクを履歴に保存します`)

        // 未完了タスクを履歴に保存
        for (const task of uncompletedTasks) {
          await supabase.from("task_history").insert([
            {
              user_id: user.id,
              text: task.text,
              completed_at: new Date().toISOString(),
              start_time: task.startTime || null,
              end_time: task.endTime || null,
              importance: task.importance || null,
              original_task_id: task.id,
              completed: false, // 未完了フラグを設定
            },
          ])
        }

        // 履歴を再取得
        await fetchTaskHistory(0)
      }

      // すべてのタスクを削除
      const { error } = await supabase.from("tasks").delete().eq("user_id", user.id)

      if (error) throw error

      // ローカルのタスク状態をクリア
      setTasks([])
      setReminderTasks([])
      setNotifiedTaskIds(new Set())

      console.log("タスクのリセットが完了しました")
    } catch (error) {
      console.error("タスクリセットエラー:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 期限切れのタスクのみを削除する関数
  const resetOverdueTasks = async () => {
    if (!supabase || !user) return

    try {
      console.log("期限切れタスクのリセットを開始します...")
      setIsLoading(true)

      // 期限切れのタスクを特定
      const now = new Date()
      const overdueTasks = tasks.filter((task) => {
        if (!task.endTime) return false

        const [hours, minutes] = task.endTime.split(":").map(Number)
        const endTime = new Date()
        endTime.setHours(hours, minutes, 0, 0)

        return now > endTime && !task.completed
      })

      if (overdueTasks.length > 0) {
        console.log(`${overdueTasks.length}件の期限切れタスクを履歴に保存します`)

        // 期限切れタスクを履歴に保存
        for (const task of overdueTasks) {
          const { error } = await supabase.from("task_history").insert([
            {
              user_id: user.id,
              text: task.text,
              completed_at: new Date().toISOString(),
              start_time: task.startTime || null,
              end_time: task.endTime || null,
              importance: task.importance || null,
              original_task_id: task.id,
              completed: false, // 未完了フラグを設定
            },
          ])

          if (error) {
            console.error("履歴保存エラー:", error)
            continue
          }

          // タスクをデータベースから削除
          await supabase.from("tasks").delete().eq("id", task.id).eq("user_id", user.id)
        }

        // 履歴を再取得（最新の状態に更新）
        await fetchTaskHistory(0)

        // ローカルのタスク状態を更新
        setTasks(tasks.filter((task) => !overdueTasks.some((overdueTask) => overdueTask.id === task.id)))

        // リマインダーからも削除
        const overdueTaskIds = new Set(overdueTasks.map((task) => task.id))
        setReminderTasks(reminderTasks.filter((task) => !overdueTaskIds.has(task.id)))

        // 通知済みリストからも削除
        const newNotifiedTaskIds = new Set(notifiedTaskIds)
        overdueTaskIds.forEach((id) => newNotifiedTaskIds.delete(id))
        setNotifiedTaskIds(newNotifiedTaskIds)

        console.log("期限切れタスクのリセットが完了しました")
      } else {
        console.log("期限切れのタスクはありません")
      }
    } catch (error) {
      console.error("期限切れタスクのリセットエラー:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // クライアントサイドでのみSupabaseを初期化
  useEffect(() => {
    setSupabase(getSupabaseClient())
  }, [])

  // ユーザーのタスクを取得
  useEffect(() => {
    if (!supabase || !user) {
      setTasks([])
      setFavoriteTasks([])
      setTaskHistory([])
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
          .select("*") // すべてのフィールドを取得
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (favoritesError) throw favoritesError

        // 履歴を取得（最新の10件）
        await fetchTaskHistory()

        setTasks(
          tasksData.map((task) => ({
            id: task.id,
            text: task.text,
            completed: task.completed,
            startTime: task.start_time,
            endTime: task.end_time,
            importance: task.importance,
          })),
        )

        setFavoriteTasks(
          favoritesData.map((favorite) => ({
            id: favorite.id,
            user_id: favorite.user_id,
            text: favorite.text,
            created_at: favorite.created_at,
            start_time: favorite.start_time,
            end_time: favorite.end_time,
            importance: favorite.importance,
          })),
        )
      } catch (error) {
        console.error("データ取得エラー:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [user, supabase])

  // 履歴を取得する関数
  const fetchTaskHistory = async (page = 0) => {
    if (!supabase || !user) return

    const pageSize = 10 // 1ページあたりの件数
    const offset = page * pageSize

    setIsHistoryLoading(true)
    try {
      const { data, error, count } = await supabase
        .from("task_history")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .range(offset, offset + pageSize - 1)

      if (error) throw error

      const formattedHistory: TaskHistory[] = data.map((item) => ({
        id: item.id,
        text: item.text,
        completedAt: item.completed_at,
        startTime: item.start_time,
        endTime: item.end_time,
        importance: item.importance,
        originalTaskId: item.original_task_id,
        completed: item.completed !== false, // 明示的にfalseでない場合はtrueとみなす
      }))

      if (page === 0) {
        setTaskHistory(formattedHistory)
      } else {
        setTaskHistory((prev) => [...prev, ...formattedHistory])
      }

      // さらに履歴があるかどうかを確認
      if (count) {
        setHasMoreHistory(offset + pageSize < count)
      } else {
        setHasMoreHistory(formattedHistory.length === pageSize)
      }

      setHistoryPage(page)
    } catch (error) {
      console.error("履歴取得エラー:", error)
    } finally {
      setIsHistoryLoading(false)
    }
  }

  // さらに履歴を読み込む関数
  const loadMoreHistory = async () => {
    if (isHistoryLoading || !hasMoreHistory) return
    await fetchTaskHistory(historyPage + 1)
  }

  // タスクを追加
  const addTask = async (text: string, startTime?: string, endTime?: string, importance?: number) => {
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
            importance: importance || null,
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
          importance: data.importance,
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

      // 通知済みリストからも削除
      if (notifiedTaskIds.has(id)) {
        const newNotifiedTaskIds = new Set(notifiedTaskIds)
        newNotifiedTaskIds.delete(id)
        setNotifiedTaskIds(newNotifiedTaskIds)
      }
    } catch (error) {
      console.error("タスク削除エラー:", error)
    }
  }

  // タスクを流す（履歴に保存してから削除）
  const flushTask = async (id: string) => {
    if (!supabase || !user) return

    const taskToFlush = tasks.find((task) => task.id === id)
    if (!taskToFlush) return

    try {
      // 履歴に保存
      const { error: historyError } = await supabase.from("task_history").insert([
        {
          user_id: user.id,
          text: taskToFlush.text,
          completed_at: new Date().toISOString(),
          start_time: taskToFlush.startTime || null,
          end_time: taskToFlush.endTime || null,
          importance: taskToFlush.importance || null,
          original_task_id: taskToFlush.id,
          completed: true, // 完了フラグを設定
        },
      ])

      if (historyError) throw historyError

      // 履歴を再取得（最新の状態に更新）
      await fetchTaskHistory(0)

      // タスクを削除（少し遅延させる）
      setTimeout(() => {
        deleteTask(id)
      }, 1000)
    } catch (error) {
      console.error("タスク履歴保存エラー:", error)
    }
  }

  // お気に入りタスクを追加（時間と重要度も保存）
  const addToFavorites = async (text: string, startTime?: string, endTime?: string, importance?: number) => {
    if (!supabase || !user) return

    // 同じテキストのお気に入りがあるかチェック
    if (favoriteTasks.some((task) => task.text === text)) {
      console.log("同じテキストのお気に入りが既に存在します:", text)
      return
    }

    try {
      console.log("お気に入りを追加します:", { text, startTime, endTime, importance })

      const { data, error } = await supabase
        .from("favorite_tasks")
        .insert([
          {
            user_id: user.id,
            text,
            start_time: startTime || null,
            end_time: endTime || null,
            importance: importance || null,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("お気に入り追加エラー:", error)
        throw error
      }

      console.log("お気に入りが正常に追加されました:", data)

      setFavoriteTasks([
        {
          id: data.id,
          user_id: data.user_id,
          text: data.text,
          created_at: data.created_at,
          start_time: data.start_time,
          end_time: data.end_time,
          importance: data.importance,
        },
        ...favoriteTasks,
      ])
    } catch (error) {
      console.error("お気に入り追加エラー:", error)
      alert("お気に入りの追加に失敗しました。もう一度お試しください。")
    }
  }

  // お気に入りタスクを削除（IDで削除）
  const removeFromFavorites = async (id: string) => {
    if (!supabase || !user) return

    try {
      const { error } = await supabase.from("favorite_tasks").delete().eq("id", id).eq("user_id", user.id)

      if (error) throw error

      setFavoriteTasks(favoriteTasks.filter((task) => task.id !== id))
    } catch (error) {
      console.error("お気に入り削除エラー:", error)
    }
  }

  // お気に入りタスクをタスクリストに追加（FavoriteTaskオブジェクトを受け取る）
  const addFavoriteToTasks = async (favoriteTask: FavoriteTask) => {
    await addTask(
      favoriteTask.text,
      favoriteTask.start_time || undefined,
      favoriteTask.end_time || undefined,
      favoriteTask.importance,
    )
  }

  // リマインダーチェック用の効果
  useEffect(() => {
    if (tasks.length === 0) return

    // 初回ロード時にもチェックを実行
    checkReminders()

    // 10秒ごとにチェック
    const checkInterval = setInterval(checkReminders, 10000)

    // リマインダーをチェックする関数
    function checkReminders() {
      const now = new Date()
      console.log("リマインダーチェック実行:", now.toLocaleTimeString())

      const reminders: Task[] = []

      tasks.forEach((task) => {
        if (task.endTime && !task.completed) {
          // 既に通知を表示したタスクはスキップ
          if (notifiedTaskIds.has(task.id)) {
            return
          }

          // 現在の日付を取得し、タスクの終了時間を設定
          const endTime = new Date()
          const [hours, minutes] = task.endTime.split(":").map(Number)
          endTime.setHours(hours, minutes, 0, 0)

          // 終了時刻の30分前
          const reminderTime = new Date(endTime.getTime() - 30 * 60 * 1000)

          // デバッグ用ログ
          console.log(
            `タスク "${task.text}" - 終了時刻: ${endTime.toLocaleTimeString()}, ` +
              `通知時刻: ${reminderTime.toLocaleTimeString()}, ` +
              `現在時刻: ${now.toLocaleTimeString()}`,
          )

          // 現在時刻が通知時間と終了時間の間にあるかチェック
          // 誤差を許容するために1分の余裕を持たせる
          const isWithinReminderWindow =
            now.getTime() >= reminderTime.getTime() - 60000 && now.getTime() <= endTime.getTime()

          if (isWithinReminderWindow) {
            console.log(`"${task.text}" の通知条件が満たされました！`)
            reminders.push(task)

            // 通知済みとして記録
            setNotifiedTaskIds((prev) => new Set(prev).add(task.id))
          }
        }
      })

      if (reminders.length > 0) {
        console.log(
          `${reminders.length}件の新しい通知があります:`,
          reminders.map((r) => r.text),
        )
        setReminderTasks((prev) => [...prev, ...reminders])
      }
    }

    return () => clearInterval(checkInterval)
  }, [tasks, reminderTasks, notifiedTaskIds])

  // リマインダーを閉じる関数
  const dismissReminder = (taskId: string) => {
    setReminderTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  // タスクを編集
  const editTask = async (id: string, text: string, startTime?: string, endTime?: string, importance?: number) => {
    if (!supabase || !user) return

    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          text,
          start_time: startTime || null,
          end_time: endTime || null,
          importance: importance || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) throw error

      // ローカルのタスク状態を更新
      setTasks(
        tasks.map((task) =>
          task.id === id
            ? {
                ...task,
                text,
                startTime,
                endTime,
                importance,
              }
            : task,
        ),
      )
    } catch (error) {
      console.error("タスク編集エラー:", error)
    }
  }

  return (
    <TodoContext.Provider
      value={{
        tasks,
        favoriteTasks,
        taskHistory,
        isLoading,
        isHistoryLoading,
        addTask,
        toggleTask,
        deleteTask,
        flushTask,
        addToFavorites,
        removeFromFavorites,
        addFavoriteToTasks,
        reminderTasks,
        dismissReminder,
        editTask,
        loadMoreHistory,
        resetDailyTasks,
        resetOverdueTasks,
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
