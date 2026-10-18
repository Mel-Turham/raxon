import { queryOptions } from "@tanstack/react-query"

import { getJson } from "@/shared/api/http"
import { MINUTE } from "@/shared/lib/time"
import type { PortfolioHistoryRange } from "../constants"
import type { HistoryValuePoint } from "../types"

export const portfolioQueries = {
  history: (range: PortfolioHistoryRange) =>
    queryOptions({
      queryKey: ["portfolio", "history", range],
      queryFn: () =>
        getJson<HistoryValuePoint[]>(
          `/portfolio/history/${encodeURIComponent(range)}`
        ),
      refetchInterval: MINUTE,
    }),
}
