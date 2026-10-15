import {
  ChartLineData02Icon,
  GlobalSearchIcon,
  Idea01Icon,
  PieChart01Icon,
  Target02Icon,
  Telescope01Icon,
} from "@hugeicons/core-free-icons"

export const WELCOME_CARDS = [
  {
    icon: PieChart01Icon,
    title: "Portfolio Check-up",
    description: "Allocation, risk and rebalance ideas",
    prompt: "Analyze my portfolio and suggest a rebalance",
  },
  {
    icon: ChartLineData02Icon,
    title: "Market Pulse",
    description: "What's moving the market and why",
    prompt: "What's moving BTC today?",
  },
  {
    icon: Target02Icon,
    title: "Trade Planner",
    description: "Entry, stop-loss and targets",
    prompt: "Plan a BTC trade with entry, stop-loss and take-profit",
  },
] as const

export const AI_STRATEGIES = [
  "BTC swing trades",
  "Long-term holdings",
  "Altcoin scalps",
] as const

export const COMPOSER_TOOLS = [
  {
    id: "reason",
    icon: Idea01Icon,
    label: "Deep reasoning",
    short: "Reasoning",
    status: "Reasoning…",
  },
  {
    id: "scan",
    icon: Telescope01Icon,
    label: "Market scan",
    short: "Market scan",
    status: "Scanning the market…",
  },
  {
    id: "web",
    icon: GlobalSearchIcon,
    label: "Search news",
    short: "News",
    status: "Searching the news…",
  },
] as const

export const PROMPT_COMPLETIONS = [
  "Analyze my portfolio and suggest a rebalance",
  "What's moving BTC today?",
  "What's the market sentiment right now?",
  "Explain funding rates with an example",
  "Explain the difference between cross and isolated margin",
  "Alert me if ETH drops below 3,000",
  "Compare BTC and ETH performance this week",
  "Is it a good time to buy BTC?",
  "Plan a BTC trade with entry, stop-loss and take-profit",
  "Which asset is my riskiest?",
]

export const MAX_ATTACHMENTS = 4

export const SENTIMENT_ZONES = [
  { max: 25, label: "Extreme fear", color: "var(--destructive)" },
  { max: 45, label: "Fear", color: "var(--chart-1)" },
  { max: 55, label: "Neutral", color: "var(--muted-foreground)" },
  { max: 75, label: "Greed", color: "var(--success)" },
  { max: 100, label: "Extreme greed", color: "var(--success)" },
] as const

export const STREAM_CHARS_PER_TICK = 7
export const STREAM_TICK_MS = 28
export const REASONING_STEP_MS = 850

export const AI_CHAT_PATH = "/ai"
export const AI_INTEGRATIONS_PATH = "/ai/integrations"

export const AI_DRAFT_MAX_LENGTH = 500

export const aiPromptHref = (prompt: string) =>
  `${AI_CHAT_PATH}?prompt=${encodeURIComponent(prompt)}`

export const parseAiDraft = (value: unknown) =>
  typeof value === "string" ? value.slice(0, AI_DRAFT_MAX_LENGTH) : ""
