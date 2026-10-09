"use client"

import { type ReactNode, useState, useTransition } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Archive02Icon,
  CheckmarkCircle02Icon,
  Csv01Icon,
  Download01Icon,
} from "@hugeicons/core-free-icons"

import {
  archiveNotification,
  replyToSupport,
  respondToRequest,
} from "@/app/actions/notifications"
import { HintTooltip } from "@/components/shared/hint-tooltip"
import { IconBadge } from "@/components/shared/icon-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NOTIFICATION_TYPES } from "@/constants"
import type { AppNotification, RequestDecision } from "@/lib/api/types"
import { downloadCsv } from "@/lib/csv"
import { cn } from "@/lib/utils"

const relativeTime = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
  style: "short",
})

const STEPS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["minute", 60],
  ["hour", 24],
  ["day", 7],
  ["week", Number.POSITIVE_INFINITY],
]

/** "2 min. ago", "3 hr. ago"… (client only: rendered inside the popover). */
const timeAgo = (iso: string) => {
  let value = (Date.parse(iso) - Date.now()) / 60_000
  for (const [unit, size] of STEPS) {
    if (Math.abs(value) < size)
      return relativeTime.format(Math.round(value), unit)
    value /= size
  }
  return ""
}

const usd = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" })

const Strong = ({ children }: { children: ReactNode }) => (
  <span className="font-medium text-foreground">{children}</span>
)

type ItemProps = {
  notification: AppNotification
  onChange: (next: AppNotification) => void
  onArchive: (id: string) => void
}

/** Decline / Accept pair, then the outcome once decided. */
const DecisionActions = ({
  notification,
  decision,
  onDecide,
  labels,
}: {
  notification: AppNotification
  decision?: RequestDecision
  onDecide: (decision: RequestDecision) => void
  labels: {
    decline: string
    accept: string
    declined: string
    approved: string
  }
}) => {
  const [isPending, startTransition] = useTransition()

  if (decision) {
    return (
      <p
        className={cn(
          "flex items-center gap-1.5 text-xs",
          decision === "approved" ? "text-success" : "text-muted-foreground"
        )}
      >
        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
        {decision === "approved" ? labels.approved : labels.declined}
      </p>
    )
  }

  const decide = (next: RequestDecision) =>
    startTransition(async () => {
      const result = await respondToRequest(notification.id, next)
      if (result.ok) onDecide(next)
    })

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="h-8 px-3.5 text-xs"
        disabled={isPending}
        onClick={() => decide("declined")}
      >
        {labels.decline}
      </Button>
      <Button
        className="h-8 px-3.5 text-xs"
        disabled={isPending}
        onClick={() => decide("approved")}
      >
        {labels.accept}
      </Button>
    </div>
  )
}

/** Quoted support message with an inline reply box. */
const SupportReply = ({ notification }: { notification: AppNotification }) => {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState("")
  const [status, setStatus] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const send = () =>
    startTransition(async () => {
      const result = await replyToSupport(notification.id, text)
      setStatus(result.ok ? "Reply sent." : result.error)
      if (result.ok) {
        setText("")
        setOpen(false)
      }
    })

  if (!open) {
    return (
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="h-8 w-fit px-3.5 text-xs"
          onClick={() => {
            setOpen(true)
            setStatus(null)
          }}
        >
          Reply
        </Button>
        {status && <span className="text-xs text-success">{status}</span>}
      </div>
    )
  }

  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        send()
      }}
    >
      <Input
        autoFocus
        aria-label="Reply to support"
        placeholder="Write a reply…"
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="h-8 flex-1 border-border bg-muted text-xs dark:bg-muted"
      />
      <Button className="h-8 px-3 text-xs" disabled={isPending} type="submit">
        Send
      </Button>
      <Button
        variant="ghost"
        className="h-8 px-2 text-xs"
        type="button"
        onClick={() => setOpen(false)}
      >
        Cancel
      </Button>
    </form>
  )
}

