"use client"

import { Cancel01Icon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { useEffect, useEffectEvent, useMemo, useState } from "react"

import {
  Command,
  CommandCollection,
  CommandEmpty,
  CommandGroup,
  CommandGroupHeading,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Kbd } from "@/components/ui/kbd"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"
import { isTypingTarget } from "@/shared/lib/dom"
import { PRICE_FORMAT } from "@/shared/lib/format"
import {
  SEARCH_RECENT_LIMIT,
  SEARCH_SCOPES,
  SEARCH_TRENDING_LIMIT,
} from "../constants"
import type {
  SearchAsset,
  SearchGroup,
  SearchIndex,
  SearchItem,
  SearchScope,
} from "../types"
import { AssetChange, SearchRow } from "./search-rows"
import { SearchTrigger } from "./search-trigger"

const SECTION =
  "flex flex-col gap-2.5 border-b border-foreground/10 px-4 py-3.5"
const SECTION_TITLE = "text-xs font-medium text-foreground"
const CHIP =
  "inline-flex h-8 items-center gap-1.5 border border-border px-2.5 text-xs text-foreground/85 transition-colors hover:bg-foreground/[0.04] hover:text-foreground"

const HINTS = [
  { keys: ["↑", "↓"], label: "Move" },
  { keys: ["↵"], label: "Select" },
  { keys: ["Esc"], label: "Close" },
]

const itemLabel = (item: SearchItem) => {
  switch (item.kind) {
    case "asset":
      return `${item.name} ${item.symbol}`
    case "exchange":
      return `${item.name} ${item.description}`
    case "page":
      return item.label
  }
}

export const SearchCommand = ({ index }: { index: SearchIndex }) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [scopes, setScopes] = useState<SearchScope[]>([...SEARCH_SCOPES])
  const [recent, setRecent] = useState(index.recent)

  const assetsById = useMemo(
    () => new Map(index.assets.map((asset) => [asset.id, asset])),
    [index.assets]
  )
  const recentAssets = recent.flatMap((id) => assetsById.get(id) ?? [])
  const hiddenScopes = SEARCH_SCOPES.filter((scope) => !scopes.includes(scope))

  const groups = useMemo<SearchGroup[]>(() => {
    if (!query.trim()) {
      const trending = [...index.assets]
        .sort((a, b) => b.volume - a.volume)
        .slice(0, SEARCH_TRENDING_LIMIT)
      return [{ value: "Trending crypto", items: trending }]
    }
    const byScope: Record<SearchScope, SearchItem[]> = {
      Cryptoassets: index.assets,
      Exchanges: index.exchanges,
      Pages: index.pages,
    }
    return SEARCH_SCOPES.filter((scope) => scopes.includes(scope)).map(
      (scope) => ({ value: scope, items: byScope[scope] })
    )
  }, [index, query, scopes])

  const select = (item: SearchItem) => {
    if (item.kind === "asset") {
      setRecent((current) =>
        [item.id, ...current.filter((id) => id !== item.id)].slice(
          0,
          SEARCH_RECENT_LIMIT
        )
      )
    }
    setIsOpen(false)
    router.push(item.href)
  }

  const onShortcut = useEffectEvent((event: KeyboardEvent) => {
    const isPalette =
      (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k"
    const isSlash = event.key === "/" && !isTypingTarget(event.target)
    if (!isPalette && !isSlash) return
    event.preventDefault()
    setIsOpen((current) => (isPalette ? !current : true))
  })

  useEffect(() => {
    const listener = (event: KeyboardEvent) => onShortcut(event)
    window.addEventListener("keydown", listener)
    return () => window.removeEventListener("keydown", listener)
  }, [])

  return (
    <>
      <SearchTrigger onClick={() => setIsOpen(true)} />

      <Dialog
        onOpenChange={setIsOpen}
        onOpenChangeComplete={(open) => {
          if (!open) setQuery("")
        }}
        open={isOpen}
      >
        <DialogContent className="max-w-[640px]">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <DialogDescription className="sr-only">
            Find cryptoassets, exchanges and pages.
          </DialogDescription>
          <Command
            items={groups}
            itemToStringValue={itemLabel}
            onValueChange={setQuery}
            value={query}
          >
            <CommandInput
              aria-label="Search"
              autoFocus
              placeholder="Search assets, exchanges or pages…"
              trailing={<Kbd>/</Kbd>}
            />

            <div className="min-h-0 flex-1 overflow-y-auto">
              <section className={SECTION}>
                <h2 className={SECTION_TITLE}>Search for</h2>
                <div className="flex flex-wrap gap-2">
                  {scopes.map((scope) => (
                    <span className={CHIP} key={scope}>
                      {scope}
                      <button
                        aria-label={`Remove ${scope}`}
                        className="-mr-1 flex size-5 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                        onClick={() =>
                          setScopes((current) =>
                            current.filter((item) => item !== scope)
                          )
                        }
                        type="button"
                      >
                        <HugeiconsIcon icon={Cancel01Icon} size={12} />
                      </button>
                    </span>
                  ))}
                  {hiddenScopes.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className={`${CHIP} border-dashed text-muted-foreground`}
                      >
                        <HugeiconsIcon icon={PlusSignIcon} size={12} />
                        Add filter
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-44">
                        {hiddenScopes.map((scope) => (
                          <DropdownMenuItem
                            key={scope}
                            onClick={() =>
                              setScopes((current) => [...current, scope])
                            }
                          >
                            {scope}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </section>

              {!query.trim() && recentAssets.length > 0 && (
                <section className={SECTION}>
                  <h2 className={SECTION_TITLE}>Recent searches</h2>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {recentAssets.map((asset) => (
                      <RecentCard
                        asset={asset}
                        key={asset.id}
                        onSelect={select}
                      />
                    ))}
                  </div>
                </section>
              )}

              <CommandEmpty>
                {scopes.length === 0
                  ? "Add a filter to start searching."
                  : `No results for “${query}”`}
              </CommandEmpty>
              <CommandList className="max-h-none p-1.5">
                {(group: SearchGroup) => (
                  <CommandGroup items={group.items} key={group.value}>
                    <CommandGroupHeading className="text-xs font-medium tracking-normal text-foreground normal-case">
                      {group.value}
                    </CommandGroupHeading>
                    <CommandCollection>
                      {(item: SearchItem) => (
                        <CommandItem
                          className="min-h-14 gap-3 py-2.5"
                          key={`${item.kind}-${item.id}`}
                          onClick={() => select(item)}
                          value={item}
                        >
                          <SearchRow item={item} />
                        </CommandItem>
                      )}
                    </CommandCollection>
                  </CommandGroup>
                )}
              </CommandList>
            </div>

            <DialogHints hints={HINTS} />
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}

const RecentCard = ({
  asset,
  onSelect,
}: {
  asset: SearchAsset
  onSelect: (asset: SearchAsset) => void
}) => (
  <button
    className="flex min-w-0 items-center gap-2.5 bg-foreground/[0.03] p-2.5 text-left transition-colors hover:bg-foreground/[0.06]"
    onClick={() => onSelect(asset)}
    type="button"
  >
    <TokenAvatar className="size-7" symbol={asset.symbol} />
    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
      <span className="flex items-baseline justify-between gap-1.5">
        <span className="truncate text-xs font-medium">{asset.name}</span>
        <AnimatedNumber
          className="font-mono text-xs tabular-nums"
          format={PRICE_FORMAT}
          value={asset.price}
        />
      </span>
      <span className="flex items-baseline justify-between gap-1.5">
        <span className="text-[11px] text-muted-foreground">
          {asset.symbol}
        </span>
        <AssetChange value={asset.changePercent} />
      </span>
    </span>
  </button>
)
