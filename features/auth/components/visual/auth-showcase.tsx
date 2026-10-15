"use client"

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  SidebarLeftIcon,
  SquareLock02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import { useEffect, useState } from "react"

import { showcaseImages } from "@/shared/assets/images"
import { EASE_SOFT } from "@/shared/lib/motion"
import { cn } from "@/shared/lib/utils"

export type ShowcaseScene = "login" | "register"

type SlideId = keyof typeof showcaseImages

const SLIDES: Record<
  SlideId,
  { eyebrow: string; title: string; description: string; path: string }
> = {
  dashboard: {
    eyebrow: "Dashboard",
    title: "Your whole portfolio, at a glance",
    description:
      "Balances, performance and markets in one live view, updated by the second.",
    path: "dashboard",
  },
  trade: {
    eyebrow: "Trade",
    title: "Pro-grade trading, made simple",
    description:
      "Real-time charts, a live order book and one-click orders with built-in risk controls.",
    path: "trade",
  },
  ai: {
    eyebrow: "Raxon AI",
    title: "Your AI trading copilot",
    description:
      "Ask anything about your portfolio or the market and get clear answers in seconds.",
    path: "ai",
  },
}

const ORDER: Record<ShowcaseScene, SlideId[]> = {
  login: ["dashboard", "trade", "ai"],
  register: ["ai", "dashboard", "trade"],
}

const SLIDE_MS = 6000

const FADE = {
  initial: { opacity: 0, filter: "blur(2px)" },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE_SOFT },
  },
  exit: {
    opacity: 0,
    filter: "blur(2px)",
    transition: { duration: 0.45, ease: EASE_SOFT },
  },
}

export function AuthShowcase({ scene }: { scene: ShowcaseScene }) {
  const slides = ORDER[scene]
  const [index, setIndex] = useState(0)
  const slideId = slides[index]
  const slide = SLIDES[slideId]

  useEffect(() => {
    const id = window.setTimeout(
      () => setIndex((index + 1) % slides.length),
      SLIDE_MS
    )
    return () => window.clearTimeout(id)
  }, [index, slides.length])

  return (
    <div className="absolute inset-0">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_50%_at_60%_30%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_70%),radial-gradient(40%_35%_at_15%_75%,color-mix(in_oklch,var(--chart-1)_12%,transparent),transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_6%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_6%,transparent)_1px,transparent_1px)] mask-[radial-gradient(75%_65%_at_55%_40%,black,transparent_85%)] bg-size-[48px_48px]"
      />

      <div className="absolute inset-0 flex flex-col gap-10 px-10 pt-[12%] xl:px-14">
        <div className="relative z-10">
          <div className="grid">
            {slides.map((id) => {
              const isActive = id === slideId
              return (
                <motion.div
                  animate={isActive ? FADE.animate : FADE.exit}
                  aria-hidden={!isActive}
                  className={cn(
                    "[grid-area:1/1]",
                    !isActive && "pointer-events-none"
                  )}
                  initial={false}
                  key={id}
                >
                  <p className="text-sm font-medium text-primary">
                    {SLIDES[id].eyebrow}
                  </p>
                  <h2 className="mt-3 max-w-md text-[34px] leading-[1.1] font-semibold tracking-tight text-balance">
                    {SLIDES[id].title}
                  </h2>
                  <p className="mt-4 max-w-sm text-base leading-7 text-muted-foreground">
                    {SLIDES[id].description}
                  </p>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-7 flex items-center gap-1.5">
            {slides.map((id, position) => (
              <button
                aria-current={position === index}
                aria-label={`Show ${SLIDES[id].eyebrow}`}
                className="relative h-1 w-10 overflow-hidden bg-foreground/20 transition-colors hover:bg-foreground/30"
                key={id}
                onClick={() => setIndex(position)}
                type="button"
              >
                {position < index && (
                  <span className="absolute inset-0 bg-foreground" />
                )}
                {position === index && (
                  <motion.span
                    animate={{ scaleX: 1 }}
                    className="absolute inset-0 origin-left bg-foreground"
                    initial={{ scaleX: 0 }}
                    key={`${id}-${index}`}
                    transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: EASE_SOFT, delay: 0.15 }}
        >
          <div className="w-[1180px] overflow-hidden border border-foreground/10 bg-card shadow-[0_40px_120px_-30px_rgb(0_0_0/0.7)]">
            <div className="flex h-10 items-center gap-4 border-b border-foreground/8 bg-muted/60 px-4">
              <span className="flex gap-1.5">
                {["#ff5f57", "#febc2e", "#28c840"].map((color) => (
                  <span
                    className="size-2.5"
                    key={color}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </span>
              <span className="flex items-center gap-2.5 text-muted-foreground">
                <HugeiconsIcon icon={SidebarLeftIcon} size={15} />
                <HugeiconsIcon icon={ArrowLeft01Icon} size={15} />
                <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
              </span>
              <span className="flex h-6 w-72 items-center justify-center gap-1.5 bg-foreground/[0.05] font-mono text-[11px] text-muted-foreground">
                <HugeiconsIcon icon={SquareLock02Icon} size={11} />
                app.raxon.io/
                <AnimatePresence initial={false} mode="wait">
                  <motion.span
                    animate={{ opacity: 1 }}
                    className="-ml-1.5 text-foreground"
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    key={slide.path}
                    transition={{ duration: 0.3 }}
                  >
                    {slide.path}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>
            <div className="relative aspect-[1440/900] w-full bg-background">
              <AnimatePresence initial={false}>
                <motion.div
                  animate={FADE.animate}
                  className="absolute inset-0"
                  exit={FADE.exit}
                  initial={FADE.initial}
                  key={slideId}
                >
                  {(["light", "dark"] as const).map((theme) => (
                    <Image
                      alt={
                        theme === "dark"
                          ? `Raxon ${SLIDES[slideId].eyebrow} preview`
                          : ""
                      }
                      className={cn(
                        "object-cover object-top-left",
                        theme === "dark" ? "hidden dark:block" : "dark:hidden"
                      )}
                      fill
                      key={theme}
                      placeholder="blur"
                      priority={index === 0}
                      quality={90}
                      sizes="1180px"
                      src={showcaseImages[slideId][theme]}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
