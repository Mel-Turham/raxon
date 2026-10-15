"use client"

import {
  ArrowLeft01Icon,
  Cancel01Icon,
  CreditCardIcon,
  CustomerSupportIcon,
  Diamond02Icon,
  FlashIcon,
  Logout01Icon,
  Moon02Icon,
  MoreVerticalIcon,
  PaintBoardIcon,
  Settings02Icon,
  Sun03Icon,
  Tick02Icon,
  ComputerIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion } from "motion/react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { type ReactNode, useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/toast"
import { CURRENT_USER } from "@/shared/config"
import { EASE_SOFT } from "@/shared/lib/motion"
import { cn } from "@/shared/lib/utils"
import type { AiPlan } from "../types"

const MENU_ITEM = "gap-2.5 rounded-lg px-2.5 py-2 text-sm"
const BADGE = "ml-auto rounded-full px-1.5 py-px text-[10px] font-medium"

const soon = (feature: string) =>
  toast.success(`${feature} is coming soon`, {
    description: "This part of Raxon AI is still being designed.",
  })

const DISMISS_KEY = "raxon-ai:upgrade-dismissed"
const dismissListeners = new Set<() => void>()

const subscribeDismiss = (onChange: () => void) => {
  dismissListeners.add(onChange)
  window.addEventListener("storage", onChange)
  return () => {
    dismissListeners.delete(onChange)
    window.removeEventListener("storage", onChange)
  }
}

export function useUpgradeDismissed() {
  const dismissed = useSyncExternalStore(
    subscribeDismiss,
    () => localStorage.getItem(DISMISS_KEY) === "1",
    () => false
  )
  const setDismissed = (value: boolean) => {
    if (value) localStorage.setItem(DISMISS_KEY, "1")
    else localStorage.removeItem(DISMISS_KEY)
    for (const listener of dismissListeners) listener()
  }
  return [dismissed, setDismissed] as const
}

const usageShare = (plan: AiPlan) => Math.round((plan.used / plan.limit) * 100)

const UsageBar = ({
  plan,
  className,
}: {
  plan: AiPlan
  className?: string
}) => (
  <div
    className={cn(
      "h-1.5 shrink-0 overflow-hidden rounded-full bg-muted",
      className
    )}
  >
    <motion.div
      animate={{ width: `${usageShare(plan)}%` }}
      className="h-full rounded-full bg-linear-to-r from-primary to-chart-1"
      initial={{ width: 0 }}
      transition={{ duration: 1.1, ease: EASE_SOFT }}
    />
  </div>
)

type UpgradeCardProps = {
  plan: AiPlan
  onDismiss: () => void
}

export function UpgradeCard({ plan, onDismiss }: UpgradeCardProps) {
  return (
    <div className="relative flex flex-col gap-3 rounded-xl border border-sidebar-border bg-foreground/[0.03] p-3.5">
      <Button
        aria-label="Hide upgrade card"
        className="absolute top-2 right-2 size-6 rounded-md text-muted-foreground"
        onClick={onDismiss}
        size="icon-xs"
        variant="ghost"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={13} />
      </Button>
      <span className="flex size-9 items-center justify-center rounded-lg bg-linear-to-br from-primary to-chart-1 text-primary-foreground shadow-[0_6px_16px_-6px_var(--primary)]">
        <HugeiconsIcon icon={FlashIcon} size={18} />
      </span>
      <div className="flex flex-col gap-1">
        <p className="flex items-center gap-2 text-sm font-semibold">
          Upgrade to Pro
          <span className="rounded-full border border-primary/30 px-1.5 py-px text-[10px] font-medium text-primary">
            {plan.discount}% OFF
          </span>
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Your {plan.name.toLowerCase()} plan includes {plan.limit} AI questions
          a month:
        </p>
      </div>
      <div className="flex items-center gap-3">
        <UsageBar className="flex-1" plan={plan} />
        <span className="font-mono text-xs tabular-nums">
          {usageShare(plan)}%
        </span>
      </div>
      <Button
        className="h-9 gap-2 rounded-lg bg-foreground text-sm text-background hover:bg-foreground/85"
        onClick={() => soon("Raxon AI Pro")}
      >
        <HugeiconsIcon icon={Diamond02Icon} size={16} />
        Upgrade plan
      </Button>
    </div>
  )
}

const THEMES = [
  { id: "light", label: "Light", icon: Sun03Icon },
  { id: "dark", label: "Dark", icon: Moon02Icon },
  { id: "system", label: "System", icon: ComputerIcon },
] as const

type UserRowProps = {
  avatar: ReactNode
  plan: AiPlan
  onUpgrade: () => void
}

export function UserRow({ avatar, plan, onUpgrade }: UserRowProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-sidebar-border bg-foreground/[0.03] p-2 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
      <span className="flex shrink-0">{avatar}</span>
      <span className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
        <span className="truncate text-sm font-medium">
          {CURRENT_USER.name}
        </span>
        <span className="truncate text-[11px] text-muted-foreground">
          {CURRENT_USER.email}
        </span>
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              aria-label="Account menu"
              className="size-7 rounded-lg text-muted-foreground group-data-[collapsible=icon]:hidden"
              size="icon-sm"
              variant="ghost"
            />
          }
        >
          <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-64 rounded-xl p-1.5"
          side="right"
          sideOffset={14}
        >
          <div className="flex items-center gap-3 p-2.5">
            <span className="flex shrink-0 [&>*]:size-9!">{avatar}</span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="flex items-center gap-2 truncate text-sm font-semibold">
                {CURRENT_USER.name}
                <span className="rounded-full bg-foreground/8 px-1.5 py-px text-[10px] font-medium text-muted-foreground">
                  {plan.name}
                </span>
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {CURRENT_USER.email}
              </span>
            </div>
          </div>

          <DropdownMenuSeparator className="my-1.5" />
          <DropdownMenuItem
            className={MENU_ITEM}
            onClick={() => soon("Settings")}
          >
            <HugeiconsIcon icon={Settings02Icon} />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem className={MENU_ITEM} onClick={onUpgrade}>
            <HugeiconsIcon icon={CreditCardIcon} />
            Plan &amp; billing
            <span className={cn(BADGE, "bg-primary/12 text-primary")}>
              Upgrade
            </span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className={MENU_ITEM}>
              <HugeiconsIcon icon={PaintBoardIcon} />
              Appearance
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-40 rounded-xl p-1.5">
              {THEMES.map(({ id, label, icon }) => (
                <DropdownMenuItem
                  className={MENU_ITEM}
                  key={id}
                  onClick={() => setTheme(id)}
                >
                  <HugeiconsIcon icon={icon} />
                  <span className="flex-1">{label}</span>
                  {theme === id && (
                    <HugeiconsIcon className="text-primary" icon={Tick02Icon} />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem
            className={MENU_ITEM}
            onClick={() => soon("Help center")}
          >
            <HugeiconsIcon icon={CustomerSupportIcon} />
            Help &amp; support
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1.5" />
          <DropdownMenuItem
            className={MENU_ITEM}
            render={<Link href="/dashboard" />}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} />
            Back to dashboard
          </DropdownMenuItem>
          <DropdownMenuItem className={MENU_ITEM} render={<Link href="/" />}>
            <HugeiconsIcon icon={Logout01Icon} />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
