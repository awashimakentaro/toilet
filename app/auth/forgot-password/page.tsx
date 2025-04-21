"use client"

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef } from "react"
import { slideInFromLeft, fadeInFromBottom, scaleIn } from "@/lib/gsap-utils"

export default function ForgotPasswordPage() {
  // アニメーション用のref
  const logoRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const formContainerRef = useRef<HTMLDivElement>(null)
  const linkRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (logoRef.current) {
      scaleIn(logoRef.current, 0.1)
    }
    if (titleRef.current) {
      slideInFromLeft(titleRef.current, 0.3)
    }
    if (formContainerRef.current) {
      fadeInFromBottom(formContainerRef.current, 0.5)
    }
    if (linkRef.current) {
      fadeInFromBottom(linkRef.current, 0.8)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div ref={logoRef} className="flex justify-center mb-4 opacity-0">
            <div className="relative w-24 h-24">
              <Image
                src="/toilet.png"
                alt="うんこフラッシュロゴ"
                width={96}
                height={96}
                className="animate-bounce-slow"
              />
            </div>
          </div>
          <h1 ref={titleRef} className="text-3xl font-bold text-[var(--header)] opacity-0">
            うんこフラッシュ
          </h1>
        </div>

        <div ref={formContainerRef} className="opacity-0">
          <ForgotPasswordForm />
        </div>

        <div className="mt-8 text-center">
          <p ref={linkRef} className="text-sm text-gray-600 opacity-0">
            <Link
              href="/auth/login"
              className="font-medium text-[var(--header)] hover:text-[var(--header)]/80 transition-colors"
            >
              ログインページに戻る
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
