import { Container } from "@/components/ui/container"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  MapPinIcon,
  Call02Icon,
  ArrowRightIcon,
} from "@hugeicons/core-free-icons"
import { hospitals } from "@/components/home/data"

export function Hospitals() {
  return (
    <section className="border-t border-border bg-muted/20">
      <Container>
        <div className="py-12 md:py-16">
          <div className="mb-8">
            <p className="mb-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Facilities
            </p>
            <h2 className="font-heading text-xl font-semibold text-foreground md:text-2xl">
              Hospitals & Diagnostics
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
            {hospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="flex items-start gap-4 bg-card p-5 transition-colors hover:bg-muted/30"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <HugeiconsIcon
                    icon={hospital.icon}
                    strokeWidth={1.5}
                    className="size-5 text-muted-foreground"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-foreground">
                    {hospital.name}
                  </h3>
                  <div className="mt-1.5 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <HugeiconsIcon
                        icon={MapPinIcon}
                        strokeWidth={1.5}
                        className="size-3 shrink-0 opacity-60"
                      />
                      {hospital.address}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <HugeiconsIcon
                        icon={Call02Icon}
                        strokeWidth={1.5}
                        className="size-3 shrink-0 opacity-60"
                      />
                      {hospital.phone}
                    </div>
                  </div>
                  <button className="mt-3 flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80">
                    View Details
                    <HugeiconsIcon
                      icon={ArrowRightIcon}
                      strokeWidth={1.5}
                      className="size-3"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
