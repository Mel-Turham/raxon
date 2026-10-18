"use client"

import { motion } from "motion/react"
import { type ReactNode, useSyncExternalStore } from "react"

import { CURRENT_USER } from "@/shared/config"
import { EASE_SOFT, SOFT_TRANSITION } from "@/shared/lib/motion"
import type { AiSource } from "@/features/integrations"
import { ConnectExchangeBanner } from "./ai-sources"
import { AiOrb } from "./ai-orb"

const subscribe = () => () => {}

const greeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 8, filter: "blur(3px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { ...SOFT_TRANSITION, duration: 0.5, delay },
})

type AiEmptyStateProps = {
  isTyping: boolean
  composer: ReactNode
  sources: AiSource[]
}

export function AiEmptyState({
  isTyping,
  composer,
  sources,
}: AiEmptyStateProps) {
  const salutation = useSyncExternalStore(subscribe, greeting, () => "Hello")
  const firstName = CURRENT_USER.name.split(" ")[0]

  return (
    <div className="relative flex flex-1 flex-col items-center justify-start gap-6 px-4 pt-6 pb-8 sm:justify-center sm:gap-8 sm:py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(50%_60%_at_50%_10%,color-mix(in_oklch,var(--primary)_16%,transparent),transparent_72%)]"
      />
      <motion.div
        {...rise(0)}
        className="relative flex flex-col items-center gap-3 text-center sm:gap-4"
      >
        <AiOrb className="size-20 sm:size-28" interactive typing={isTyping} />
        <h2 className="text-xl leading-tight font-medium tracking-tight text-balance sm:text-3xl md:text-4xl">
          {salutation}, {firstName}
          <br />
          <span className="text-foreground/80">What are we </span>
          <motion.span
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            className="bg-linear-to-r from-primary via-chart-1 to-primary bg-size-[200%_100%] bg-clip-text text-transparent"
            transition={{
              duration: 8,
              ease: EASE_SOFT,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            trading today?
          </motion.span>
        </h2>
      </motion.div>

      <motion.div {...rise(0.08)} className="relative w-full max-w-3xl">
        {composer}
      </motion.div>

      <motion.div {...rise(0.16)} className="flex w-full justify-center">
        <ConnectExchangeBanner sources={sources} />
      </motion.div>
    </div>
  )
}
