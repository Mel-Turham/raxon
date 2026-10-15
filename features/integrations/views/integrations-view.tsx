"use client"

import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { setIntegrationAiAccess } from "../actions"
import { ConnectIntegrationDialog } from "../components/connect/connect-integration-dialog"
import { IntegrationCard } from "../components/integration-card"
import {
  AnimatedGrid,
  AnimatedGridItem,
} from "@/shared/components/molecules/animated-grid"
import { IntegrationsEmpty } from "../components/integrations-empty"
import { IntegrationsNav } from "../components/integrations-nav"
import { IntegrationsToolbar } from "../components/integrations-toolbar"
import { IntegrationsTopbar } from "../components/integrations-topbar"
import { ManageIntegrationSheet } from "../components/manage-integration-sheet"
import { RequestIntegrationDialog } from "../components/request-integration-dialog"
import { INTEGRATION_TABS } from "../constants"
import {
  matchesCategory,
  matchesQuery,
  matchesTab,
} from "../helpers/integrations"
import type {
  Integration,
  IntegrationCategory,
  IntegrationsData,
  IntegrationTab,
} from "../types"

type Selection =
  { mode: "connect" | "manage"; id: string } | { mode: "request" } | null

export function IntegrationsView({
  initialData,
}: {
  initialData: IntegrationsData
}) {
  const router = useRouter()
  const [integrations, setIntegrations] = useState(initialData.integrations)
  const [tab, setTab] = useState<IntegrationTab>("All")
  const [category, setCategory] = useState<IntegrationCategory | null>(null)
  const [query, setQuery] = useState("")
  const [selection, setSelection] = useState<Selection>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const selected =
    selection && selection.mode !== "request"
      ? (integrations.find((item) => item.id === selection.id) ?? null)
      : null

  const openPanel = (next: Selection) => {
    setSelection(next)
    setIsPanelOpen(true)
  }

  const closePanel = () => setSelection(null)

  const patchIntegration = (id: string, patch: Partial<Integration>) =>
    setIntegrations((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    )

  const commitIntegration = (id: string, patch: Partial<Integration>) => {
    patchIntegration(id, patch)
    router.refresh()
  }

  const searchable = useMemo(
    () =>
      integrations.filter(
        (integration) =>
          matchesCategory(integration, category) &&
          matchesQuery(integration, query)
      ),
    [integrations, category, query]
  )

  const counts = useMemo(
    () =>
      Object.fromEntries(
        INTEGRATION_TABS.map((option) => [
          option,
          searchable.filter((integration) => matchesTab(integration, option))
            .length,
        ])
      ) as Record<IntegrationTab, number>,
    [searchable]
  )

  const visible = searchable.filter((integration) =>
    matchesTab(integration, tab)
  )

  const resetFilters = () => {
    setTab("All")
    setCategory(null)
    setQuery("")
  }

  const changeAiAccess = async (integration: Integration, enabled: boolean) => {
    patchIntegration(integration.id, { aiAccess: enabled })
    const result = await setIntegrationAiAccess({
      id: integration.id,
      enabled,
    })
    if (!result.ok) {
      patchIntegration(integration.id, { aiAccess: !enabled })
      toast.error(result.error)
      return
    }
    router.refresh()
    toast.success(
      enabled
        ? `Raxon AI can now read ${integration.name}`
        : `${integration.name} hidden from Raxon AI`
    )
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <IntegrationsTopbar trail={[{ label: "Integrations" }]} />
      <main className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 sm:p-6">
        <header className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Integrations
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect exchanges, wallets and data sources so Raxon AI works with
              your full picture.
            </p>
          </div>
          <Button
            className="h-9 self-start px-3 sm:self-auto"
            onClick={() => openPanel({ mode: "request" })}
            variant="outline"
          >
            <HugeiconsIcon icon={PlusSignIcon} />
            Request integration
          </Button>
        </header>

        <IntegrationsNav />

        <IntegrationsToolbar
          category={category}
          counts={counts}
          onCategoryChange={setCategory}
          onQueryChange={setQuery}
          onTabChange={setTab}
          query={query}
          tab={tab}
        />

        {visible.length > 0 ? (
          <AnimatedGrid
            className="grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
            label="Integrations"
          >
            {visible.map((integration) => (
              <AnimatedGridItem
                key={integration.id}
                layoutId={`integration-${integration.id}`}
              >
                <IntegrationCard
                  integration={integration}
                  onAiAccessChange={changeAiAccess}
                  onConnect={(item) =>
                    openPanel({ mode: "connect", id: item.id })
                  }
                  onManage={(item) =>
                    openPanel({ mode: "manage", id: item.id })
                  }
                />
              </AnimatedGridItem>
            ))}
          </AnimatedGrid>
        ) : (
          <IntegrationsEmpty onReset={resetFilters} />
        )}
      </main>

      {selection?.mode === "connect" && selected && (
        <ConnectIntegrationDialog
          integration={selected}
          key={selected.id}
          onClosed={closePanel}
          onConnected={(integration, result) =>
            commitIntegration(integration.id, {
              status: "connected",
              connection: result.connection,
              permissions: result.permissions,
              aiAccess: true,
            })
          }
          onOpenChange={setIsPanelOpen}
          open={isPanelOpen}
        />
      )}

      {selection?.mode === "manage" && selected && (
        <ManageIntegrationSheet
          integration={selected}
          key={selected.id}
          onAiAccessChange={changeAiAccess}
          onClosed={closePanel}
          onDisconnected={(integration) =>
            commitIntegration(integration.id, {
              status: "available",
              connection: undefined,
              aiAccess: false,
            })
          }
          onOpenChange={setIsPanelOpen}
          onReconnect={(integration) =>
            setSelection({ mode: "connect", id: integration.id })
          }
          onSynced={(integration, lastSyncAt) =>
            integration.connection &&
            patchIntegration(integration.id, {
              status: "connected",
              connection: { ...integration.connection, lastSyncAt },
            })
          }
          open={isPanelOpen}
        />
      )}

      {selection?.mode === "request" && (
        <RequestIntegrationDialog
          onClosed={closePanel}
          onOpenChange={setIsPanelOpen}
          open={isPanelOpen}
        />
      )}
    </div>
  )
}
