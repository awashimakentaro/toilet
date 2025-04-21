"use client"

import { LoginForm } from "@/components/auth/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 左側のデザインエリア */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[var(--header)] to-blue-500 p-12 flex-col justify-center items-center text-white">
        <div className="max-w-md">
          <div className="mb-8 flex justify-center">
            <div className="relative w-32 h-32">
              <Image src="/toilet.png" alt="うんこフラッシュロゴ" width={128} height={128} className="drop-shadow-lg" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-6 text-center">うんこフラッシュ</h1>
          <p className="text-xl mb-8 text-center">
            タスクを完了してトイレに流そう！
            <br />
            最もスッキリするTODOアプリ
          </p>
          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">アプリの特徴</h2>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="mr-2">💩</span>
                <span>完了したタスクをトイレに流して気分爽快</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">⏰</span>
                <span>時間設定とリマインダー機能</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">⭐</span>
                <span>よく使うタスクをお気に入り登録</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">📊</span>
                <span>ユニークなうんこ解析機能</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 右側のログインフォームエリア */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="md:hidden text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative w-24 h-24">
                <Image src="/toilet.png" alt="うんこフラッシュロゴ" width={96} height={96} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[var(--header)]">うんこフラッシュ</h1>
            <p className="text-gray-600 mt-2">タスクを完了してトイレに流そう！</p>
          </div>

          <LoginForm />

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} うんこフラッシュTODO. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
