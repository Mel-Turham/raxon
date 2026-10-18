"use client"

import { isAxiosError } from "axios"
import { useEffect, useRef, useState } from "react"

import { toast } from "@/components/ui/toast"
import type { AiSource } from "@/features/integrations"
import { apiClient } from "@/shared/api/http"
import { COMPOSER_TOOLS } from "../constants"
import { attributeSources } from "../helpers/sources"
import type { ChatAttachment, ChatMessage, ChatTool } from "../types"

type AssistantMessage = Extract<ChatMessage, { role: "assistant" }>

const reasoningSteps = (tools: ChatTool[]) => [
  "Reading live market data",
  "Reviewing your portfolio",
  ...COMPOSER_TOOLS.filter(({ id }) => tools.includes(id)).map(({ status }) =>
    status.replace("…", "")
  ),
  "Writing the answer",
]

const withAttachments = (text: string, attachments: ChatAttachment[]) =>
  attachments.length
    ? `${text}\n\nAttached: ${attachments.map((item) => item.symbol ?? item.name).join(", ")}`
    : text

const toGroqMessages = (messages: ChatMessage[]) =>
  messages
    .filter((message) => message.role === "user" || message.status === "done")
    .map((message) => ({
      role: message.role,
      content:
        message.role === "user"
          ? withAttachments(message.text, message.attachments)
          : message.text,
    }))

export function useChat(sources: AiSource[]) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const controller = useRef<AbortController | null>(null)

  const last = messages.at(-1)
  const isStreaming =
    last?.role === "assistant" &&
    (last.status === "thinking" || last.status === "streaming")

  useEffect(() => () => controller.current?.abort(), [])

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

  const append = (id: string, chunk: string, startedAt: number) =>
    patch(id, (message) => {
      const isFirst = message.status === "thinking"
      return {
        ...message,
        text: message.text + chunk,
        status: "streaming",
        stepsDone: message.reasoning.length,
        thoughtMs: isFirst ? Date.now() - startedAt : message.thoughtMs,
      }
    })

  const ask = async (
    history: ChatMessage[],
    question: Extract<ChatMessage, { role: "user" }>,
    tools: ChatTool[]
  ) => {
    const id = crypto.randomUUID()
    const startedAt = Date.now()
    const abort = new AbortController()
    controller.current = abort

    setMessages([
      ...history,
      question,
      {
        id,
        role: "assistant",
        createdAt: startedAt,
        text: "",
        reasoning: reasoningSteps(tools),
        stepsDone: 0,
        thoughtMs: 0,
        status: "thinking",
        ...attributeSources(question.text, sources),
      },
    ])

    try {
      const { data } = await apiClient.post<ReadableStream<BufferSource>>(
        "/ai/chat",
        { messages: toGroqMessages([...history, question]), tools },
        { responseType: "stream", signal: abort.signal }
      )
      const reader = data.pipeThrough(new TextDecoderStream()).getReader()
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        append(id, value, startedAt)
      }
      patch(id, (message) => ({ ...message, status: "done" }))
    } catch (error) {
      if (abort.signal.aborted) return
      patch(id, (message) => ({ ...message, status: "stopped" }))
      const retryAfter = Number(
        isAxiosError(error) && error.response?.status === 429
          ? (error.response.headers["retry-after"] ?? 60)
          : 0
      )
      toast.error(retryAfter ? "Raxon AI is busy" : "Raxon AI is unavailable", {
        description: retryAfter
          ? `The free AI quota is used up for now. Try again in about ${Math.ceil(retryAfter / 60)} min.`
          : "Something went wrong. Please try again.",
      })
    }
  }

  const send = (
    prompt: string,
    attachments: ChatAttachment[] = [],
    tools: ChatTool[] = []
  ) => {
    const text = prompt.trim()
    if (!text || isStreaming) return
    ask(
      messages,
      {
        id: crypto.randomUUID(),
        role: "user",
        text,
        attachments,
        createdAt: Date.now(),
      },
      tools
    )
  }

  const stop = () => {
    controller.current?.abort()
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
    controller.current?.abort()
    setMessages([])
  }

  const load = (saved: ChatMessage[]) => {
    controller.current?.abort()
    setMessages(saved)
  }

  const regenerate = () => {
    const question = messages.at(-2)
    if (isStreaming || question?.role !== "user") return
    ask(messages.slice(0, -2), question, [])
  }

  const edit = (id: string, text: string) => {
    const index = messages.findIndex((message) => message.id === id)
    const original = messages[index]
    if (isStreaming || original?.role !== "user" || !text.trim()) return
    ask(messages.slice(0, index), { ...original, text: text.trim() }, [])
  }

  return { messages, isStreaming, send, stop, reset, load, regenerate, edit }
}
