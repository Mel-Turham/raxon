"use client"

import { useState } from "react"

import { AuthLogo } from "@/features/auth/components/login/auth-logo"
import { AuthVisual } from "@/features/auth/components/login/auth-visual"
import { LoginForm } from "@/features/auth/components/login/login-form"

export function Login() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <main className="h-svh overflow-hidden">
      <div className="grid h-full w-full lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex min-h-0 flex-col px-7 py-5 sm:px-12 sm:py-8 lg:px-14">
          <div className="mx-auto flex min-h-0 w-full max-w-120 flex-1 flex-col">
            <AuthLogo />
            <LoginForm
              showPassword={showPassword}
              onShowPasswordChange={setShowPassword}
            />
          </div>
        </section>
        <AuthVisual scene="login" />
      </div>
    </main>
  )
}
