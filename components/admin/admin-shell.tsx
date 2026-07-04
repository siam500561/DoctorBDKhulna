"use client"

import * as React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminTopbar } from "@/components/admin/admin-topbar"

interface AdminShellProps {
  email?: string
  children: React.ReactNode
}

export function AdminShell({ email, children }: AdminShellProps) {
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <div className="flex min-h-svh">
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar email={email} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
