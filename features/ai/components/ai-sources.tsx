import { ArrowRight01Icon, PlugSocketIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

import type { AiSource } from "@/features/integrations"
import { BrandLogo } from "@/shared/components/atoms/logos/brand-logo"
import { AI_INTEGRATIONS_PATH } from "../constants"

export function ConnectExchangeBanner({ sources }: { sources: AiSource[] }) {
  if (sources.some(({ category }) => category === "exchanges")) return null

  return (
    <Link
      className="group flex w-full max-w-3xl items-center gap-3 border border-primary/25 bg-primary/5 px-3 py-2.5 text-xs transition-colors hover:bg-primary/10"
      href={AI_INTEGRATIONS_PATH}
    >
      <HugeiconsIcon className="text-primary" icon={PlugSocketIcon} size={16} />
      <span className="min-w-0 flex-1 truncate">
        <span className="font-medium text-foreground">Connect an exchange</span>{" "}
        so I can analyse your trades and P&L
      </span>
      <span className="flex shrink-0 items-center gap-1 text-primary">
        Connect
        <HugeiconsIcon
          className="transition-transform group-hover:translate-x-0.5"
          icon={ArrowRight01Icon}
          size={13}
        />
      </span>
    </Link>
  )
}

export function MessageSources({
  sources,
  nudge,
}: {
  sources: AiSource[]
  nudge?: "connect-exchange"
}) {
  if (!sources.length && !nudge) return null

  return (
    <div className="flex flex-col gap-2">
      {sources.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
          <span>Based on</span>
          {sources.map((source) => (
            <span
              className="inline-flex h-6 items-center gap-1.5 border border-border pr-2 pl-1 text-foreground/80"
              key={source.id}
            >
              <BrandLogo
                className="size-4 shadow-none [&_svg]:size-3"
                logo={source.logo}
              />
              {source.name}
            </span>
          ))}
        </div>
      )}
      {nudge === "connect-exchange" && (
        <Link
          className="group flex w-fit items-center gap-2 border border-primary/25 bg-primary/5 px-2.5 py-1.5 text-xs transition-colors hover:bg-primary/10"
          href={AI_INTEGRATIONS_PATH}
        >
          <HugeiconsIcon
            className="text-primary"
            icon={PlugSocketIcon}
            size={14}
          />
          Connect an exchange for trade-level answers
          <HugeiconsIcon
            className="text-primary transition-transform group-hover:translate-x-0.5"
            icon={ArrowRight01Icon}
            size={13}
          />
        </Link>
      )}
    </div>
  )
}
