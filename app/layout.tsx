import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { Suspense } from "react"

import { HeaderNavBar } from "@/components/layouts"
import {
  NotificationsBellFallback,
  NotificationsSection,
} from "@/components/notifications"
import { UserAvatar } from "@/components/shared/user-avatar"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { CURRENT_USER } from "@/constants"
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider defaultTheme="dark">
          {/* Shared delay: moving between hints opens them instantly. */}
          <TooltipProvider delay={250}>
            <HeaderNavBar
              userAvatar={<UserAvatar seed={CURRENT_USER.email} />}
              notifications={
                <Suspense fallback={<NotificationsBellFallback />}>
                  <NotificationsSection />
                </Suspense>
              }
            />
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
