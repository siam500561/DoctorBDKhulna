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
import { DoctorSpecializations } from "@/components/doctor-profile/doctor-specializations"
import { TreatedConditions } from "@/components/doctor-profile/treated-conditions"
import { ConsultationInfo } from "@/components/doctor-profile/consultation-info"
import { HospitalInfo } from "@/components/doctor-profile/hospital-info"
import { WeeklySchedule } from "@/components/doctor-profile/weekly-schedule"
import { RelatedDoctors } from "@/components/doctor-profile/related-doctors"
import type { Doc } from "@/convex/_generated/dataModel"
import type { PublicDoctor } from "@/lib/public-types"

interface DoctorProfileViewProps {
  doctor: PublicDoctor
  hospital: Doc<"hospitals"> | null
  relatedDoctors: PublicDoctor[]
}

export function DoctorProfileView({
  doctor,
  hospital,
  relatedDoctors,
}: DoctorProfileViewProps) {
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

      <div className="grid grid-cols-1 gap-10 pb-16 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <DoctorProfileHeader doctor={doctor} />
          <DoctorAbout bio={doctor.bio} />
          <DoctorEducation education={doctor.education} />
          <DoctorSpecializations specializations={doctor.specializations} />
          <TreatedConditions conditions={doctor.treatedConditions} />
          {doctor.workingHours && (
            <WeeklySchedule schedule={doctor.workingHours} />
          )}
        </div>

        <div className="space-y-10">
          <ConsultationInfo doctor={doctor} />
          {hospital && <HospitalInfo hospital={hospital} />}
        </div>

        <div className="lg:col-span-3">
          <RelatedDoctors doctors={relatedDoctors} />
        </div>
      </div>
    </Container>
  )
}
