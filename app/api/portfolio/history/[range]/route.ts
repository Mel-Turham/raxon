import { getHistoryPoints } from "@/features/portfolio/api/portfolio"
import {
  PORTFOLIO_HISTORY_RANGES,
  type PortfolioHistoryRange,
} from "@/features/portfolio/constants"

const isRange = (value: string): value is PortfolioHistoryRange =>
  PORTFOLIO_HISTORY_RANGES.includes(value as PortfolioHistoryRange)

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ range: string }> }
) {
  const { range } = await params
  if (!isRange(range)) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }
  try {
    return Response.json(await getHistoryPoints(range))
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Upstream unavailable" }, { status: 502 })
  }
}
