"use client"

import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
} from "motion/react"
import { type ReactNode, useId, useLayoutEffect, useRef, useState } from "react"

import { SOFT_TRANSITION, stepVariants } from "@/shared/lib/motion"
import { cn } from "@/shared/lib/utils"

type StepTransitionProps = {
  step: string
  children: ReactNode
  maxHeightClassName?: string
}

export function StepTransition({
  step,
  children,
  maxHeightClassName = "max-h-[calc(76dvh-2px)]",
}: StepTransitionProps) {
  const groupId = useId()
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number>()

  useLayoutEffect(() => {
    const node = contentRef.current
    if (!node) return
    const observer = new ResizeObserver(([entry]) =>
      setHeight(entry.borderBoxSize[0].blockSize)
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id={groupId}>
        <motion.div
          animate={{ height: height ?? "auto" }}
          className="flex min-h-0 flex-col overflow-hidden"
          initial={false}
          transition={SOFT_TRANSITION}
        >
          <div
            className={cn("relative flex flex-col", maxHeightClassName)}
            ref={contentRef}
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                animate="animate"
                className="flex min-h-0 flex-1 flex-col"
                exit="exit"
                initial="initial"
                key={step}
                variants={stepVariants}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </LayoutGroup>
    </MotionConfig>
  )
}

type SharedElementProps = {
  id: string
  children: ReactNode
  className?: string
}

export function SharedElement({ id, children, className }: SharedElementProps) {
  return (
    <motion.span
      className={cn("inline-flex shrink-0", className)}
      layoutId={id}
      transition={SOFT_TRANSITION}
    >
      {children}
    </motion.span>
  )
}
