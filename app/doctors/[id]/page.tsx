import type { Metadata } from "next"
import { DoctorProfileView } from "@/components/doctor-profile/doctor-profile-view"
import { DoctorNotFound } from "@/components/doctor-profile/doctor-not-found"
import {
  getDoctorById,
  getHospitalByName,
  getRelatedDoctors,
  buildDoctorProfile,
} from "@/lib/doctor-profile"

interface DoctorPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: DoctorPageProps): Promise<Metadata> {
  const { id } = await params
  const doctor = getDoctorById(id)

  if (!doctor) {
    return { title: "Doctor Not Found | DoctorBD" }
  }

  return {
    title: `${doctor.name} — ${doctor.specialty} | DoctorBD`,
    description: `Book an appointment with ${doctor.name}, ${doctor.specialty} specialist at ${doctor.hospital}.`,
  }
}

export default async function DoctorProfilePage({ params }: DoctorPageProps) {
  const { id } = await params
  const doctor = getDoctorById(id)

  if (!doctor) {
    return <DoctorNotFound />
  }

  const profile = buildDoctorProfile(doctor)
  const hospital = getHospitalByName(doctor.hospital)
  const relatedDoctors = getRelatedDoctors(doctor)

  return (
    <DoctorProfileView
      doctor={doctor}
      profile={profile}
      hospital={hospital}
      relatedDoctors={relatedDoctors}
    />
  )
}
