"use client"

import { type MotionValue, motion } from "motion/react"
import { type RefObject, useId } from "react"

export interface HighlightSegmentProps {
  pathRef: RefObject<SVGPathElement | null>
  visible: boolean
  stroke: string
  strokeWidth: number
  height: number
  x: MotionValue<number>
  width: MotionValue<number>
}

export function HighlightSegment({
  pathRef,
  visible,
  stroke,
  strokeWidth,
  height,
  x,
  width,
}: HighlightSegmentProps) {
  const clipId = useId()
  if (!(visible && pathRef.current)) {
    return null
  }
  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <motion.rect height={height} width={width} x={x} y={0} />
        </clipPath>
      </defs>
      <motion.path
        animate={{ opacity: 1 }}
        clipPath={`url(#${clipId})`}
        d={pathRef.current.getAttribute("d") || ""}
        exit={{ opacity: 0 }}
        fill="none"
        initial={{ opacity: 0 }}
        stroke={stroke}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
    </>
  )
}

HighlightSegment.displayName = "HighlightSegment"

export default HighlightSegment
