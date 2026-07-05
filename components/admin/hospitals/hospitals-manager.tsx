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
  Hospital01Icon,
} from "@hugeicons/core-free-icons"

type Hospital = Doc<"hospitals">

const PAGE_SIZE = 10

export function HospitalsManager() {
  const router = useRouter()
  const hospitals = useQuery(api.hospitals.list)
  const districts = useQuery(api.districts.list)
  const removeHospital = useMutation(api.hospitals.remove)
  const bulkRemoveHospitals = useMutation(api.hospitals.bulkRemove)

  const districtName = React.useMemo(() => {
    const map = new Map<string, string>()
    districts?.forEach((d) => map.set(d._id, d.name))
    return map
  }, [districts])

  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [deleting, setDeleting] = React.useState<Hospital | null>(null)
  const [bulkDeleting, setBulkDeleting] = React.useState(false)

  const filtered = React.useMemo(() => {
    if (!hospitals) return undefined
    if (!search.trim()) return hospitals
    const q = search.toLowerCase()
    return hospitals.filter((h) => h.name.toLowerCase().includes(q))
  }, [hospitals, search])

  const totalCount = filtered?.length ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = filtered?.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id])

  const columns: ColumnDef<Hospital, unknown>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium text-foreground">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="capitalize text-muted-foreground">
          {row.original.type.replace("_", " ")}
        </span>
      ),
    },
    {
      id: "district",
      header: "District",
      cell: ({ row }) =>
        districtName.get(row.original.districtId) ?? "—",
    },
    { accessorKey: "phone", header: "Phone" },
    {
      id: "emergency",
      header: "Emergency",
      cell: ({ row }) =>
        row.original.emergencyAvailable ? (
          <Badge className="bg-green-500/10 text-green-600 dark:text-green-400">
            Yes
          </Badge>
        ) : (
          <span className="text-muted-foreground">No</span>
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
                router.push(`/admin/hospitals/${row.original.slug}/edit`)
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
        title="Hospitals"
        description="Manage hospitals and diagnostic centers shown on the public directory."
        action={
          <Button className="gap-2" render={<Link href="/admin/hospitals/new" />} nativeButton={false}>
            <HugeiconsIcon icon={Add01Icon} strokeWidth={1.5} />
            Add Hospital
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
          searchPlaceholder="Search hospitals..."
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

        {hospitals === undefined ? (
          <TableSkeleton rows={6} />
        ) : totalCount === 0 ? (
          <EmptyState
            icon={Hospital01Icon}
            title="No hospitals found."
            description="Add your first hospital to get started."
            action={
              <Button render={<Link href="/admin/hospitals/new" />} nativeButton={false}>
                Add Hospital
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
        title="Delete hospital?"
        description={`This will permanently delete "${deleting?.name}".`}
        confirmLabel="Delete"
        onConfirm={async () => {
          if (!deleting) return
          try {
            await removeHospital({ id: deleting._id })
            toast.success("Hospital deleted")
          } catch {
            toast.error("Couldn't delete hospital")
          }
        }}
      />

      <ConfirmDialog
        open={bulkDeleting}
        onOpenChange={setBulkDeleting}
        title={`Delete ${selectedIds.length} hospitals?`}
        description="This will permanently delete all selected hospitals."
        confirmLabel="Delete all"
        onConfirm={async () => {
          try {
            await bulkRemoveHospitals({
              ids: selectedIds as Hospital["_id"][],
            })
            setRowSelection({})
            toast.success("Hospitals deleted")
          } catch {
            toast.error("Couldn't delete hospitals")
          }
        }}
      />
    </div>
  )
}
