import type { BrandLogoId } from "@/shared/types"
import type { SEARCH_SCOPES } from "../constants"

export type SearchScope = (typeof SEARCH_SCOPES)[number]

export type SearchAsset = {
  kind: "asset"
  id: string
  symbol: string
  name: string
  price: number
  changePercent: number
  marketCap: number
  volume: number
  href: string
}

export type SearchExchange = {
  kind: "exchange"
  id: string
  name: string
  logo: BrandLogoId
  description: string
  href: string
}

export type SearchPage = {
  kind: "page"
  id: string
  label: string
  href: string
}

export type SearchItem = SearchAsset | SearchExchange | SearchPage

export type SearchGroup = {
  value: string
  items: SearchItem[]
}

export type SearchIndex = {
  assets: SearchAsset[]
  exchanges: SearchExchange[]
  pages: SearchPage[]
  recent: string[]
}
