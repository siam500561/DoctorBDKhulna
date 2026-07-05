"use client"

import { use } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { HospitalForm } from "@/components/admin/hospitals/hospital-form"
import { TableSkeleton } from "@/components/ui/loading-skeleton"

export function EditHospitalClient({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const hospital = useQuery(
    api.hospitals.getBySlug,
    slug ? { slug } : "skip"
  )

  if (hospital === undefined) {
    return <TableSkeleton rows={4} />
  }

  if (!hospital) {
    return <div className="text-sm text-muted-foreground">Hospital not found.</div>
  }

  return <HospitalForm hospital={hospital} />
}
