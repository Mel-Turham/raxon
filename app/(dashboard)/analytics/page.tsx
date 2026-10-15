import type { Metadata } from "next"
import { Suspense } from "react"

import {
  AnalyticsSection,
  AnalyticsSkeleton,
  parseAnalyticsRange,
} from "@/features/analytics"

export const metadata: Metadata = {
  title: "Analytics",
  description:
    "Track portfolio performance, asset allocation, and trading results.",
}

export default async function AnalyticsPage({
  searchParams,
}: PageProps<"/analytics">) {
  const range = parseAnalyticsRange((await searchParams).range)

  return (
    <Suspense fallback={<AnalyticsSkeleton />}>
      <AnalyticsSection range={range} />
    </Suspense>
  )
}
