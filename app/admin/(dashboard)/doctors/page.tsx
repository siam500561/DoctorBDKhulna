import type { Metadata } from "next"
import { DoctorsManager } from "@/components/admin/doctors/doctors-manager"

export const metadata: Metadata = {
  title: "Manage Doctors | DoctorBDKhulna Admin",
}

export default function AdminDoctorsPage() {
  return <DoctorsManager />
}
