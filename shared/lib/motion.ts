import type { Transition, Variants } from "motion/react"

export const EASE_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const SOFT_TRANSITION: Transition = {
  type: "tween",
  duration: 0.36,
  ease: EASE_SOFT,
}

export const stepVariants: Variants = {
  initial: { opacity: 0, filter: "blur(2px)" },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    transition: SOFT_TRANSITION,
  },
  exit: {
    opacity: 0,
    filter: "blur(2px)",
    transition: { ...SOFT_TRANSITION, duration: 0.2 },
  },
}
