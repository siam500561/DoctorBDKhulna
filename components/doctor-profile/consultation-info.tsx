import { HugeiconsIcon } from "@hugeicons/react"
import { Clock01Icon, Alert02Icon, VideoOffIcon } from "@hugeicons/core-free-icons"
import type { DoctorProfile } from "@/lib/doctor-profile"

interface ConsultationInfoProps {
  consultation: DoctorProfile["consultation"]
}

export function ConsultationInfo({ consultation }: ConsultationInfoProps) {
  return (
    <section aria-labelledby="consultation-heading">
      <h2
        id="consultation-heading"
        className="font-heading text-lg font-semibold text-foreground"
      >
        Consultation Fee
      </h2>

      <div className="mt-3 rounded-xl border border-border/60 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">New Patient</p>
          <p className="text-base font-semibold text-foreground">
            ৳{consultation.newPatientFee.toLocaleString()}
          </p>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
          <p className="text-sm text-muted-foreground">Returning Patient</p>
          <p className="text-base font-semibold text-foreground">
            ৳{consultation.returningPatientFee.toLocaleString()}
          </p>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {consultation.returningPatientNote}
        </p>

        <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
          {consultation.onlineFee !== null ? (
            <>
              <span className="font-medium text-foreground">
                Online Consultation:
              </span>
              ৳{consultation.onlineFee.toLocaleString()}
            </>
          ) : (
            <>
              <HugeiconsIcon
                icon={VideoOffIcon}
                strokeWidth={1.5}
                className="size-3.5 shrink-0 opacity-60"
              />
              There is no online consultation fee
            </>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-border/60 p-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <HugeiconsIcon
              icon={Clock01Icon}
              strokeWidth={1.5}
              className="size-4 text-muted-foreground"
            />
          </span>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              Appointment Duration
            </p>
            <p className="text-sm font-medium text-foreground">
              {consultation.duration}
            </p>
          </div>
        </div>

        {consultation.emergencyAvailable && (
          <div className="flex items-center gap-3 rounded-xl border border-border/60 p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
              <HugeiconsIcon
                icon={Alert02Icon}
                strokeWidth={1.5}
                className="size-4 text-green-600 dark:text-green-400"
              />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                Emergency Availability
              </p>
              <p className="text-sm font-medium text-foreground">
                Available today
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
