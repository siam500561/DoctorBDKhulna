"use client"

import * as React from "react"
import { usePreloadedQuery, type Preloaded } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Container } from "@/components/ui/container"
import { useDoctorFilters } from "@/hooks/use-doctor-filters"
import { specialtyLabel } from "@/components/admin/specialties"
import { DoctorsHeader } from "@/components/doctors/doctors-header"
import { SearchBar } from "@/components/doctors/search-bar"
import { FilterSidebar } from "@/components/doctors/filter-sidebar"
import { MobileFilterBar } from "@/components/doctors/filter-sheet"
import { DoctorPanel } from "@/components/doctors/doctor-panel"
import { DoctorsEmptyState } from "@/components/doctors/doctors-empty-state"
import { DoctorsPagination } from "@/components/doctors/doctors-pagination"

interface DoctorsDirectoryProps {
  preloadedDoctors: Preloaded<typeof api.doctors.listPublic>
}

export function DoctorsDirectory({ preloadedDoctors }: DoctorsDirectoryProps) {
  const doctors = usePreloadedQuery(preloadedDoctors)

  const {
    filters,
    setSearch,
    toggleFilter,
    clearFilters,
    activeFilterCount,
    paginatedDoctors,
    page,
    setPage,
    totalPages,
    totalCount,
    pageSize,
  } = useDoctorFilters(doctors)

  const specialtyOptions = React.useMemo(() => {
    const seen = new Map<string, string>()
    for (const doctor of doctors ?? []) {
      if (!seen.has(doctor.specialty)) {
        seen.set(doctor.specialty, specialtyLabel(doctor.specialty))
      }
    }
    return Array.from(seen, ([value, label]) => ({ value, label })).sort(
      (a, b) => a.label.localeCompare(b.label)
    )
  }, [doctors])

  const hospitalOptions = React.useMemo(() => {
    const seen = new Set<string>()
    for (const doctor of doctors ?? []) {
      if (doctor.hospitalName) seen.add(doctor.hospitalName)
    }
    return Array.from(seen).sort((a, b) => a.localeCompare(b))
  }, [doctors])

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
          onClear={clearFilters}
          onSearch={setSearch}
          specialtyOptions={specialtyOptions}
          hospitalOptions={hospitalOptions}
        />
      </div>

      <div className="flex gap-8 pb-16 lg:gap-10">
        <FilterSidebar
          filters={filters}
          activeFilterCount={activeFilterCount}
          onToggle={toggleFilter}
          onClear={clearFilters}
          specialtyOptions={specialtyOptions}
          hospitalOptions={hospitalOptions}
        />

        <main className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-end gap-3">
            <div className="hidden lg:block">
              <SearchBar value={filters.search} onSearch={setSearch} />
            </div>
          </div>

          {paginatedDoctors.length === 0 ? (
            <DoctorsEmptyState onClearFilters={clearFilters} />
          ) : (
            <div className="space-y-3">
              {paginatedDoctors.map((doctor) => (
                <DoctorPanel key={doctor._id} doctor={doctor} />
              ))}
            </div>
          )}

          {paginatedDoctors.length > 0 && (
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
