"use client"

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { isTypingTarget } from "@/shared/lib/dom"
import * as React from "react"

function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  const onToggleKey = React.useEffectEvent((event: KeyboardEvent) => {
    if (event.defaultPrevented || event.repeat) {
      return
    }

    if (event.metaKey || event.ctrlKey || event.altKey) {
      return
    }

    if (event.key.toLowerCase() !== "d") {
      return
    }

    if (isTypingTarget(event.target)) {
      return
    }

    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  })

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => onToggleKey(event)

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  return null
}

export { ThemeProvider }
