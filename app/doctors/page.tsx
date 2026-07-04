import { Suspense } from "react"
import type { Metadata } from "next"
import { DoctorsDirectory } from "@/components/doctors/doctors-directory"

export const metadata: Metadata = {
  title: "Find Your Doctor | DoctorBD",
  description:
    "Browse verified doctors across Khulna and Bagerhat, filtered by specialty, hospital, district, and more.",
}

export default function DoctorsPage() {
  return (
    <Suspense>
      <DoctorsDirectory />
    </Suspense>
  )
}
