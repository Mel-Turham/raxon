"use client"

import { Logout01Icon, Menu01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { type ReactNode, useState } from "react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { RaxonLogo } from "@/shared/components/atoms/raxon-logo"
import { CURRENT_USER } from "@/shared/config"
import { cn } from "@/shared/lib/utils"

import { ACCOUNT_LINKS, HELP_LINK } from "./account-links"
import { HEADER_ICON_BUTTON } from "./header-styles"
import { NavLinks } from "./nav-links"
import { ThemeSwitch } from "./theme-switch"

const SECTION_LABEL =
  "px-4 pb-1 font-mono text-[10px] tracking-wider text-muted-foreground/70 uppercase"

const ROW =
  "flex h-11 w-full items-center gap-3 px-4 text-left text-sm text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground"

type MobileNavProps = {
  notifications?: ReactNode
  userAvatar?: ReactNode
  className?: string
}

export const MobileNav = ({
  notifications,
  userAvatar,
  className,
}: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const close = () => setIsOpen(false)

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger
        aria-label="Open navigation"
        className={cn(HEADER_ICON_BUTTON, className)}
      >
        <HugeiconsIcon icon={Menu01Icon} size={18} />
      </SheetTrigger>

      <SheetContent className="w-80 gap-0 p-0" side="right">
        <SheetHeader className="h-16 justify-center border-b border-border px-4">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Pages, account and preferences
          </SheetDescription>
          <RaxonLogo />
        </SheetHeader>

        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex items-center gap-3 border-b border-border p-4">
            {userAvatar}
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm font-medium">
                {CURRENT_USER.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {CURRENT_USER.email}
              </span>
            </span>
          </div>

          <section className="pt-4">
            <h2 className={SECTION_LABEL}>Menu</h2>
            <NavLinks onNavigate={close} orientation="vertical" />
          </section>

          <section className="mt-2 border-t border-border pt-4 pb-2">
            <h2 className={SECTION_LABEL}>Account</h2>
            {[...ACCOUNT_LINKS, HELP_LINK].map(({ label, icon }) => (
              <button className={ROW} key={label} type="button">
                <HugeiconsIcon icon={icon} size={17} />
                {label}
              </button>
            ))}
          </section>
        </div>

        <div className="flex flex-col border-t border-border">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <ThemeSwitch />
            {notifications}
          </div>
          <button
            className={cn(
              ROW,
              "border-t border-border text-destructive hover:bg-destructive/10 hover:text-destructive"
            )}
            type="button"
          >
            <HugeiconsIcon icon={Logout01Icon} size={17} />
            Log out
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
