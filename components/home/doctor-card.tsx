import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  StarIcon,
  MapPinIcon,
  Clock01Icon,
  User02Icon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons"
import type { doctors } from "@/components/home/data"

type Doctor = (typeof doctors)[number]

interface DoctorCardProps {
  doctor: Doctor
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <div className="group flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-4 transition-all duration-200 hover:border-border hover:bg-muted/30 sm:flex-row sm:items-start sm:p-5">
      <div className="relative shrink-0">
        <div className="flex size-14 items-center justify-center rounded-xl bg-muted sm:size-16">
          <HugeiconsIcon
            icon={User02Icon}
            strokeWidth={1}
            className="size-7 text-muted-foreground sm:size-8"
          />
        </div>
        <span
          className={`absolute -top-0.5 -right-0.5 size-2.5 rounded-full border-2 border-card ${doctor.available ? "bg-green-500" : "bg-muted-foreground/30"}`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-heading text-[0.9rem] font-semibold text-foreground">
              {doctor.name}
            </h3>
            <p className="mt-0.5 text-xs font-medium text-primary">
              {doctor.specialty}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${doctor.available ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-muted text-muted-foreground"}`}
          >
            {doctor.available ? "Available" : "Unavailable"}
          </span>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          {doctor.qualifications}
        </p>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <HugeiconsIcon
              icon={MapPinIcon}
              strokeWidth={1.5}
              className="size-3.5 opacity-60"
            />
            {doctor.hospital}
          </span>
          <span className="flex items-center gap-1">
            <HugeiconsIcon
              icon={Clock01Icon}
              strokeWidth={1.5}
              className="size-3.5 opacity-60"
            />
            {doctor.experience} yrs
          </span>
          <span className="flex items-center gap-1">
            <HugeiconsIcon
              icon={StarIcon}
              strokeWidth={1.5}
              className="size-3.5 text-amber-500/80"
            />
            {doctor.rating} ({doctor.reviews})
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-lg">
            Profile
          </Button>
          <Button size="sm" className="rounded-lg">
            <HugeiconsIcon
              icon={Calendar03Icon}
              strokeWidth={1.5}
              data-icon="inline-start"
            />
            Book
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}
