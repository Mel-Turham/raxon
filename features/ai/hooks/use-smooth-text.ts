"use client"

import { useEffect, useRef, useState } from "react"

const CATCH_UP_FRAMES = 60
const MAX_CHARS_PER_FRAME = 8

export function useSmoothText(text: string, isStreaming: boolean) {
  const [length, setLength] = useState(() => (isStreaming ? 0 : text.length))
  const shown = useRef(length)

  useEffect(() => {
    let frame = 0
    const tick = () => {
      const backlog = text.length - shown.current
      if (backlog <= 0) return
      shown.current += Math.min(
        MAX_CHARS_PER_FRAME,
        Math.max(1, Math.ceil(backlog / CATCH_UP_FRAMES))
      )
      setLength(shown.current)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [text])

  return text.slice(0, length)
}
