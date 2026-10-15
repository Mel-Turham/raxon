import type { AiSource, IntegrationCategory } from "@/features/integrations"

type SourceTopic = {
  pattern: RegExp
  categories: IntegrationCategory[]
  needsExchange?: boolean
}

const SOURCE_TOPICS: SourceTopic[] = [
  {
    pattern:
      /portfolio|rebalanc|risk|allocat|holding|p&?l|trade|position|perform|exposure|balance|dca|tax/,
    categories: ["exchanges", "wallets", "tax"],
    needsExchange: true,
  },
  {
    pattern: /sentiment|market|news|trend|funding|signal|compare|on-?chain/,
    categories: ["market-data", "news"],
  },
  { pattern: /alert|notify|brief/, categories: ["alerts"] },
]

export type SourceAttribution = {
  sources: AiSource[]
  nudge?: "connect-exchange"
}

export const attributeSources = (
  prompt: string,
  sources: AiSource[]
): SourceAttribution => {
  const text = prompt.toLowerCase()
  const topics = SOURCE_TOPICS.filter(({ pattern }) => pattern.test(text))
  const categories = new Set(topics.flatMap(({ categories }) => categories))
  const hasExchange = sources.some(({ category }) => category === "exchanges")

  return {
    sources: sources.filter(({ category }) => categories.has(category)),
    nudge:
      topics.some(({ needsExchange }) => needsExchange) && !hasExchange
        ? "connect-exchange"
        : undefined,
  }
}
