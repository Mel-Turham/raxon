import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"

import { cn } from "@/shared/lib/utils"
import { AppProviders } from "./providers"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "Raxon",
    template: "%s · Raxon",
  },
  description: "Track your markets, portfolio, and trades with Raxon.",
  applicationName: "Raxon",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Raxon",
    title: "Raxon",
    description: "Track your markets, portfolio, and trades with Raxon.",
  },
}

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
      <body className="grow">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
