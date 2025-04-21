import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { AuthProvider } from "@/context/auth-context"
import { UserMenu } from "@/components/user-menu"

export const metadata: Metadata = {
  title: "うんこフラッシュTODOアプリ",
  description: "タスクを完了してトイレに流そう！",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <UserMenu />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
