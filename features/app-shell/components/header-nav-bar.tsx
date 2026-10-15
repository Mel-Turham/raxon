"use client"

import { Logout01Icon, UnfoldMoreIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ReactNode } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RaxonLogo } from "@/shared/components/atoms/raxon-logo"
import { HintTooltip } from "@/shared/components/molecules/hint-tooltip"
import { CURRENT_USER } from "@/shared/config"

import { ACCOUNT_LINKS, HELP_LINK } from "./account-links"
import { HEADER_ICON_BUTTON } from "./header-styles"
import { MobileNav } from "./mobile-nav"
import { NavLinks } from "./nav-links"
import { ThemeSwitch } from "./theme-switch"

const USER = CURRENT_USER

type HeaderNavBarProps = {
  search?: ReactNode
  notifications?: ReactNode

  userAvatar?: ReactNode
}

export const HeaderNavBar = ({
  search,
  notifications,
  userAvatar,
}: HeaderNavBarProps) => (
  <header className="relative z-10 flex h-16 items-center justify-between gap-3 border-b border-border bg-card px-4 shadow-(--header-shadow) sm:px-6 xl:gap-6">
    <div className="flex h-full min-w-0 items-center gap-8 2xl:gap-10">
      <RaxonLogo />
      <NavLinks className="hidden xl:flex" />
    </div>

    <div className="flex shrink-0 items-center gap-3">
      {search}

      <div className="hidden items-center gap-3 xl:flex">
        <ThemeSwitch />

        {notifications}

        <HintTooltip label={HELP_LINK.label}>
          <button
            aria-label={HELP_LINK.label}
            className={HEADER_ICON_BUTTON}
            type="button"
          >
            <HugeiconsIcon icon={HELP_LINK.icon} size={17} />
          </button>
        </HintTooltip>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Account menu"
            className="flex items-center gap-2.5 pl-1 text-left outline-none"
          >
            {userAvatar}
            <span className="hidden max-w-32 flex-col leading-tight 2xl:flex">
              <span className="truncate text-sm font-medium">{USER.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {USER.email}
              </span>
            </span>
            <HugeiconsIcon
              className="text-muted-foreground"
              icon={UnfoldMoreIcon}
              size={16}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
            <DropdownMenuGroup>
              <DropdownMenuLabel>{USER.email}</DropdownMenuLabel>
              {ACCOUNT_LINKS.map(({ label, icon }) => (
                <DropdownMenuItem key={label}>
                  <HugeiconsIcon icon={icon} />
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <HugeiconsIcon icon={Logout01Icon} />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <MobileNav
        className="xl:hidden"
        notifications={notifications}
        userAvatar={userAvatar}
      />
    </div>
  </header>
)
