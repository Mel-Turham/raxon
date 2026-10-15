import type { Transition } from "motion/react"

export const DEFAULT_ANIMATION_EASING = "cubic-bezier(0.85, 0, 0.15, 1)"

export const DEFAULT_ANIMATION_DURATION_MS = 1100

export const DEFAULT_CHART_ENTER_TRANSITION: Transition = {
  type: "tween",
  duration: DEFAULT_ANIMATION_DURATION_MS / 1000,
  ease: [0.85, 0, 0.15, 1],
}

export function clipRevealTransition(enterTransition?: Transition): Transition {
  if (enterTransition?.type === "tween") {
    return {
      ...enterTransition,
      ease: enterTransition.ease ?? DEFAULT_CHART_ENTER_TRANSITION.ease,
    }
  }

  const duration =
    typeof enterTransition?.duration === "number"
      ? enterTransition.duration
      : DEFAULT_ANIMATION_DURATION_MS / 1000

  return {
    type: "tween",
    duration,
    ease: DEFAULT_CHART_ENTER_TRANSITION.ease,
  }
}
