import { JsonLd } from "@/components/seo/json-ld"
import { specialtyLabel } from "@/components/admin/specialties"
import { siteConfig } from "@/lib/site"
import type { PublicDoctor } from "@/lib/public-types"
import type { Doc } from "@/convex/_generated/dataModel"

interface PhysicianJsonLdProps {
  doctor: PublicDoctor
  hospital: Doc<"hospitals"> | null
}

export function PhysicianJsonLd({ doctor, hospital }: PhysicianJsonLdProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Physician",
        name: doctor.name,
        url: `${siteConfig.url}/doctors/${doctor.slug}`,
        image: doctor.photoUrl ?? undefined,
        medicalSpecialty: specialtyLabel(doctor.specialty),
        description: doctor.bio.join(" "),
        knowsLanguage: doctor.languages,
        ...(doctor.reviewCount > 0 && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: doctor.averageRating,
            reviewCount: doctor.reviewCount,
          },
        }),
        ...(hospital && {
          worksFor: {
            "@type": "Hospital",
            name: hospital.name,
            address: hospital.address,
            telephone: hospital.phone,
          },
        }),
      }}
    />
  )
}
