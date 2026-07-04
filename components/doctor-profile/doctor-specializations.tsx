import { Badge } from "@/components/ui/badge"

interface DoctorSpecializationsProps {
  specializations: string[]
}

export function DoctorSpecializations({
  specializations,
}: DoctorSpecializationsProps) {
  return (
    <section aria-labelledby="specializations-heading">
      <h2
        id="specializations-heading"
        className="font-heading text-lg font-semibold text-foreground"
      >
        Specializations
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {specializations.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="h-7 rounded-full px-3 text-xs font-normal"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </section>
  )
}
