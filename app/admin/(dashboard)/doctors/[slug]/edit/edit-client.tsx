"use client"

import { use } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { DoctorForm } from "@/components/admin/doctors/doctor-form"
import { TableSkeleton } from "@/components/ui/loading-skeleton"

export function EditDoctorClient({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const existing = useQuery(
    api.doctors.getBySlug,
    slug ? { slug } : "skip"
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
