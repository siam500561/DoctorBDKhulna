"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMutation, useQuery } from "convex/react"
import { toast } from "sonner"
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { DataTable } from "@/components/admin/data-table/data-table"
import { DataTableToolbar } from "@/components/admin/data-table/data-table-toolbar"
import { DataTablePagination } from "@/components/admin/data-table/data-table-pagination"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableSkeleton } from "@/components/ui/loading-skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  MoreVerticalIcon,
  Edit02Icon,
  Delete02Icon,
  User02Icon,
} from "@hugeicons/core-free-icons"

type Doctor = Doc<"doctors">

const PAGE_SIZE = 10

const availabilityLabel: Record<Doctor["availabilityStatus"], string> = {
  available_today: "Available Today",
  available_this_week: "This Week",
  unavailable: "Unavailable",
}

export function DoctorsManager() {
  const router = useRouter()
  const doctors = useQuery(api.doctors.list)
  const removeDoctor = useMutation(api.doctors.remove)
  const bulkRemoveDoctors = useMutation(api.doctors.bulkRemove)

  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [deleting, setDeleting] = React.useState<Doctor | null>(null)
  const [bulkDeleting, setBulkDeleting] = React.useState(false)

  const filtered = React.useMemo(() => {
    if (!doctors) return undefined
    if (!search.trim()) return doctors
    const q = search.toLowerCase()
    return doctors.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q)
    )
  }, [doctors, search])

  const totalCount = filtered?.length ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = filtered?.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id])

  const columns: ColumnDef<Doctor, unknown>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium text-foreground">{row.original.name}</span>
      ),
    },
    { accessorKey: "specialty", header: "Specialty" },
    {
      accessorKey: "experienceYears",
      header: "Experience",
      cell: ({ row }) => `${row.original.experienceYears} yrs`,
    },
    {
      accessorKey: "startingFee",
      header: "Fee",
      cell: ({ row }) => `৳${row.original.startingFee.toLocaleString()}`,
    },
    {
      id: "availabilityStatus",
      header: "Availability",
      cell: ({ row }) => (
        <Badge variant="outline">
          {availabilityLabel[row.original.availabilityStatus]}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
            <HugeiconsIcon icon={MoreVerticalIcon} strokeWidth={1.5} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                router.push(`/admin/doctors/${row.original._id}/edit`)
              }
            >
              <HugeiconsIcon icon={Edit02Icon} strokeWidth={1.5} />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleting(row.original)}
            >
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={1.5} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div>
      <AdminPageHeader
        title="Doctors"
        description="Manage doctor profiles shown on the public directory."
        action={
          <Button className="gap-2" render={<Link href="/admin/doctors/new" />} nativeButton={false}>
            <HugeiconsIcon icon={Add01Icon} strokeWidth={1.5} />
            Add Doctor
          </Button>
        }
      />

      <div className="space-y-4">
        <DataTableToolbar
          search={search}
          onSearchChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          searchPlaceholder="Search doctors by name or specialty..."
          selectedCount={selectedIds.length}
          bulkActions={
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleting(true)}
            >
              Delete selected
            </Button>
          }
        />

        {doctors === undefined ? (
          <TableSkeleton rows={6} />
        ) : totalCount === 0 ? (
          <EmptyState
            icon={User02Icon}
            title="No doctors found."
            description="Add your first doctor to get started."
            action={
              <Button render={<Link href="/admin/doctors/new" />} nativeButton={false}>
                Add Doctor
              </Button>
            }
          />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={paged ?? []}
              getRowId={(row) => row._id}
              enableRowSelection
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
            />
            <DataTablePagination
              page={safePage}
              totalPages={totalPages}
              totalCount={totalCount}
              from={totalCount === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}
              to={Math.min(safePage * PAGE_SIZE, totalCount)}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete doctor?"
        description={`This will permanently delete "${deleting?.name}" and their hospital affiliation and schedule.`}
        confirmLabel="Delete"
        onConfirm={async () => {
          if (!deleting) return
          try {
            await removeDoctor({ id: deleting._id })
            toast.success("Doctor deleted")
          } catch {
            toast.error("Couldn't delete doctor")
          }
        }}
      />

      <ConfirmDialog
        open={bulkDeleting}
        onOpenChange={setBulkDeleting}
        title={`Delete ${selectedIds.length} doctors?`}
        description="This will permanently delete all selected doctors."
        confirmLabel="Delete all"
        onConfirm={async () => {
          try {
            await bulkRemoveDoctors({ ids: selectedIds as Doctor["_id"][] })
            setRowSelection({})
            toast.success("Doctors deleted")
          } catch {
            toast.error("Couldn't delete doctors")
          }
        }}
      />
    </div>
  )
}
