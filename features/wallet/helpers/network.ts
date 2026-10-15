import type { AssetNetwork } from "../types"

export const networkLabel = (network: AssetNetwork) =>
  network.standard ? `${network.name} (${network.standard})` : network.name
