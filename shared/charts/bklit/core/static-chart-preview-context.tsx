"use client"

import { createContext, type ReactNode, useContext } from "react"

const StaticChartPreviewContext = createContext(false)

export function StaticChartPreviewProvider({
  children,
}: {
  children: ReactNode
}) {
  return (
    <StaticChartPreviewContext.Provider value={true}>
      {children}
    </StaticChartPreviewContext.Provider>
  )
}

export function useStaticChartPreview() {
  return useContext(StaticChartPreviewContext)
}
