"use client"

import * as React from "react"
import Link from "next/link"
import { Container } from "@/components/ui/container"
import { useHospitalFilters } from "@/hooks/use-hospital-filters"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  MapPinIcon,
  Call02Icon,
  SearchIcon,
  ArrowRightIcon,
} from "@hugeicons/core-free-icons"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function HospitalsDirectory() {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timeout)
  }, [])

  const {
    filters,
    setSearch,
    paginatedHospitals,
    totalCount,
  } = useHospitalFilters()

  return (
    <Container>
      <div className="py-8 md:py-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Hospitals</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Hospitals & Diagnostic Centers
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Find trusted hospitals and diagnostic centers in Khulna and Bagerhat.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          {totalCount > 0
            ? `Showing ${totalCount} Hospital${totalCount !== 1 ? "s" : ""}`
            : "No hospitals found"}
        </p>
      </div>

      <div className="pb-16">
        {/* Search bar */}
        <div className="mb-6 flex items-center gap-2">
          <div className="relative flex-1 sm:max-w-xs">
            <HugeiconsIcon
              icon={SearchIcon}
              strokeWidth={1.5}
              className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hospital..."
              className="h-10 w-full rounded-lg border border-border/60 bg-muted/30 pr-2.5 pl-7.5 text-xs text-foreground transition-colors outline-none placeholder:text-muted-foreground focus:bg-muted/60 focus:ring-2 focus:ring-ring/30"
            />
          </div>
        </div>

        {/* Hospital grid */}
        {isLoading ? (
          <div className="grid gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-card p-5"
              >
                <div className="size-10 shrink-0 animate-pulse rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-48 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-28 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedHospitals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 py-16 text-center">
            <p className="text-sm font-medium text-foreground">
              No hospitals found.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try adjusting your search.
            </p>
          </div>
        ) : (
          <div className="grid gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedHospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="flex items-start gap-4 bg-card p-5 transition-colors hover:bg-muted/30"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <HugeiconsIcon
                    icon={hospital.icon}
                    strokeWidth={1.5}
                    className="size-5 text-muted-foreground"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-foreground">
                    {hospital.name}
                  </h3>
                  <div className="mt-1.5 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <HugeiconsIcon
                        icon={MapPinIcon}
                        strokeWidth={1.5}
                        className="size-3 shrink-0 opacity-60"
                      />
                      {hospital.address}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <HugeiconsIcon
                        icon={Call02Icon}
                        strokeWidth={1.5}
                        className="size-3 shrink-0 opacity-60"
                      />
                      {hospital.phone}
                    </div>
                  </div>
                  <Link
                    href={`/hospitals/${hospital.id}`}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    View Details
                    <HugeiconsIcon
                      icon={ArrowRightIcon}
                      strokeWidth={1.5}
                      className="size-3"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}
