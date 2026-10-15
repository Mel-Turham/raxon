import { AiMagicIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { aiPromptHref } from "@/features/ai/constants"
import { RelativeTime } from "@/shared/components/atoms/relative-time"
import { cn } from "@/shared/lib/utils"
import { sentimentLabel, sentimentTone } from "../helpers/markets"
import type { MarketNewsItem } from "../types"

const MARKET_BRIEF_PROMPT =
  "Summarize today's top crypto news and how it could affect my portfolio."

const newsPrompt = (item: MarketNewsItem) =>
  `Explain this news and its impact on ${item.symbols.join(", ")}: "${item.title}"`
import { MarketCard } from "./market-card"
import { ToneBadge } from "./tone-badge"

export const MarketNews = ({ news }: { news: MarketNewsItem[] }) => (
  <MarketCard
    action={
      <Link
        className={cn(
          buttonVariants({ size: "sm", variant: "outline" }),
          "gap-1.5 text-xs"
        )}
        href={aiPromptHref(MARKET_BRIEF_PROMPT)}
      >
        <HugeiconsIcon className="text-primary" icon={AiMagicIcon} size={14} />
        Ask Raxon AI
      </Link>
    }
    contentClassName="gap-0"
    title="Top News"
  >
    <ul className="flex flex-1 flex-col">
      {news.map((item) => (
        <li
          className="flex flex-1 flex-col justify-center gap-1 border-b border-border/60 py-2.5 first:pt-0 last:border-b-0 last:pb-0"
          key={item.id}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="line-clamp-1 text-sm font-medium">{item.title}</p>
            <ToneBadge tone={sentimentTone(item.sentiment)}>
              {Math.round(item.sentiment * 100)}
              <span className="font-normal opacity-80">
                {sentimentLabel(item.sentiment)}
              </span>
            </ToneBadge>
          </div>
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {item.excerpt}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            {item.symbols.map((symbol) => (
              <span
                className="bg-muted px-1 font-mono text-foreground/80"
                key={symbol}
              >
                {symbol}
              </span>
            ))}
            <span>{item.source}</span>
            <span aria-hidden>·</span>
            <RelativeTime value={item.publishedAt} />
            <Link
              className="ml-auto inline-flex items-center gap-1 text-foreground/70 transition-colors hover:text-primary"
              href={aiPromptHref(newsPrompt(item))}
            >
              <HugeiconsIcon icon={AiMagicIcon} size={12} />
              Ask AI
            </Link>
          </div>
        </li>
      ))}
    </ul>
  </MarketCard>
)
