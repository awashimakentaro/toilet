"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User, AuthChangeEvent, SupabaseClient } from "@supabase/supabase-js"
import { getSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signUp: (email: string, password: string, redirectTo?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(null)

  // クライアントサイドでのみSupabaseを初期化
  useEffect(() => {
    setSupabase(getSupabaseClient())
  }, [])

  useEffect(() => {
    if (!supabase) return

    // 現在のセッションを取得
    const getSession = async () => {
      setIsLoading(true)
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("セッション取得エラー:", error)
        }

        setSession(session)
        setUser(session?.user ?? null)
      } catch (e) {
        console.error("セッション取得中にエラーが発生しました:", e)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    try {
      // 認証状態の変更を監視
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, currentSession: Session | null) => {
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
        setIsLoading(false)
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch (e) {
      console.error("認証状態の監視中にエラーが発生しました:", e)
      setIsLoading(false)
    }
  }, [supabase])

  // サインアップ関数
  const signUp = async (email: string, password: string, redirectTo?: string) => {
    if (!supabase) throw new Error("Supabaseクライアントが初期化されていません")

    // 現在のホストURLを取得（ローカル開発とデプロイ環境の両方で動作するように）
    const baseUrl =
      typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : redirectTo || ""

    // リダイレクトURLを設定
    const options = {
      emailRedirectTo: redirectTo || `${baseUrl}/auth/callback`,
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options,
    })

    if (error) {
      throw error
    }
  }

  // サインイン関数
  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabaseクライアントが初期化されていません")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }
  }

  // サインアウト関数
  const signOut = async () => {
    if (!supabase) throw new Error("Supabaseクライアントが初期化されていません")

    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
