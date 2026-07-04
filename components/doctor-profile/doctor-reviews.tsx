"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { StarIcon, User02Icon } from "@hugeicons/core-free-icons"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { DoctorProfile } from "@/lib/doctor-profile"

interface DoctorReviewsProps {
  reviews: DoctorProfile["reviews"]
}

const PAGE_SIZE = 2

export function DoctorReviews({ reviews }: DoctorReviewsProps) {
  const [page, setPage] = React.useState(1)
  const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE))
  const paginated = reviews.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

  return (
    <section aria-labelledby="reviews-heading">
      <h2
        id="reviews-heading"
        className="font-heading text-lg font-semibold text-foreground"
      >
        Patient Reviews
      </h2>
      <div className="mt-3 space-y-4">
        {paginated.map((review, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-xl border border-border/60 p-4"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
              <HugeiconsIcon
                icon={User02Icon}
                strokeWidth={1.5}
                className="size-4 text-muted-foreground"
              />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">
                  {review.name}
                </p>
                <span className="text-xs text-muted-foreground">
                  {review.date}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <HugeiconsIcon
                    key={starIndex}
                    icon={StarIcon}
                    strokeWidth={1.5}
                    className={
                      starIndex < Math.round(review.rating)
                        ? "size-3.5 text-amber-500/80"
                        : "size-3.5 text-muted-foreground/30"
                    }
                  />
                ))}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {review.comment}
              </p>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-6 justify-start">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={page === 1}
                className={page === 1 ? "pointer-events-none opacity-40" : ""}
                onClick={(e) => {
                  e.preventDefault()
                  if (page > 1) setPage(page - 1)
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={page === i + 1}
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(i + 1)
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={page === totalPages}
                className={
                  page === totalPages ? "pointer-events-none opacity-40" : ""
                }
                onClick={(e) => {
                  e.preventDefault()
                  if (page < totalPages) setPage(page + 1)
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  )
}
