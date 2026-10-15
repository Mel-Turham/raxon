import type {
  AiSource,
  Integration,
  IntegrationCategory,
  IntegrationTab,
} from "../types"

export const isLinked = (integration: Integration) =>
  integration.connection !== undefined

export const needsAttention = (integration: Integration) =>
  integration.status === "expired"

export const isAiSource = (integration: Integration) =>
  isLinked(integration) && integration.aiAccess && !needsAttention(integration)

export const toAiSource = ({
  id,
  name,
  logo,
  category,
}: Integration): AiSource => ({ id, name, logo, category })

export const matchesTab = (integration: Integration, tab: IntegrationTab) => {
  if (tab === "Connected") return isLinked(integration)
  if (tab === "Available") return !isLinked(integration)
  return true
}

export const matchesCategory = (
  integration: Integration,
  category: IntegrationCategory | null
) => category === null || integration.category === category

export const matchesQuery = (integration: Integration, query: string) => {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return [integration.name, integration.description, integration.category]
    .join(" ")
    .toLowerCase()
    .includes(needle)
}
