"use client"

import { use } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { DoctorForm } from "@/components/admin/doctors/doctor-form"
import { TableSkeleton } from "@/components/ui/loading-skeleton"

export default function EditDoctorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const existing = useQuery(
    api.doctors.get,
    id ? { id: id as any } : "skip"
  )

  if (existing === undefined) {
    return <TableSkeleton rows={4} />
  }

  if (!existing?.doctor) {
    return <div className="text-sm text-muted-foreground">Doctor not found.</div>
  }

  return (
    <DoctorForm
      doctor={existing.doctor}
      affiliation={existing.affiliation}
    />
  )
}
