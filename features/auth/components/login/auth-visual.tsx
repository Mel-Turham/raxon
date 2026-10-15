"use client"

import { MotionConfig } from "motion/react"

import { AuthVisualHeading } from "@/features/auth/components/login/auth-visual-heading"
import { AuthShowcase, type ShowcaseScene } from "../visual/auth-showcase"

type AuthVisualProps = {
  scene?: ShowcaseScene
  heading?: {
    firstLine: string
    secondLine: string
  }
}

export function AuthVisual({
  scene = "login",
  heading = { firstLine: "Trade Smarter.", secondLine: "Build Wealth." },
}: AuthVisualProps) {
  return (
    <MotionConfig reducedMotion="user">
      <aside className="relative hidden min-h-0 overflow-hidden bg-card/40 lg:block">
        <AuthShowcase scene={scene} />
        <AuthVisualHeading {...heading} />
      </aside>
    </MotionConfig>
  )
}
