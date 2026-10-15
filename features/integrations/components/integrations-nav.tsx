"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/shared/lib/utils"

const LINKS = [
  { href: "/ai/integrations", label: "Integrations" },
  { href: "/ai/integrations/automations", label: "Automations" },
] as const

export function IntegrationsNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Integrations sections"
      className="flex gap-5 border-b border-border"
    >
      {LINKS.map(({ href, label }) => {
        const isActive = pathname === href
        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "-mb-px flex h-10 items-center gap-2 border-b-2 text-sm transition-colors",
              isActive
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            href={href}
            key={href}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
