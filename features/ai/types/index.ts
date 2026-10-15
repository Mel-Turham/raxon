import type { AiSource } from "@/features/integrations"
export type SignalBias = "bullish" | "neutral" | "bearish"

export type MarketSentiment = {
  score: number
  history: number[]
}

export type HealthMetric = {
  label: string
  value: number
  hint: string
}

export type PortfolioHealth = {
  score: number
  metrics: HealthMetric[]
}

export type AiSignal = {
  symbol: string
  name: string
  bias: SignalBias
  confidence: number
  change: number
  horizon: string
}

export type AiConversation = {
  id: string
  title: string
  prompts: string[]
  minutesAgo: number
  archived: boolean
  pinned: boolean
  strategy: string | null
}

export type AiPlan = {
  name: string
  used: number
  limit: number
  discount: number
}

export type AiAccount = {
  uid: string
  kycLevel: number
  referralBonus: number
  language: string
}

export type AiInsights = {
  plan: AiPlan
  account: AiAccount
  sentiment: MarketSentiment
  health: PortfolioHealth
  signals: AiSignal[]
  conversations: AiConversation[]
}

export type AiAssetQuote = {
  symbol: string
  name: string
  price: number
  change: number
}

export type AiBlock =
  | { type: "text"; text: string }
  | { type: "assets"; items: AiAssetQuote[] }
  | { type: "allocation"; items: { symbol: string; share: number }[] }

export type ChatTool = "reason" | "scan" | "web"

export type ChatAttachment = {
  id: string
  kind: "image" | "file" | "asset" | "link"
  name: string
  meta: string
  url?: string
  symbol?: string
}

export type AiReply = {
  blocks: AiBlock[]
  reasoning: string[]
  followUps: string[]
}

export type ChatMessage =
  | {
      id: string
      role: "user"
      text: string
      attachments: ChatAttachment[]
      createdAt: number
    }
  | {
      id: string
      role: "assistant"
      createdAt: number
      blocks: AiBlock[]
      reasoning: string[]
      stepsDone: number
      thoughtMs: number
      followUps: string[]
      revealed: number
      status: "thinking" | "streaming" | "done" | "stopped"
      sources: AiSource[]
      nudge?: "connect-exchange"
    }
