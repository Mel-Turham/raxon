import { SENTIMENT_ZONES } from "../constants"

export const sentimentZone = (score: number) =>
  SENTIMENT_ZONES.find((zone) => score <= zone.max) ?? SENTIMENT_ZONES[4]
