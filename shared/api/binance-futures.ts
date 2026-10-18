import "server-only"

import { serverEnvConfig } from "@/shared/config/env.server"
import { createHttpClient } from "./http"

const futures = createHttpClient(serverEnvConfig.binanceFuturesApiUrl)

export const binanceFuturesGet = async <T>(
  path: string,
  params?: Record<string, string | number>
) => (await futures.get<T>(path, { params })).data
