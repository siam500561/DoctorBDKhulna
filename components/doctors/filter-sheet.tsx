"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { FilterFields } from "@/components/doctors/filter-fields"
import { HugeiconsIcon } from "@hugeicons/react"
import { FilterIcon } from "@hugeicons/core-free-icons"
import { categories } from "@/components/home/data"
import type {
  DoctorFilterKey,
  DoctorFilterState,
} from "@/hooks/use-doctor-filters"

const ALL = "all"

interface MobileFilterBarProps {
  filters: DoctorFilterState
  activeFilterCount: number
  onToggle: (key: DoctorFilterKey, value: string) => void
  onSingleFilterChange: (key: DoctorFilterKey, value: string | null) => void
  onClear: () => void
}

export function MobileFilterBar({
  filters,
  activeFilterCount,
  onToggle,
  onSingleFilterChange,
  onClear,
}: MobileFilterBarProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex items-center gap-2 lg:hidden">
      <Select
        value={filters.categories[0] ?? ALL}
        onValueChange={(value) =>
          onSingleFilterChange("categories", value === ALL ? null : value)
        }
      >
        <SelectTrigger className="h-10 flex-1 rounded-xl">
          <SelectValue placeholder="All Specialties" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All Specialties</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.name} value={cat.name}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="outline"
              className="h-10 shrink-0 gap-1.5 rounded-xl px-4"
            />
          }
        >
          <HugeiconsIcon
            icon={FilterIcon}
            strokeWidth={1.5}
            data-icon="inline-start"
          />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[0.65rem] text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[85vh] rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6">
            <FilterFields filters={filters} onToggle={onToggle} />
          </div>
          <SheetFooter className="flex-row gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onClear()
              }}
            >
              Clear All
            </Button>
            <Button className="flex-1" onClick={() => setOpen(false)}>
              Show Results
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
