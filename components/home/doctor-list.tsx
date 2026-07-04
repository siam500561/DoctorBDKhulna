import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRightIcon } from "@hugeicons/core-free-icons"
import { DoctorPanel } from "@/components/doctors/doctor-panel"
import type { doctors as allDoctors } from "@/components/home/data"

type Doctor = (typeof allDoctors)[number]

interface DoctorListProps {
  doctors: Doctor[]
  title: string
}

export function DoctorList({ doctors, title }: DoctorListProps) {
  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          {title}
        </h2>
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground">
            {doctors.length} doctor{doctors.length !== 1 ? "s" : ""}
          </p>
          <Link href="/doctors">
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-primary">
              See All
              <HugeiconsIcon icon={ArrowRightIcon} strokeWidth={1.5} className="size-3" />
            </Button>
          </Link>
        </div>
      </div>
      {doctors.length === 0 ? (
        <div className="rounded-xl border border-border/60 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No doctors found matching your search.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {doctors.map((doctor) => (
            <DoctorPanel key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  )
}
