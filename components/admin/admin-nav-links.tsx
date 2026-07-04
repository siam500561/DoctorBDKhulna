"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardSquare01Icon,
  User02Icon,
  Hospital01Icon,
} from "@hugeicons/core-free-icons"

export const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: DashboardSquare01Icon, exact: true },
  { href: "/admin/doctors", label: "Doctors", icon: User02Icon },
  { href: "/admin/hospitals", label: "Hospitals", icon: Hospital01Icon },
]

interface AdminNavLinksProps {
  collapsed?: boolean
  onNavigate?: () => void
}

export function AdminNavLinks({ collapsed, onNavigate }: AdminNavLinksProps) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-0.5">
      {adminNavItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              collapsed && "justify-center px-2",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            title={collapsed ? item.label : undefined}
          >
            <HugeiconsIcon
              icon={item.icon}
              strokeWidth={1.5}
              className="size-4 shrink-0"
            />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        )
      })}
    </nav>
  )
}
