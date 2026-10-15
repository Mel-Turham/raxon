"use client"

import type { Transition } from "motion/react"
import { motion } from "motion/react"
import { clipRevealTransition } from "./animation"

export type ChartRevealClipMode = "reveal" | "conceal"

export interface ChartRevealClipProps {
  clipPathId: string
  height: number
  targetWidth: number
  enterTransition?: Transition
  revealEpoch: number
  padding?: number
  animating?: boolean
  mode?: ChartRevealClipMode
  onComplete?: () => void
}

export function ChartRevealClip({
  clipPathId,
  height,
  targetWidth,
  enterTransition,
  revealEpoch,
  padding = 0,
  animating = true,
  mode = "reveal",
  onComplete,
}: ChartRevealClipProps) {
  const transition = clipRevealTransition(enterTransition)
  const paddedWidth = Math.max(0, targetWidth + padding * 2)
  const paddedHeight = height + padding * 2

  if (!animating) {
    return (
      <clipPath id={clipPathId}>
        <rect
          height={paddedHeight}
          width={paddedWidth}
          x={-padding}
          y={-padding}
        />
      </clipPath>
    )
  }

  if (mode === "conceal") {
    const rightEdge = -padding + paddedWidth

    return (
      <clipPath id={clipPathId}>
        <motion.rect
          animate={{ width: 0, x: rightEdge }}
          height={paddedHeight}
          initial={{ width: paddedWidth, x: -padding }}
          key={`conceal-${revealEpoch}`}
          onAnimationComplete={() => onComplete?.()}
          transition={transition}
          y={-padding}
        />
      </clipPath>
    )
  }

  return (
    <clipPath id={clipPathId}>
      <motion.rect
        animate={{ width: paddedWidth }}
        height={paddedHeight}
        initial={{ width: 0 }}
        key={`reveal-${revealEpoch}`}
        transition={transition}
        width={paddedWidth}
        x={-padding}
        y={-padding}
      />
    </clipPath>
  )
}
