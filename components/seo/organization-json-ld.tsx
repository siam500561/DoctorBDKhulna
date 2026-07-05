import { JsonLd } from "@/components/seo/json-ld"
import { siteConfig } from "@/lib/site"

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "MedicalBusiness",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        areaServed: {
          "@type": "City",
          name: "Khulna",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteConfig.url}/doctors?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      }}
    />
  )
}
