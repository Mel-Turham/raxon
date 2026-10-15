"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { NAV_LINKS } from "@/shared/config"
import { cn } from "@/shared/lib/utils"

const ORIENTATION_CLASS = {
  horizontal: {
    nav: "flex h-full items-center gap-5 2xl:gap-6",
    link: "h-full after:inset-x-0 after:bottom-0 after:h-0.5",
  },
  vertical: {
    nav: "flex flex-col",
    link: "h-11 px-4 hover:bg-foreground/[0.04] aria-[current=page]:bg-foreground/[0.04] after:inset-y-2 after:left-0 after:w-0.5",
  },
} as const

type NavLinksProps = {
  orientation?: keyof typeof ORIENTATION_CLASS
  onNavigate?: () => void
  className?: string
}

export const NavLinks = ({
  orientation = "horizontal",
  onNavigate,
  className,
}: NavLinksProps) => {
  const pathname = usePathname()
  const styles = ORIENTATION_CLASS[orientation]

  return (
    <nav className={cn(styles.nav, className)}>
      {NAV_LINKS.map((link) => {
        const isActive =
          pathname === link.href || pathname.startsWith(`${link.href}/`)

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative flex shrink-0 items-center text-sm transition-colors after:absolute",
              styles.link,
              isActive
                ? "font-medium text-foreground after:bg-primary"
                : "text-muted-foreground after:bg-transparent hover:text-foreground"
            )}
            href={link.href}
            key={link.href}
            onClick={onNavigate}
          >
            {link.label}
            {"badge" in link && (
              <span className="ml-1.5 bg-primary/10 px-1 py-px font-mono text-[9px] text-primary">
                {link.badge}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
