import { getOtcDashboardData } from "../api/otc"
import { OtcView } from "./otc-view"

export async function OtcSection() {
  const data = await getOtcDashboardData()

  return <OtcView initialData={data} />
}
