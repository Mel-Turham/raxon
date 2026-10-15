import { AnalyticsSummary } from "@/features/analytics/components/analytics-summary"
import { AnalyticsToolbar } from "@/features/analytics/components/analytics-toolbar"
import { AssetAllocation } from "@/features/analytics/components/asset-allocation"
import { PortfolioPerformance } from "@/features/analytics/components/portfolio-performance"
import { TopPerformingAssets } from "@/features/analytics/components/top-performing-assets"
import { TradeStatistics } from "@/features/analytics/components/trade-statistics"
import { TradingPerformance } from "@/features/analytics/components/trading-performance"
import { buildExportRows } from "@/features/analytics/helpers/export"
import type { AnalyticsReport } from "@/features/analytics/types"

type AnalyticsViewProps = {
  report: AnalyticsReport
}

export function AnalyticsView({ report }: AnalyticsViewProps) {
  return (
    <main className="flex min-w-0 flex-col gap-3 p-4 sm:p-6">
      <header className="flex flex-col gap-4 pt-1 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track portfolio performance and understand your trading activity.
          </p>
        </div>
        <AnalyticsToolbar
          exportRows={buildExportRows(report)}
          range={report.range}
        />
      </header>

      <AnalyticsSummary summary={report.summary} />

      <section
        aria-label="Portfolio and allocation"
        className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]"
      >
        <PortfolioPerformance
          performance={report.performance}
          range={report.range}
        />
        <AssetAllocation allocation={report.allocation} />
      </section>

      <section
        aria-label="Trading analysis"
        className="grid min-w-0 gap-3 xl:grid-cols-2"
      >
        <TradingPerformance breakdown={report.breakdown} />
        <TradeStatistics statistics={report.statistics} />
      </section>

      <TopPerformingAssets assets={report.assets} />
    </main>
  )
}
