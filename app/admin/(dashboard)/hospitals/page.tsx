import type { Metadata } from "next"
import { HospitalsManager } from "@/components/admin/hospitals/hospitals-manager"

export const metadata: Metadata = {
  title: "Manage Hospitals | DoctorBDKhulna Admin",
}

export default function AdminHospitalsPage() {
  return <HospitalsManager />
}
