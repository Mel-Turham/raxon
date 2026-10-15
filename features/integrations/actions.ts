"use server"

import { randomBytes } from "node:crypto"

import { z } from "zod"

import { CURRENT_USER } from "@/shared/config"
import { shortenAddress } from "@/shared/lib/format"
import {
  findAutomation,
  getAutomationsData,
  removeAutomation,
  saveAutomation,
  updateAutomation,
} from "./api/automations"
import { getIntegrationsData, saveIntegration } from "./api/integrations"
import {
  AUTOMATION_ASSETS,
  AUTOMATION_BRIEF_TIMES,
  AUTOMATION_CHANNEL_IDS,
  AUTOMATION_NAME_MAX,
  AUTOMATION_SIGNAL_BIASES,
  INTEGRATION_CATEGORIES,
  REQUEST_NOTE_MAX,
} from "./constants"
import { triggerMeta } from "./helpers/automations"
import {
  detectAddressNetwork,
  maskSecret,
  validateApiCredential,
  validateWalletAddress,
} from "./helpers/credentials"
import type {
  Automation,
  AutomationDraft,
  ConnectIntegrationResult,
  Integration,
  IntegrationConnection,
  IntegrationCredentials,
  IntegrationPermission,
  IntegrationRequest,
} from "./types"

type ActionResult<T = object> =
  ({ ok: true } & T) | { ok: false; error: string }

const idSchema = z.string().regex(/^[a-z0-9-]{1,40}$/)
const automationIdSchema = z.string().regex(/^auto-[a-z0-9-]{1,40}$/)

const credentialsSchema = z.discriminatedUnion("method", [
  z.object({
    method: z.literal("api-key"),
    apiKey: z.string().trim(),
    apiSecret: z.string().trim(),
    allowTrading: z.boolean(),
    withdrawalsDisabled: z.boolean(),
  }),
  z.object({ method: z.literal("address"), address: z.string().trim() }),
  z.object({ method: z.literal("oauth") }),
  z.object({ method: z.literal("webhook") }),
])

const findIntegration = async (id: string) => {
  const { integrations } = await getIntegrationsData()
  return integrations.find((integration) => integration.id === id) ?? null
}

type LinkedIntegration = Integration & { connection: IntegrationConnection }

const findLinkedIntegration = async (
  id: string
): Promise<LinkedIntegration | null> => {
  const integration = await findIntegration(id)
  return integration?.connection
    ? { ...integration, connection: integration.connection }
    : null
}

const credentialError = (credentials: IntegrationCredentials) => {
  if (credentials.method === "api-key") {
    if (!credentials.withdrawalsDisabled) {
      return "Disable withdrawals on this API key before connecting."
    }
    return (
      validateApiCredential(credentials.apiKey, "API key") ??
      validateApiCredential(credentials.apiSecret, "API secret")
    )
  }
  if (credentials.method === "address") {
    return validateWalletAddress(credentials.address)
  }
  return null
}

const accountLabel = (credentials: IntegrationCredentials) => {
  switch (credentials.method) {
    case "api-key":
      return `API ${maskSecret(credentials.apiKey)}`
    case "address":
      return `${shortenAddress(credentials.address)} · ${detectAddressNetwork(credentials.address)}`
    case "oauth":
      return CURRENT_USER.email
    case "webhook":
      return "Signed webhook"
  }
}

export async function connectIntegration(input: {
  id: string
  credentials: IntegrationCredentials
}): Promise<ConnectIntegrationResult> {
  const id = idSchema.safeParse(input.id)
  const parsed = credentialsSchema.safeParse(input.credentials)
  if (!id.success || !parsed.success) {
    return { ok: false, error: "Invalid connection request." }
  }

  const integration = await findIntegration(id.data)
  if (!integration || integration.status === "coming-soon") {
    return { ok: false, error: "This integration is not available yet." }
  }

  const credentials = parsed.data
  if (credentials.method !== integration.auth) {
    return { ok: false, error: `${integration.name} uses another method.` }
  }

  const error = credentialError(credentials)
  if (error) return { ok: false, error }

  const permissions: IntegrationPermission[] =
    credentials.method === "api-key" &&
    credentials.allowTrading &&
    integration.permissions.includes("trade")
      ? ["read", "trade"]
      : ["read"]

  const now = new Date().toISOString()
  const connection = {
    account: accountLabel(credentials),
    connectedAt: now,
    lastSyncAt: now,
  }
  saveIntegration(integration.id, {
    status: "connected",
    connection,
    permissions,
    aiAccess: true,
  })

  return {
    ok: true,
    permissions,
    connection,
    webhook:
      credentials.method === "webhook"
        ? {
            url: `https://hooks.raxon.io/v1/${integration.id}/${randomBytes(6).toString("hex")}`,
            secret: `whsec_${randomBytes(18).toString("base64url")}`,
          }
        : undefined,
  }
}

export async function setIntegrationAiAccess(input: {
  id: string
  enabled: boolean
}): Promise<ActionResult> {
  const id = idSchema.safeParse(input.id)
  if (!id.success || typeof input.enabled !== "boolean") {
    return { ok: false, error: "Invalid request." }
  }
  if (!(await findLinkedIntegration(id.data))) {
    return { ok: false, error: "Connect this integration first." }
  }
  saveIntegration(id.data, { aiAccess: input.enabled })
  return { ok: true }
}

