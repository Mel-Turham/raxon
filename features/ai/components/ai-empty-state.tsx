"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { motion } from "motion/react"
import { type ReactNode, useSyncExternalStore } from "react"

import { CURRENT_USER } from "@/shared/config"
import { EASE_SOFT, SOFT_TRANSITION } from "@/shared/lib/motion"
import { cn } from "@/shared/lib/utils"
import type { AiSource } from "@/features/integrations"
import { WELCOME_CARDS } from "../constants"
import { ConnectExchangeBanner } from "./ai-sources"
import { AiOrb } from "./ai-orb"
import { RAISED_HOVER, RAISED_SURFACE } from "./surface"

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
  onPick: (prompt: string) => void
  sources: AiSource[]
}

export function AiEmptyState({
  isTyping,
  composer,
  onPick,
  sources,
}: AiEmptyStateProps) {
  const salutation = useSyncExternalStore(subscribe, greeting, () => "Hello")
  const firstName = CURRENT_USER.name.split(" ")[0]

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-8 px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(50%_60%_at_50%_10%,color-mix(in_oklch,var(--primary)_16%,transparent),transparent_72%)]"
      />
      <motion.div
        {...rise(0)}
        className="relative flex flex-col items-center gap-4 text-center"
      >
        <AiOrb interactive typing={isTyping} />
        <h2 className="text-3xl leading-tight font-medium tracking-tight text-balance md:text-4xl">
          {salutation}, {firstName}
          <br />
          <span className="text-foreground/80">How can I </span>
          <motion.span
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            className="bg-linear-to-r from-primary via-chart-1 to-primary bg-size-[200%_100%] bg-clip-text text-transparent"
            transition={{
              duration: 8,
              ease: EASE_SOFT,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            help you trade today?
          </motion.span>
        </h2>
      </motion.div>

      <motion.div {...rise(0.08)} className="relative w-full max-w-3xl">
        {composer}
      </motion.div>

      <motion.div
        {...rise(0.16)}
        className="grid w-full max-w-3xl gap-2 sm:grid-cols-3"
      >
        {WELCOME_CARDS.map((card) => (
          <button
            className={cn(
              "group flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left",
              RAISED_SURFACE,
              RAISED_HOVER
            )}
            key={card.title}
            onClick={() => onPick(card.prompt)}
            type="button"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={card.icon} size={15} />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-[13px] font-medium">{card.title}</span>
              <span className="truncate text-[11px] text-muted-foreground">
                {card.description}
              </span>
            </span>
          </button>
        ))}
      </motion.div>

      <motion.div {...rise(0.24)} className="flex w-full justify-center">
        <ConnectExchangeBanner sources={sources} />
      </motion.div>
    </div>
  )
}
