"use client"

import { useEffect, useEffectEvent, useState } from "react"

import { BINANCE_WS_URL } from "@/shared/api/binance"

export type StreamStatus = "connecting" | "live" | "offline"

const RETRY_BASE_MS = 1000
const RETRY_MAX_MS = 30_000

type StreamMessage = { stream: string; data: unknown }

export const useBinanceStream = (
  streams: string[],
  onMessage: (stream: string, data: unknown) => void
) => {
  const [status, setStatus] = useState<StreamStatus>("connecting")
  const handleMessage = useEffectEvent(onMessage)
  const key = streams.join("/")

  useEffect(() => {
    if (!key) return
    let socket: WebSocket | undefined
    let retryTimer: number | undefined
    let attempt = 0
    let closed = false

    const connect = () => {
      setStatus("connecting")
      socket = new WebSocket(`${BINANCE_WS_URL}?streams=${key}`)
      socket.onopen = () => {
        attempt = 0
        setStatus("live")
      }
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data) as StreamMessage
        handleMessage(message.stream, message.data)
      }
      socket.onclose = () => {
        if (closed) return
        setStatus("offline")
        const delay = Math.min(RETRY_MAX_MS, RETRY_BASE_MS * 2 ** attempt++)
        retryTimer = window.setTimeout(connect, delay)
      }
    }

    connect()
    return () => {
      closed = true
      window.clearTimeout(retryTimer)
      socket?.close()
    }
  }, [key])

  return status
}
