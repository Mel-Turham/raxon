"use client"

import { useCallback, useState } from "react"

const SIMULATED_API_DELAY = 3000

export function useAuthSimulation() {
  const [isLoading, setIsLoading] = useState(false)

  const simulateRequest = useCallback(async () => {
    setIsLoading(true)

    try {
      await new Promise<void>((resolve) =>
        setTimeout(resolve, SIMULATED_API_DELAY)
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { isLoading, simulateRequest }
}
