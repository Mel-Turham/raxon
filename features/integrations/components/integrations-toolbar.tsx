"use client"

import { FilterHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SearchInput } from "@/shared/components/molecules/search-input"
import { SegmentedTabs } from "@/shared/components/molecules/segmented-tabs"
import {
  INTEGRATION_CATEGORIES,
  INTEGRATION_CATEGORY_LABELS,
  INTEGRATION_TABS,
} from "../constants"
import type { IntegrationCategory, IntegrationTab } from "../types"

const ALL_CATEGORIES = "all"

type IntegrationsToolbarProps = {
  tab: IntegrationTab
  counts: Record<IntegrationTab, number>
  category: IntegrationCategory | null
  query: string
  onTabChange: (tab: IntegrationTab) => void
  onCategoryChange: (category: IntegrationCategory | null) => void
  onQueryChange: (query: string) => void
}

export function IntegrationsToolbar({
  tab,
  counts,
  category,
  query,
  onTabChange,
  onCategoryChange,
  onQueryChange,
}: IntegrationsToolbarProps) {
  return (
    <div className="flex flex-col justify-between gap-3 pt-2 lg:flex-row lg:items-center">
      <SegmentedTabs
        counts={counts}
        onValueChange={onTabChange}
        options={INTEGRATION_TABS}
        value={tab}
      />
      <div className="flex flex-col gap-2 sm:flex-row">
        <SearchInput
          aria-label="Search integrations"
          className="lg:h-10"
          containerClassName="sm:w-64"
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search integrations"
          value={query}
        />
        <Select
          onValueChange={(value) =>
            onCategoryChange(
              value === ALL_CATEGORIES ? null : (value as IntegrationCategory)
            )
          }
          value={category ?? ALL_CATEGORIES}
        >
          <SelectTrigger
            aria-label="Filter by category"
            className="h-9 min-w-44 gap-2 border-border text-sm data-[size=default]:h-9 lg:data-[size=default]:h-10"
          >
            <HugeiconsIcon
              className="text-muted-foreground"
              icon={FilterHorizontalIcon}
              size={16}
            />
            <SelectValue>
              {(value: string) =>
                value === ALL_CATEGORIES
                  ? "All categories"
                  : INTEGRATION_CATEGORY_LABELS[value as IntegrationCategory]
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value={ALL_CATEGORIES}>All categories</SelectItem>
            {INTEGRATION_CATEGORIES.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
