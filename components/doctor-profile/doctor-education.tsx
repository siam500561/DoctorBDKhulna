import { HugeiconsIcon } from "@hugeicons/react"
import { GraduationScrollIcon } from "@hugeicons/core-free-icons"
import type { DoctorProfile } from "@/lib/doctor-profile"

interface DoctorEducationProps {
  education: DoctorProfile["education"]
}

export function DoctorEducation({ education }: DoctorEducationProps) {
  return (
    <section aria-labelledby="education-heading">
      <h2
        id="education-heading"
        className="font-heading text-lg font-semibold text-foreground"
      >
        Education
      </h2>
      <ol className="mt-4 space-y-6">
        {education.map((item, i) => (
          <li key={i} className="relative flex gap-4 pl-1">
            <div className="flex flex-col items-center">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
                <HugeiconsIcon
                  icon={GraduationScrollIcon}
                  strokeWidth={1.5}
                  className="size-3.5 text-muted-foreground"
                />
              </span>
              {i < education.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-border" />
              )}
            </div>
            <div className="min-w-0 pb-1">
              <p className="text-sm font-medium text-foreground">
                {item.degree}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {item.institute} &middot; {item.year}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
