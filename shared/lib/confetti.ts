import type { Options } from "canvas-confetti"

const CONFETTI_COLORS = ["#d85a32", "#fe7644", "#22a55b", "#f5c542", "#ffffff"]

const BASE: Options = {
  colors: CONFETTI_COLORS,
  shapes: ["square"],
  disableForReducedMotion: true,
  zIndex: 100,
  ticks: 260,
  scalar: 0.9,
}

const CANNON_MS = 900

export const celebrate = async (origin = { x: 0.5, y: 0.4 }) => {
  const { default: confetti } = await import("canvas-confetti")

  confetti({
    ...BASE,
    particleCount: 90,
    spread: 80,
    startVelocity: 38,
    origin,
  })

  const end = performance.now() + CANNON_MS
  const fire = () => {
    confetti({
      ...BASE,
      particleCount: 4,
      angle: 60,
      spread: 55,
      startVelocity: 62,
      origin: { x: 0, y: 0.85 },
    })
    confetti({
      ...BASE,
      particleCount: 4,
      angle: 120,
      spread: 55,
      startVelocity: 62,
      origin: { x: 1, y: 0.85 },
    })
    if (performance.now() < end) requestAnimationFrame(fire)
  }
  fire()
}
