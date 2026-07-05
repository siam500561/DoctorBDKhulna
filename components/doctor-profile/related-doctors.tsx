import { DoctorPanel } from "@/components/doctors/doctor-panel"
import type { PublicDoctor } from "@/lib/public-types"

interface RelatedDoctorsProps {
  doctors: PublicDoctor[]
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
          <DoctorPanel key={doctor._id} doctor={doctor} />
        ))}
      </div>
    </section>
  )
}
