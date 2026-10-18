import {
  getKpis,
  getMarketLeaders,
  getTopAssets,
  getTopGainers,
  getTransactions,
} from "@/features/dashboard/api/dashboard"

const LOADERS: Record<string, () => Promise<unknown>> = {
  kpis: getKpis,
  leaders: getMarketLeaders,
  transactions: getTransactions,
  "top-assets": getTopAssets,
  "top-gainers": getTopGainers,
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ resource: string }> }
) {
  const load = LOADERS[(await params).resource]
  if (!load) return Response.json({ error: "Not found" }, { status: 404 })
  try {
    return Response.json(await load())
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Upstream unavailable" }, { status: 502 })
  }
}
