import "server-only"

import { AUTOMATION_CHANNEL_IDS } from "../constants"
import { isLinked, needsAttention } from "../helpers/integrations"
import { buildMockAutomations } from "../mocks/automations-data"
import type { Automation, AutomationChannel, AutomationsData } from "../types"
import { getIntegrationsData } from "./integrations"

const created = new Map<string, Automation>()
const overrides = new Map<string, Partial<Automation>>()
const deleted = new Set<string>()

export const getAutomationsData = async (): Promise<AutomationsData> => {
  const { integrations } = await getIntegrationsData()
  const isUsable = (id: string) =>
    integrations.some(
      (integration) =>
        integration.id === id &&
        isLinked(integration) &&
        !needsAttention(integration)
    )

  const channels: AutomationChannel[] = AUTOMATION_CHANNEL_IDS.flatMap((id) => {
    const integration = integrations.find((item) => item.id === id)
    return integration
      ? [
          {
            id,
            name: integration.name,
            logo: integration.logo,
            isConnected: isUsable(id),
          },
        ]
      : []
  })

  const automations = [...created.values(), ...buildMockAutomations(Date.now())]
    .filter((automation) => !deleted.has(automation.id))
    .map((automation) => ({ ...automation, ...overrides.get(automation.id) }))

  return {
    automations,
    channels,
    connectedSources: integrations
      .filter((integration) => isUsable(integration.id))
      .map((integration) => integration.id),
  }
}

export const findAutomation = async (id: string) => {
  const { automations } = await getAutomationsData()
  return automations.find((automation) => automation.id === id) ?? null
}

export const saveAutomation = (automation: Automation) => {
  created.set(automation.id, automation)
}

export const updateAutomation = (id: string, patch: Partial<Automation>) => {
  overrides.set(id, { ...overrides.get(id), ...patch })
}

export const removeAutomation = (id: string) => {
  created.delete(id)
  overrides.delete(id)
  deleted.add(id)
}
