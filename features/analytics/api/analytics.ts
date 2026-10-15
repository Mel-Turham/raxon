import "server-only"

import { cache } from "react"

import { request } from "@/shared/api/request"
import { buildAnalyticsReport } from "../helpers/report"
import { MOCK_ANALYTICS_SOURCE } from "../mocks/analytics-data"
import type { AnalyticsRange } from "../types"

const getAnalyticsSource = cache(() => request(MOCK_ANALYTICS_SOURCE))

export const getAnalyticsReport = cache(async (range: AnalyticsRange) =>
  buildAnalyticsReport(await getAnalyticsSource(), range)
)
