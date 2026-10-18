import "server-only"

import { z } from "zod"

const optional = z
  .string()
  .optional()
  .transform((value) => value || undefined)

const feed = z
  .string()
  .transform((value) => value.split("|"))
  .pipe(z.tuple([z.string().min(1), z.url()]))
  .transform(([source, url]) => ({ source, url }))

const serverEnv = z
  .object({
    COINGECKO_API_URL: z.url(),
    COINGECKO_API_KEY: optional,
    BINANCE_FUTURES_API_URL: z.url(),
    FEAR_GREED_API_URL: z.url(),
    NEWS_RSS_FEEDS: z
      .string()
      .transform((value) => value.split(",").map((item) => item.trim()))
      .pipe(z.array(feed).min(1)),
    GROQ_API_URL: z.url(),
    GROQ_API_KEY: optional,
    GROQ_MODEL: optional,
  })
  .parse(process.env)

export const serverEnvConfig = {
  coingeckoApiUrl: serverEnv.COINGECKO_API_URL,
  coingeckoApiKey: serverEnv.COINGECKO_API_KEY,
  binanceFuturesApiUrl: serverEnv.BINANCE_FUTURES_API_URL,
  fearGreedApiUrl: serverEnv.FEAR_GREED_API_URL,
  newsFeeds: serverEnv.NEWS_RSS_FEEDS,
  groqApiUrl: serverEnv.GROQ_API_URL,
  groqApiKey: serverEnv.GROQ_API_KEY,
  groqModel: serverEnv.GROQ_MODEL,
}
