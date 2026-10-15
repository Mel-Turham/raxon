"use client"

import { useEffect, useRef, useState } from "react"

import type { AiSource } from "@/features/integrations"
import type { WalletAsset } from "@/features/wallet"
import {
  REASONING_STEP_MS,
  STREAM_CHARS_PER_TICK,
  STREAM_TICK_MS,
} from "../constants"
import { buildReply } from "../helpers/replies"
import { attributeSources } from "../helpers/sources"
import { totalUnits } from "../helpers/stream"
import type { ChatAttachment, ChatMessage } from "../types"

type AssistantMessage = Extract<ChatMessage, { role: "assistant" }>

export function useMockChat(assets: WalletAsset[], sources: AiSource[]) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const timers = useRef<number[]>([])

  const last = messages.at(-1)
  const isStreaming =
    last?.role === "assistant" &&
    (last.status === "thinking" || last.status === "streaming")

  const clearTimers = () => {
    for (const id of timers.current) {
      window.clearTimeout(id)
      window.clearInterval(id)
    }
    timers.current = []
  }

  useEffect(() => {
    if (!isStreaming) clearTimers()
  }, [isStreaming])

  useEffect(() => clearTimers, [])

  const patch = (
    id: string,
    update: (message: AssistantMessage) => AssistantMessage
  ) =>
    setMessages((current) =>
      current.map((message) =>
        message.id === id && message.role === "assistant"
          ? update(message)
          : message
      )
    )

  const streamAnswer = (id: string, total: number) => {
    const stream = window.setInterval(() => {
      patch(id, (message) => {
        const revealed = Math.min(
          total,
          message.revealed + STREAM_CHARS_PER_TICK
        )
        return {
          ...message,
          revealed,
          status: revealed >= total ? "done" : "streaming",
        }
      })
    }, STREAM_TICK_MS)
    timers.current.push(stream)
  }

  const send = (prompt: string, attachments: ChatAttachment[] = []) => {
    const text = prompt.trim()
    if (!text || isStreaming) return

    const id = crypto.randomUUID()
    const context = attachments.map((item) => item.symbol ?? "").join(" ")
    const { blocks, reasoning, followUps } = buildReply(
      `${text} ${context}`,
      assets
    )
    const createdAt = Date.now()

    setMessages((current) => [
      ...current,
      { id: `${id}-user`, role: "user", text, attachments, createdAt },
      {
        id,
        role: "assistant",
        createdAt,
        blocks,
        reasoning,
        stepsDone: 0,
        thoughtMs: 0,
        followUps,
        revealed: 0,
        status: "thinking",
        ...attributeSources(text, sources),
      },
    ])

    let stepsDone = 0
    const steps = window.setInterval(() => {
      stepsDone += 1
      const finished = stepsDone >= reasoning.length
      patch(id, (message) => ({
        ...message,
        stepsDone,
        ...(finished && {
          status: "streaming",
          thoughtMs: Date.now() - createdAt,
        }),
      }))
      if (!finished) return
      window.clearInterval(steps)
      streamAnswer(id, totalUnits(blocks))
    }, REASONING_STEP_MS)
    timers.current.push(steps)
  }

  const stop = () => {
    clearTimers()
    setMessages((current) =>
      current.map((message) =>
        message.role === "assistant" &&
        (message.status === "thinking" || message.status === "streaming")
          ? { ...message, status: "stopped" }
          : message
      )
    )
  }

  const reset = () => {
    clearTimers()
    setMessages([])
  }

  const load = (prompts: string[], minutesAgo = 0) => {
    clearTimers()
    const startedAt = Date.now() - minutesAgo * 60_000
    setMessages(
      prompts.flatMap<ChatMessage>((prompt, index) => {
        const { blocks, reasoning, followUps } = buildReply(prompt, assets)
        const createdAt = startedAt + index * 90_000
        const id = `${minutesAgo}-${index}`
        return [
          {
            id: `${id}-user`,
            role: "user",
            text: prompt,
            attachments: [],
            createdAt,
          },
          {
            id: `${id}-answer`,
            role: "assistant",
            createdAt: createdAt + 4_000,
            blocks,
            reasoning,
            stepsDone: reasoning.length,
            thoughtMs: reasoning.length * REASONING_STEP_MS,
            followUps,
            revealed: totalUnits(blocks),
            status: "done",
            ...attributeSources(prompt, sources),
          },
        ]
      })
    )
  }

  const regenerate = () => {
    const question = messages.at(-2)
    if (isStreaming || question?.role !== "user") return
    setMessages((current) => current.slice(0, -2))
    send(question.text, question.attachments)
  }

  const edit = (id: string, text: string) => {
    const index = messages.findIndex((message) => message.id === id)
    const original = messages[index]
    if (isStreaming || original?.role !== "user" || !text.trim()) return
    setMessages((current) => current.slice(0, index))
    send(text, original.attachments)
  }

  return { messages, isStreaming, send, stop, reset, load, regenerate, edit }
}
