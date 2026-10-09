import "server-only"

import {
  MOCK_FX_RATES,
  MOCK_MARKET_ASSETS,
  MOCK_NEW_LISTINGS,
} from "@/lib/api/mock-markets-data"
import { request } from "@/lib/api/request"

export const getNewListings = () => request(MOCK_NEW_LISTINGS)

export const getMarketAssets = () =>
  request({ assets: MOCK_MARKET_ASSETS, fxRates: MOCK_FX_RATES })
