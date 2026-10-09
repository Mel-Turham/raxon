"use client"

import NumberFlow from "@number-flow/react"
import { type ComponentProps, useSyncExternalStore } from "react"

import { CURRENCY_FORMAT } from "@/lib/format"

type AnimatedNumberProps = {
  value: number
  format?: ComponentProps<typeof NumberFlow>["format"]
  prefix?: string
  suffix?: string
  className?: string
}

const subscribe = () => () => {}

export const AnimatedNumber = ({
  value,
  format = CURRENCY_FORMAT,
  prefix,
  suffix,
  className,
}: AnimatedNumberProps) => {
  const isHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )

  return (
    <NumberFlow
      className={className}
      format={format}
      locales="en-US"
      prefix={prefix}
      suffix={suffix}
      value={isHydrated ? value : 0}
    />
  )
}
