import type { Metadata } from "next"
import { EditHospitalClient } from "./edit-client"

export const metadata: Metadata = {
  title: "Edit Hospital | DoctorBDKhulna Admin",
}

export default function EditHospitalPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  return <EditHospitalClient params={params} />
}
