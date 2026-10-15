import { getIntegrationsData } from "../api/integrations"
import { IntegrationsView } from "./integrations-view"

export async function IntegrationsSection() {
  const data = await getIntegrationsData()

  return <IntegrationsView initialData={data} />
}
