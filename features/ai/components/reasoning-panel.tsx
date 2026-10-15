"use client"

import {
  AiBrain01Icon,
  ArrowDown01Icon,
  SparklesIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"

import { ShimmeringText } from "@/shared/components/atoms/shimmering-text"
import { SOFT_TRANSITION } from "@/shared/lib/motion"
import { cn } from "@/shared/lib/utils"

const seconds = (ms: number) => `${(ms / 1000).toFixed(1)}s`

const useElapsed = (since: number, isRunning: boolean) => {
  const [now, setNow] = useState(since)

  useEffect(() => {
    if (!isRunning) return
    const id = window.setInterval(() => setNow(Date.now()), 100)
    return () => window.clearInterval(id)
  }, [isRunning])

  return Math.max(0, now - since)
}

type ReasoningPanelProps = {
  steps: string[]
  stepsDone: number
  isThinking: boolean
  isStopped: boolean
  startedAt: number
  thoughtMs: number
}

export function ReasoningPanel({
  steps,
  stepsDone,
  isThinking,
  isStopped,
  startedAt,
  thoughtMs,
}: ReasoningPanelProps) {
  const [userOpen, setUserOpen] = useState<boolean | null>(null)
  const isOpen = userOpen ?? isThinking
  const elapsed = useElapsed(startedAt, isThinking)
  const visibleSteps = steps.slice(0, Math.min(steps.length, stepsDone + 1))

  return (
    <div className="flex flex-col">
      <button
        aria-expanded={isOpen}
        className="group/reasoning flex h-7 w-fit items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => setUserOpen(!isOpen)}
        type="button"
      >
        {isThinking ? (
          <motion.span
            animate={{ rotate: [0, 90, 180], scale: [1, 1.15, 1] }}
            className="flex text-primary"
            transition={{
              duration: 1.6,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            <HugeiconsIcon icon={SparklesIcon} size={15} />
          </motion.span>
        ) : (
          <HugeiconsIcon icon={AiBrain01Icon} size={15} />
        )}
        {isThinking ? (
          <span className="flex items-center gap-1.5">
            <ShimmeringText className="font-medium" text="Thinking" />
            <span className="font-mono text-[11px] tabular-nums">
              {seconds(elapsed)}
            </span>
          </span>
        ) : (
          <span>
            {isStopped && !thoughtMs
              ? "Stopped thinking"
              : `Thought for ${seconds(thoughtMs)}`}
          </span>
        )}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="flex opacity-60 group-hover/reasoning:opacity-100"
          transition={SOFT_TRANSITION}
        >
          <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={SOFT_TRANSITION}
          >
            <ol className="relative mt-1.5 mb-1 ml-[7px] flex flex-col gap-2.5 border-l border-foreground/10 py-1 pl-5">
              {visibleSteps.map((step, index) => {
                const isDone = index < stepsDone
                const isCurrent = isThinking && index === stepsDone
                return (
                  <motion.li
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    className="relative flex items-center text-[13px] leading-5"
                    initial={{ opacity: 0, y: 4, filter: "blur(3px)" }}
                    key={step}
                    transition={SOFT_TRANSITION}
                  >
                    <span className="absolute -left-[27px] flex size-3.5 items-center justify-center bg-background">
                      {isCurrent ? (
                        <span className="relative flex size-2">
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
                          <span className="relative inline-flex size-2 rounded-full bg-primary" />
                        </span>
                      ) : (
                        <HugeiconsIcon
                          className={cn(
                            isDone ? "text-success" : "text-muted-foreground"
                          )}
                          icon={Tick02Icon}
                          size={12}
                          strokeWidth={2.5}
                        />
                      )}
                    </span>
                    {isCurrent ? (
                      <ShimmeringText
                        className="text-foreground/90"
                        text={step}
                      />
                    ) : (
                      <span
                        className={cn(
                          "text-muted-foreground",
                          !isDone && "opacity-60"
                        )}
                      >
                        {step}
                      </span>
                    )}
                  </motion.li>
                )
              })}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
