"use client"

import { Button } from "@/components/ui/button"
import { FilterFields } from "@/components/doctors/filter-fields"
import type {
  DoctorFilterKey,
  DoctorFilterState,
} from "@/hooks/use-doctor-filters"

interface FilterSidebarProps {
  filters: DoctorFilterState
  activeFilterCount: number
  onToggle: (key: DoctorFilterKey, value: string) => void
  onClear: () => void
}

export function FilterSidebar({
  filters,
  activeFilterCount,
  onToggle,
  onClear,
}: FilterSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-20">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-heading text-sm font-semibold text-foreground">
            Filters
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-6 px-2 text-xs text-muted-foreground"
          >
            Clear all ({activeFilterCount})
          </Button>
        </div>
        <FilterFields filters={filters} onToggle={onToggle} />
      </div>
    </aside>
  )
}
