"use client"

import { SignupForm } from "@/components/auth/signup-form"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef } from "react"
import { slideInFromLeft, slideInFromRight, fadeInFromBottom, scaleIn } from "@/lib/gsap-utils"

export default function SignupPage() {
  // アニメーション用のref
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const featureBoxRef = useRef<HTMLDivElement>(null)
  const featureItem1Ref = useRef<HTMLLIElement>(null)
  const featureItem2Ref = useRef<HTMLLIElement>(null)
  const featureItem3Ref = useRef<HTMLLIElement>(null)
  const featureItem4Ref = useRef<HTMLLIElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const formContainerRef = useRef<HTMLDivElement>(null)
  const mobileTitleRef = useRef<HTMLHeadingElement>(null)
  const mobileSubtitleRef = useRef<HTMLParagraphElement>(null)
  const mobileLogoRef = useRef<HTMLDivElement>(null)

  // コンポーネントがマウントされた後にアニメーションを実行
  useEffect(() => {
    // デスクトップ版のアニメーション
    slideInFromLeft(titleRef.current, 0.2)
    slideInFromRight(subtitleRef.current, 0.4)
    fadeInFromBottom(featureBoxRef.current, 0.6)

    // 個別の要素にアニメーションを適用
    fadeInFromBottom(featureItem1Ref.current, 0.8)
    fadeInFromBottom(featureItem2Ref.current, 0.9)
    fadeInFromBottom(featureItem3Ref.current, 1.0)
    fadeInFromBottom(featureItem4Ref.current, 1.1)

    scaleIn(logoRef.current, 0.1)
    fadeInFromBottom(formContainerRef.current, 0.3)

    // モバイル版のアニメーション
    slideInFromLeft(mobileTitleRef.current, 0.2)
    slideInFromRight(mobileSubtitleRef.current, 0.3)
    scaleIn(mobileLogoRef.current, 0.1)
  }, [])

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 左側のデザインエリア */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[var(--header)] to-blue-500 p-12 flex-col justify-center items-center text-white">
        <div className="max-w-md">
          <div ref={logoRef} className="mb-8 flex justify-center opacity-0">
            <div className="relative w-32 h-32">
              <Image src="/toilet.png" alt="うんこフラッシュロゴ" width={128} height={128} className="drop-shadow-lg" />
            </div>
          </div>
          <h1 ref={titleRef} className="text-4xl font-bold mb-6 text-center opacity-0">
            うんこフラッシュ
          </h1>
          <p ref={subtitleRef} className="text-xl mb-8 text-center opacity-0">
            新規登録して、タスク管理を
            <br />
            もっとスッキリさせよう！
          </p>
          <div ref={featureBoxRef} className="bg-white/20 backdrop-blur-sm p-6 rounded-xl opacity-0">
            <h2 className="text-xl font-semibold mb-4">アカウント作成のメリット</h2>
            <ul className="space-y-2">
              <li ref={featureItem1Ref} className="flex items-center opacity-0">
                <span className="mr-2">🔄</span>
                <span>デバイス間でタスクを同期</span>
              </li>
              <li ref={featureItem2Ref} className="flex items-center opacity-0">
                <span className="mr-2">🔔</span>
                <span>リマインダー通知機能</span>
              </li>
              <li ref={featureItem3Ref} className="flex items-center opacity-0">
                <span className="mr-2">⭐</span>
                <span>お気に入りタスクの保存</span>
              </li>
              <li ref={featureItem4Ref} className="flex items-center opacity-0">
                <span className="mr-2">📊</span>
                <span>タスク完了の統計</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 右側のサインアップフォームエリア */}
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
              新規登録して始めよう！
            </p>
          </div>

          <SignupForm />

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              すでにアカウントをお持ちの場合は{" "}
              <Link
                href="/auth/login"
                className="font-medium text-[var(--header)] hover:text-[var(--header)]/80 transition-colors"
              >
                こちら
              </Link>
              からログインしてください。
            </p>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} うんこフラッシュTODO. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
