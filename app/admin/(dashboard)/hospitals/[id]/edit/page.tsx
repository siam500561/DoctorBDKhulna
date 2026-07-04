"use client"

import { use } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { HospitalForm } from "@/components/admin/hospitals/hospital-form"
import { TableSkeleton } from "@/components/ui/loading-skeleton"

export default function EditHospitalPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const hospital = useQuery(api.hospitals.get, { id: id as any })

  if (hospital === undefined) {
    return <TableSkeleton rows={4} />
  }

  if (!hospital) {
    return <div className="text-sm text-muted-foreground">Hospital not found.</div>
  }

  return <HospitalForm hospital={hospital} />
}
