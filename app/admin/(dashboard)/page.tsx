"use client"

import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { StatCard } from "@/components/admin/stat-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  User02Icon,
  Hospital01Icon,
  UserAdd01Icon,
  Building01Icon,
  Globe02Icon,
  InboxIcon,
} from "@hugeicons/core-free-icons"

function RecentCard<T>({
  title,
  href,
  items,
  renderItem,
}: {
  title: string
  href: string
  items: T[] | undefined
  renderItem: (item: T) => React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold text-foreground">
          {title}
        </h3>
        <Link
          href={href}
          className="text-xs font-medium text-primary hover:text-primary/80"
        >
          View all
        </Link>
      </div>
      {items === undefined ? (
        <div className="space-y-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={InboxIcon}
          title="Nothing here yet"
          className="py-8"
        />
      ) : (
        <ul className="space-y-2.5">
          {items.map((item, i) => (
            <li key={i}>{renderItem(item)}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function AdminDashboardPage() {
  const overview = useQuery(api.dashboard.overview)

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your Doctor Directory."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Total Doctors"
          value={overview?.totals.doctors ?? "—"}
          icon={User02Icon}
        />
        <StatCard
          label="Total Hospitals"
          value={overview?.totals.hospitals ?? "—"}
          icon={Hospital01Icon}
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <Button
          className="gap-2"
          nativeButton={false}
          render={<Link href="/admin/doctors" />}
        >
          <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={1.5} />
          Add Doctor
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          nativeButton={false}
          render={<Link href="/admin/hospitals" />}
        >
          <HugeiconsIcon icon={Building01Icon} strokeWidth={1.5} />
          Add Hospital
        </Button>
        <Button
          variant="ghost"
          className="gap-2"
          nativeButton={false}
          render={<Link href="/" target="_blank" />}
        >
          <HugeiconsIcon icon={Globe02Icon} strokeWidth={1.5} />
          View Website
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentCard
          title="Recent Doctors"
          href="/admin/doctors"
          items={overview?.recentDoctors}
          renderItem={(d) => (
            <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
              <span className="truncate text-sm text-foreground">{d.name}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {d.experienceYears} yrs
              </span>
            </div>
          )}
        />
        <RecentCard
          title="Recent Hospitals"
          href="/admin/hospitals"
          items={overview?.recentHospitals}
          renderItem={(h) => (
            <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
              <span className="truncate text-sm text-foreground">{h.name}</span>
              <span className="shrink-0 text-xs text-muted-foreground capitalize">
                {h.type.replace("_", " ")}
              </span>
            </div>
          )}
        />
      </div>
    </div>
  )
}
