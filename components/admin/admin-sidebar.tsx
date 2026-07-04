"use client"

import Link from "next/link"
import { AdminNavLinks } from "@/components/admin/admin-nav-links"
import LogoutButton from "@/components/admin/logout-button"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  collapsed: boolean
  onToggleCollapsed: () => void
}

export function AdminSidebar({
  collapsed,
  onToggleCollapsed,
}: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-svh shrink-0 flex-col border-r border-border/60 bg-card transition-all duration-200 md:flex",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-border/60 px-4",
          collapsed && "justify-center px-2"
        )}
      >
        <Link href="/admin" className="flex items-center gap-2 overflow-hidden">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
            D
          </span>
          {!collapsed && (
            <span className="truncate font-heading text-sm font-semibold text-foreground">
              DoctorBD Admin
            </span>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <AdminNavLinks collapsed={collapsed} />
      </div>

      <div className="border-t border-border/60 p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapsed}
          className={cn("mb-2 w-full gap-2", collapsed && "justify-center px-0")}
        >
          <HugeiconsIcon
            icon={collapsed ? PanelLeftOpenIcon : PanelLeftCloseIcon}
            strokeWidth={1.5}
            className="size-4"
          />
          {!collapsed && "Collapse"}
        </Button>
        {collapsed ? (
          <LogoutButton iconOnly />
        ) : (
          <LogoutButton className="w-full" />
        )}
      </div>
    </aside>
  )
}
