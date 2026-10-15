"use client"

import { createKeys } from "@/shared/lib/keys"
import { scaleLinear } from "@visx/scale"
import { LineRadial } from "@visx/shape"
import { motion } from "motion/react"
import { transitionWithDelay } from "../core/motion-utils"
import { radarCssVars, useRadarStable } from "./radar-context"

export interface RadarGridProps {
  showLabels?: boolean
  stroke?: string
  strokeOpacity?: number
  className?: string
}

export function RadarGrid({
  showLabels = true,
  stroke = radarCssVars.border,
  strokeOpacity = 0.6,
  className = "",
}: RadarGridProps) {
  const {
    metrics,
    radius,
    levels,
    animate,
    enterTransition,
    staggerScale,
    enterDurationMs,
    motionReplayKey,
  } = useRadarStable()

  const durationFactor = enterDurationMs / 1100
  const gridStagger = 0.08 * staggerScale * durationFactor

  const degrees = 360
  const angles = [...new Array(metrics.length + 1)].map((_, i) => ({
    angle: i * (degrees / metrics.length) + degrees / metrics.length / 2,
  }))

  const radialScale = scaleLinear<number>({
    range: [0, Math.PI * 2],
    domain: [degrees, 0],
  })

  const labelDelay = levels * gridStagger * 0.5

  return (
    <g className={className}>
      {createKeys(levels, "grid").map((levelKey, i) => {
        const targetRadius = ((i + 1) * radius) / levels
        return (
          <motion.g
            animate={{ scale: 1, opacity: 1 }}
            initial={
              animate ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }
            }
            key={`${levelKey}-${motionReplayKey}`}
            style={{ transformOrigin: "0px 0px" }}
            transition={
              animate
                ? transitionWithDelay(enterTransition, i * gridStagger, {
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    mass: 1,
                  })
                : undefined
            }
          >
            <LineRadial
              angle={(d) => radialScale(d.angle) ?? 0}
              data={angles}
              fill="none"
              radius={targetRadius}
              stroke={stroke}
              strokeLinecap="round"
              strokeOpacity={strokeOpacity}
              strokeWidth={1}
            />
          </motion.g>
        )
      })}

      {showLabels &&
        createKeys(levels, "level-label").map((levelKey, i) => (
          <motion.g
            animate={{ opacity: 1 }}
            initial={animate ? { opacity: 0 } : { opacity: 1 }}
            key={`${levelKey}-${motionReplayKey}`}
            transition={
              animate
                ? transitionWithDelay(
                    enterTransition,
                    labelDelay + i * 0.06 * durationFactor
                  )
                : undefined
            }
          >
            <text
              dominantBaseline="middle"
              fill={radarCssVars.foregroundMuted}
              fontSize={9}
              textAnchor="start"
              x={4}
              y={-((i + 1) * radius) / levels}
            >
              {((i + 1) * 100) / levels}
            </text>
          </motion.g>
        ))}
    </g>
  )
}

RadarGrid.displayName = "RadarGrid"

export default RadarGrid
