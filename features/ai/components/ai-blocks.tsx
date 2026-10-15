"use client"

import { Fragment, memo, type ReactNode } from "react"

import { Sparkline } from "@/shared/components/atoms/sparkline"
import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import { TrendBadge } from "@/shared/components/atoms/trend-badge"
import { TOKEN_BRANDS } from "@/shared/config"
import { PRICE } from "@/shared/lib/format"
import type { AiBlock } from "../types"

const PERCENT = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 0,
})

const BOLD_MARKER = "**"

const renderInline = (text: string) => {
  let offset = 0
  return text.split(BOLD_MARKER).map((part, segment) => {
    const key = `inline-${offset}`
    offset += part.length + BOLD_MARKER.length
    return segment % 2 === 1 ? (
      <strong className="font-semibold text-foreground" key={key}>
        {part}
      </strong>
    ) : (
      <Fragment key={key}>{part}</Fragment>
    )
  })
}

type Bullet = { offset: number; text: string }

const TextBlock = ({ text }: { text: string }) => {
  const nodes: ReactNode[] = []
  let bullets: Bullet[] = []
  let offset = 0

  const flush = () => {
    if (!bullets.length) return
    nodes.push(
      <ul
        className="flex flex-col gap-1.5 pl-4"
        key={`list-${bullets[0].offset}`}
      >
        {bullets.map((bullet) => (
          <li className="list-disc marker:text-primary" key={bullet.offset}>
            {renderInline(bullet.text)}
          </li>
        ))}
      </ul>
    )
    bullets = []
  }

  for (const line of text.split("\n")) {
    const lineOffset = offset
    offset += line.length + 1
    if (line.startsWith("- ")) {
      bullets.push({ offset: lineOffset, text: line.slice(2) })
      continue
    }
    flush()
    if (line) nodes.push(<p key={`p-${lineOffset}`}>{renderInline(line)}</p>)
  }
  flush()

  return <div className="flex flex-col gap-2">{nodes}</div>
}

const AssetsBlock = memo(function AssetsBlock({
  items,
}: {
  items: Extract<AiBlock, { type: "assets" }>["items"]
}) {
  return (
    <div className="flex flex-col divide-y divide-foreground/8 border border-foreground/10">
      {items.map((item) => (
        <div className="flex items-center gap-3 px-3 py-2.5" key={item.symbol}>
          <TokenAvatar className="size-7" symbol={item.symbol} />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="text-sm font-medium text-foreground">
              {item.symbol}
            </span>
            <span className="text-xs text-muted-foreground">{item.name}</span>
          </span>
          <Sparkline
            className="h-8 w-20"
            seed={item.symbol}
            trend={item.change}
          />
          <span className="flex w-24 flex-col items-end">
            <span className="font-mono text-sm text-foreground tabular-nums">
              {PRICE.format(item.price)}
            </span>
            <TrendBadge value={item.change} />
          </span>
        </div>
      ))}
    </div>
  )
})

const AllocationBlock = memo(function AllocationBlock({
  items,
}: {
  items: Extract<AiBlock, { type: "allocation" }>["items"]
}) {
  return (
    <div className="flex flex-col gap-3 border border-foreground/10 p-3">
      <div className="flex h-2 w-full gap-0.5">
        {items.map((item) => (
          <span
            className="h-full ring-1 ring-foreground/10 ring-inset"
            key={item.symbol}
            style={{
              width: `${item.share * 100}%`,
              backgroundColor:
                TOKEN_BRANDS[item.symbol]?.background ?? "var(--muted)",
            }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
        {items.map((item) => (
          <span className="flex items-center gap-1.5" key={item.symbol}>
            <span
              className="size-2 ring-1 ring-foreground/15 ring-inset"
              style={{
                backgroundColor:
                  TOKEN_BRANDS[item.symbol]?.background ?? "var(--muted)",
              }}
            />
            <span className="text-foreground">{item.symbol}</span>
            <span className="font-mono text-muted-foreground tabular-nums">
              {PERCENT.format(item.share)}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
})

export function AiBlockView({ block }: { block: AiBlock }) {
  switch (block.type) {
    case "text":
      return <TextBlock text={block.text} />
    case "assets":
      return <AssetsBlock items={block.items} />
    case "allocation":
      return <AllocationBlock items={block.items} />
  }
}
