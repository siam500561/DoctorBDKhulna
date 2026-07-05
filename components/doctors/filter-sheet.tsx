"use client"

import * as React from "react"
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
import { SearchBar } from "@/components/doctors/search-bar"
import { HugeiconsIcon } from "@hugeicons/react"
import { FilterIcon } from "@hugeicons/core-free-icons"
import type {
  DoctorFilterArrayKey,
  DoctorFilterState,
} from "@/hooks/use-doctor-filters"

interface MobileFilterBarProps {
  filters: DoctorFilterState
  activeFilterCount: number
  onToggle: (key: DoctorFilterArrayKey, value: string) => void
  onClear: () => void
  onSearch: (value: string) => void
  specialtyOptions: { value: string; label: string }[]
  hospitalOptions: string[]
}

export function MobileFilterBar({
  filters,
  activeFilterCount,
  onToggle,
  onClear,
  onSearch,
  specialtyOptions,
  hospitalOptions,
}: MobileFilterBarProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex items-center gap-2 lg:hidden">
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
            <FilterFields
              filters={filters}
              onToggle={onToggle}
              specialtyOptions={specialtyOptions}
              hospitalOptions={hospitalOptions}
            />
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

      <SearchBar fullWidth value={filters.search} onSearch={onSearch} />
    </div>
  )
}
