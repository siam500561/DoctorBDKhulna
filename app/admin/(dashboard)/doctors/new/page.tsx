import type { Metadata } from "next"
import { NewDoctorClient } from "./new-client"

export const metadata: Metadata = {
  title: "Add Doctor | DoctorBDKhulna Admin",
}

export default function NewDoctorPage() {
  return <NewDoctorClient />
}
