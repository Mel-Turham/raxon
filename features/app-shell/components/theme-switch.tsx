"use client"

import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTheme } from "next-themes"

import { HintTooltip } from "@/shared/components/molecules/hint-tooltip"
import { cn } from "@/shared/lib/utils"

const THEME_OPTIONS = [
  {
    theme: "light",
    label: "Light mode",
    icon: Sun03Icon,
    activeClass: "not-dark:bg-foreground/[0.06] not-dark:text-foreground",
  },
  {
    theme: "dark",
    label: "Dark mode",
    icon: Moon02Icon,
    activeClass:
      "dark:bg-foreground/[0.06] dark:text-foreground/90 dark:shadow-(--control-active-shadow)",
  },
] as const

export const ThemeSwitch = ({ className }: { className?: string }) => {
  const { setTheme } = useTheme()

  return (
    <div
      className={cn(
        "flex h-9 items-center gap-0.5 border border-border p-0.5",
        className
      )}
    >
      {THEME_OPTIONS.map(({ theme, label, icon, activeClass }) => (
        <HintTooltip key={theme} label={label}>
          <button
            aria-label={label}
            className={cn(
              "flex size-7 items-center justify-center text-muted-foreground/70 transition-colors hover:text-foreground",
              activeClass
            )}
            onClick={() => setTheme(theme)}
            type="button"
          >
            <HugeiconsIcon icon={icon} size={16} />
          </button>
        </HintTooltip>
      ))}
    </div>
  )
}
