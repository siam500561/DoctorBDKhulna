import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  MapPinIcon,
  Call02Icon,
  Calendar03Icon,
  ArrowRightIcon,
} from "@hugeicons/core-free-icons"
import type { hospitals } from "@/components/home/data"

type Hospital = (typeof hospitals)[number]

interface HospitalInfoProps {
  hospital: Hospital
}

const WORKING_HOURS = "Saturday – Thursday, 8:00 AM – 10:00 PM"

export function HospitalInfo({ hospital }: HospitalInfoProps) {
  return (
    <section aria-labelledby="hospital-heading">
      <h2
        id="hospital-heading"
        className="font-heading text-lg font-semibold text-foreground"
      >
        Hospital Information
      </h2>
      <div className="mt-3 flex flex-col gap-4 rounded-xl border border-border/60 p-5 sm:flex-row sm:items-start">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted">
          <HugeiconsIcon
            icon={hospital.icon}
            strokeWidth={1.5}
            className="size-5 text-muted-foreground"
          />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-foreground">
            {hospital.name}
          </h3>
          <div className="mt-2 space-y-1.5 text-xs text-muted-foreground">
            <p className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={MapPinIcon}
                strokeWidth={1.5}
                className="size-3.5 shrink-0 opacity-60"
              />
              {hospital.address}
            </p>
            <p className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={Calendar03Icon}
                strokeWidth={1.5}
                className="size-3.5 shrink-0 opacity-60"
              />
              {WORKING_HOURS}
            </p>
            <p className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={Call02Icon}
                strokeWidth={1.5}
                className="size-3.5 shrink-0 opacity-60"
              />
              {hospital.phone}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 rounded-lg"
            nativeButton={false}
            render={<Link href={`/hospitals/${hospital.id}`} />}
          >
            View Hospital
            <HugeiconsIcon
              icon={ArrowRightIcon}
              strokeWidth={1.5}
              data-icon="inline-end"
              className="size-3.5"
            />
          </Button>
        </div>
      </div>
    </section>
  )
}