export async function syncIntegration(input: {
  id: string
}): Promise<ActionResult<{ lastSyncAt: string }>> {
  const id = idSchema.safeParse(input.id)
  if (!id.success) return { ok: false, error: "Invalid request." }

  const integration = await findLinkedIntegration(id.data)
  if (!integration) return { ok: false, error: "Integration not connected." }
  if (integration.status === "expired") {
    return { ok: false, error: "Reconnect to refresh your API key first." }
  }
  const lastSyncAt = new Date().toISOString()
  saveIntegration(integration.id, {
    status: "connected",
    connection: { ...integration.connection, lastSyncAt },
  })
  return { ok: true, lastSyncAt }
}

export async function disconnectIntegration(input: {
  id: string
}): Promise<ActionResult> {
  const id = idSchema.safeParse(input.id)
  if (!id.success) return { ok: false, error: "Invalid request." }
  if (!(await findLinkedIntegration(id.data))) {
    return { ok: false, error: "Integration not connected." }
  }
  saveIntegration(id.data, {
    status: "available",
    connection: undefined,
    aiAccess: false,
  })
  return { ok: true }
}

const requestSchema = z.object({
  name: z.string().trim().min(2).max(60),
  category: z.enum(
    INTEGRATION_CATEGORIES.map(({ value }) => value) as [
      IntegrationRequest["category"],
      ...IntegrationRequest["category"][],
    ]
  ),
  note: z.string().trim().max(REQUEST_NOTE_MAX),
})

export async function requestIntegration(
  input: IntegrationRequest
): Promise<ActionResult<{ reference: string }>> {
  const parsed = requestSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: "Tell us the tool name and its category." }
  }
  return {
    ok: true,
    reference: `REQ-${randomBytes(3).toString("hex").toUpperCase()}`,
  }
}

const automationConditionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("tradingview-alert") }),
  z.object({
    type: z.literal("price-cross"),
    asset: z.enum(AUTOMATION_ASSETS),
    direction: z.enum(["above", "below"]),
    price: z.number().finite().positive().max(10_000_000),
  }),
  z.object({
    type: z.literal("portfolio-drawdown"),
    percent: z.number().int().min(1).max(50),
  }),
  z.object({
    type: z.literal("ai-signal"),
    bias: z.enum(AUTOMATION_SIGNAL_BIASES),
  }),
  z.object({
    type: z.literal("whale-transfer"),
    amountUsd: z.number().finite().min(1_000).max(100_000_000),
  }),
  z.object({
    type: z.literal("daily-brief"),
    time: z.enum(AUTOMATION_BRIEF_TIMES),
  }),
])

const automationDraftSchema = z.object({
  name: z.string().trim().min(2).max(AUTOMATION_NAME_MAX),
  condition: automationConditionSchema,
  channelId: z.enum(AUTOMATION_CHANNEL_IDS),
})

const channelError = async (channelId: string) => {
  const { channels } = await getAutomationsData()
  const channel = channels.find((item) => item.id === channelId)
  if (!channel) return "Unknown channel."
  return channel.isConnected ? null : `Connect ${channel.name} first.`
}

export async function createAutomation(
  input: AutomationDraft
): Promise<ActionResult<{ automation: Automation }>> {
  const parsed = automationDraftSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: "Check the automation settings." }
  }

  const { name, condition, channelId } = parsed.data
  const blocked = await channelError(channelId)
  if (blocked) return { ok: false, error: blocked }

  const trigger = triggerMeta(condition.type)
  if ("requires" in trigger) {
    const { connectedSources } = await getAutomationsData()
    if (!connectedSources.includes(trigger.requires)) {
      return {
        ok: false,
        error: `Connect ${trigger.label.split(" ")[0]} first.`,
      }
    }
  }

  const now = new Date().toISOString()
  const automation: Automation = {
    id: `auto-${randomBytes(4).toString("hex")}`,
    name,
    condition,
    channelId,
    enabled: true,
    runs: 0,
    lastRunAt: null,
    updatedAt: now,
  }
  saveAutomation(automation)
  return { ok: true, automation }
}

export async function setAutomationEnabled(input: {
  id: string
  enabled: boolean
}): Promise<ActionResult> {
  const id = automationIdSchema.safeParse(input.id)
  if (!id.success || typeof input.enabled !== "boolean") {
    return { ok: false, error: "Invalid request." }
  }
  const automation = await findAutomation(id.data)
  if (!automation) return { ok: false, error: "Automation not found." }
  if (input.enabled) {
    const blocked = await channelError(automation.channelId)
    if (blocked) return { ok: false, error: blocked }
  }
  updateAutomation(id.data, {
    enabled: input.enabled,
    updatedAt: new Date().toISOString(),
  })
  return { ok: true }
}

export async function deleteAutomation(input: {
  id: string
}): Promise<ActionResult> {
  const id = automationIdSchema.safeParse(input.id)
  if (!id.success) return { ok: false, error: "Invalid request." }
  if (!(await findAutomation(id.data))) {
    return { ok: false, error: "Automation not found." }
  }
  removeAutomation(id.data)
  return { ok: true }
}

export async function testAutomation(input: {
  id: string
}): Promise<ActionResult<{ channel: string }>> {
  const id = automationIdSchema.safeParse(input.id)
  if (!id.success) return { ok: false, error: "Invalid request." }
  const automation = await findAutomation(id.data)
  if (!automation) return { ok: false, error: "Automation not found." }

  const { channels } = await getAutomationsData()
  const channel = channels.find((item) => item.id === automation.channelId)
  if (!channel?.isConnected) {
    return {
      ok: false,
      error: `Connect ${channel?.name ?? "a channel"} first.`,
    }
  }
  return { ok: true, channel: channel.name }
}
