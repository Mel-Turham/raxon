import {
  dehydrate,
  HydrationBoundary,
  type QueryClient,
} from "@tanstack/react-query"
import { connection } from "next/server"
import type { ReactNode } from "react"

import { getQueryClient } from "./query-client"

export const Prefetched = async ({
  prefetch,
  children,
}: {
  prefetch: (queryClient: QueryClient) => Promise<unknown>[]
  children: ReactNode
}) => {
  await connection()
  const queryClient = getQueryClient()
  await Promise.all(prefetch(queryClient))
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}
