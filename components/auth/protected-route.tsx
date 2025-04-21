"use client"

import type React from "react"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  // クライアントサイドでのみ実行
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router, isMounted])

  // サーバーサイドレンダリング時は何も表示しない
  if (!isMounted) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--header)]"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
