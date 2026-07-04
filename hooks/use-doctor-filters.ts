"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import {
  doctors as allDoctors,
  experienceRanges,
  feeRanges,
} from "@/components/home/data"

export interface DoctorFilterState {
  search: string
  categories: string[]
  hospitals: string[]
  genders: string[]
  availability: string[]
  experienceRanges: string[]
  feeRanges: string[]
}

export type DoctorFilterArrayKey = {
  [K in keyof DoctorFilterState]: DoctorFilterState[K] extends string[]
    ? K
    : never
}[keyof DoctorFilterState]

const emptyFilters: DoctorFilterState = {
  search: "",
  categories: [],
  hospitals: [],
  genders: [],
  availability: [],
  experienceRanges: [],
  feeRanges: [],
}

const PAGE_SIZE = 5

/**
 * Owns doctor-directory filter/pagination state against the local placeholder
 * dataset. Swap `allDoctors` for a real fetch when the backend is ready —
 * the filtering/pagination contract below can stay the same.
 *
 * Reads URL search params (?specialty=..., ?hospital=...) via useSearchParams
 * so that both hard refreshes and client-side navigations apply the filters
 * immediately.
 */
export function useDoctorFilters() {
  const searchParams = useSearchParams()

  const urlFilters = React.useMemo<Partial<DoctorFilterState>>(() => {
    const result: Partial<DoctorFilterState> = {}
    const specialty = searchParams.get("specialty")
    const hospital = searchParams.get("hospital")
    if (specialty) result.categories = [specialty]
    if (hospital) result.hospitals = [hospital]
    return result
  }, [searchParams])

  const [filters, setFilters] = React.useState<DoctorFilterState>({
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
        // Only update if something actually changed
        if (JSON.stringify(prev) === JSON.stringify(next)) return prev
        return next
      })
      setPage(1)
    }
  }, [urlFiltersKey, urlFilters])

  const toggleFilter = React.useCallback(
    (key: DoctorFilterArrayKey, value: string) => {
      setFilters((prev) => {
        const current = prev[key]
        const next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value]
        return { ...prev, [key]: next }
      })
      setPage(1)
    },
    []
  )

  const setSingleFilter = React.useCallback(
    (key: DoctorFilterArrayKey, value: string | null) => {
      setFilters((prev) => ({ ...prev, [key]: value ? [value] : [] }))
      setPage(1)
    },
    []
  )

  const clearFilters = React.useCallback(() => {
    setFilters(emptyFilters)
    setPage(1)
  }, [])

  const setSearch = React.useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }))
    setPage(1)
  }, [])

  const activeFilterCount = Object.values(filters).reduce(
    (sum, values) => sum + (Array.isArray(values) ? values.length : 0),
    0
  )

  const filteredDoctors = React.useMemo(() => {
    const q = filters.search.toLowerCase().trim()
    return allDoctors.filter((doctor) => {
      if (q) {
        const haystack = [
          doctor.name,
          doctor.specialty,
          doctor.hospital,
          doctor.qualifications,
          doctor.district,
        ]
          .join(" ")
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      if (
        filters.categories.length &&
        !filters.categories.includes(doctor.specialty)
      )
        return false
      if (
        filters.hospitals.length &&
        !filters.hospitals.includes(doctor.hospital)
      )
        return false
      if (filters.genders.length && !filters.genders.includes(doctor.gender))
        return false
      if (
        filters.availability.length &&
        !filters.availability.includes(doctor.availability)
      )
        return false
      if (filters.experienceRanges.length) {
        const matches = filters.experienceRanges.some((label) => {
          const range = experienceRanges.find((r) => r.label === label)
          return (
            range &&
            doctor.experience >= range.min &&
            doctor.experience < range.max
          )
        })
        if (!matches) return false
      }
      if (filters.feeRanges.length) {
        const matches = filters.feeRanges.some((label) => {
          const range = feeRanges.find((r) => r.label === label)
          return range && doctor.fee >= range.min && doctor.fee <= range.max
        })
        if (!matches) return false
      }
      return true
    })
  }, [filters, filters.search])

  const totalCount = filteredDoctors.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginatedDoctors = filteredDoctors.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  )

  return {
    filters,
    setSearch,
    toggleFilter,
    setSingleFilter,
    clearFilters,
    activeFilterCount,
    paginatedDoctors,
    page: safePage,
    setPage,
    totalPages,
    totalCount,
    pageSize: PAGE_SIZE,
  }
}
