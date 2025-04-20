export interface Task {
  id: string
  text: string
  completed: boolean
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
