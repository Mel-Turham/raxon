export type ChartStatus = "loading" | "ready"

export type LoadingStyle = "pulse" | "sweep"

export type ChartPhase =
  | "loading"
  | "exiting"
  | "gridTweenReady"
  | "revealing"
  | "ready"
  | "exitingReady"
  | "gridTweenLoading"
  | "revealingLoading"

export const DEFAULT_CHART_STATUS: ChartStatus = "ready"

export const DEFAULT_Y_DOMAIN_TWEEN_MS = 500

export const Y_DOMAIN_TWEEN_SKIP_THRESHOLD = 0.02

export function resolveRestingChartPhase(status: ChartStatus): ChartPhase {
  return status === "loading" ? "loading" : "ready"
}

export function isChartInteractionPhase(phase: ChartPhase): boolean {
  return phase === "ready"
}

export const DEFAULT_CHART_LIFECYCLE = {
  chartPhase: "ready",
  chartStatus: "ready",
  loadingLabel: undefined,
  yDomainTweenDuration: DEFAULT_Y_DOMAIN_TWEEN_MS,
  yDomainSkeletonByAxis: { left: [0, 100] as [number, number] },
  yDomainTargetByAxis: { left: [0, 100] as [number, number] },
} as const satisfies {
  chartPhase: ChartPhase
  chartStatus: ChartStatus
  loadingLabel: undefined
  yDomainTweenDuration: number
  yDomainSkeletonByAxis: Record<string, [number, number]>
  yDomainTargetByAxis: Record<string, [number, number]>
}