/** Message + optional extra block, per notification type. */
const NotificationBody = ({
  notification,
  onChange,
}: Omit<ItemProps, "onArchive">) => {
  switch (notification.type) {
    case "security_login":
      return (
        <>
          <p>
            New sign-in from <Strong>{notification.device}</Strong> ·{" "}
            {notification.location}. Was it you?
          </p>
          <DecisionActions
            decision={notification.decision}
            labels={{
              decline: "Not me",
              accept: "Yes, it's me",
              declined: "Session locked. Change your password.",
              approved: "Sign-in confirmed.",
            }}
            notification={notification}
            onDecide={(decision) => onChange({ ...notification, decision })}
          />
        </>
      )
    case "transfer_request":
      return (
        <>
          <p>
            <Strong>{notification.from}</Strong> requested{" "}
            <Strong>
              {notification.amount} {notification.asset}
            </Strong>{" "}
            from you.
          </p>
          <DecisionActions
            decision={notification.decision}
            labels={{
              decline: "Decline",
              accept: "Accept",
              declined: "Request declined.",
              approved: "Transfer sent.",
            }}
            notification={notification}
            onDecide={(decision) => onChange({ ...notification, decision })}
          />
        </>
      )
    case "order_filled":
      return (
        <p>
          Your <Strong>{notification.side}</Strong> order of{" "}
          <Strong>
            {notification.amount} {notification.asset}
          </Strong>{" "}
          was filled at <Strong>{usd(notification.price)}</Strong>.
        </p>
      )
    case "support_message":
      return (
        <>
          <p>
            <Strong>{notification.agent}</Strong> replied to your ticket.
          </p>
          <blockquote className="border-l-2 border-border pl-3 text-foreground/90">
            {notification.message}
          </blockquote>
          <SupportReply notification={notification} />
        </>
      )
    case "price_alert":
      return (
        <>
          <p>
            <Strong>{notification.asset}</Strong> crossed{" "}
            <Strong>
              {notification.direction} {usd(notification.price)}
            </Strong>
            .
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {notification.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-(--card-radius) bg-muted px-2 py-0.5 text-xs text-foreground/90"
              >
                {tag}
              </li>
            ))}
          </ul>
        </>
      )
    case "statement_ready":
      return (
        <>
          <p>
            Your <Strong>{notification.period}</Strong> statement is ready.
          </p>
          <div className="flex items-center gap-2.5 border border-border bg-foreground/[0.03] px-3 py-2">
            <HugeiconsIcon
              className="text-muted-foreground"
              icon={Csv01Icon}
              size={18}
            />
            <span className="min-w-0 flex-1 truncate text-xs text-foreground">
              {notification.fileName}
            </span>
            <span className="text-xs text-muted-foreground">
              {notification.sizeKb}KB
            </span>
            <HintTooltip label="Download">
              <button
                type="button"
                aria-label={`Download ${notification.fileName}`}
                className="text-muted-foreground transition-colors hover:text-foreground"
                onClick={() =>
                  // Mock statement until the statements API is plugged in.
                  downloadCsv(
                    notification.fileName,
                    ["Date", "Type", "Amount (USD)"],
                    [
                      ["2026-06-03", "Deposit", 1_000],
                      ["2026-06-14", "Buy BTC", -500],
                      ["2026-06-27", "Fee", -4],
                    ]
                  )
                }
              >
                <HugeiconsIcon icon={Download01Icon} size={16} />
              </button>
            </HintTooltip>
          </div>
        </>
      )
  }
}

export const NotificationItem = ({
  notification,
  onChange,
  onArchive,
}: ItemProps) => {
  const { title, icon, accent } = NOTIFICATION_TYPES[notification.type]
  const [isArchiving, startArchive] = useTransition()

  return (
    <li
      className="group/notification relative flex gap-3 border-b border-border/60 px-4 py-3.5 last:border-b-0"
      // Reading a notification marks it as read.
      onPointerDown={() =>
        !notification.read && onChange({ ...notification, read: true })
      }
    >
      <IconBadge accent={accent} icon={icon} />
      <div className="flex min-w-0 flex-1 flex-col gap-2 text-sm text-muted-foreground">
        <div className="flex items-baseline gap-2 pr-10">
          <span className="font-medium text-foreground">{title}</span>
          <time className="text-xs" dateTime={notification.createdAt}>
            {timeAgo(notification.createdAt)}
          </time>
        </div>
        <NotificationBody notification={notification} onChange={onChange} />
      </div>

      <div className="absolute top-3.5 right-4 flex items-center gap-2">
        {!notification.archived && (
          <HintTooltip label="Archive">
            <button
              type="button"
              aria-label="Archive notification"
              disabled={isArchiving}
              onClick={() =>
                startArchive(async () => {
                  const result = await archiveNotification(notification.id)
                  if (result.ok) onArchive(notification.id)
                })
              }
              className="text-muted-foreground opacity-0 transition-opacity group-hover/notification:opacity-100 hover:text-foreground focus-visible:opacity-100"
            >
              <HugeiconsIcon icon={Archive02Icon} size={15} />
            </button>
          </HintTooltip>
        )}
        {!notification.read && (
          <span
            aria-label="Unread"
            className="size-2 rounded-full bg-primary"
          />
        )}
      </div>
    </li>
  )
}
