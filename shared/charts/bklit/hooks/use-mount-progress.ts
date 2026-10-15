"use client"

import { animate, type Transition, useMotionValue } from "motion/react"
import { useEffect, useRef } from "react"
import { DEFAULT_CHART_ENTER_TRANSITION } from "../core/animation"

export function useMountProgress(
  enterTransition: Transition | undefined,
  delaySeconds: number,
  replayKey: number | string
) {
  const progress = useMotionValue(0)
  const transitionRef = useRef(enterTransition)
  transitionRef.current = enterTransition

  useEffect(() => {
    progress.set(0)
    const controls = animate(progress, 1, {
      ...(transitionRef.current ?? DEFAULT_CHART_ENTER_TRANSITION),
      delay: delaySeconds,
    })
    return () => controls.stop()
  }, [delaySeconds, replayKey, progress])

  return progress
}
