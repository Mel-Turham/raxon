import { getAutomationsData } from "../api/automations"
import { AutomationsView } from "./automations-view"

export async function AutomationsSection() {
  const data = await getAutomationsData()

  return <AutomationsView initialData={data} />
}
