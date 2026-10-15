"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  type ChartPhase,
  type ChartStatus,
  resolveRestingChartPhase,
} from "../core/chart-phase"

export interface UseChartPhaseOrchestratorOptions {
  chartStatus: ChartStatus
  targetData: Record<string, unknown>[]
  skeletonData: Record<string, unknown>[]
  animationDuration: number
  yDomainTweenDuration: number

  revealSignature?: string

  skipEnterReveal?: boolean
}

export function useChartPhaseOrchestrator({
  chartStatus,
  targetData,
  skeletonData,
  animationDuration,
  yDomainTweenDuration,
  revealSignature = "",
  skipEnterReveal = false,
}: UseChartPhaseOrchestratorOptions) {
  const [chartPhase, setChartPhase] = useState<ChartPhase>(() =>
    resolveRestingChartPhase(chartStatus)
  )
  const [plotData, setPlotData] = useState<Record<string, unknown>[]>(() =>
    chartStatus === "loading" ? skeletonData : targetData
  )
  const [revealEpoch, setRevealEpoch] = useState(0)
  const [concealEpoch, setConcealEpoch] = useState(0)
  const [isLoaded, setIsLoaded] = useState(() => chartStatus === "ready")
  const prevStatusRef = useRef(chartStatus)
  const phaseRef = useRef(chartPhase)
  phaseRef.current = chartPhase

  useEffect(() => {
    const prevStatus = prevStatusRef.current
    if (prevStatus === chartStatus) {
      return
    }
    prevStatusRef.current = chartStatus

    if (chartStatus === "ready" && prevStatus === "loading") {
      setIsLoaded(false)
      if (animationDuration <= 0) {
        if (yDomainTweenDuration <= 0) {
          setPlotData(targetData)
          setChartPhase("revealing")
        } else {
          setChartPhase("gridTweenReady")
        }
      } else {
        setChartPhase("exiting")
      }
      return
    }

    if (chartStatus === "loading" && prevStatus === "ready") {
      setIsLoaded(false)
      if (animationDuration <= 0) {
        if (yDomainTweenDuration <= 0) {
          setPlotData(skeletonData)
          setChartPhase("loading")
        } else {
          setChartPhase("gridTweenLoading")
        }
      } else {
        setConcealEpoch((epoch) => epoch + 1)
        setChartPhase("exitingReady")
      }
    }
  }, [
    animationDuration,
    chartStatus,
    skeletonData,
    targetData,
    yDomainTweenDuration,
  ])

  useEffect(() => {
    if (skipEnterReveal) {
      return
    }
    if (chartStatus !== "ready") {
      return
    }
    if (phaseRef.current !== "ready") {
      return
    }

    setChartPhase("revealing")
    setIsLoaded(false)
  }, [animationDuration, chartStatus, revealSignature, skipEnterReveal])

  useEffect(() => {
    switch (chartPhase) {
      case "loading":
        if (chartStatus === "loading") {
          setPlotData(skeletonData)
        }
        break
      case "exiting":
        setPlotData(skeletonData)
        break
      case "exitingReady":
      case "gridTweenLoading":
      case "gridTweenReady":
      case "revealing":
      case "ready":
        setPlotData(targetData)
        break
      default:
        break
    }
  }, [chartPhase, chartStatus, skeletonData, targetData])

  const notifyLoadingPulseComplete = useCallback(() => {
    if (phaseRef.current !== "exiting") {
      return
    }
    setChartPhase("gridTweenReady")
  }, [])

  const notifyRevealConcealComplete = useCallback(() => {
    if (phaseRef.current !== "exitingReady") {
      return
    }
    setChartPhase("gridTweenLoading")
  }, [])

  const notifyYDomainTweenComplete = useCallback(() => {
    if (phaseRef.current === "gridTweenLoading") {
      setChartPhase("loading")
      return
    }
    if (phaseRef.current === "gridTweenReady") {
      setChartPhase("revealing")
    }
  }, [])

  useEffect(() => {
    if (chartPhase !== "revealing") {
      return
    }

    setRevealEpoch((epoch) => epoch + 1)
    if (animationDuration <= 0) {
      setChartPhase("ready")
      setIsLoaded(true)
      return
    }

    const timer = window.setTimeout(() => {
      setChartPhase("ready")
      setIsLoaded(true)
    }, animationDuration)
    return () => window.clearTimeout(timer)
  }, [animationDuration, chartPhase])

  return {
    chartPhase,
    plotData,
    revealEpoch,
    concealEpoch,
    isLoaded,
    notifyLoadingPulseComplete,
    notifyRevealConcealComplete,
    notifyYDomainTweenComplete,
  }
}
