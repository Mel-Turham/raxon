import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react"

export const CHART_CLIP_PASSTHROUGH = "__chartClipPassthrough" as const

export function isChartClipPassthrough(type: unknown): boolean {
  return (
    typeof type === "function" &&
    (type as { [CHART_CLIP_PASSTHROUGH]?: boolean })[CHART_CLIP_PASSTHROUGH] ===
      true
  )
}

export function resolveChartChildElement(child: ReactElement): ReactElement {
  if (isChartClipPassthrough(child.type)) {
    const inner = (child.props as { children?: unknown }).children
    if (isValidElement(inner)) {
      return resolveChartChildElement(inner)
    }
  }
  return child
}

export function forEachChartChild(
  children: ReactNode,
  callback: (child: ReactElement, index: number) => void
) {
  let index = 0
  const visit = (nodes: ReactNode) => {
    Children.forEach(nodes, (child) => {
      if (!isValidElement(child)) {
        return
      }
      if (child.type === Fragment) {
        visit((child.props as { children?: ReactNode }).children)
        return
      }
      callback(child, index)
      index += 1
    })
  }
  visit(children)
}

const CLIP_EXCLUDED_COMPONENT_NAMES = new Set([
  "Background",
  "Grid",
  "XAxis",
  "YAxis",
  "BarXAxis",
  "BarYAxis",
  "LiveXAxis",
  "LiveYAxis",
])

const UNDERLAY_COMPONENT_NAMES = new Set(["ReferenceArea", "BarColumnTrack"])

export function isPostOverlayComponent(child: ReactElement): boolean {
  const childType = child.type as {
    displayName?: string
    name?: string
    __isChartMarkers?: boolean
    __isPostOverlay?: boolean
  }

  if (childType.__isChartMarkers || childType.__isPostOverlay) {
    return true
  }

  const componentName =
    typeof child.type === "function"
      ? childType.displayName || childType.name || ""
      : ""

  return (
    componentName === "ChartMarkers" ||
    componentName === "MarkerGroup" ||
    componentName === "ChartBrush"
  )
}

export function isUnderlayComponent(child: ReactElement): boolean {
  const childType = child.type as { displayName?: string; name?: string }
  const componentName =
    typeof child.type === "function"
      ? childType.displayName || childType.name || ""
      : ""
  return UNDERLAY_COMPONENT_NAMES.has(componentName)
}

export function isClipExcludedComponent(child: ReactElement): boolean {
  const childType = child.type as { displayName?: string; name?: string }
  const componentName =
    typeof child.type === "function"
      ? childType.displayName || childType.name || ""
      : ""
  return CLIP_EXCLUDED_COMPONENT_NAMES.has(componentName)
}

export function renderKeyedChartLayers(children: ReactElement[]) {
  return children.map((child, index) =>
    cloneElement(child, { key: child.key ?? `chart-layer-${index}` })
  )
}
