"use client"

import { useMemo, useState } from "react"

export type SortDirection = "asc" | "desc"

type SortValue = number | string

const compare = (a: SortValue, b: SortValue) =>
  typeof a === "string" || typeof b === "string"
    ? String(a).localeCompare(String(b))
    : a - b

export type SortState<K extends string> = {
  key: K
  direction: SortDirection
}

export const useSortedRows = <Row, K extends string>(
  rows: Row[],
  getters: Record<K, (row: Row) => SortValue>
) => {
  const [sort, setSort] = useState<SortState<K> | null>(null)

  const sortedRows = useMemo(() => {
    if (!sort) return rows
    const factor = sort.direction === "asc" ? 1 : -1
    const value = getters[sort.key]
    return [...rows].sort((a, b) => compare(value(a), value(b)) * factor)
  }, [rows, getters, sort])

  const toggleSort = (key: K) =>
    setSort((current) =>
      current?.key === key && current.direction === "desc"
        ? { key, direction: "asc" }
        : { key, direction: "desc" }
    )

  return { sortedRows, sort, toggleSort }
}
