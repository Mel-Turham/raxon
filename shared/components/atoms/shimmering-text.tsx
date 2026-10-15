"use client"

import { motion, useReducedMotion, type Variants } from "motion/react"
import { type ComponentProps, useCallback, useMemo } from "react"
import { withKeys } from "@/shared/lib/keys"
import { cn } from "@/shared/lib/utils"

export type ShimmeringTextProps = Omit<
  ComponentProps<typeof motion.span>,
  "children"
> & {
  text: string

  duration?: number

  paused?: boolean

  isStopped?: boolean
}

export function ShimmeringText({
  text,
  duration = 1,
  isStopped = false,
  paused = false,
  className,
  ...props
}: ShimmeringTextProps) {
  const reducedMotion = useReducedMotion()
  const stopped = isStopped || paused || reducedMotion === true
  const chars = useMemo(() => withKeys(Array.from(text), "char"), [text])

  const createCharVariants = useCallback(
    (charIndex: number): Variants => ({
      running: {
        color: ["var(--color)", "var(--shimmering-color)", "var(--color)"],
        transition: {
          duration,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          repeatDelay: text.length * 0.05,
          delay: (charIndex * duration) / text.length,
          ease: "easeInOut",
        },
      },
      stopped: {
        color: "var(--color)",
        transition: {
          duration: duration * 0.5,
          ease: "easeOut",
        },
      },
    }),
    [duration, text.length]
  )

  return (
    <motion.span
      className={cn(
        "inline-flex items-center leading-none select-none",
        "[--color:var(--muted-foreground)] [--shimmering-color:var(--foreground)]",
        className
      )}
      {...props}
    >
      {chars.map(({ key, value: char }, position) => (
        <motion.span
          animate={stopped ? "stopped" : "running"}
          aria-hidden
          className="inline-block leading-none whitespace-pre"
          initial="stopped"
          key={key}
          variants={createCharVariants(position)}
        >
          {char}
        </motion.span>
      ))}
      <span className="sr-only">{text}</span>
    </motion.span>
  )
}
