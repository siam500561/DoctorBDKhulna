"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  StarIcon,
  User02Icon,
  Calendar03Icon,
  Share08Icon,
  FavouriteIcon,
  IdIcon,
  MapPinIcon,
  TranslateIcon,
} from "@hugeicons/core-free-icons"
import type { doctors as allDoctors } from "@/components/home/data"
import type { DoctorProfile } from "@/lib/doctor-profile"

type Doctor = (typeof allDoctors)[number]

interface DoctorProfileHeaderProps {
  doctor: Doctor
  profile: DoctorProfile
}

export function DoctorProfileHeader({
  doctor,
  profile,
}: DoctorProfileHeaderProps) {
  const [isFavorited, setIsFavorited] = React.useState(false)

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: doctor.name, url: window.location.href })
    }
  }

  return (
    <div className="flex flex-col gap-6 border-b border-border/60 pb-8 sm:flex-row sm:items-start">
      <div className="relative shrink-0">
        <div className="flex size-28 items-center justify-center rounded-2xl bg-muted sm:size-32">
          <HugeiconsIcon
            icon={User02Icon}
            strokeWidth={1}
            className="size-12 text-muted-foreground sm:size-14"
          />
        </div>
        <span
          className={`absolute -top-1 -right-1 size-4 rounded-full border-2 border-background ${
            doctor.available ? "bg-green-500" : "bg-muted-foreground/30"
          }`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
              {doctor.name}
            </h1>
            <p className="mt-1 text-sm font-medium text-primary md:text-base">
              {doctor.specialty}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {doctor.qualifications}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
              doctor.available
                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {doctor.availability}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <HugeiconsIcon
              icon={MapPinIcon}
              strokeWidth={1.5}
              className="size-3.5 opacity-60"
            />
            {doctor.hospital}
          </span>
          <span className="flex items-center gap-1.5">
            {doctor.experience} yrs experience
          </span>
          <span className="flex items-center gap-1.5">
            <HugeiconsIcon
              icon={IdIcon}
              strokeWidth={1.5}
              className="size-3.5 opacity-60"
            />
            Reg. No. {profile.registrationNumber}
          </span>
          <span className="flex items-center gap-1.5">
            <HugeiconsIcon
              icon={TranslateIcon}
              strokeWidth={1.5}
              className="size-3.5 opacity-60"
            />
            {doctor.languages.join(", ")}
          </span>
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <HugeiconsIcon
              icon={StarIcon}
              strokeWidth={1.5}
              className="size-3.5 text-amber-500/80"
            />
            {doctor.rating}
            <span className="font-normal text-muted-foreground">
              ({doctor.reviews} reviews)
            </span>
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button className="rounded-lg">
            <HugeiconsIcon
              icon={Calendar03Icon}
              strokeWidth={1.5}
              data-icon="inline-start"
            />
            Book Appointment
          </Button>
          <Button
            variant="outline"
            className="rounded-lg"
            nativeButton={false}
            render={
              <Link
                href={`https://wa.me/8801XXXXXXXXX?text=${encodeURIComponent(
                  `Hi, I'd like to book an appointment with ${doctor.name}.`
                )}`}
                target="_blank"
              />
            }
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Share profile"
            onClick={handleShare}
          >
            <HugeiconsIcon icon={Share08Icon} strokeWidth={1.5} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isFavorited}
            onClick={() => setIsFavorited((v) => !v)}
          >
            <HugeiconsIcon
              icon={FavouriteIcon}
              strokeWidth={1.5}
              className={isFavorited ? "text-destructive" : ""}
              fill={isFavorited ? "currentColor" : "none"}
            />
          </Button>
        </div>
      </div>
    </div>
  )
}
