import type { Metadata } from "next"
import Link from "next/link"
import { Container } from "@/components/ui/container"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { Building01Icon } from "@hugeicons/core-free-icons"
import { HospitalDetailsView } from "@/components/hospitals/hospital-details-view"
import { doctors, hospitals } from "@/components/home/data"

interface HospitalPageProps {
  params: Promise<{ id: string }>
}

function getHospitalById(id: string) {
  return hospitals.find((hospital) => hospital.id === Number(id))
}

export async function generateMetadata({
  params,
}: HospitalPageProps): Promise<Metadata> {
  const { id } = await params
  const hospital = getHospitalById(id)

  if (!hospital) {
    return { title: "Hospital Not Found | DoctorBD" }
  }

  return {
    title: `${hospital.name} | DoctorBD`,
    description: `Find doctors and contact information for ${hospital.name}.`,
  }
}

export default async function HospitalPage({ params }: HospitalPageProps) {
  const { id } = await params
  const hospital = getHospitalById(id)

  if (!hospital) {
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

  const hospitalDoctors = doctors.filter((d) => d.hospital === hospital.name)

  return <HospitalDetailsView hospital={hospital} doctors={hospitalDoctors} />
}
