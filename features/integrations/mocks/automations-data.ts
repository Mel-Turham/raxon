import { DAY, HOUR, MINUTE } from "@/shared/lib/time"
import type { Automation } from "../types"

export const buildMockAutomations = (now: number): Automation[] => {
  const at = (offsetMs: number) => new Date(now - offsetMs).toISOString()

  return [
    {
      id: "auto-btc-breakout",
      name: "BTC breakout alerts",
      condition: { type: "tradingview-alert" },
      channelId: "telegram",
      enabled: true,
      runs: 14,
      lastRunAt: at(3 * HOUR),
      updatedAt: at(12 * DAY),
    },
    {
      id: "auto-eth-level",
      name: "ETH below $3,000",
      condition: {
        type: "price-cross",
        asset: "ETH",
        direction: "below",
        price: 3000,
      },
      channelId: "telegram",
      enabled: true,
      runs: 2,
      lastRunAt: at(2 * DAY),
      updatedAt: at(5 * DAY),
    },
    {
      id: "auto-morning-brief",
      name: "Morning market brief",
      condition: { type: "daily-brief", time: "08:00" },
      channelId: "telegram",
      enabled: true,
      runs: 41,
      lastRunAt: at(6 * HOUR + 20 * MINUTE),
      updatedAt: at(41 * DAY),
    },
    {
      id: "auto-drawdown",
      name: "Drawdown guard 8%",
      condition: { type: "portfolio-drawdown", percent: 8 },
      channelId: "discord",
      enabled: false,
      runs: 0,
      lastRunAt: null,
      updatedAt: at(3 * DAY),
    },
    {
      id: "auto-bearish-signals",
      name: "AI bearish signals",
      condition: { type: "ai-signal", bias: "bearish" },
      channelId: "webhooks",
      enabled: false,
      runs: 6,
      lastRunAt: at(9 * DAY),
      updatedAt: at(20 * DAY),
    },
  ]
}
