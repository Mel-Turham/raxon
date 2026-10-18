"use client"

import {
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  TestTube01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/shared/config"

const SEEN_KEY = "raxon:demo-notice-seen"

const LIVE_FEATURES = [
  "Markets, prices and stats from CoinGecko, Binance and Alternative.me",
  "Trade chart, order book and trades streamed in real time from Binance",
  "Raxon AI answers powered by Groq, grounded in live market data",
  "Portfolio and analytics charts valued at real market prices",
]

const SIMULATED_FEATURES = [
  "Sign-in and sign-up: no account is created or stored",
  "Your balances, trade history and orders come from a demo account",
  "Placing orders, deposits, transfers, integrations and notifications",
]

const readSeen = () => {
  try {
    return localStorage.getItem(SEEN_KEY) === "1"
  } catch {
    return false
  }
}

const markSeen = () => {
  try {
    localStorage.setItem(SEEN_KEY, "1")
  } catch {}
}

const FeatureList = ({
  title,
  icon,
  items,
  className,
}: {
  title: string
  icon: typeof CheckmarkCircle02Icon
  items: string[]
  className: string
}) => (
  <section className="flex flex-col gap-2">
    <h3 className="flex items-center gap-1.5 text-xs font-medium text-foreground">
      <HugeiconsIcon className={className} icon={icon} size={14} />
      {title}
    </h3>
    <ul className="flex flex-col gap-1 pl-5 text-xs text-muted-foreground">
      {items.map((item) => (
        <li className="list-disc" key={item}>
          {item}
        </li>
      ))}
    </ul>
  </section>
)

export function DemoNotice() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!readSeen()) setOpen(true)
  }, [])

  const close = (next: boolean) => {
    if (next) return
    markSeen()
    setOpen(false)
  }

  return (
    <AlertDialog onOpenChange={close} open={open}>
      <AlertDialogContent className="max-h-[90svh] overflow-y-auto data-[size=default]:sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-primary/10 text-primary">
            <HugeiconsIcon icon={InformationCircleIcon} />
          </AlertDialogMedia>
          <AlertDialogTitle>Welcome to the Raxon demo</AlertDialogTitle>
          <AlertDialogDescription>
            Raxon is an open-source showcase of a crypto trading app. Market
            data and the AI assistant are real; anything tied to a personal
            account is simulated so you can explore safely.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4">
          <FeatureList
            className="text-success"
            icon={CheckmarkCircle02Icon}
            items={LIVE_FEATURES}
            title="Live data"
          />
          <FeatureList
            className="text-primary"
            icon={TestTube01Icon}
            items={SIMULATED_FEATURES}
            title="Simulated for the demo"
          />
          <section className="flex flex-col gap-2 border border-border bg-muted/40 p-3 text-xs">
            <h3 className="font-medium text-foreground">Demo access</h3>
            <p className="text-muted-foreground">
              The sign-in form is pre-filled; only these credentials are
              accepted. Sign-up accepts any valid details and stores nothing.
            </p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-mono text-foreground">{DEMO_EMAIL}</dd>
              <dt className="text-muted-foreground">Password</dt>
              <dd className="font-mono text-foreground">{DEMO_PASSWORD}</dd>
            </dl>
          </section>
          <p className="text-[11px] text-muted-foreground">
            Nothing here is financial advice.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogAction onClick={() => close(false)}>
            Got it, explore Raxon
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
