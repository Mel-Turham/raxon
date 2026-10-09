import "server-only"

import { connection } from "next/server"

/**
 * Simulated network latency for the mock API, so the section skeletons are
 * visible in development. Override with MOCK_API_LATENCY_MS (0 disables).
 */
const MOCK_LATENCY_MS = Number(
  process.env.MOCK_API_LATENCY_MS ??
    (process.env.NODE_ENV === "development" ? 800 : 0)
)

/**
 * Single entry point for API data. Swap the body for the external API call
 * (e.g. `fetch(url, { next: { revalidate: 30 } })`) when it is ready.
 */
export const request = async <T>(payload: T): Promise<T> => {
  // Market data is per request: never bake it into the build.
  await connection()
  if (MOCK_LATENCY_MS > 0) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))
  }
  return payload
}
