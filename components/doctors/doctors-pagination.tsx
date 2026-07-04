import * as React from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface DoctorsPaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function getPageNumbers(page: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1])
  return Array.from(pages)
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b)
}

export function DoctorsPagination({
  page,
  totalPages,
  onPageChange,
}: DoctorsPaginationProps) {
  if (totalPages <= 1) return null

  const pageNumbers = getPageNumbers(page, totalPages)

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={page === 1}
            className={page === 1 ? "pointer-events-none opacity-40" : ""}
            onClick={(e) => {
              e.preventDefault()
              if (page > 1) onPageChange(page - 1)
            }}
          />
        </PaginationItem>

        {pageNumbers.map((p, i) => {
          const prev = pageNumbers[i - 1]
          const showEllipsis = prev !== undefined && p - prev > 1
          return (
            <React.Fragment key={p}>
              {showEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={p === page}
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange(p)
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            </React.Fragment>
          )
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={page === totalPages}
            className={
              page === totalPages ? "pointer-events-none opacity-40" : ""
            }
            onClick={(e) => {
              e.preventDefault()
              if (page < totalPages) onPageChange(page + 1)
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
