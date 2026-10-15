"use client"

import { AnimatePresence, MotionConfig, motion } from "motion/react"
import type { ReactNode } from "react"

import { SOFT_TRANSITION } from "@/shared/lib/motion"

export function FadeSwap({
  swapKey,
  children,
  className,
}: {
  swapKey: string
  children: ReactNode
  className?: string
}) {
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={className}
          exit={{ opacity: 0, transition: { duration: 0.12, ease: "easeIn" } }}
          initial={{ opacity: 0, y: 4 }}
          key={swapKey}
          transition={SOFT_TRANSITION}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  )
}
