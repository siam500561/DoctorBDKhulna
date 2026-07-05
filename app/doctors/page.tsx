import { Suspense } from "react"
import type { Metadata } from "next"
import { preloadQuery } from "convex/nextjs"
import { DoctorsDirectory } from "@/components/doctors/doctors-directory"
import { api } from "@/convex/_generated/api"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Find Your Doctor",
  description:
    "Browse verified doctors across Khulna, filtered by specialty, hospital, district, and more.",
  alternates: { canonical: "/doctors" },
}

export default async function DoctorsPage() {
  const preloadedDoctors = await preloadQuery(api.doctors.listPublic)

  return (
    <Suspense>
      <DoctorsDirectory preloadedDoctors={preloadedDoctors} />
    </Suspense>
  )
}
