"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { SearchIcon } from "@hugeicons/core-free-icons"

interface DataTableToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  filters?: React.ReactNode
  action?: React.ReactNode
  selectedCount?: number
  bulkActions?: React.ReactNode
}

export function DataTableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  action,
  selectedCount = 0,
  bulkActions,
}: DataTableToolbarProps) {
  if (selectedCount > 0 && bulkActions) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/40 px-4 py-2.5">
        <p className="text-sm font-medium text-foreground">
          {selectedCount} selected
        </p>
        <div className="flex items-center gap-2">{bulkActions}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-64">
          <HugeiconsIcon
            icon={SearchIcon}
            strokeWidth={1.5}
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 w-full rounded-lg border border-border/60 bg-muted/30 pr-2.5 pl-8 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus:bg-muted/60 focus:ring-2 focus:ring-ring/30"
          />
        </div>
        {filters}
      </div>
      {action}
    </div>
  )
}
