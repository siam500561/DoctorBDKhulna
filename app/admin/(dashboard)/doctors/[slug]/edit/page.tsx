import type { Metadata } from "next"
import { EditDoctorClient } from "./edit-client"

export const metadata: Metadata = {
  title: "Edit Doctor | DoctorBDKhulna Admin",
}

export default function EditDoctorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  return <EditDoctorClient params={params} />
}
