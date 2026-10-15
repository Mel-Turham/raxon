import { AUTOMATION_TRIGGERS } from "../constants"
import type {
  Automation,
  AutomationChannel,
  AutomationCondition,
  AutomationTab,
  AutomationTriggerType,
} from "../types"

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const BIAS_LABELS = {
  bullish: "a bullish",
  bearish: "a bearish",
  any: "any",
} as const

export const triggerMeta = (type: AutomationTriggerType) =>
  AUTOMATION_TRIGGERS.find((trigger) => trigger.value === type) ??
  AUTOMATION_TRIGGERS[0]

export const describeCondition = (condition: AutomationCondition) => {
  switch (condition.type) {
    case "tradingview-alert":
      return "Any TradingView alert on your webhook"
    case "price-cross":
      return `${condition.asset} crosses ${condition.direction} ${USD.format(condition.price)}`
    case "portfolio-drawdown":
      return `Portfolio drops ${condition.percent}% in 24h`
    case "ai-signal":
      return `Raxon AI flags ${BIAS_LABELS[condition.bias]} signal`
    case "whale-transfer":
      return `A wallet moves more than ${USD.format(condition.amountUsd)}`
    case "daily-brief":
      return `Every day at ${condition.time}`
  }
}

export const suggestAutomationName = (condition: AutomationCondition) => {
  switch (condition.type) {
    case "tradingview-alert":
      return "TradingView alerts"
    case "price-cross":
      return `${condition.asset} ${condition.direction} ${USD.format(condition.price)}`
    case "portfolio-drawdown":
      return `Drawdown guard ${condition.percent}%`
    case "ai-signal":
      return condition.bias === "any"
        ? "AI signals"
        : `AI ${condition.bias} signals`
    case "whale-transfer":
      return "Large transfers"
    case "daily-brief":
      return `Market brief ${condition.time}`
  }
}

export const findChannel = (
  automation: Automation,
  channels: AutomationChannel[]
) => channels.find((channel) => channel.id === automation.channelId) ?? null

export const isBlocked = (
  automation: Automation,
  channels: AutomationChannel[]
) => !findChannel(automation, channels)?.isConnected

export const matchesAutomationTab = (
  automation: Automation,
  tab: AutomationTab
) => {
  if (tab === "Active") return automation.enabled
  if (tab === "Paused") return !automation.enabled
  return true
}

export const matchesAutomationQuery = (
  automation: Automation,
  query: string
) => {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return [automation.name, describeCondition(automation.condition)]
    .join(" ")
    .toLowerCase()
    .includes(needle)
}

export const defaultCondition = (
  type: AutomationTriggerType
): AutomationCondition => {
  switch (type) {
    case "tradingview-alert":
      return { type }
    case "price-cross":
      return { type, asset: "BTC", direction: "above", price: 75_000 }
    case "portfolio-drawdown":
      return { type, percent: 8 }
    case "ai-signal":
      return { type, bias: "bullish" }
    case "whale-transfer":
      return { type, amountUsd: 100_000 }
    case "daily-brief":
      return { type, time: "08:00" }
  }
}

export const isConditionValid = (condition: AutomationCondition) => {
  switch (condition.type) {
    case "price-cross":
      return condition.price > 0
    case "portfolio-drawdown":
      return condition.percent >= 1 && condition.percent <= 50
    case "whale-transfer":
      return condition.amountUsd >= 1_000
    default:
      return true
  }
}
