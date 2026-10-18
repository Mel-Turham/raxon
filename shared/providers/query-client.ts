import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
} from "@tanstack/react-query"
import { cache } from "react"

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  })

let browserQueryClient: QueryClient | undefined

const getServerQueryClient = cache(makeQueryClient)

export const getQueryClient = () => {
  if (isServer) return getServerQueryClient()
  browserQueryClient ??= makeQueryClient()
  return browserQueryClient
}
