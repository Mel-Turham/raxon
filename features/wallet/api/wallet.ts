import "server-only"

import { request } from "@/shared/api/request"
import { MOCK_WALLET_ASSETS } from "../mocks/wallet-assets"

export const getWalletAssets = () => request(MOCK_WALLET_ASSETS)
