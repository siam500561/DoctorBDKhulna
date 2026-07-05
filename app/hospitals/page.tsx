import { Suspense } from "react"
import type { Metadata } from "next"
import { preloadQuery } from "convex/nextjs"
import { HospitalsDirectory } from "@/components/hospitals/hospitals-directory"
import { api } from "@/convex/_generated/api"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Hospitals",
  description: "Browse trusted hospitals and diagnostic centers in Khulna.",
  alternates: { canonical: "/hospitals" },
}

export default async function HospitalsPage() {
  const preloadedHospitals = await preloadQuery(api.hospitals.listPublic)

  return (
    <Suspense>
      <HospitalsDirectory preloadedHospitals={preloadedHospitals} />
    </Suspense>
  )
}
