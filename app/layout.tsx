import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { AuthProvider } from "@/context/auth-context"
import { UserMenu } from "@/components/user-menu"

export const metadata: Metadata = {
  title: "うんこフラッシュTODOアプリ",
  description: "タスクを完了してトイレに流そう！",
}

// ビューポート設定を追加
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
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
