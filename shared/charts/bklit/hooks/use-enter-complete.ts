"use client"

import type { MotionValue } from "motion/react"
import { useEffect, useState } from "react"

export function useEnterComplete(mountProgress: MotionValue<number>): boolean {
  const [complete, setComplete] = useState(() => mountProgress.get() >= 1)

  useEffect(() => {
    if (mountProgress.get() >= 1) {
      setComplete(true)
      return
    }

    return mountProgress.on("change", (value) => {
      if (value >= 1) {
        setComplete(true)
      }
    })
  }, [mountProgress])

  return complete
}
