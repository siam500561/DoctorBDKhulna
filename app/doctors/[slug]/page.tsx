import type { Metadata } from "next"
import { fetchQuery } from "convex/nextjs"
import { DoctorProfileView } from "@/components/doctor-profile/doctor-profile-view"
import { DoctorNotFound } from "@/components/doctor-profile/doctor-not-found"
import { specialtyLabel } from "@/components/admin/specialties"
import { PhysicianJsonLd } from "@/components/seo/physician-json-ld"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import { api } from "@/convex/_generated/api"

interface DoctorPageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 300

export async function generateMetadata({
  params,
}: DoctorPageProps): Promise<Metadata> {
  const { slug } = await params
  const doctor = await fetchQuery(api.doctors.getPublicBySlug, {
    slug,
  }).catch(() => null)

  if (!doctor) {
    return { title: "Doctor Not Found" }
  }

  const specialty = specialtyLabel(doctor.specialty)
  const title = `${doctor.name} — ${specialty}`
  const description = `Book an appointment with ${doctor.name}, a ${specialty} specialist${doctor.hospitalName ? ` at ${doctor.hospitalName}` : ""} in ${doctor.districtName ?? "Khulna"}. ${doctor.experienceYears} years of experience, rated ${doctor.averageRating}/5.`

  return {
    title,
    description,
    alternates: { canonical: `/doctors/${doctor.slug}` },
    openGraph: {
      title,
      description,
      type: "profile",
      images: doctor.photoUrl ? [{ url: doctor.photoUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: doctor.photoUrl ? [doctor.photoUrl] : undefined,
    },
  }
}

export default async function DoctorProfilePage({ params }: DoctorPageProps) {
  const { slug } = await params
  const doctor = await fetchQuery(api.doctors.getPublicBySlug, {
    slug,
  }).catch(() => null)

  if (!doctor) {
    return <DoctorNotFound />
  }

  const [hospitalResult, relatedDoctors] = await Promise.all([
    doctor.hospitalId
      ? fetchQuery(api.hospitals.getPublic, { id: doctor.hospitalId }).catch(
          () => null
        )
      : Promise.resolve(null),
    fetchQuery(api.doctors.listRelatedPublic, {
      id: doctor._id,
      specialty: doctor.specialty,
    }).catch(() => []),
  ])

  const hospital = hospitalResult?.hospital ?? null

  return (
    <>
      <PhysicianJsonLd doctor={doctor} hospital={hospital} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Doctors", path: "/doctors" },
          { name: doctor.name, path: `/doctors/${doctor.slug}` },
        ]}
      />
      <DoctorProfileView
        doctor={doctor}
        hospital={hospital}
        relatedDoctors={relatedDoctors}
      />
    </>
  )
}
