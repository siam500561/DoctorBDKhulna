import { Skeleton } from "@/components/ui/skeleton"

export function DoctorProfileSkeleton() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 border-b border-border/60 pb-8 sm:flex-row sm:items-start">
        <Skeleton className="size-28 shrink-0 rounded-2xl sm:size-32" />
        <div className="min-w-0 flex-1 space-y-3">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-44" />
          <div className="flex flex-wrap gap-4 pt-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex gap-2 pt-3">
            <Skeleton className="h-9 w-36 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="size-9 rounded-lg" />
            <Skeleton className="size-9 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-11/12" />
        <Skeleton className="h-3 w-3/4" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    </div>
  )
}
