"use client"

import dynamic from "next/dynamic"

import { SparklineSkeleton } from "./skeleton-parts"

/** Sparkline loaded after first paint (keeps the chart stack lazy). */
export const LazySparkline = dynamic(
  () => import("./sparkline").then((mod) => mod.Sparkline),
  { ssr: false, loading: () => <SparklineSkeleton /> }
)
