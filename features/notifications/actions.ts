"use server"

import { z } from "zod"

import type { RequestDecision } from "@/features/notifications/types"

type ActionResult = { ok: true } | { ok: false; error: string }

const idSchema = z.string().regex(/^[a-z0-9-]{1,64}$/i, "Unknown notification.")

const decisionSchema = z.enum(["approved", "declined"])

const messageSchema = z
  .string()
  .trim()
  .min(1, "Write a message first.")
  .max(1_000, "Message is too long.")

export async function respondToRequest(
  id: string,
  decision: RequestDecision
): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) {
    return { ok: false, error: "Unknown notification." }
  }
  if (!decisionSchema.safeParse(decision).success) {
    return { ok: false, error: "Unknown decision." }
  }
  return { ok: true }
}

export async function replyToSupport(
  id: string,
  message: string
): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) {
    return { ok: false, error: "Unknown notification." }
  }
  const parsed = messageSchema.safeParse(message)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid message.",
    }
  }
  return { ok: true }
}

export async function markAllNotificationsRead(): Promise<ActionResult> {
  return { ok: true }
}

export async function archiveNotification(id: string): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) {
    return { ok: false, error: "Unknown notification." }
  }
  return { ok: true }
}
