import type { Metadata } from "next"
import { AdminLoginPage } from "./login-client"

export const metadata: Metadata = {
  title: "Admin Login | DoctorBDKhulna",
}

export default function Page() {
  return <AdminLoginPage />
}
