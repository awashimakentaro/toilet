"use client"

import { Header } from "@/components/header"
import { SignupForm } from "@/components/auth/signup-form"
import Link from "next/link"
import { AuthProvider } from "@/context/auth-context"

export default function SignupPage() {
  return (
    <AuthProvider>
      <div className="max-w-md mx-auto p-4">
        <Header />
        <SignupForm />
        <div className="mt-4 text-center">
          <p>
            すでにアカウントをお持ちの場合は{" "}
            <Link href="/auth/login" className="text-blue-500 hover:underline">
              こちら
            </Link>
            からログインしてください。
          </p>
        </div>
      </div>
    </AuthProvider>
  )
}
