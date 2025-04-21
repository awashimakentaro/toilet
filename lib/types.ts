export interface Task {
  id: string
  text: string
  completed: boolean
  startTime?: string // 開始時間（HH:MM形式）
  endTime?: string // 終了時間（HH:MM形式）
  importance?: number // 重要度（1-5）
}

export interface Profile {
  id: string
  username: string
  created_at: string
  updated_at: string
}

export interface FavoriteTask {
  id: string
  user_id: string
  text: string
  created_at: string
}
