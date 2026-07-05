import Link from "next/link"
import Image from "next/image"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { DoctorPanel } from "@/components/doctors/doctor-panel"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  MapPinIcon,
  Call02Icon,
  Calendar03Icon,
  ArrowLeft01Icon,
  Hospital01Icon,
} from "@hugeicons/core-free-icons"
import { hospitalTypeLabels } from "@/lib/labels"
import type { PublicDoctor, PublicHospital } from "@/lib/public-types"

interface HospitalDetailsViewProps {
  hospital: PublicHospital
  doctors: PublicDoctor[]
}

export function HospitalDetailsView({
  hospital,
  doctors,
}: HospitalDetailsViewProps) {
  return (
    <Container>
      <div className="pt-6 pb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/hospitals" />}>
                Hospitals
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{hospital.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {hospital.coverImageUrl ? (
          <div className="relative mt-4 h-48 w-full overflow-hidden rounded-2xl sm:h-64">
            <Image
              src={hospital.coverImageUrl}
              alt={hospital.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 640px"
              priority
            />
          </div>
        ) : (
          <div className="mt-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
            <HugeiconsIcon
              icon={Hospital01Icon}
              strokeWidth={1.5}
              className="size-6 text-muted-foreground"
            />
          </div>
        )}

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
              {hospital.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {hospitalTypeLabels[hospital.type] ?? hospital.type}
              {hospital.districtName ? ` · ${hospital.districtName}` : ""}
            </p>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-1.5">
                <HugeiconsIcon
                  icon={MapPinIcon}
                  strokeWidth={1.5}
                  className="size-4 shrink-0 opacity-60"
                />
                {hospital.address}
              </p>
              {hospital.workingHours && (
                <p className="flex items-center gap-1.5">
                  <HugeiconsIcon
                    icon={Calendar03Icon}
                    strokeWidth={1.5}
                    className="size-4 shrink-0 opacity-60"
                  />
                  {hospital.workingHours}
                </p>
              )}
              <p className="flex items-center gap-1.5">
                <HugeiconsIcon
                  icon={Call02Icon}
                  strokeWidth={1.5}
                  className="size-4 shrink-0 opacity-60"
                />
                {hospital.phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-16">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Doctors at this Hospital
          </h2>
          <p className="text-xs text-muted-foreground">
            {doctors.length} doctor{doctors.length !== 1 ? "s" : ""}
          </p>
        </div>

        {doctors.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              No doctors listed for this hospital yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {doctors.map((doctor) => (
              <DoctorPanel key={doctor._id} doctor={doctor} />
            ))}
          </div>
        )}

        <Button
          variant="outline"
          className="mt-8 rounded-lg"
          nativeButton={false}
          render={<Link href="/hospitals" />}
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            strokeWidth={1.5}
            data-icon="inline-start"
          />
          Back to Hospitals
        </Button>
      </div>
    </Container>
  )
}
