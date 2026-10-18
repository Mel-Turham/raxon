import { getPortfolioValues } from "@/features/dashboard/api/dashboard"
import {
  PORTFOLIO_RANGES,
  type PortfolioRange,
} from "@/features/dashboard/constants"

const isRange = (value: string): value is PortfolioRange =>
  PORTFOLIO_RANGES.includes(value as PortfolioRange)

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ range: string }> }
) {
  const { range } = await params
  if (!isRange(range)) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }
  try {
    return Response.json(await getPortfolioValues(range))
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Upstream unavailable" }, { status: 502 })
  }
}
