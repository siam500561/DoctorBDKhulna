"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HugeiconsIcon } from "@hugeicons/react"
import { SortByDown01Icon } from "@hugeicons/core-free-icons"
import { sortOptions } from "@/lib/filter-ranges"

// UI only — wire up to real ordering once the backend can sort results.
export function SortSelect() {
  const [sort, setSort] = React.useState<string>(sortOptions[0])

  return (
    <Select value={sort} onValueChange={(value) => value && setSort(value)}>
      <SelectTrigger className="h-8 w-full rounded-lg text-xs sm:w-40">
        <HugeiconsIcon
          icon={SortByDown01Icon}
          strokeWidth={1.5}
          className="size-4 shrink-0 opacity-60"
        />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
