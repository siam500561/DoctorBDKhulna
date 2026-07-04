import { HugeiconsIcon } from "@hugeicons/react"
import { Briefcase01Icon } from "@hugeicons/core-free-icons"
import type { DoctorProfile } from "@/lib/doctor-profile"

interface DoctorExperienceProps {
  experience: DoctorProfile["experience"]
}

export function DoctorExperience({ experience }: DoctorExperienceProps) {
  return (
    <section aria-labelledby="experience-heading">
      <h2
        id="experience-heading"
        className="font-heading text-lg font-semibold text-foreground"
      >
        Experience
      </h2>
      <ol className="mt-4 space-y-6">
        {experience.map((item, i) => (
          <li key={i} className="relative flex gap-4 pl-1">
            <div className="flex flex-col items-center">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
                <HugeiconsIcon
                  icon={Briefcase01Icon}
                  strokeWidth={1.5}
                  className="size-3.5 text-muted-foreground"
                />
              </span>
              {i < experience.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-border" />
              )}
            </div>
            <div className="min-w-0 pb-1">
              <p className="text-sm font-medium text-foreground">
                {item.designation}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {item.hospital} &middot; {item.period}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
