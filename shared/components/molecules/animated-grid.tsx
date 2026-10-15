"use client"

import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  type Transition,
} from "motion/react"
import type { ReactNode } from "react"

import { EASE_SOFT } from "@/shared/lib/motion"
import { cn } from "@/shared/lib/utils"

const ITEM_TRANSITION: Transition = {
  layout: { type: "tween", duration: 0.5, ease: EASE_SOFT },
  opacity: { duration: 0.3, ease: "easeOut" },
  y: { duration: 0.4, ease: EASE_SOFT },
}

const EXIT_TRANSITION: Transition = { duration: 0.16, ease: "easeIn" }

export function AnimatedGrid({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: ReactNode
}) {
  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id={label}>
        <section aria-label={label} className={cn("grid", className)}>
          <AnimatePresence initial={false} mode="popLayout">
            {children}
          </AnimatePresence>
        </section>
      </LayoutGroup>
    </MotionConfig>
  )
}

export function AnimatedGridItem({
  layoutId,
  children,
}: {
  layoutId: string
  children: ReactNode
}) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex *:flex-1"
      exit={{ opacity: 0, transition: EXIT_TRANSITION }}
      initial={{ opacity: 0, y: 4 }}
      layout="position"
      layoutId={layoutId}
      transition={ITEM_TRANSITION}
    >
      {children}
    </motion.div>
  )
}
