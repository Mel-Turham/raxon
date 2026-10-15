"use client"

import { motion } from "motion/react"

import { cn } from "@/shared/lib/utils"
import { AiBloub } from "./ai-bloub"

const SIZES = {
  sm: "size-7",
  lg: "size-28",
} as const

type AiOrbProps = {
  size?: keyof typeof SIZES
  active?: boolean
  interactive?: boolean
  typing?: boolean
  className?: string
}

export function AiOrb({
  size = "lg",
  active = false,
  interactive = false,
  typing = false,
  className,
}: AiOrbProps) {
  return (
    <motion.div
      animate={{ scale: [1, active ? 1.06 : 1.025, 1] }}
      className={cn(
        "shrink-0 drop-shadow-[0_0_24px_color-mix(in_oklch,var(--primary)_35%,transparent)]",
        SIZES[size],
        className
      )}
      transition={{
        duration: active ? 1.1 : 4,
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
      }}
    >
      <AiBloub
        active={active}
        className="size-full"
        interactive={interactive}
        typing={typing}
      />
    </motion.div>
  )
}
