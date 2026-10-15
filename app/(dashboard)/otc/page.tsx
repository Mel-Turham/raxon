import type { Metadata } from "next"
import { Suspense } from "react"

import { OtcSection, OtcSkeleton } from "@/features/otc"

export const metadata: Metadata = {
  title: "OTC Trading",
  description:
    "Request indicative quotes and manage over-the-counter crypto trades.",
}

export default function OtcPage() {
  return (
    <Suspense fallback={<OtcSkeleton />}>
      <OtcSection />
    </Suspense>
  )
}
