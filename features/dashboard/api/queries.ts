import { queryOptions } from "@tanstack/react-query"

import { getJson } from "@/shared/api/http"
import { MINUTE } from "@/shared/lib/time"
import type { PortfolioRange } from "../constants"
import type { ValuePoint } from "../helpers/portfolio-series"
import type {
  Kpi,
  MarketLeadersByPeriod,
  TopAsset,
  TopGainer,
  Transaction,
} from "../types"

const dashboardQuery = <T>(resource: string) =>
  queryOptions({
    queryKey: ["dashboard", resource],
    queryFn: () => getJson<T>(`/dashboard/${resource}`),
    refetchInterval: MINUTE,
  })

export const dashboardQueries = {
  portfolio: (range: PortfolioRange) =>
    queryOptions({
      queryKey: ["dashboard", "portfolio", range],
      queryFn: () => getJson<ValuePoint[]>(`/dashboard/portfolio/${range}`),
      refetchInterval: MINUTE,
    }),
  kpis: () => dashboardQuery<Kpi[]>("kpis"),
  leaders: () => dashboardQuery<MarketLeadersByPeriod>("leaders"),
  transactions: () => dashboardQuery<Transaction[]>("transactions"),
  topAssets: () => dashboardQuery<TopAsset[]>("top-assets"),
  topGainers: () => dashboardQuery<TopGainer[]>("top-gainers"),
}
