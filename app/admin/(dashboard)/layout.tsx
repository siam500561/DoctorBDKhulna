import { cookies } from "next/headers"
import { verifySession, SESSION_COOKIE } from "@/lib/auth"
import { AdminShell } from "@/components/admin/admin-shell"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const session = token ? await verifySession(token) : null

  return <AdminShell email={session?.email}>{children}</AdminShell>
}
