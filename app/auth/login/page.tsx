"use client"

import { Header } from "@/components/header"
import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto p-4">
      <Header />
      <LoginForm />
      <div className="mt-4 text-center">
        <p>
          アカウントをお持ちでない場合は{" "}
          <Link href="/auth/signup" className="text-blue-500 hover:underline">
            こちら
          </Link>
          から登録してください。
        </p>
      </div>
    </div>
  )
}
