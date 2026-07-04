import { Skeleton } from "@/components/ui/skeleton"

export function DoctorPanelSkeleton() {
  return (
    <div className="flex flex-col gap-5 rounded-xl border border-border/60 bg-card p-5 sm:flex-row sm:items-start md:p-6">
      <Skeleton className="size-20 shrink-0 rounded-2xl sm:size-24" />

      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>

        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <Skeleton className="h-4 w-20" />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-24 rounded-lg" />
            <Skeleton className="h-7 w-32 rounded-lg" />
            <Skeleton className="size-7 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
