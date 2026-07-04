"use client"

import * as React from "react"
import { Container } from "@/components/ui/container"
import { useDoctorFilters } from "@/hooks/use-doctor-filters"
import { DoctorsHeader } from "@/components/doctors/doctors-header"
import { SearchBar } from "@/components/doctors/search-bar"
import { SortSelect } from "@/components/doctors/sort-select"
import { FilterSidebar } from "@/components/doctors/filter-sidebar"
import { MobileFilterBar } from "@/components/doctors/filter-sheet"
import { DoctorPanel } from "@/components/doctors/doctor-panel"
import { DoctorPanelSkeleton } from "@/components/doctors/doctor-panel-skeleton"
import { DoctorsEmptyState } from "@/components/doctors/doctors-empty-state"
import { DoctorsPagination } from "@/components/doctors/doctors-pagination"

export function DoctorsDirectory() {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timeout)
  }, [])

  const {
    filters,
    toggleFilter,
    setSingleFilter,
    clearFilters,
    activeFilterCount,
    paginatedDoctors,
    page,
    setPage,
    totalPages,
    totalCount,
    pageSize,
  } = useDoctorFilters()

  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalCount)

  return (
    <Container>
      <DoctorsHeader from={from} to={to} total={totalCount} />

      <div className="pb-8">
        <MobileFilterBar
          filters={filters}
          activeFilterCount={activeFilterCount}
          onToggle={toggleFilter}
          onSingleFilterChange={setSingleFilter}
          onClear={clearFilters}
        />
      </div>

      <div className="flex gap-8 pb-16 lg:gap-10">
        <FilterSidebar
          filters={filters}
          activeFilterCount={activeFilterCount}
          onToggle={toggleFilter}
          onClear={clearFilters}
        />

        <main className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <SearchBar />
            <SortSelect />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: pageSize }).map((_, i) => (
                <DoctorPanelSkeleton key={i} />
              ))}
            </div>
          ) : paginatedDoctors.length === 0 ? (
            <DoctorsEmptyState onClearFilters={clearFilters} />
          ) : (
            <div className="space-y-3">
              {paginatedDoctors.map((doctor) => (
                <DoctorPanel key={doctor.id} doctor={doctor} />
              ))}
            </div>
          )}

          {!isLoading && paginatedDoctors.length > 0 && (
            <div className="mt-8">
              <DoctorsPagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </main>
      </div>
    </Container>
  )
}
