import type { Metadata, Viewport } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"

import { env } from "@/shared/config/env"
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

const SITE_URL = env.siteUrl
const DESCRIPTION = "Track your markets, portfolio, and trades with Raxon."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Raxon",
    template: "%s · Raxon",
  },
  description: DESCRIPTION,
  applicationName: "Raxon",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Raxon",
    url: "/",
    title: "Raxon",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Raxon",
    description: DESCRIPTION,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f3" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
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
