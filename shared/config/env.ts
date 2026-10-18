import { z } from "zod"

const publicEnv = z
  .object({
    NEXT_PUBLIC_SITE_URL: z.url(),
    NEXT_PUBLIC_BINANCE_API_URL: z.url(),
    NEXT_PUBLIC_BINANCE_WS_URL: z.url(),
  })
  .parse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_BINANCE_API_URL: process.env.NEXT_PUBLIC_BINANCE_API_URL,
    NEXT_PUBLIC_BINANCE_WS_URL: process.env.NEXT_PUBLIC_BINANCE_WS_URL,
  })

export const env = {
  siteUrl: publicEnv.NEXT_PUBLIC_SITE_URL,
  binanceApiUrl: publicEnv.NEXT_PUBLIC_BINANCE_API_URL,
  binanceWsUrl: publicEnv.NEXT_PUBLIC_BINANCE_WS_URL,
}
