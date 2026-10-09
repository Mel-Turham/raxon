"use client"

import {
  AlertCircleIcon,
  CommandIcon,
  Logout01Icon,
  Moon02Icon,
  Settings01Icon,
  Sun03Icon,
  UnfoldMoreIcon,
  UserIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { SearchInput } from "@/components/search-input"
import { HintTooltip } from "@/components/shared/hint-tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { CURRENT_USER, NAV_LINKS } from "@/constants"
import { cn } from "@/lib/utils"

import { HEADER_ICON_BUTTON } from "./header-styles"

const USER = CURRENT_USER

// Clean outlined controls, as in the design: no fill, subtle border.
const iconButton = HEADER_ICON_BUTTON

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

type HeaderNavBarProps = {
  /** Bell + notifications panel, streamed from the server. */
  notifications?: ReactNode
  /** Profile picture, rendered on the server (DiceBear). */
  userAvatar?: ReactNode
}

export const HeaderNavBar = ({
  notifications,
  userAvatar,
}: HeaderNavBarProps) => {
  const pathname = usePathname()
  const { setTheme } = useTheme()

  return (
    <header className="relative z-10 flex h-16 items-center justify-between gap-6 border-b border-border bg-card px-6 shadow-(--header-shadow)">
      {/*HEADER LEFT */}
      <div className="flex items-center gap-10">
        {/*RAXON LOGO*/}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center bg-primary">
            <span className="flex w-3.5 flex-col items-end gap-[1.5px]">
              <span className="h-1 w-full bg-primary-foreground" />
              <span className="h-1 w-full bg-primary-foreground" />
              <span className="h-1 w-2/3 bg-primary-foreground" />
            </span>
          </span>
          <span className="text-xl font-normal tracking-tight">Raxon</span>
        </Link>

        {/*NAVIGATION LINKS*/}
        <nav className="flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm transition-colors",
                  isActive
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/*HEADER RIGHT */}
      <div className="flex items-center gap-3">
        {/*SEARCH*/}
        <SearchInput
          containerClassName="w-72"
          placeholder="Search here..."
          className="bg-transparent dark:bg-transparent"
          trailing={
            <KbdGroup>
              <Kbd>K</Kbd>
              <Kbd>
                <HugeiconsIcon icon={CommandIcon} />
              </Kbd>
            </KbdGroup>
          }
        />

        {/*THEME TOGGLE*/}
        <div className="flex h-9 items-center gap-0.5 border border-border p-0.5">
          {THEME_OPTIONS.map(({ theme, label, icon, activeClass }) => (
            <HintTooltip key={theme} label={label}>
              <button
                type="button"
                aria-label={label}
                onClick={() => setTheme(theme)}
                className={cn(
                  "flex size-7 items-center justify-center text-muted-foreground/70 transition-colors hover:text-foreground",
                  activeClass
                )}
              >
                <HugeiconsIcon icon={icon} size={16} />
              </button>
            </HintTooltip>
          ))}
        </div>

        {/*NOTIFICATIONS*/}
        {notifications}

        {/*INFO*/}
        <HintTooltip label="Help & support">
          <button
            type="button"
            aria-label="Help & support"
            className={iconButton}
          >
            <HugeiconsIcon icon={AlertCircleIcon} size={17} />
          </button>
        </HintTooltip>

        {/*USER*/}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2.5 pl-1 text-left outline-none">
            {userAvatar}
            <span className="flex max-w-32 flex-col leading-tight">
              <span className="truncate text-sm font-medium">{USER.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {USER.email}
              </span>
            </span>
            <HugeiconsIcon
              icon={UnfoldMoreIcon}
              size={16}
              className="text-muted-foreground"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{USER.email}</DropdownMenuLabel>
              <DropdownMenuItem>
                <HugeiconsIcon icon={UserIcon} />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Wallet01Icon} />
                Wallet
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Settings01Icon} />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <HugeiconsIcon icon={Logout01Icon} />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
