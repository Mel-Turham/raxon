"use client"

import { useSuspenseQuery } from "@tanstack/react-query"

import { dashboardQueries } from "../api/queries"
import { KpiCards } from "../components/kpi-cards"
import { MarketLeaders } from "../components/market-leaders"
import { RecentTransactions } from "../components/recent-transactions"
import { TopAssets } from "../components/top-assets"
import { TopGainers } from "../components/top-gainers"

export const LiveKpiCards = () => (
  <KpiCards items={useSuspenseQuery(dashboardQueries.kpis()).data} />
)

export const LiveMarketLeaders = () => (
  <MarketLeaders data={useSuspenseQuery(dashboardQueries.leaders()).data} />
)

export const LiveRecentTransactions = () => (
  <RecentTransactions
    transactions={useSuspenseQuery(dashboardQueries.transactions()).data}
  />
)

export const LiveTopAssets = () => (
  <TopAssets assets={useSuspenseQuery(dashboardQueries.topAssets()).data} />
)

export const LiveTopGainers = ({ className }: { className?: string }) => (
  <TopGainers
    className={className}
    gainers={useSuspenseQuery(dashboardQueries.topGainers()).data}
  />
)
