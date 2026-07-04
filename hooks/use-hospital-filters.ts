"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { hospitals as allHospitals } from "@/components/home/data"

export interface HospitalFilterState {
  search: string
  districts: string[]
}

export type HospitalFilterKey = keyof HospitalFilterState

const emptyFilters: HospitalFilterState = {
  search: "",
  districts: [],
}

/**
 * Owns hospital-directory filter/pagination state against the local placeholder
 * dataset. Swap `allHospitals` for a real fetch when the backend is ready —
 * the filtering/pagination contract below can stay the same.
 *
 * Reads URL search params (?hospital=...) via useSearchParams so that both
 * hard refreshes and client-side navigations apply the filters immediately.
 */
export function useHospitalFilters() {
  const searchParams = useSearchParams()

  const urlFilters = React.useMemo<Partial<HospitalFilterState>>(() => {
    const result: Partial<HospitalFilterState> = {}
    const hospital = searchParams.get("hospital")
    if (hospital) result.search = hospital
    return result
  }, [searchParams])

  const [filters, setFilters] = React.useState<HospitalFilterState>({
    ...emptyFilters,
    ...urlFilters,
  })

  const [page, setPage] = React.useState(1)

  // Sync filters when URL search params change (client-side navigation)
  const urlFiltersKey = JSON.stringify(urlFilters)
  const prevUrlFiltersKey = React.useRef(urlFiltersKey)
  React.useEffect(() => {
    if (urlFiltersKey !== prevUrlFiltersKey.current) {
      prevUrlFiltersKey.current = urlFiltersKey
      setFilters((prev) => {
        const next = { ...emptyFilters, ...urlFilters }
        if (JSON.stringify(prev) === JSON.stringify(next)) return prev
        return next
      })
      setPage(1)
    }
  }, [urlFiltersKey, urlFilters])

  const setSearch = React.useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }))
    setPage(1)
  }, [])

  const toggleFilter = React.useCallback(
    (key: HospitalFilterKey, value: string) => {
      setFilters((prev) => {
        const current = prev[key]
        if (Array.isArray(current)) {
          const next = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value]
          return { ...prev, [key]: next }
        }
        return prev
      })
      setPage(1)
    },
    []
  )

  const clearFilters = React.useCallback(() => {
    setFilters(emptyFilters)
    setPage(1)
  }, [])

  const activeFilterCount =
    filters.districts.length + (filters.search ? 1 : 0)

  const filteredHospitals = React.useMemo(() => {
    return allHospitals.filter((hospital) => {
      if (
        filters.search &&
        !hospital.name.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false
      return true
    })
  }, [filters])

  const totalCount = filteredHospitals.length
  const PAGE_SIZE = 9
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginatedHospitals = filteredHospitals.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  )

  return {
    filters,
    setSearch,
    toggleFilter,
    clearFilters,
    activeFilterCount,
    paginatedHospitals,
    page: safePage,
    setPage,
    totalPages,
    totalCount,
    pageSize: PAGE_SIZE,
  }
}
