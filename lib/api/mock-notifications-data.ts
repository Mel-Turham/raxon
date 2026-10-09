import type { AppNotification } from "@/lib/api/types"
import { MINUTE } from "@/lib/time"

// Temporary payloads until the external API is plugged in. Dates are made
// relative to the request so "x mins ago" stays meaningful.

// Distributive: keeps each notification variant's own fields.
type DraftOf<T> = T extends unknown
  ? Omit<T, "createdAt"> & { minutesAgo: number }
  : never

type Draft = DraftOf<AppNotification>

const DRAFTS = [
  {
    id: "n1",
    type: "security_login",
    device: "Chrome on Windows",
    location: "Paris, FR",
    read: false,
    archived: false,
    minutesAgo: 2,
  },
  {
    id: "n2",
    type: "order_filled",
    side: "buy",
    amount: 0.25,
    asset: "BTC",
    price: 43_324.03,
    read: false,
    archived: false,
    minutesAgo: 6,
  },
  {
    id: "n3",
    type: "support_message",
    agent: "Sarah · Raxon Support",
    message:
      "Your withdrawal limit has been raised to $50,000 per day. Let me know if you need anything else.",
    read: false,
    archived: false,
    minutesAgo: 14,
  },
  {
    id: "n4",
    type: "price_alert",
    asset: "BTC",
    price: 105_000,
    direction: "above",
    tags: ["#BTC", "#PriceAlert", "#Breakout"],
    read: true,
    archived: false,
    minutesAgo: 38,
  },
  {
    id: "n5",
    type: "statement_ready",
    period: "June 2026",
    fileName: "raxon-statement-june-2026.csv",
    sizeKb: 60,
    read: true,
    archived: false,
    minutesAgo: 95,
  },
  {
    id: "n6",
    type: "transfer_request",
    from: "Alex Martin",
    amount: 0.5,
    asset: "ETH",
    read: true,
    archived: false,
    minutesAgo: 180,
  },
  {
    id: "n7",
    type: "order_filled",
    side: "sell",
    amount: 12,
    asset: "SOL",
    price: 145.67,
    read: true,
    archived: true,
    minutesAgo: 1_440,
  },
  {
    id: "n8",
    type: "price_alert",
    asset: "ETH",
    price: 3_000,
    direction: "below",
    tags: ["#ETH", "#PriceAlert"],
    read: true,
    archived: true,
    minutesAgo: 2_880,
  },
] satisfies Draft[]

export const buildMockNotifications = (now: number): AppNotification[] =>
  DRAFTS.map(({ minutesAgo, ...notification }) => ({
    ...notification,
    createdAt: new Date(now - minutesAgo * MINUTE).toISOString(),
  })) as AppNotification[]
