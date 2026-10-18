import "server-only"

import { serverEnvConfig } from "@/shared/config/env.server"
import { createHttpClient, revalidate } from "./http"

const alternative = createHttpClient(serverEnvConfig.fearGreedApiUrl)

type RawFearGreed = { data: { value: string }[] }

export const getFearGreedHistory = async (days: number) => {
  const { data } = await alternative.get<RawFearGreed>("/fng/", {
    params: { limit: days },
    ...revalidate(3600),
  })
  return data.data.map((day) => Number(day.value))
}
