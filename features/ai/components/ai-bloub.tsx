"use client"

import {
  motion,
  type TargetAndTransition,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"
import { useEffect, useId, useRef } from "react"

import { cn } from "@/shared/lib/utils"

const POINTS = 10
const RADIUS = 100
const MOODS = {
  idle: { energy: 0.55, speed: 0.9 },
  typing: { energy: 0.95, speed: 1.9 },
  active: { energy: 1.5, speed: 2.6 },
} as const

const LOOK = { x: 16, y: 13, body: 0.35, reachPx: 320 }
const LOOK_SPRING = { stiffness: 140, damping: 16, mass: 0.6 }

const point = (angle: number, radius: number) =>
  [Math.cos(angle) * radius, Math.sin(angle) * radius] as const

const blobPath = (time: number, energy: number) => {
  const points = Array.from({ length: POINTS }, (_, index) => {
    const angle = (index / POINTS) * Math.PI * 2
    const wobble =
      6 * Math.sin(3 * angle + time * 1.3) +
      4 * Math.sin(5 * angle - time * 1.7) +
      3 * Math.cos(2 * angle + time * 0.9)
    return point(angle, RADIUS + wobble * energy)
  })
  const at = (index: number) => points[(index + POINTS) % POINTS]
  const fixed = (value: number) => value.toFixed(2)

  let path = `M${fixed(at(0)[0])} ${fixed(at(0)[1])}`
  for (let index = 0; index < POINTS; index++) {
    const [x0, y0] = at(index - 1)
    const [x1, y1] = at(index)
    const [x2, y2] = at(index + 1)
    const [x3, y3] = at(index + 2)
    path += `C${fixed(x1 + (x2 - x0) / 6)} ${fixed(y1 + (y2 - y0) / 6)} ${fixed(
      x2 - (x3 - x1) / 6
    )} ${fixed(y2 - (y3 - y1) / 6)} ${fixed(x2)} ${fixed(y2)}`
  }
  return `${path}Z`
}

const EYE = { width: 21, height: 44, rx: 10.5 }
const EYES = [
  { x: -21, y: -12 },
  { x: 21, y: -12 },
]

const GAZE: Record<"idle" | "active", TargetAndTransition> = {
  idle: {
    x: [0, 7, 7, -5, -5, 0],
    y: [0, -2, 3, 2, -3, 0],
    transition: {
      duration: 7,
      ease: "easeInOut",
      repeat: Number.POSITIVE_INFINITY,
    },
  },
  active: {
    x: [6, 9, 4, 6],
    y: [-14, -16, -13, -14],
    transition: {
      duration: 1.6,
      ease: "easeInOut",
      repeat: Number.POSITIVE_INFINITY,
    },
  },
}

const TYPING_NOD = {
  duration: 0.5,
  ease: "easeInOut",
  repeat: Number.POSITIVE_INFINITY,
} as const

const BLINK: TargetAndTransition = {
  scaleY: [1, 1, 0.12, 1, 1],
  transition: {
    duration: 4.2,
    times: [0, 0.9, 0.94, 0.98, 1],
    repeat: Number.POSITIVE_INFINITY,
  },
}

type AiBloubProps = {
  active?: boolean
  interactive?: boolean
  typing?: boolean
  className?: string
}

export function AiBloub({
  active = false,
  interactive = false,
  typing = false,
  className,
}: AiBloubProps) {
  const gradientId = useId()
  const reducedMotion = useReducedMotion()
  const svgRef = useRef<SVGSVGElement>(null)
  const path = useMotionValue(blobPath(0, MOODS.idle.energy))
  const clock = useRef({ time: 0, energy: MOODS.idle.energy, speed: 1 })
  const lookX = useSpring(0, LOOK_SPRING)
  const lookY = useSpring(0, LOOK_SPRING)
  const bodyX = useTransform(lookX, (value) => value * LOOK.body)
  const bodyY = useTransform(lookY, (value) => value * LOOK.body)
  const isTracking = interactive && !reducedMotion

  useEffect(() => {
    if (!isTracking || typing) return
    const onMove = (event: PointerEvent) => {
      const box = svgRef.current?.getBoundingClientRect()
      if (!box) return
      const dx = event.clientX - (box.left + box.width / 2)
      const dy = event.clientY - (box.top + box.height / 2)
      const distance = Math.hypot(dx, dy) || 1
      const reach = Math.min(1, distance / LOOK.reachPx)
      lookX.set((dx / distance) * LOOK.x * reach)
      lookY.set((dy / distance) * LOOK.y * reach)
    }
    window.addEventListener("pointermove", onMove)
    return () => window.removeEventListener("pointermove", onMove)
  }, [isTracking, typing, lookX, lookY])

  useEffect(() => {
    if (!isTracking || !typing) return
    lookX.set(0)
    lookY.set(LOOK.y)
  }, [isTracking, typing, lookX, lookY])

  useAnimationFrame((_, delta) => {
    if (reducedMotion) return
    const target = MOODS[active ? "active" : typing ? "typing" : "idle"]
    const state = clock.current
    state.energy += (target.energy - state.energy) * 0.05
    state.speed += (target.speed - state.speed) * 0.05
    state.time += (delta / 1000) * state.speed
    path.set(blobPath(state.time, state.energy))
  })

  return (
    <svg
      aria-label="Raxon AI"
      className={cn("overflow-visible", className)}
      ref={svgRef}
      role="img"
      viewBox="-125 -125 250 250"
    >
      <defs>
        <radialGradient cx="35%" cy="28%" id={gradientId} r="80%">
          <stop
            offset="0%"
            style={{
              stopColor: "color-mix(in oklch, var(--primary) 62%, white)",
            }}
          />
          <stop offset="55%" style={{ stopColor: "var(--primary)" }} />
          <stop
            offset="100%"
            style={{
              stopColor: "color-mix(in oklch, var(--primary) 72%, black)",
            }}
          />
        </radialGradient>
      </defs>

      <motion.g style={isTracking ? { x: bodyX, y: bodyY } : undefined}>
        <motion.path d={path} fill={`url(#${gradientId})`} />
        <ellipse
          cx={-38}
          cy={-52}
          fill="white"
          opacity={0.16}
          rx={24}
          ry={12}
          transform="rotate(-32 -38 -52)"
        />
      </motion.g>

      <motion.g style={isTracking ? { x: lookX, y: lookY } : undefined}>
        <motion.g
          animate={
            isTracking
              ? typing
                ? { y: [0, 3, 0], transition: TYPING_NOD }
                : { y: 0 }
              : reducedMotion
                ? undefined
                : GAZE[active ? "active" : "idle"]
          }
        >
          {EYES.map(({ x, y }) => (
            <motion.rect
              animate={reducedMotion ? undefined : BLINK}
              fill="var(--primary-foreground)"
              height={EYE.height}
              key={x}
              rx={EYE.rx}
              style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
              width={EYE.width}
              x={x - EYE.width / 2}
              y={y - EYE.height / 2}
            />
          ))}
        </motion.g>
      </motion.g>
    </svg>
  )
}
