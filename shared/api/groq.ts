import "server-only"

import { isAxiosError } from "axios"

import { serverEnvConfig } from "@/shared/config/env.server"
import { createHttpClient } from "./http"

const groq = createHttpClient(serverEnvConfig.groqApiUrl, {
  Authorization: `Bearer ${serverEnvConfig.groqApiKey ?? ""}`,
})

const CHAT_MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
]
const LIGHT_MODELS = ["openai/gpt-oss-20b", "qwen/qwen3.8-27b"]
const RETRYABLE_STATUSES = new Set([404, 429, 500, 502, 503])
const MAX_ANSWER_TOKENS = 2_500
const MAX_JSON_TOKENS = 600

const withPreferred = (models: string[]) => {
  const preferred = serverEnvConfig.groqModel
  return preferred
    ? [preferred, ...models.filter((m) => m !== preferred)]
    : models
}

export type GroqMessage = {
  role: "system" | "user" | "assistant"
  content: string
}

export class GroqUnavailableError extends Error {
  constructor(readonly retryAfterSeconds: number) {
    super("All Groq models are rate limited or unavailable")
  }
}

const retryAfterOf = (error: unknown) => {
  if (!isAxiosError(error)) return 0
  return Number(error.response?.headers["retry-after"] ?? 0)
}

const isRetryable = (error: unknown) =>
  isAxiosError(error) && RETRYABLE_STATUSES.has(error.response?.status ?? 503)

const firstAvailable = async <T>(
  models: string[],
  request: (model: string) => Promise<T>
) => {
  let retryAfter = 0
  for (const model of models) {
    try {
      return await request(model)
    } catch (error) {
      if (!isRetryable(error)) throw error
      retryAfter = Math.max(retryAfter, retryAfterOf(error))
    }
  }
  throw new GroqUnavailableError(retryAfter)
}

const reasoningOptions = (model: string, effort: "low" | "medium" | "high") =>
  model.startsWith("openai/gpt-oss")
    ? { reasoning_effort: effort }
    : { reasoning_format: "hidden" }

type Completion = { choices: { message: { content: string } }[] }

export const isGroqConfigured = () => Boolean(serverEnvConfig.groqApiKey)

export const groqJson = <T>(messages: GroqMessage[]): Promise<T> =>
  firstAvailable(LIGHT_MODELS, async (model) => {
    const { data } = await groq.post<Completion>("/chat/completions", {
      model,
      messages,
      temperature: 0,
      max_tokens: MAX_JSON_TOKENS,
      response_format: { type: "json_object" },
      ...reasoningOptions(model, "low"),
    })
    return JSON.parse(data.choices[0]?.message.content ?? "{}") as T
  })

type StreamOptions = {
  reasoningEffort?: "low" | "medium" | "high"
  signal?: AbortSignal
}

type StreamChunk = { choices: { delta: { content?: string } }[] }

const contentOf = (line: string) => {
  const payload = line.replace(/^data:\s*/, "")
  if (!line.startsWith("data:") || payload === "[DONE]") return ""
  return (JSON.parse(payload) as StreamChunk).choices[0]?.delta.content ?? ""
}

const sseToText = () => {
  let buffer = ""
  return new TransformStream<string, string>({
    transform(chunk, controller) {
      const lines = (buffer + chunk).split("\n")
      buffer = lines.pop() ?? ""
      for (const line of lines) {
        const content = contentOf(line.trim())
        if (content) controller.enqueue(content)
      }
    },
    flush(controller) {
      const content = contentOf(buffer.trim())
      if (content) controller.enqueue(content)
    },
  })
}

export const groqStream = async (
  messages: GroqMessage[],
  { reasoningEffort = "low", signal }: StreamOptions = {}
) => {
  const data = await firstAvailable(
    withPreferred(CHAT_MODELS),
    async (model) =>
      (
        await groq.post<ReadableStream<BufferSource>>(
          "/chat/completions",
          {
            model,
            messages,
            stream: true,
            temperature: 0.4,
            max_tokens: MAX_ANSWER_TOKENS,
            ...reasoningOptions(model, reasoningEffort),
          },
          { responseType: "stream", signal }
        )
      ).data
  )
  return data
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(sseToText())
    .pipeThrough(new TextEncoderStream())
}
