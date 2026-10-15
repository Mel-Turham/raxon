import { getAnalyticsReport } from "../api/analytics"
import type { AnalyticsRange } from "../types"
import { AnalyticsView } from "./analytics-view"

export async function AnalyticsSection({ range }: { range: AnalyticsRange }) {
  const report = await getAnalyticsReport(range)

  return <AnalyticsView report={report} />
}
