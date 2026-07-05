import type { Metadata } from "next"
import Link from "next/link"
import { fetchQuery } from "convex/nextjs"
import { Container } from "@/components/ui/container"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { Building01Icon } from "@hugeicons/core-free-icons"
import { HospitalDetailsView } from "@/components/hospitals/hospital-details-view"
import { HospitalJsonLd } from "@/components/seo/hospital-json-ld"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import { hospitalTypeLabels } from "@/lib/labels"
import { api } from "@/convex/_generated/api"

interface HospitalPageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 300

export async function generateMetadata({
  params,
}: HospitalPageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await fetchQuery(api.hospitals.getPublicBySlug, {
    slug,
  }).catch(() => null)

  if (!result) {
    return { title: "Hospital Not Found" }
  }

  const { hospital } = result
  const typeLabel = hospitalTypeLabels[hospital.type] ?? hospital.type
  const title = hospital.name
  const description = `${typeLabel} in ${hospital.districtName ?? "Khulna"}. Find doctors, contact information, facilities, and departments at ${hospital.name}.`

  return {
    title,
    description,
    alternates: { canonical: `/hospitals/${hospital.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: hospital.coverImageUrl ? [{ url: hospital.coverImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: hospital.coverImageUrl ? [hospital.coverImageUrl] : undefined,
    },
  }
}

export default async function HospitalPage({ params }: HospitalPageProps) {
  const { slug } = await params
  const result = await fetchQuery(api.hospitals.getPublicBySlug, {
    slug,
  }).catch(() => null)

  if (!result) {
    return (
      <Container>
        <div className="py-16">
          <EmptyState
            icon={Building01Icon}
            title="Hospital not found."
            description="The hospital you're looking for doesn't exist or may have been removed."
            action={
              <Button render={<Link href="/hospitals" />}>
                Return to Hospitals
              </Button>
            }
          />
        </div>
      </Container>
    )
  }

  return (
    <>
      <HospitalJsonLd hospital={result.hospital} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Hospitals", path: "/hospitals" },
          { name: result.hospital.name, path: `/hospitals/${result.hospital.slug}` },
        ]}
      />
      <HospitalDetailsView hospital={result.hospital} doctors={result.doctors} />
    </>
  )
}
