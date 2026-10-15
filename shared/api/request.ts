import "server-only"

import { connection } from "next/server"

const MOCK_LATENCY_MS = Number(
  process.env.MOCK_API_LATENCY_MS ??
    (process.env.NODE_ENV === "development" ? 800 : 0)
)

export const request = async <T>(payload: T): Promise<T> => {
  await connection()
  if (MOCK_LATENCY_MS > 0) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))
  }
  return payload
}
