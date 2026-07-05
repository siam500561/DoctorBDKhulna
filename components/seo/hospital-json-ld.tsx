import { JsonLd } from "@/components/seo/json-ld"
import { hospitalTypeLabels } from "@/lib/labels"
import { siteConfig } from "@/lib/site"
import type { PublicHospital } from "@/lib/public-types"

interface HospitalJsonLdProps {
  hospital: PublicHospital
}

export function HospitalJsonLd({ hospital }: HospitalJsonLdProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Hospital",
        name: hospital.name,
        url: `${siteConfig.url}/hospitals/${hospital.slug}`,
        image: hospital.coverImageUrl ?? undefined,
        description: `${hospitalTypeLabels[hospital.type] ?? hospital.type} in ${hospital.districtName ?? "Khulna"}.`,
        telephone: hospital.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: hospital.address,
          addressLocality: hospital.districtName ?? "Khulna",
          addressCountry: "BD",
        },
        medicalSpecialty: hospital.departments,
        amenityFeature: hospital.facilities.map((facility) => ({
          "@type": "LocationFeatureSpecification",
          name: facility,
        })),
      }}
    />
  )
}
