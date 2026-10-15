import type { Metadata } from "next"
import { DashboardView } from "@/features/dashboard"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Get an overview of your portfolio and the latest market movements.",
}

export default function Page() {
  return <DashboardView />
}
