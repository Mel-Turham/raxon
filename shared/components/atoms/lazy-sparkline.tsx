"use client"

import dynamic from "next/dynamic"

import { SparklineSkeleton } from "@/shared/components/molecules/skeleton-parts"

export const LazySparkline = dynamic(
  () => import("./sparkline").then((mod) => mod.Sparkline),
  { ssr: false, loading: () => <SparklineSkeleton /> }
)
