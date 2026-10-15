import "server-only"

import { request } from "@/shared/api/request"
import { isAiSource, toAiSource } from "../helpers/integrations"
import { buildMockIntegrationsData } from "../mocks/integrations-data"
import type { AiSource, Integration, IntegrationsData } from "../types"

const overrides = new Map<string, Partial<Integration>>()

export const getIntegrationsData = async (): Promise<IntegrationsData> => {
  const data = await request(buildMockIntegrationsData(Date.now()))
  return {
    integrations: data.integrations.map((integration) => ({
      ...integration,
      ...overrides.get(integration.id),
    })),
  }
}

export const saveIntegration = (id: string, patch: Partial<Integration>) => {
  overrides.set(id, { ...overrides.get(id), ...patch })
}

export const getAiSources = async (): Promise<AiSource[]> => {
  const { integrations } = await getIntegrationsData()
  return integrations.filter(isAiSource).map(toAiSource)
}
