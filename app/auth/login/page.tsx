"use client"

import { LoginForm } from "@/components/auth/login-form"
import Image from "next/image"
import { useEffect, useRef } from "react"
import { slideInFromLeft, slideInFromRight, fadeInFromBottom, staggerElements, scaleIn } from "@/lib/gsap-utils"

export default function LoginPage() {
  // アニメーション用のref
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const featureBoxRef = useRef<HTMLDivElement>(null)
  const featureItemsRef = useRef<HTMLUListElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const formContainerRef = useRef<HTMLDivElement>(null)
  const mobileTitleRef = useRef<HTMLHeadingElement>(null)
  const mobileSubtitleRef = useRef<HTMLParagraphElement>(null)
  const mobileLogoRef = useRef<HTMLDivElement>(null)

  // コンポーネントがマウントされた後にアニメーションを実行
  useEffect(() => {
    // デスクトップ版のアニメーション
    if (titleRef.current) {
      slideInFromLeft(titleRef.current, 0.2)
    }
    if (subtitleRef.current) {
      slideInFromRight(subtitleRef.current, 0.4)
    }
    if (featureBoxRef.current) {
      fadeInFromBottom(featureBoxRef.current, 0.6)
    }
    if (featureItemsRef.current) {
      staggerElements(featureItemsRef.current.children, 0.1, 0.8)
    }
    if (logoRef.current) {
      scaleIn(logoRef.current, 0.1)
    }
    if (formContainerRef.current) {
      fadeInFromBottom(formContainerRef.current, 0.3)
    }

    // モバイル版のアニメーション
    if (mobileTitleRef.current) {
      slideInFromLeft(mobileTitleRef.current, 0.2)
    }
    if (mobileSubtitleRef.current) {
      slideInFromRight(mobileSubtitleRef.current, 0.3)
    }
    if (mobileLogoRef.current) {
      scaleIn(mobileLogoRef.current, 0.1)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 左側のデザインエリア */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[var(--header)] to-blue-500 p-12 flex-col justify-center items-center text-white">
        <div className="max-w-md">
          <div ref={logoRef} className="mb-8 flex justify-center">
            <div className="relative w-32 h-32">
              <Image src="/toilet.png" alt="うんこフラッシュロゴ" width={128} height={128} className="drop-shadow-lg" />
            </div>
          </div>
          <h1 ref={titleRef} className="text-4xl font-bold mb-6 text-center opacity-0">
            うんこフラッシュ
          </h1>
          <p ref={subtitleRef} className="text-xl mb-8 text-center opacity-0">
            タスクを完了してトイレに流そう！
            <br />
            最もスッキリするTODOアプリ
          </p>
          <div ref={featureBoxRef} className="bg-white/20 backdrop-blur-sm p-6 rounded-xl opacity-0">
            <h2 className="text-xl font-semibold mb-4">アプリの特徴</h2>
            <ul ref={featureItemsRef} className="space-y-2">
              <li className="flex items-center opacity-0">
                <span className="mr-2">💩</span>
                <span>完了したタスクをトイレに流して気分爽快</span>
              </li>
              <li className="flex items-center opacity-0">
                <span className="mr-2">⏰</span>
                <span>時間設定とリマインダー機能</span>
              </li>
              <li className="flex items-center opacity-0">
                <span className="mr-2">⭐</span>
                <span>よく使うタスクをお気に入り登録</span>
              </li>
              <li className="flex items-center opacity-0">
                <span className="mr-2">📊</span>
                <span>ユニークなうんこ解析機能</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 右側のログインフォームエリア */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div ref={formContainerRef} className="w-full max-w-md opacity-0">
          <div className="md:hidden text-center mb-8">
            <div ref={mobileLogoRef} className="flex justify-center mb-4 opacity-0">
              <div className="relative w-24 h-24">
                <Image src="/toilet.png" alt="うんこフラッシュロゴ" width={96} height={96} />
              </div>
            </div>
            <h1 ref={mobileTitleRef} className="text-3xl font-bold text-[var(--header)] opacity-0">
              うんこフラッシュ
            </h1>
            <p ref={mobileSubtitleRef} className="text-gray-600 mt-2 opacity-0">
              タスクを完了してトイレに流そう！
            </p>
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
