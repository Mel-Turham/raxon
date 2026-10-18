"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { Toaster } from "sonner"

import { TooltipProvider } from "@/components/ui/tooltip"
import { getQueryClient } from "@/shared/providers/query-client"
import { ThemeProvider } from "@/shared/providers/theme-provider"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider delay={250}>
          {children}
          <Toaster
            position="bottom-center"
            gap={10}
            offset={16}
            toastOptions={{
              classNames: {
                toast: "bg-transparent! border-0! p-0! shadow-none!",
              },
            }}
          />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
