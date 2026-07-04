"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { SearchIcon } from "@hugeicons/core-free-icons"

interface SearchBarProps {
  fullWidth?: boolean
  value?: string
  onSearch?: (value: string) => void
}

export function SearchBar({ fullWidth = false, value, onSearch }: SearchBarProps) {
  const [internalQuery, setInternalQuery] = React.useState("")

  const query = value !== undefined ? value : internalQuery

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value)
    } else {
      setInternalQuery(e.target.value)
    }
  }

  return (
    <div className={cn("flex items-center gap-2", fullWidth && "flex-1")}>
      <div className={cn("relative", fullWidth && "flex-1")}>
        <HugeiconsIcon
          icon={SearchIcon}
          strokeWidth={1.5}
          className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search doctor..."
          className={cn(
            "rounded-lg border border-border/60 bg-muted/30 pr-2.5 pl-7.5 text-xs text-foreground transition-colors outline-none placeholder:text-muted-foreground focus:bg-muted/60 focus:ring-2 focus:ring-ring/30",
            fullWidth ? "h-10 w-full" : "h-8 w-44 sm:w-64"
          )}
        />
      </div>

      <button
        type="button"
        className={cn(
          "shrink-0 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 active:translate-y-px",
          fullWidth ? "h-10 px-4" : "h-8"
        )}
      >
        Search
      </button>
    </div>
  )
}
