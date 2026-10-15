"use client"

import { FlashIcon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { IconTile } from "@/shared/components/atoms/icon-tile"
import {
  AnimatedGrid,
  AnimatedGridItem,
} from "@/shared/components/molecules/animated-grid"
import { SearchInput } from "@/shared/components/molecules/search-input"
import { SegmentedTabs } from "@/shared/components/molecules/segmented-tabs"
import {
  deleteAutomation,
  setAutomationEnabled,
  testAutomation,
} from "../actions"
import { AutomationCard } from "../components/automations/automation-card"
import { CreateAutomationDialog } from "../components/automations/create-automation-dialog"
import { IntegrationsNav } from "../components/integrations-nav"
import { IntegrationsTopbar } from "../components/integrations-topbar"
import { AUTOMATION_TABS } from "../constants"
import {
  findChannel,
  matchesAutomationQuery,
  matchesAutomationTab,
} from "../helpers/automations"
import type { Automation, AutomationsData, AutomationTab } from "../types"

export function AutomationsView({
  initialData,
}: {
  initialData: AutomationsData
}) {
  const [automations, setAutomations] = useState(initialData.automations)
  const [tab, setTab] = useState<AutomationTab>("All")
  const [query, setQuery] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [createKey, setCreateKey] = useState(0)
  const { channels, connectedSources } = initialData

  const searchable = useMemo(
    () =>
      automations.filter((automation) =>
        matchesAutomationQuery(automation, query)
      ),
    [automations, query]
  )

  const counts = useMemo(
    () =>
      Object.fromEntries(
        AUTOMATION_TABS.map((option) => [
          option,
          searchable.filter((automation) =>
            matchesAutomationTab(automation, option)
          ).length,
        ])
      ) as Record<AutomationTab, number>,
    [searchable]
  )

  const visible = searchable.filter((automation) =>
    matchesAutomationTab(automation, tab)
  )

  const patchAutomation = (id: string, patch: Partial<Automation>) =>
    setAutomations((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    )

  const toggle = async (automation: Automation, enabled: boolean) => {
    patchAutomation(automation.id, { enabled })
    const result = await setAutomationEnabled({ id: automation.id, enabled })
    if (!result.ok) {
      patchAutomation(automation.id, { enabled: !enabled })
      toast.error(result.error)
      return
    }
    patchAutomation(automation.id, { updatedAt: new Date().toISOString() })
    toast.success(
      enabled ? `${automation.name} resumed` : `${automation.name} paused`
    )
  }

  const test = async (automation: Automation) => {
    const result = await testAutomation({ id: automation.id })
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success(`Test sent to ${result.channel}`, {
      description: automation.name,
    })
  }

  const remove = async (automation: Automation) => {
    const result = await deleteAutomation({ id: automation.id })
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    setAutomations((current) =>
      current.filter((item) => item.id !== automation.id)
    )
    toast.success("Automation deleted", { description: automation.name })
  }

  const openCreate = () => {
    setCreateKey((current) => current + 1)
    setIsCreating(true)
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <IntegrationsTopbar
        trail={[
          { label: "Integrations", href: "/ai/integrations" },
          { label: "Automations" },
        ]}
      />
      <main className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 sm:p-6">
        <header className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Automations
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Turn alerts and AI signals into messages on the channels you use.
            </p>
          </div>
          <Button
            className="h-9 self-start px-3 sm:self-auto"
            onClick={openCreate}
          >
            <HugeiconsIcon icon={PlusSignIcon} />
            New automation
          </Button>
        </header>

        <IntegrationsNav />

        <div className="flex flex-col justify-between gap-3 pt-2 lg:flex-row lg:items-center">
          <SegmentedTabs
            counts={counts}
            onValueChange={setTab}
            options={AUTOMATION_TABS}
            value={tab}
          />
          <SearchInput
            aria-label="Search automations"
            className="lg:h-10"
            containerClassName="sm:w-64"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search automations"
            value={query}
          />
        </div>

        {visible.length > 0 ? (
          <AnimatedGrid
            className="grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
            label="Automations"
          >
            {visible.map((automation) => (
              <AnimatedGridItem
                key={automation.id}
                layoutId={`automation-${automation.id}`}
              >
                <AutomationCard
                  automation={automation}
                  channel={findChannel(automation, channels)}
                  onDelete={remove}
                  onTest={test}
                  onToggle={toggle}
                />
              </AnimatedGridItem>
            ))}
          </AnimatedGrid>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-border px-6 py-16 text-center">
            <IconTile icon={FlashIcon} />
            <div className="space-y-1">
              <p className="text-sm font-medium">No automations here</p>
              <p className="text-xs text-muted-foreground">
                Send price alerts, AI signals or a daily brief to Telegram,
                Discord or Slack.
              </p>
            </div>
            <Button onClick={openCreate} size="sm" variant="outline">
              New automation
            </Button>
          </div>
        )}
      </main>

      <CreateAutomationDialog
        channels={channels}
        connectedSources={connectedSources}
        key={createKey}
        onCreated={(automation) =>
          setAutomations((current) => [automation, ...current])
        }
        onOpenChange={setIsCreating}
        open={isCreating}
      />
    </div>
  )
}
