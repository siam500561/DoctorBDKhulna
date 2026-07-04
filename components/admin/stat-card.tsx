import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"

interface StatCardProps {
  label: string
  value: number | string
  icon: IconSvgElement
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <HugeiconsIcon icon={icon} strokeWidth={1.5} className="size-5 text-primary" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 font-heading text-2xl font-semibold text-foreground">
          {value}
        </p>
      </div>
    </div>
  )
}
