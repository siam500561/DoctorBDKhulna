import { DoctorPanel } from "@/components/doctors/doctor-panel"
import type { doctors as allDoctors } from "@/components/home/data"

interface RelatedDoctorsProps {
  doctors: (typeof allDoctors)[number][]
}

export function RelatedDoctors({ doctors }: RelatedDoctorsProps) {
  if (doctors.length === 0) return null

  return (
    <section aria-labelledby="related-heading">
      <h2
        id="related-heading"
        className="font-heading text-lg font-semibold text-foreground"
      >
        Related Doctors
      </h2>
      <div className="mt-3 space-y-3">
        {doctors.map((doctor) => (
          <DoctorPanel key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </section>
  )
}
