"use client"

import { ArrowRight02Icon, Clock01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { confirmOtcTrade } from "../actions"
import { OtcActivityTable } from "../components/otc-activity"
import { OtcOverview } from "../components/otc-overview"
import {
  OtcQuotePanel,
  type OtcQuoteState,
} from "../components/otc-quote-panel"
import { OtcSteps } from "../components/otc-steps"
import { OtcTradeForm } from "../components/otc-trade-form"
import { buildQuote, quoteToActivity } from "../helpers/quote"
import type { OtcDashboardData, OtcQuoteRequest } from "../types"

const ACTIVE_STEP: Record<OtcQuoteState["status"], number> = {
  idle: 0,
  expired: 0,
  live: 1,
  settled: 3,
}

type OtcViewProps = {
  initialData: OtcDashboardData
}

export function OtcView({ initialData }: OtcViewProps) {
  const [state, setState] = useState<OtcQuoteState>({ status: "idle" })
  const [activity, setActivity] = useState(initialData.activity)
  const [error, setError] = useState<string | null>(null)
  const [isConfirming, startConfirm] = useTransition()

  const liveQuote = state.status === "live" ? state.quote : null

  useEffect(() => {
    if (!liveQuote) return
    const timer = window.setTimeout(() => {
      setState({ status: "expired", quote: liveQuote })
      setActivity((current) => [
        quoteToActivity(liveQuote, "Quote expired"),
        ...current,
      ])
    }, liveQuote.expiresAt - Date.now())
    return () => window.clearTimeout(timer)
  }, [liveQuote])

  const requestQuote = (request: OtcQuoteRequest) => {
    setError(null)
    setState({ status: "live", quote: buildQuote(request, initialData) })
  }

  const resetQuote = () => {
    setError(null)
    if (state.status !== "idle") setState({ status: "idle" })
  }

  const confirmQuote = () => {
    if (!liveQuote) return
    startConfirm(async () => {
      const result = await confirmOtcTrade({
        quoteId: liveQuote.id,
        side: liveQuote.side,
        baseAsset: liveQuote.baseAsset,
        quoteAsset: liveQuote.quoteAsset,
        amount: liveQuote.amount,
        total: liveQuote.total,
        expiresAt: liveQuote.expiresAt,
      })
      if (!result.ok) {
        setError(result.error)
        return
      }
      setState({
        status: "settled",
        quote: liveQuote,
        reference: result.reference,
      })
      setActivity((current) => [
        quoteToActivity(liveQuote, "Completed", result.reference),
        ...current,
      ])
    })
  }

  return (
    <main className="flex min-w-0 flex-col gap-3 p-4 sm:p-6">
      <header className="flex flex-col gap-4 pt-1 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">OTC Trading</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Trade large amounts privately at a firm price, without moving the
            market.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex h-9 items-center gap-2.5 border border-border bg-card px-3 text-xs">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            <span className="font-medium">Desk online</span>
            <span className="flex items-center gap-1 border-l border-border pl-2.5 text-muted-foreground">
              <HugeiconsIcon icon={Clock01Icon} size={13} />
              24/7
            </span>
          </div>
          <Button
            className="h-9 px-3"
            onClick={() =>
              document
                .getElementById("otc-activity")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            type="button"
            variant="outline"
          >
            Trade history
            <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
          </Button>
        </div>
      </header>

      <OtcOverview data={initialData} />

      <div className="grid min-w-0 items-start gap-3 xl:grid-cols-[minmax(0,1fr)_380px]">
        <OtcTradeForm
          data={initialData}
          hasQuote={state.status === "live"}
          onChange={resetQuote}
          onRequestQuote={requestQuote}
        />
        <aside className="flex min-w-0 flex-col gap-3">
          <OtcQuotePanel
            error={error}
            isConfirming={isConfirming}
            onConfirm={confirmQuote}
            onDismiss={resetQuote}
            state={state}
          />
          <OtcSteps activeStep={ACTIVE_STEP[state.status]} />
        </aside>
      </div>

      <OtcActivityTable activity={activity} />
    </main>
  )
}
