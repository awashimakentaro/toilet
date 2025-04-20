"use client"

import { Header } from "@/components/header"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div className="max-w-md mx-auto p-4">
      <Header />
      <ForgotPasswordForm />
      <div className="mt-4 text-center">
        <p>
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            ログインページに戻る
          </Link>
        </p>
      </div>
    </div>
  )
}
