"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { SearchIcon } from "@hugeicons/core-free-icons"

export function SearchBar() {
  const [query, setQuery] = React.useState("")

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <HugeiconsIcon
          icon={SearchIcon}
          strokeWidth={1.5}
          className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search doctor..."
          className="h-8 w-32 rounded-lg border border-border/60 bg-muted/30 pr-2.5 pl-7.5 text-xs text-foreground transition-colors outline-none placeholder:text-muted-foreground focus:bg-muted/60 focus:ring-2 focus:ring-ring/30 sm:w-44"
        />
      </div>

      <button
        type="button"
        className="h-8 shrink-0 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 active:translate-y-px"
      >
        Search
      </button>
    </div>
  )
}
