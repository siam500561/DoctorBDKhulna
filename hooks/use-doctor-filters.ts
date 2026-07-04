"use client"

import * as React from "react"
import {
  doctors as allDoctors,
  experienceRanges,
  feeRanges,
} from "@/components/home/data"

export interface DoctorFilterState {
  categories: string[]
  hospitals: string[]
  genders: string[]
  availability: string[]
  experienceRanges: string[]
  feeRanges: string[]
}

export type DoctorFilterKey = keyof DoctorFilterState

const emptyFilters: DoctorFilterState = {
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
 */
export function useDoctorFilters() {
  const [filters, setFilters] = React.useState<DoctorFilterState>(emptyFilters)
  const [page, setPage] = React.useState(1)

  const toggleFilter = React.useCallback(
    (key: DoctorFilterKey, value: string) => {
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
    (key: DoctorFilterKey, value: string | null) => {
      setFilters((prev) => ({ ...prev, [key]: value ? [value] : [] }))
      setPage(1)
    },
    []
  )

  const clearFilters = React.useCallback(() => {
    setFilters(emptyFilters)
    setPage(1)
  }, [])

  const activeFilterCount = Object.values(filters).reduce(
    (sum, values) => sum + values.length,
    0
  )

  const filteredDoctors = React.useMemo(() => {
    return allDoctors.filter((doctor) => {
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
  }, [filters])

  const totalCount = filteredDoctors.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginatedDoctors = filteredDoctors.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  )

  return {
    filters,
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
