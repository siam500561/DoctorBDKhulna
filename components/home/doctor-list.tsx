import { DoctorCard } from "@/components/home/doctor-card"
import { doctors } from "@/components/home/data"

interface DoctorListProps {
  activeCategory: string | null
}

export function DoctorList({ activeCategory }: DoctorListProps) {
  const filtered = activeCategory
    ? doctors.filter((d) => d.specialty === activeCategory)
    : doctors

  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          {activeCategory || "All Doctors"}
        </h2>
        <p className="text-xs text-muted-foreground">
          {filtered.length} doctor{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border/60 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No doctors found in this category.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  )
}
