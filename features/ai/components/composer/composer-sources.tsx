"use client"

import { PlugSocketIcon, Settings02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { AiSource } from "@/features/integrations"
import { BrandLogo } from "@/shared/components/atoms/logos/brand-logo"
import { HintTooltip } from "@/shared/components/molecules/hint-tooltip"
import { cn } from "@/shared/lib/utils"
import { AI_INTEGRATIONS_PATH } from "../../constants"

const VISIBLE_SOURCES = 3

const CHIP =
  "inline-flex h-8 shrink-0 items-center gap-2 rounded-lg border border-foreground/10 bg-foreground/[0.03] px-2.5 text-xs text-foreground/85 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"

const SOURCE_LOGO = "size-4.5 rounded-[4px] shadow-none [&_svg]:size-3.5"

type ComposerSourcesProps = {
  sources: AiSource[]
  planName: string
}

export function ComposerSources({ sources, planName }: ComposerSourcesProps) {
  const visible = sources.slice(0, VISIBLE_SOURCES)
  const hidden = sources.slice(VISIBLE_SOURCES)

  return (
    <div className="flex min-w-0 [scrollbar-width:none] items-center gap-2 overflow-x-auto px-1">
      <span className={cn(CHIP, "cursor-default hover:bg-foreground/[0.03]")}>
        <BrandLogo className={SOURCE_LOGO} logo="raxon" />
        Raxon AI
        <span className="rounded bg-primary/10 px-1 py-px font-mono text-[10px] text-primary">
          {planName}
        </span>
      </span>

      <span aria-hidden className="h-5 w-px shrink-0 bg-foreground/10" />

      {sources.length === 0 ? (
        <Link
          className={cn(CHIP, "text-muted-foreground")}
          href={AI_INTEGRATIONS_PATH}
        >
          <HugeiconsIcon icon={PlugSocketIcon} size={14} />
          Connect sources
        </Link>
      ) : (
        <>
          {visible.map((source) => (
            <HintTooltip
              key={source.id}
              label={`Raxon AI reads ${source.name}`}
              side="top"
            >
              <Link className={CHIP} href={AI_INTEGRATIONS_PATH}>
                <BrandLogo className={SOURCE_LOGO} logo={source.logo} />
                {source.name}
              </Link>
            </HintTooltip>
          ))}

          {hidden.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label={`${hidden.length} more sources`}
                className={cn(CHIP, "px-2 font-mono tabular-nums")}
              >
                +{hidden.length}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56 rounded-xl p-1.5"
                side="top"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-2.5 text-[11px] text-muted-foreground">
                    Also used by Raxon AI
                  </DropdownMenuLabel>
                  {hidden.map((source) => (
                    <DropdownMenuItem
                      className="gap-2.5 rounded-lg px-2.5 py-2 text-sm"
                      key={source.id}
                      render={<Link href={AI_INTEGRATIONS_PATH} />}
                    >
                      <BrandLogo className={SOURCE_LOGO} logo={source.logo} />
                      {source.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2.5 rounded-lg px-2.5 py-2 text-sm"
                  render={<Link href={AI_INTEGRATIONS_PATH} />}
                >
                  <HugeiconsIcon icon={Settings02Icon} size={15} />
                  Manage integrations
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </>
      )}
    </div>
  )
}
