export type FadeEdges = boolean | "left" | "right"

export interface FadeSides {
  left: boolean
  right: boolean
  any: boolean
}

export function resolveFadeSides(fade: FadeEdges): FadeSides {
  if (fade === false) {
    return { left: false, right: false, any: false }
  }
  if (fade === "left") {
    return { left: true, right: false, any: true }
  }
  if (fade === "right") {
    return { left: false, right: true, any: true }
  }
  return { left: true, right: true, any: true }
}

export interface FadeGradientStop {
  offset: string
  opacity: number
}

export function fadeGradientStops(sides: FadeSides): FadeGradientStop[] {
  return [
    { offset: "0%", opacity: sides.left ? 0 : 1 },
    { offset: "15%", opacity: 1 },
    { offset: "85%", opacity: 1 },
    { offset: "100%", opacity: sides.right ? 0 : 1 },
  ]
}

export function viewportFadeGradientAttrs(innerWidth: number) {
  return {
    gradientUnits: "userSpaceOnUse" as const,
    x1: 0,
    x2: innerWidth,
    y1: 0,
    y2: 0,
  }
}
