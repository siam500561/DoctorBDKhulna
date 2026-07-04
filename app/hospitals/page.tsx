import type { Metadata } from "next"
import { HospitalsDirectory } from "@/components/hospitals/hospitals-directory"

export const metadata: Metadata = {
  title: "Hospitals | DoctorBD",
  description:
    "Browse trusted hospitals and diagnostic centers in Khulna and Bagerhat.",
}

export default function HospitalsPage() {
  return <HospitalsDirectory />
}
