"use client"

import * as React from "react"
import Link from "next/link"
import { Container } from "@/components/ui/container"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { DoctorProfileHeader } from "@/components/doctor-profile/doctor-profile-header"
import { DoctorAbout } from "@/components/doctor-profile/doctor-about"
import { DoctorEducation } from "@/components/doctor-profile/doctor-education"
import { DoctorExperience } from "@/components/doctor-profile/doctor-experience"
import { DoctorSpecializations } from "@/components/doctor-profile/doctor-specializations"
import { TreatedConditions } from "@/components/doctor-profile/treated-conditions"
import { ConsultationInfo } from "@/components/doctor-profile/consultation-info"
import { HospitalInfo } from "@/components/doctor-profile/hospital-info"
import { WeeklySchedule } from "@/components/doctor-profile/weekly-schedule"
import { DoctorReviews } from "@/components/doctor-profile/doctor-reviews"
import { RelatedDoctors } from "@/components/doctor-profile/related-doctors"
import { DoctorProfileSkeleton } from "@/components/doctor-profile/doctor-profile-skeleton"
import type { doctors as allDoctors, hospitals } from "@/components/home/data"
import type { DoctorProfile } from "@/lib/doctor-profile"

type Doctor = (typeof allDoctors)[number]
type Hospital = (typeof hospitals)[number]

interface DoctorProfileViewProps {
  doctor: Doctor
  profile: DoctorProfile
  hospital: Hospital | undefined
  relatedDoctors: Doctor[]
}

export function DoctorProfileView({
  doctor,
  profile,
  hospital,
  relatedDoctors,
}: DoctorProfileViewProps) {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <Container>
      <div className="pt-6 pb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/doctors" />}>
                Doctors
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{doctor.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {isLoading ? (
        <div className="pb-16">
          <DoctorProfileSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10 pb-16 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <DoctorProfileHeader doctor={doctor} profile={profile} />
            <DoctorAbout bio={profile.bio} />
            <DoctorEducation education={profile.education} />
            <DoctorExperience experience={profile.experience} />
            <DoctorSpecializations specializations={profile.specializations} />
            <TreatedConditions conditions={profile.treatedConditions} />
            <WeeklySchedule schedule={profile.schedule} />
            <DoctorReviews reviews={profile.reviews} />
          </div>

          <div className="space-y-10">
            <ConsultationInfo consultation={profile.consultation} />
            {hospital && <HospitalInfo hospital={hospital} />}
          </div>

          <div className="lg:col-span-3">
            <RelatedDoctors doctors={relatedDoctors} />
          </div>
        </div>
      )}
    </Container>
  )
}
