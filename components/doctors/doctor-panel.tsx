import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  StarIcon,
  MapPinIcon,
  Clock01Icon,
  User02Icon,
  TranslateIcon,
} from "@hugeicons/core-free-icons"
import { specialtyLabel } from "@/components/admin/specialties"
import { availabilityLabels } from "@/lib/labels"
import type { PublicDoctor } from "@/lib/public-types"

interface DoctorPanelProps {
  doctor: PublicDoctor
}

export function DoctorPanel({ doctor }: DoctorPanelProps) {
  const isAvailable = doctor.availabilityStatus !== "unavailable"

  return (
    <div className="group flex flex-col gap-5 rounded-xl border border-border/60 bg-card p-5 transition-colors duration-200 hover:border-border hover:bg-muted/20 sm:flex-row sm:items-start md:p-6">
      <div className="relative shrink-0">
        {doctor.photoUrl ? (
          <div className="relative size-20 overflow-hidden rounded-2xl sm:size-24">
            <Image
              src={doctor.photoUrl}
              alt={doctor.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        ) : (
          <div className="flex size-20 items-center justify-center rounded-2xl bg-muted sm:size-24">
            <HugeiconsIcon
              icon={User02Icon}
              strokeWidth={1}
              className="size-9 text-muted-foreground sm:size-10"
            />
          </div>
        )}
        <span
          className={`absolute -top-0.5 -right-0.5 size-3 rounded-full border-2 border-card ${isAvailable ? "bg-green-500" : "bg-muted-foreground/30"}`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-heading text-base font-semibold text-foreground">
              {doctor.name}
            </h3>
            <p className="mt-0.5 text-sm font-medium text-primary">
              {specialtyLabel(doctor.specialty)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {doctor.qualifications.join(", ")}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${isAvailable ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-muted text-muted-foreground"}`}
          >
            {availabilityLabels[doctor.availabilityStatus]}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          {doctor.hospitalName && (
            <span className="flex items-center gap-1">
              <HugeiconsIcon
                icon={MapPinIcon}
                strokeWidth={1.5}
                className="size-3.5 opacity-60"
              />
              {doctor.hospitalName}
            </span>
          )}
          <span className="flex items-center gap-1">
            <HugeiconsIcon
              icon={Clock01Icon}
              strokeWidth={1.5}
              className="size-3.5 opacity-60"
            />
            {doctor.experienceYears} yrs experience
          </span>
          <span className="flex items-center gap-1">
            <HugeiconsIcon
              icon={TranslateIcon}
              strokeWidth={1.5}
              className="size-3.5 opacity-60"
            />
            {doctor.languages.join(", ")}
          </span>
          <span className="flex items-center gap-1">
            <HugeiconsIcon
              icon={StarIcon}
              strokeWidth={1.5}
              className="size-3.5 text-amber-500/80"
            />
            {doctor.averageRating} ({doctor.reviewCount})
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-foreground">
            ৳{doctor.startingFee.toLocaleString()}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              / consultation
            </span>
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              nativeButton={false}
              render={<Link href={`/doctors/${doctor.slug}`} />}
            >
              View Profile
            </Button>
            {doctor.whatsappNumber && (
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="WhatsApp"
                nativeButton={false}
                render={
                  <Link
                    href={`https://wa.me/${doctor.whatsappNumber.replace(/\D/g, "")}`}
                    target="_blank"
                  />
                }
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
