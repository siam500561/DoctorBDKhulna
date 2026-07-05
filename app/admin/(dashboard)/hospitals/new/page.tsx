import type { Metadata } from "next"
import { NewHospitalClient } from "./new-client"

export const metadata: Metadata = {
  title: "Add Hospital | DoctorBDKhulna Admin",
}

export default function NewHospitalPage() {
  return <NewHospitalClient />
}
