"use client"

import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { Fragment } from "react"

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"

type Crumb = { label: string; href?: string }

export function IntegrationsTopbar({ trail }: { trail: Crumb[] }) {
  const { isMobile } = useSidebar()
  const crumbs: Crumb[] = [{ label: "Raxon AI", href: "/ai" }, ...trail]

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
      {isMobile && (
        <>
          <SidebarTrigger className="-ml-1 text-muted-foreground" />
          <span className="h-5 w-px bg-border" />
        </>
      )}
      <nav
        aria-label="Breadcrumb"
        className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground"
      >
        {crumbs.map(({ label, href }, position) => (
          <Fragment key={label}>
            {position > 0 && (
              <HugeiconsIcon
                className="shrink-0"
                icon={ArrowRight01Icon}
                size={14}
              />
            )}
            {href ? (
              <Link
                className="truncate transition-colors hover:text-foreground"
                href={href}
              >
                {label}
              </Link>
            ) : (
              <span
                aria-current="page"
                className="truncate font-medium text-foreground"
              >
                {label}
              </span>
            )}
          </Fragment>
        ))}
      </nav>
    </header>
  )
}
