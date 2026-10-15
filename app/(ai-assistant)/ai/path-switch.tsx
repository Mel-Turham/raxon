"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

export function PathSwitch({
  routes,
  fallback,
}: {
  routes: Record<string, ReactNode>
  fallback: ReactNode
}) {
  const pathname = usePathname()
  const match = Object.keys(routes).find((path) => pathname.startsWith(path))

  return match ? routes[match] : fallback
}
