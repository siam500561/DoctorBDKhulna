import { HugeiconsIcon } from "@hugeicons/react"
import { Clock01Icon } from "@hugeicons/core-free-icons"
import type { DoctorProfile } from "@/lib/doctor-profile"

interface WeeklyScheduleProps {
  schedule: DoctorProfile["schedule"]
}

export function WeeklySchedule({ schedule }: WeeklyScheduleProps) {
  return (
    <section aria-labelledby="schedule-heading">
      <h2
        id="schedule-heading"
        className="font-heading text-lg font-semibold text-foreground"
      >
        Schedule
      </h2>
      <div className="mt-3 flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 px-5 py-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <HugeiconsIcon
            icon={Clock01Icon}
            strokeWidth={1.5}
            className="size-5 text-primary"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{schedule}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Friday: Closed
          </p>
        </div>
      </div>
    </section>
  )
}
