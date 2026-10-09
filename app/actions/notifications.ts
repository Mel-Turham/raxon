"use server"

import type { RequestDecision } from "@/lib/api/types"

type ActionResult = { ok: true } | { ok: false; error: string }

const isId = (id: unknown): id is string =>
  typeof id === "string" && /^[a-z0-9-]{1,64}$/i.test(id)

export async function respondToRequest(
  id: string,
  decision: RequestDecision
): Promise<ActionResult> {
  if (!isId(id)) return { ok: false, error: "Unknown notification." }
  if (decision !== "approved" && decision !== "declined") {
    return { ok: false, error: "Unknown decision." }
  }
  return { ok: true }
}

export async function replyToSupport(
  id: string,
  message: string
): Promise<ActionResult> {
  if (!isId(id)) return { ok: false, error: "Unknown notification." }
  const text = message.trim()
  if (!text) return { ok: false, error: "Write a message first." }
  if (text.length > 1_000) return { ok: false, error: "Message is too long." }
  return { ok: true }
}

export async function markAllNotificationsRead(): Promise<ActionResult> {
  return { ok: true }
}

export async function archiveNotification(id: string): Promise<ActionResult> {
  if (!isId(id)) return { ok: false, error: "Unknown notification." }
  return { ok: true }
}
